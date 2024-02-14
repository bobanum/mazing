import CornerBase from "./Corner.js";
import Maze from "./Maze.js";
import CellBase from "./Cell.js";
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
	createCellCorner(r, c, a) {
		if (a instanceof Array) {
			return a.map(a => this.createCellCorner(r, c, a));
		}
		var result = this.getCornerCoords(r, c, a);
		result = new Corner(...result);
		return result;
	}
	createCells() {
		for (let r = 0; r < this.height; r++) {
			for (let c = 0; c < this.width; c++) {
				let cellL = this.getCell(r, c - 1);
				let cellTL = this.getCell(r - 1, c + r % 2 - 1);
				let cellTR = this.getCell(r - 1, c + r % 2);
				let corners = [
					cellTL?.corners[2] || cellTR?.corners[4] || this.createCellCorner(r, c, 0),
					cellTR?.corners[3] || this.createCellCorner(r, c, 1),
					...this.createCellCorner(r, c, [2, 3]),
					cellL?.corners[2] || this.createCellCorner(r, c, 4),
					cellL?.corners[1] || cellTL?.corners[3] || this.createCellCorner(r, c, 5),
				];
				this.addCell(...corners);
			}
		}
		return this;
	}
	addCell(...corners) {
		var cell = Cell.fromCorners(...corners);
		this.appendCells(cell);
		this.appendWalls(...cell.walls);
		this.appendCorners(...cell.corners);
		return cell;
	}
	getCell(r, c) {
		if (r < 0 || r >= this.height || c < 0 || c >= this.width) return null;
		return this.cells[r * this.width + c];
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
class Cell extends CellBase {
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