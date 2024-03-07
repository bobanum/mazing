export default class Wall {
	constructor(corners = []) {
		this.corners = corners;
		this.start.walls.push(this);
		this.end.walls.unshift(this);
		this.cells = [];
		this._open = 0;	// 0:close, 1:open cell 0 to cell 1, 2:open cell 1 to cell 2, 3: closed
	}
	get start() {
		return this.corners[0];
	}
	get end() {
		return this.corners.slice(-1)[0];
	}
	toString(scale = 1) {
		return `M ${this.start.toString(scale)} ${this.end.toString(scale)}`;
	}
	static fromCorners(corners, cell = null) {
		var wall;
		var start = corners[0];
		var end = corners.slice(-1)[0];
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
		wall = new this([start, end]);
		wall.cells[1] = cell;
		return wall;
	}
	getAjoiningTo(cell) {
		return this.cells.find(oneCell => oneCell !== cell);
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
		return this;
	}
}
