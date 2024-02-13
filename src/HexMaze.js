import CornerBase from "./Corner.js";
import Maze from "./Maze.js";
import RoomBase from "./Room.js";
import WallBase from "./Wall.js";

export default class HexMaze extends Maze {
	addCorners() {
		for (let c = 0; c < this.width; c++) {
			this.corners.push(new Corner(...this.getCornerCoords(0, c, 0)));
		}
		for (let r = 0; r < this.height; r++) {

			for (let c = 0; c <= this.width; c++) {
				this.corners.push(new Corner(...this.getCornerCoords(r, c, 5)));
			}
			for (let c = 0; c <= this.width; c++) {
				this.corners.push(new Corner(...this.getCornerCoords(r, c, 4)));
			}
		}
		let r = this.height - 1;
		for (let c = 0; c < this.width; c++) {
			this.corners.push(new Corner(...this.getCornerCoords(r, c, 3)));
		}
	}
	getCornerCoords(r, c, a) {
		if (a instanceof Array) {
			return a.map(a => this.getCornerCoords(r, c, a));
		}
		var result = Corner.getCoords(r, c, a);
		return [result[0] * this.cellWidth, result[1] * this.cellHeight];
	}
	createRoomCorners(r, c, from = 0, to = 5) {
		var angles = [0, 1, 2, 3, 4, 5];
		var result = this.getCornerCoords(r, c, angles.slice(from, to + 1));
		result = result.map(coords => new Corner(...coords));
		return result;
	}
	createRoomCorner(r, c, a) {
		if (a instanceof Array) {
			return a.map(a => this.createRoomCorner(r, c, a));
		}
		var result = this.getCornerCoords(r, c, a);
		result = new Corner(...result);
		return result;
	}
	createRooms() {
		for (let r = 0; r < this.height; r++) {
			for (let c = 0; c < this.width; c++) {
				let roomL = this.getRoom(r, c - 1);
				let roomTL = this.getRoom(r - 1, c + r % 2 - 1);
				let roomTR = this.getRoom(r - 1, c + r % 2);
				let corners = [
					roomTL?.corners[2] || roomTR?.corners[4] || this.createRoomCorner(r, c, 0),
					roomTR?.corners[3] || this.createRoomCorner(r, c, 1),
					...this.createRoomCorner(r, c, [2, 3]),
					roomL?.corners[2] || this.createRoomCorner(r, c, 4),
					roomL?.corners[1] || roomTL?.corners[3] || this.createRoomCorner(r, c, 5),
				];
				this.addRoom(...corners);
			}
		}
		return this;
	}
	addRoom(...corners) {
		var room = Room.fromCorners(...corners);
		this.appendRooms(room);
		this.appendWalls(...room.walls);
		this.appendCorners(...room.corners);
		return room;
	}
	addWalls() {
		this.addWall(...this.getCorner(0, 0, [0, 1, 2, 3, 4, 5, 0]));
		for (let c = 1; c < this.width; c++) {
			this.addWall(...this.getCorner(0, c, [5, 0, 1, 2, 3, 4]));
		}
		for (let r = 1; r < this.height; r++) {
			if (r % 2 === 0) {
				this.addWall(...this.getCorner(r, 0, [5, 0]));
			}
			this.addWall(...this.getCorner(r, 0, [1, 2, 3, 4, 5]));
			for (let c = 1; c < this.width - 1; c++) {
				this.addWall(...this.getCorner(r, c, [1, 2, 3, 4]));
			}
			if (r % 2 === 1) {
				this.addWall(...this.getCorner(r, this.width - 1, [0, 1]));
			}
			this.addWall(...this.getCorner(r, this.width - 1, [1, 2, 3, 4]));
		}
		return this;
	}
	getRoom(r, c) {
		if (r < 0 || r >= this.height || c < 0 || c >= this.width) return null;
		return this.rooms[r * this.width + c];
	}
	getCorner(r, c, a = 0) {
		if (a instanceof Array) {
			return a.map(a => this.getCorner(r, c, a));
		}
		var result = r * (this.width * 2) + r;
		result += ((r === 0) ? 0 : 1) * (r - 1);
		if (a > 0) result += this.width + ((r === 0) ? 0 : 1);
		if (a === 2 || a === 3) result += this.width + 2;
		if (a === 0 || (a === 3 && r < this.height - 1)) result += (r % 2);
		if (a === 1 || a === 4) result += 1;
		if (a === 3 || a === 4) result += this.width;
		result += c;
		return this.corners[result];
	}
	get cellWidth() {
		return Math.sqrt(3 / 2) * this.cellHeight;
	}
}
class Corner extends CornerBase {
	static getCoords(r, c, a) {
		var result = [c * 2 + (r % 2), r * 3];
		if (a === 0 || a === 3) {
			result[0] += 1;
		}
		if (a > 0) {
			result[1] += 1;
		}
		if (a === 1 || a === 2) {
			result[0] += 2;
		}
		if (a === 2 || a === 4) {
			result[1] += 2;
		}
		if (a === 3) {
			result[1] += 3;
		}

		return [result[0] / 2, result[1] / 3];
	}
}
class Wall extends WallBase {
}
class Room extends RoomBase {
	// Usless for now
	getCornerCoords(r, c, a) {
		if (a instanceof Array) {
			return a.map(a => this.getCornerCoords(r, c, a));
		}
		var result = Corner.getCoords(r, c, a);
		return result;
	}
	// Usless for now
	static createCorners(r, c, from = 0, to = 5) {
		var angles = [0, 1, 2, 3, 4, 5];
		var result = this.getCornerCoords(r, c, angles.slice(from, to - from + 1));
		result = result.map(coords => new Corner(...coords));
		return result;
	}
}