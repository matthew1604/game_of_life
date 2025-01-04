function createCanvas({ width = 800, height = 600 } = {}) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    return canvas;
}

function drawSquare(canvas, x, y, width, color = '#000') {
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, width);
}

function onClick(canvas, callback = null) {
    canvas.addEventListener('click', (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = Math.floor((e.clientX - rect.left) / (canvas.width / canvas.clientWidth));
        const y = Math.floor((e.clientY - rect.top) / (canvas.height / canvas.clientHeight));
        callback && callback({ x, y });
    });
}

function onDrag(canvas, callback = null) {
    let isDragging = false;
    canvas.addEventListener('mousedown', (e) => {
        isDragging = true;
    });
    canvas.addEventListener('mouseup', (e) => {
        isDragging = false;
    });
    onMousemove(canvas, ({ x, y }) => {
        if (isDragging) {
            callback && callback({ x, y });
        }
    });
}

function onMousemove(canvas, callback = null) {
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = Math.floor((e.clientX - rect.left) / (canvas.width / canvas.clientWidth));
        const y = Math.floor((e.clientY - rect.top) / (canvas.height / canvas.clientHeight));
        callback && callback({ x, y });
    });
}

function addClickableZone(canvas, { x, y, width, height } = {}, callback = null) {
    onMousemove(canvas, ({ x: mouseX, y: mouseY }) => {
        if (mouseX >= x && mouseX <= x + width && mouseY >= y && mouseY <= y + height) {
            canvas.style.cursor = 'pointer';
        } else {
            canvas.style.cursor = 'default';
        }
    });

    onClick(canvas, ({ x: mouseX, y: mouseY }) => {
        if (mouseX >= x && mouseX <= x + width && mouseY >= y && mouseY <= y + height) {
            callback && callback({ x: mouseX, y: mouseY });
        }
    });
}

export {
    createCanvas,
    drawSquare,
    onClick,
    onDrag,
    onMousemove,
    addClickableZone,
};
