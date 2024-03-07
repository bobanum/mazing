export default class Corner {
	constructor(...coords) {
		this.coords = coords;
		this.walls = [];
		this.rooms = [];
	}
	get c() {
		return this.coords[0];
	}
	get r() {
		return this.coords[1];
	}
	toString(scale = 1) {
		return [this.coords].map(coord => coord * scale).join(", ");
	}
	wallFrom(corner) {
		return this.walls.find(wall => wall.start === corner);
	}
	wallTo(corner) {
		return this.walls.find(wall => wall.end === corner);
	}
	wallConnected(corner) {
		return this.walls.find(wall => wall.start === corner || wall.end === corner);
	}
	appendWalls(...walls) {
		this.walls.appendNew(...walls);
	}
	appendCells(...rooms) {
		rooms = rooms.filter(room => !this.rooms.includes(room));
		this.rooms.push(...rooms);
	}
	get openWalls() {
		return this.walls.filter(wall => wall.open !== 0);
	}
	get closedWalls() {
		return this.walls.filter(wall => wall.open === 0);
	}
}