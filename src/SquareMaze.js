import CornerBase from "./Corner.js";
import Maze from "./Maze.js";
import RoomBase from "./Room.js";
import WallBase from "./Wall.js";

export default class SquareMaze extends Maze {
	getCornerCoords(r, c, a) {
		if (a instanceof Array) {
			return a.map(a => this.getCornerCoords(r, c, a));
		}
		var result = Corner.getCoords(r, c, a);
		return [result[0] * this.cellWidth, result[1] * this.cellHeight];
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
				let roomT = this.getRoom(r - 1, c);
				let corners = [
					roomT?.corners[3] || roomL?.corners[1] || this.createRoomCorner(r, c, 0),
					roomT?.corners[2] || this.createRoomCorner(r, c, 1),
					this.createRoomCorner(r, c, 2),
					roomL?.corners[2] || this.createRoomCorner(r, c, 3),
				];
				this.addRoom(...corners);
			}
		}
		return this;
	}
	getRoom(r, c) {
		if (r < 0 || r >= this.height || c < 0 || c >= this.width) return null;
		return this.rooms[r * this.width + c];
	}
	get cellWidth() {
		return this.cellHeight;
	}
}
class Corner extends CornerBase {
	// a = 0 = top left
	static getCoords(r, c, a = 0) {
		var result = [c , r];
		if (a === 1 || a === 2) {
			result[0] += 1;
		}
		if (a === 2 || a === 3) {
			result[1] += 1;
		}
		return result;
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