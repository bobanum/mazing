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
				this.addWall(...this.getCorner(r - 1, 0, [4, 3]));
			}
			for (let c = 0; c < this.width; c++) {
				this.addWall(...this.getCorner(r, c, [5, 0, 1]));
			}
			if (r > 0 && r % 2 === 0) {
				this.addWall(...this.getCorner(r - 1, this.width - 1, [3, 2]));
			}
			for (let c = 0; c <= this.width; c++) {
				this.addWall(...this.getCorner(r, c, [4, 5]));
			}
		}
		let r = this.height - 1;
		for (let c = 0; c < this.width; c++) {
			this.addWall(...this.getCorner(r, c, [4, 3, 2]));
		}
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
		console.log(this.cellSize, this.cellHeight);
		return Math.sqrt(3 / 2) * this.cellHeight;
	}
}