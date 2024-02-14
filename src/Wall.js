import Edge from "./Edge.js";

export default class Wall extends Edge {
	_open = 0;
	constructor(start, end) {
		super(start, end);
		this.start = start;
		this.end = end;
		start.walls.push(this);
		end.walls.unshift(this);
		this.rooms = [];
		this._open = 0;	// 0:close, 1:open room 0 to room 1, 2:open room 1 to room 2, 3: closed
	}
	get corners() {
		return [this.start, this.end];
	}
	toString(scale = 1) {
		return `M ${this.start.toString(scale)} ${this.end.toString(scale)}`;
	}
	static fromCorners(start, end, room = null) {
		var wall;
		start.appendRooms(room);
		end.appendRooms(room);
		if (wall = start.wallTo(end)) {
			wall.rooms[1] = room;
			return wall;
		}
		if (wall = end.wallTo(start)) {
			wall.rooms[0] = room;
			return wall;
		}
		wall = new this(start, end);
		wall.rooms[1] = room;
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