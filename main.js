import GameOfLife from "./modules/core.js";
import { initCanvasFromClientBoundsAndAppendToBody, drawFromGame } from "./modules/game_drawing.js";

const game = new GameOfLife();

const canvas = initCanvasFromClientBoundsAndAppendToBody({ theme: 'dark' });
canvas.onClick(({ x, y }) => {
    if (loop.isRunning) {
        return;
    }

    if (game.isCellAlive(x, y)) {
        game.removeCell(x, y);
    } else {
        game.addCell(x, y);
    }

    drawFromGame(canvas, game);
});

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const loop = {
    state: 'stopped',
    get isRunning() {
        return this.state === 'running';
    },
    set isRunning(value) {
        this.state = value ? 'running' : 'stopped';
    },
    async start(waitTime) {
        this.state = 'running';
        while (this.isRunning) {
            await Promise.all([
                wait(waitTime),
                new Promise((resolve) => {
                    game.nextGeneration();
                    resolve();
                }),
            ]);
            drawFromGame(canvas, game, this.isRunning);
        }
    },
    async stop() {
        this.isRunning = false;
    },
    async toggle(waitTime) {
        if (!this.isRunning) {
            await this.start(waitTime);
        } else {
            await this.stop();
        }
    },
};

document.addEventListener('keydown', (event) => {
    if (event.key === ' ') {
        loop.toggle(50);
    }
});

canvas.onPlayPause(() => loop.toggle(50));
