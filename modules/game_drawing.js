import * as canvasJs from "./canvas.js";
import GameOfLife from "./core.js";

class GoLCanvas {
    constructor({ cellWidth = 16, gap = 1, width = null, height = null, theme = 'dark' } = {}) {
        this.cellWidth = cellWidth;
        this.gap = gap;
        width ??= 32 * cellWidth + 31 * gap;
        height ??= 32 * cellWidth + 31 * gap;
        this.canvas = canvasJs.createCanvas({ width, height });
        this.ctx = this.canvas.getContext('2d');

        switch (theme) {
            case 'light':
                this.theme = {
                    grid: '#eee',
                    deadCell: '#f5f7fb',
                    aliveCell: '#080a0c',
                    menuBackground: '#101828',
                    menuText: '#fff',
                };
                break;
            default: // dark
                this.theme = {
                    grid: '#181b21',
                    deadCell: '#080a0c',
                    aliveCell: '#e4ebf5',
                    menuBackground: '#e8eef6',
                    menuText: '#080a0c',
                };
                break;
        }

        this.playButtonCoords = {
            x: width - 50,
            y: 6,
            width: (3 * (cellWidth + gap)) - 12,
            height: (3 * (cellWidth + gap)) - 12,
        }

        this.playImage = new Image();
        this.playImage.src = `assets/play-${theme}.svg`;
        this.pauseImage = new Image();
        this.pauseImage.src = `assets/pause-${theme}.svg`;

        this.drawEmptyGrid();
        this.playImage.addEventListener('load', () => {
            this.drawMenu();
        }, { once: true });
    }

    drawMenu({ generation = 0, population = 0, running = false } = {}) {
        this.ctx.fillStyle = this.theme.menuBackground;
        this.ctx.fillRect(0, 0, this.canvas.width, 3 * (this.cellWidth + this.gap));
        this.ctx.font = '20px monospace';
        this.ctx.fillStyle = this.theme.menuText;
        this.ctx.fillText(`Generation: ${generation}  -  Population: ${population}`, 10, 30);

        const { x, y, width, height } = this.playButtonCoords;
        this.ctx.drawImage(running ? this.pauseImage : this.playImage, x, y, width, height);
    }

    drawEmptyGrid() {
        this.ctx.fillStyle = this.theme.deadCell;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = this.theme.grid;
        for (let x = 0; x < this.canvas.width; x += this.cellWidth + this.gap) {
            this.ctx.fillRect(x, 0, this.gap, this.canvas.height);
        }
        for (let y = 0; y < this.canvas.height; y += this.cellWidth + this.gap) {
            this.ctx.fillRect(0, y, this.canvas.width, this.gap);
        }
    }

    drawAliveCell(x, y, color = null) {
        canvasJs.drawSquare(this.canvas, (x + 1) * this.gap + x * this.cellWidth, (y + 1) * this.gap + y * this.cellWidth, this.cellWidth, color ?? this.theme.aliveCell);
    }

    onClick(callback) {
        canvasJs.onClick(this.canvas, ({ x, y }) => {
            const cellX = Math.floor(x / (this.cellWidth + this.gap));
            const cellY = Math.floor(y / (this.cellWidth + this.gap));
            if (cellY > 2) {
                callback({ x: cellX, y: cellY });
            }
        });
    }

    /* onDrag(callback) {
        canvasJs.onDrag(this.canvas, ({ x, y }) => {
            const cellX = Math.floor(x / (this.cellWidth + this.gap));
            const cellY = Math.floor(y / (this.cellWidth + this.gap));
            callback({ x: cellX, y: cellY });
        });
    } */

    onPlayPause(callback) {
        canvasJs.addClickableZone(this.canvas, this.playButtonCoords, callback);
    }
}

function initCanvasFromClientBoundsAndAppendToBody({ cellWidth = 16, gap = 1, theme = 'dark' } = {}) {
    const width = window.innerWidth;
    const height = window.innerHeight;

    const canvas = new GoLCanvas({ cellWidth, gap, width, height, theme });
    document.body.appendChild(canvas.canvas);
    return canvas;
}

function drawFromGame(canvas, gameOfLife, running = false) {
    canvas.drawEmptyGrid();
    for (const key in gameOfLife.cells) {
        const [x, y] = GameOfLife.getCoordsFromKey(key);
        canvas.drawAliveCell(x, y);
    }

    canvas.drawMenu({ ...gameOfLife.stats, running });
}

export { initCanvasFromClientBoundsAndAppendToBody, drawFromGame };
