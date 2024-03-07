import Cell from "./Cell.js";
import Cursor from "./Cursor.js";

export default class Maze {
	static rendererClass = null;
	constructor(width, height, cellSize = 10) {
		this.width = width;
		this.height = height;
		this.cellSize = [].concat(cellSize);
		this.corners = [];
		this.walls = [];
		this.cells = [];
		this.start = null;
		this.end = null;
		this.renderers = {};
		this.addRenderer(this.constructor.rendererClass);
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
	getCellSize(dimension = 0) {
		return this.cellSize[dimension % this.cellSize.length];
	}
	get cellWidth() {
		return this.getCellSize(0);
	}
	get cellHeight() {
		return this.getCellSize(1);
	}
	get cellDepth() {
		return this.getCellSize(2);
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
		// console.log(walls.map(wall => wall+""));
		walls = walls.filter(wall => (!this.walls.includes(wall)));
		// console.log(walls.map(wall => wall+""));
		this.walls.push(...walls);
	}
	appendCells(...cells) {
		cells = cells.filter(cell => !this.cells.includes(cell));
		this.cells.push(...cells);
	}

	addCell(...corners) {
		debugger;
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
	}
	getRenderer() {
		return new this.constructor.rendererClass(this, scale);
	}
}