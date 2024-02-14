import Room from "./Room.js";
import Corner from "./Corner.js";
import Wall from "./Wall.js";

export default class Maze {
	static rendererClass = null;
	constructor(width, height, cellSize = 10) {
		this.width = width;
		this.height = height;
		this.cellSize = cellSize;
		this.corners = [];
		this.walls = [];
		this.rooms = [];
		this.start = null;
		this.end = null;
		if (this.constructor.rendererClass) {
			if (typeof this.constructor.rendererClass === "string") {
				this.constructor.rendererClass = import(`./renderers/${this.constructor.rendererClass}.js`).then(module => {
					this.constructor.rendererClass = module.default;
				});
			}
		}
	}
	get cellWidth() {
		if (typeof this.cellSize === "number") {
			return this.cellSize;
		}
		if (Array.isArray(this.cellSize)) {
			return this.cellSize[0];
		}
		return this.cellSize.width || this.cellSize.x;
	}

	get cellHeight() {
		if (typeof this.cellSize === "number") {
			return this.cellSize;
		}
		if (Array.isArray(this.cellSize)) {
			return this.cellSize[1];
		}
		return this.cellSize.height || this.cellSize.y;
	}
	appendCorners(...corners) {
		corners = corners.filter(corner => !this.corners.includes(corner));
		this.corners.push(...corners);
	}
	appendWalls(...walls) {
		walls = walls.filter(wall => !this.walls.includes(wall));
		this.walls.push(...walls);
	}
	appendRooms(...rooms) {
		rooms = rooms.filter(room => !this.rooms.includes(room));
		this.rooms.push(...rooms);
	}

	addRoom(...corners) {
		var room = Room.fromCorners(...corners);
		this.appendRooms(room);
		this.appendWalls(...room.walls);
		this.appendCorners(...room.corners);
		return room;
	}

	async render(scale = 10) {
		await Promise.resolve(this.constructor.rendererClass);
		const renderer = new this.constructor.rendererClass(this, scale);
		var result = renderer.render();
		return result;
	}
	decimate(ratio = .5, depth = 2) {
		var deadEnds = this.corners.filter(corner => corner.closedWalls.length === 1).shuffle();
		deadEnds = deadEnds.slice(0, deadEnds.length * ratio);
		deadEnds.forEach(deadEnd => {
			for (let i = 0; i < depth; i++) {
				deadEnd.svg.classList.add("dead-end");
				let wall = deadEnd.walls.find(wall => wall.open === 0);
				wall.open = 3;
				wall.svg.classList.add("dead-end");
				let opposite = wall.getOpposite(deadEnd);
				let oppositeWalls = opposite.closedWalls;
				if (oppositeWalls.length > 1) break;
				deadEnd = opposite;
			}
		});
	}
}