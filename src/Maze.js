import Cell from "./Cell.js";
import Corner from "./Corner.js";
import Cursor from "./Cursor.js";
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
		this.renderers = {};
		this.addRenderer(this.constructor.rendererClass);
		// if (this.constructor.rendererClass) {
		// 	if (typeof this.constructor.rendererClass === "string") {
		// 		this.constructor.rendererClass = import(`./renderers/${this.constructor.rendererClass}.js`).then(module => {
		// 			return this.constructor.rendererClass = module.default;
		// 		});
		// 	} else if (Array.isArray(this.constructor.rendererClass)) {
		// 		this.constructor.rendererClass = Promise.all(this.constructor.rendererClass.map(rendererClass => {
		// 			return import(`./renderers/${rendererClass}.js`).then(module => module.default);
		// 		}));
		// 	}
		// }
	}
	addRenderer(rendererClass) {
		if (!rendererClass) return;
		if (Array.isArray(rendererClass)) {
			rendererClass.forEach(rendererClass => this.addRenderer(rendererClass));
			return this;
		}
		if (typeof rendererClass === "string") {
			this.renderers[rendererClass] = import(`./renderers/${rendererClass}.js`).then(module => {
				return this.renderers[rendererClass] = new module.default(this);
			});
			return this;
		}
	}
	getRenderer(rendererClass) {
		return this.renderers[rendererClass];
	}
	toString() {
		var result = "";
		for (let r = 0; r < this.height; r++) {
			for (let c = 0; c < this.width; c++) {
				let cell = this.getCell(r, c);
				result += cell.toString();
			}
			result += "\n";
		}
		return result;
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
	generate() {
		this.createCells();
		var cell = this.getCell(Math.floor(this.height / 2), Math.floor(this.width / 2));
		var cursor = new Cursor(this, cell);
		cursor.run();
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
		var result = {};
		for (let rendererName in this.renderers) {
			let renderer = await this.renderers[rendererName];
			result[rendererName] = renderer.render();
		}
		return result;
		// return Object.values(this.renderers).map(renderer => {
		// 	console.log(renderer);
		// });
		// if (Array.isArray(this.constructor.rendererClass)) {
		// 	const rendererClass = await Promise.all(this.constructor.rendererClass);
		// 	return rendererClass.map(Renderer => new Renderer(this, scale).render());
		// } else {
		// 	const rendererClass = await Promise.resolve(this.constructor.rendererClass);
		// 	debugger;
		// 	const renderer = new rendererClass(this, scale);
		// 	var result = renderer.render();
		// 	return result;
		// }
	}
	getRenderer() {
		return new this.constructor.rendererClass(this, scale);
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