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
	render(scale) {
		var result = document.createElementNS("http://www.w3.org/2000/svg", "circle");
		result.classList.add("corner");
		result.setAttribute("cx", this.x * scale);
		result.setAttribute("cy", this.y * scale);
		result.setAttribute("r", .5);
		return result;
	}
}