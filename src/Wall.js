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
	static fromCorners(start, end, room = null) {
		var wall;
		if (wall = start.wallTo(end)) {
			wall.rooms[0] = room;
			return wall;
		}
		if (wall = end.wallTo(start)) {
			wall.rooms[1] = room;
			return wall;
		}
		wall = new this(start, end);
		wall.rooms[1] = room;
		return wall;
	}
}