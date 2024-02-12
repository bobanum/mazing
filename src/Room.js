import Cell from './Cell.js';
export default class Room extends Cell {
	constructor(walls = []) {
		super();
		this.walls = walls;
		this.corners = walls.map(wall => wall.start);
		this.neighbors = [];
	}
	toString(scale = 1) {
		var vertices = this.corners.map(corner => corner.toString(scale)).join(" ");
		return `M ${vertices} z`;
	}
	static fromCorners(corners) {
		var result = new this();
		result.corners = corners;
		return result;
	}
}