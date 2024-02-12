import Edge from "./Edge.js";

export default class Wall extends Edge {
	constructor(start, end) {
		super(start, end);
		this.start = start;
		this.end = end;
		start.walls.push(this);
		end.walls.unshift(this);
		this.rooms = [];
		this.open = false;
	}
	get corners() {
		return [this.start, this.end];
	}
	toString(scale = 1) {
		return `M ${this.start.toString(scale)} ${this.end.toString(scale)}`;
	}
}