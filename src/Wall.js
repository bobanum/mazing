import Edge from "./Edge.js";

export default class Wall extends Edge {
	_open = 0;
	constructor(start, end) {
		super(start, end);
		this.start = start;
		this.end = end;
		start.walls.push(this);
		end.walls.unshift(this);
		this.cells = [];
		this._open = 0;	// 0:close, 1:open cell 0 to cell 1, 2:open cell 1 to cell 2, 3: closed
	}
	get corners() {
		return [this.start, this.end];
	}
	toString(scale = 1) {
		return `M ${this.start.toString(scale)} ${this.end.toString(scale)}`;
	}
	static fromCorners(start, end, cell = null) {
		var wall;
		start.appendCells(cell);
		end.appendCells(cell);
		if (wall = start.wallTo(end)) {
			wall.cells[1] = cell;
			return wall;
		}
		if (wall = end.wallTo(start)) {
			wall.cells[0] = cell;
			return wall;
		}
		wall = new this(start, end);
		wall.cells[1] = cell;
		return wall;
	}
	getOpposite(corner) {
		if (!this.corners.includes(corner)) {
			return null;
		}
		return this.corners.find(oneCorner => oneCorner !== corner);
	}
	get open() {
		return this._open;
	}
	set open(value) {
		this._open = value & 3;
		this.svg.classList.toggle("open", value !== 0);
		return this;
	}
}