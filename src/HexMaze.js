import Corner from "./Corner.js";
import Maze from "./Maze.js";
import Room from "./Room.js";
import Wall from "./Wall.js";

export default class HexMaze extends Maze {
	addCorners() {
		const cellHeight = this.cellHeight;
		const cellWidth = this.cellWidth;
		for (let c = 0; c < this.width; c++) {
			this.corners.push(new Corner((c + 1 / 2) * cellWidth, 0));
		}
		for (let r = 0; r < this.height; r++) {

			for (let c = 0; c <= this.width; c++) {
				this.corners.push(new Corner((c + (r % 2) / 2) * cellWidth, (r + 1 / 3) * cellHeight));
			}
			for (let c = 0; c <= this.width; c++) {
				this.corners.push(new Corner((c + (r % 2) / 2) * cellWidth, (r + 1) * cellHeight));
			}
		}
		for (let c = 0; c < this.width; c++) {
			this.corners.push(new Corner((c + 1 - (this.height % 2) / 2) * cellWidth, (this.height + 1 / 3) * cellHeight));
		}
	}
	addWalls() {
		for (let r = 0; r < this.height; r++) {
			if (r % 2 === 1) {
				this.walls.push(new Wall(this.getCorner(r - 1, 0, 4), this.getCorner(r - 1, 0, 3)));
			}
			for (let c = 0; c < this.width; c++) {
				let c0 = this.getCorner(r, c);
				let c1 = this.getCorner(r, c, 1);
				let c5 = this.getCorner(r, c, 5);
				this.walls.push(new Wall(c5, c0));
				this.walls.push(new Wall(c0, c1));
			}
			if (r > 0 && r % 2 === 0) {
				this.walls.push(new Wall(this.getCorner(r - 1, this.width - 1, 3), this.getCorner(r - 1, this.width - 1, 2)));
			}
			for (let c = 0; c <= this.width; c++) {
				let c4 = this.getCorner(r, c, 4);
				let c5 = this.getCorner(r, c, 5);
				this.walls.push(new Wall(c4, c5));
			}
		}
		let r = this.height-1;
		if (r % 2 === 1) {
			// this.walls.push(new Wall(this.getCorner(r, 0, 4), this.getCorner(r, 0, 3)));
		}
		for (let c = 0; c < this.width; c++) {
			let c2 = this.getCorner(r, c, 2);
			let c3 = this.getCorner(r, c, 3);
			let c4 = this.getCorner(r, c,4);
			this.walls.push(new Wall(c4, c3));
			this.walls.push(new Wall(c3, c2));
		}
	}
	getCorner0(r, c, a = 0) {
		const extra = (r > 0) ? 1 : 0;
		const supra = (r === 0) ? 1 : 0;
		const c0 = r * (this.width * 2 + 1) + c + r % 2 + (r - 1) - supra * (r - 1);
		switch (a) {
			case 0:
				return this.corners[c0];
			case 1:
				return this.corners[c0 + this.width + 2 - supra - (r % 2)];
			case 2:
				return this.corners[c0 + 2 * this.width + 3 - supra - (r % 2)];
			case 3:
				return this.corners[c0 + 3 * this.width + 3 - supra];
			case 4:
				return this.corners[c0 + 2 * this.width + 2 - supra - (r % 2)];
			case 5:
				return this.corners[c0 + this.width + 1 - supra - (r % 2)];
			default:
				throw new Error("Invalid corner");
		}
		return result;
	}
	getCorner(r, c, a = 0) {
		var result = r * (this.width * 2) + r;
		result += ((r === 0) ? 0 : 1) * (r - 1);
		if (a > 0) result += this.width + ((r === 0) ? 0 : 1);
		if (a === 2 || a === 3) result += this.width + 2;
		if (a === 0 || (a === 3 && r < this.height-1)) result += (r % 2);
		if (a === 1 || a === 4) result += 1;
		if (a === 3 || a === 4) result += this.width;
		result += c;
		return this.corners[result];
	}
	get cellWidth() {
		console.log(this.cellSize, this.cellHeight);
		return Math.sqrt(3 / 2) * this.cellHeight;
	}
}