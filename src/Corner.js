import Point from "./Point.js";

export default class Corner extends Point {
	constructor(x, y) {
		super(x, y);
		this.walls = [];
		this.rooms = [];
	}
	toString(scale = 1) {
		return `${this.x * scale}, ${this.y * scale}`;
	}
}