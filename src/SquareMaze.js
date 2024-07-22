import CornerBase from "./Corner.js";
import Maze from "./Maze.js";
import CellBase from "./Cell.js";
import WallBase from "./Wall.js";

export default class SquareMaze extends Maze {
	getCornerCoords(cr, a) {
		if (a instanceof Array) {
			return a.map(a => this.getCornerCoords(cr, a));
		}
		var result = Corner.getCoords(cr, a);
		return [result[0] * this.cellWidth, result[1] * this.cellHeight];
	}
	createCellCorner(cr, a) {
		if (a instanceof Array) {
			return a.map(a => this.createCellCorner(cr, a));
		}
		var result = this.getCornerCoords(cr, a);
		//!!!
		result = new Corner(...result);
		return result;
	}
	createCells() {
		// 0----1
		// |    |
		// 3----2
		for (let r = 0; r < this.height; r++) {
			for (let c = 0; c < this.width; c++) {
				let cellL = this.getCell(c - 1);
				let cellT = this.getCell(c, r - 1);
				let cr = [c, r];
				let corners = [
					/*0*/ cellT?.corners[3] || cellL?.corners[1] || this.createCellCorner(cr, 0),
					/*1*/ cellT?.corners[2] || this.createCellCorner(cr, 1),
					/*2*/ this.createCellCorner(cr, 2),
					/*3*/ cellL?.corners[2] || this.createCellCorner(cr, 3),
				];
				let cell = new this.Cell(c, r);
				cell.addCorner(...corners);
				// this.addCell(cell);
				this.cells.push(cell);
				this.walls.appendNew(...cell.walls);
			}
		}
		return this;
	}
	getCell(c, r) {
		if (r < 0 || r >= this.height || c < 0 || c >= this.width) return null;
		return this.cells[r * this.width + c];
	}
	get cellWidth() {
		return this.cellHeight;
	}
}
export class Corner extends CornerBase {
	/**
	 * Returns the coordinates c,r of the corner (of a cell cr) 
	 * @param {array} cr - [column, row] of the cell
	 * @returns 
	 */
	static getCoords(cr, a = 0) {
		const offset = [
			[0, 0, 0],
			[1, 0, 0],
			[1, 1, 0],
			[0, 1, 0],
		][a];
		var result = cr.reduce((acc, one, i) => { acc[i] += one; return acc; }, [...offset]);
		return result;
	}
	// a = 0 = top left
	// static getCoords(cr, a = 0) {
	// 	var result = [c, r];
	// 	if (a === 1 || a === 2) {
	// 		result[0] += 1;
	// 	}
	// 	if (a === 2 || a === 3) {
	// 		result[1] += 1;
	// 	}
	// 	return result;
	// }
}
SquareMaze.Corner = SquareMaze.prototype.Corner = Corner;

export class Wall extends WallBase {
}
SquareMaze.Wall = SquareMaze.prototype.Wall = Wall;

export class Cell extends CellBase {
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
SquareMaze.Cell = SquareMaze.prototype.Cell = Cell;