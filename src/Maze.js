import Cell from "./Cell.js";
import Corner from "./Corner.js";
import Wall from "./Wall.js";

export default class Maze {
	static rendererClass = null;
	constructor(width, height, cellSize = 10) {
		this.allowTunnels = false;
		this.width = width;
		this.height = height;
		this.cellSize = cellSize;
		this.corners = [];
		this.walls = [];
		this.cells = [];
		this.start = null;
		this.end = null;
		if (this.constructor.rendererClass) {
			if (typeof this.constructor.rendererClass === "string") {
				this.constructor.rendererClass = import(`./renderers/${this.constructor.rendererClass}.js`).then(module => {
					this.constructor.rendererClass = module.default;
				});
			}
		}
	}
	get cellWidth() {
		if (typeof this.cellSize === "number") {
			return this.cellSize;
		}
		if (Array.isArray(this.cellSize)) {
			return this.cellSize[0];
		}
		return this.cellSize.width || this.cellSize.x;
	}

	get cellHeight() {
		if (typeof this.cellSize === "number") {
			return this.cellSize;
		}
		if (Array.isArray(this.cellSize)) {
			return this.cellSize[1];
		}
		return this.cellSize.height || this.cellSize.y;
	}
	appendCorners(...corners) {
		corners = corners.filter(corner => !this.corners.includes(corner));
		this.corners.push(...corners);
	}
	appendWalls(...walls) {
		walls = walls.filter(wall => !this.walls.includes(wall));
		this.walls.push(...walls);
	}
	appendCells(...cells) {
		cells = cells.filter(cell => !this.cells.includes(cell));
		this.cells.push(...cells);
	}

	addCell(...corners) {
		var cell = Cell.fromCorners(...corners);
		this.appendCells(cell);
		this.appendWalls(...cell.walls);
		this.appendCorners(...cell.corners);
		return cell;
	}

	async render(scale = 10) {
		await Promise.resolve(this.constructor.rendererClass);
		const renderer = new this.constructor.rendererClass(this, scale);
		var result = renderer.render();
		return result;
	}
	findDeadEnds() {
		return this.cells.filter(cell => cell.isDeadEnd);
	}
	decimate(ratio = .5, depth = 2) {
		var wallEnds = this.corners.filter(corner => corner.closedWalls.length === 1).shuffle();
		wallEnds = wallEnds.slice(0, wallEnds.length * ratio);
		wallEnds.forEach(wallEnd => {
			for (let i = 0; i < depth; i++) {
				wallEnd.svg.classList.add("wall-end");
				let wall = wallEnd.walls.find(wall => wall.open === 0);
				wall.open = 3;
				wall.svg.classList.add("wall-end");
				let opposite = wall.getOpposite(wallEnd);
				let oppositeWalls = opposite.closedWalls;
				if (oppositeWalls.length > 1) break;
				wallEnd = opposite;
			}
		});
	}
}