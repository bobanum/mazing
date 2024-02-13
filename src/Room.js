import Cell from './Cell.js';
import Wall from './Wall.js';
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
	static fromCorners(...corners) {
		var result = new this();
		for (let i = 0; i < corners.length; i++) {
			let start = corners[i];
			let end = corners[(i + 1) % corners.length];
			let wall = Wall.fromCorners(start, end, result);
			result.walls.push(wall);
		}
		result.corners = corners;
		return result;
	}
	
}