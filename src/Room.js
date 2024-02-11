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
	render(scale) {
		var result = document.createElementNS("http://www.w3.org/2000/svg", "path");
		result.classList.add("room");
		result.setAttribute("d", this.toString(scale));
		return result;
	}
	static fromCorners(corners) {
		var result = new this();
		result.corners = corners;
		return result;
	}
}