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
		// console.log(walls.join("¤"));
		// console.log(this.id, this.walls.join("¤"));
		// walls = walls.filter(wall => !this.walls.includes(wall));
		this.walls.appendNew(...walls);
		// console.log(this.walls.join("¤"));
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