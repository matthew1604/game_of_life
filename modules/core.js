export default class GameOfLife {
    constructor() {
        this.cells = {};
        const thisObj = this;
        this.stats = {
            generation: 0,
            get population() {
                return Object.keys(thisObj.cells).length;
            },
        };
    }

    static getKeyFromCoords(x, y) {
        return `${x}/${y}`;
    }

    static getCoordsFromKey(key) {
        return key.split('/').map(Number);
    }

    static getNeighborsCoords(x, y) {
        return [
            [x - 1, y - 1], [x, y - 1], [x + 1, y - 1],
            [x - 1, y],                 [x + 1, y],
            [x - 1, y + 1], [x, y + 1], [x + 1, y + 1]
        ];
    }

    addCell(x, y) {
        this.cells[GameOfLife.getKeyFromCoords(x, y)] = true;
    }

    removeCell(x, y) {
        delete this.cells[GameOfLife.getKeyFromCoords(x, y)];
    }

    isCellAlive(x, y) {
        return Boolean(this.cells[GameOfLife.getKeyFromCoords(x, y)]);
    }

    getNeighborsCount(x, y) {
        return GameOfLife.getNeighborsCoords(x, y).reduce((sum, [x, y]) => sum + Number(this.isCellAlive(x, y)), 0);
    }

    shouldBorn(x, y) {
        return this.getNeighborsCount(x, y) === 3;
    }

    shouldDie(x, y) {
        const neighborsCount = this.getNeighborsCount(x, y);
        return neighborsCount < 2 || neighborsCount > 3;
    }

    nextGenerationOfCellShouldBeAlive(x, y) {
        if (this.shouldDie(x, y)) {
            return false;
        } else if (this.shouldBorn(x, y)) {
            return true;
        }

        return this.isCellAlive(x, y);
    }

    nextGeneration() {
        const newCells = {};
        for (const key in this.cells) {
            const [x, y] = GameOfLife.getCoordsFromKey(key);
            [[x, y], ...GameOfLife.getNeighborsCoords(x, y)].forEach(([x, y]) => {
                if (this.nextGenerationOfCellShouldBeAlive(x, y)) {
                    newCells[GameOfLife.getKeyFromCoords(x, y)] = true;
                }
            });
        }

        this.cells = newCells;
        this.stats.generation++;
    }
}
