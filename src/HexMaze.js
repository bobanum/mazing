import CornerBase from "./Corner.js";
import Maze from "./Maze.js";
import CellBase from "./Cell.js";
import WallBase from "./Wall.js";
import Point from "./Point.js";
import Size from "./Size.js";

export default class HexMaze extends Maze {
	constructor(width, height, cellSize = 10) {
		super(width, height, new Size(cellSize, cellSize * Math.SQRT3 / 2));
		this.mode = 0;	// 0: hourglass; 1: zigzag; 2: diamond; 3: zagzig
		this.orientation = 1;	// 0: horizontal; 1: vertical
	}
	// addCorners() {
	// 	for (let c = 0; c < this.width; c+=1) {
	// 		this.corners.push(new Corner(this, ...this.getCornerCoords(0, c, 0)));
	// 	}
	// 	for (let r = 0; r < this.height; r+=1) {

	// 		for (let c = 0; c <= this.width; c+=1) {
	// 			this.corners.push(new Corner(this, ...this.getCornerCoords(r, c, 5)));
	// 		}
	// 		for (let c = 0; c <= this.width; c+=1) {
	// 			this.corners.push(new Corner(this, ...this.getCornerCoords(r, c, 4)));
	// 		}
	// 	}
	// 	let r = this.height - 1;
	// 	for (let c = 0; c < this.width; c+=1) {
	// 		this.corners.push(new Corner(this, ...this.getCornerCoords(r, c, 3)));
	// 	}
	// }
	getCornerCoords(r, c, a) {
		if (a instanceof Array) {
			return a.map(a => this.getCornerCoords(r, c, a));
		}
		var result = Corner.getCoords(a);
		console.log(a, result.x, result.y);
		result.add(c + 1/2, r + 2 / 3);
		console.log(a, result.x, result.y);
		result.mult(this.cellSize);
		console.log(a, result.x, result.y);

		return result;
	}
	createCellCorner(r, c, a) {
		if (a instanceof Array) {
			return a.map(a => this.createCellCorner(r, c, a));
		}
		var result = this.getCornerCoords(r, c, a);
		// console.log(result);

		result = new Corner(this, result.x, result.y);
		return result;
	}
	createCorners() {
		for (var r = 0, m = this.height; r < m; r += 1) {
			// this.corners.push(...this.createCellCorner(r, 0, [5]));

			for (var c = 0, n = this.rowWidth(r); c < n; c += 1) {
				this.corners.push(...this.createCellCorner(r, c, [0, 1, 2, 3, 4, 5]));
			}
			// if (this.mode === 2) {
			// 	if (r % 2 === 0) {
			// 		this.corners.push(...this.createCellCorner(r, 0, [4]));
			// 	} else {
			// 		this.corners.push(...this.createCellCorner(r - 1, c, [2]));
			// 	}
			// }
		}
		// r--;
		// for (var c = 0, m = this.rowWidth(r); c < m; c+=1) {
		// 	this.corners.push(...this.createCellCorner(r, c, [3, 4]));
		// }
		// if (this.mode === 2) {
		// 	if (r % 2 === 0) {
		// 		this.corners.push(...this.createCellCorner(r, m, [3, 4, 5]));
		// 	} else {
		// 		this.corners.push(...this.createCellCorner(r, m - 1, [2]));
		// 	}
		// }
	}
	createCells() {
		console.log("createCells");

		this.createCorners();
		return;
		for (let r = 0; r < this.height; r += 1) {
			let start = r % 2;
			for (let c = 0, n = this.rowWidth(r); c < n; c += 1) {
				// console.log(Cell.getCoords(this, r, c));

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
	rowWidth(r) {
		// debugger;
		if (this.height === 1) return this.width;
		if (this.mode % 2 === 1) return this.width;
		if (this.mode / 2 !== r % 2) return this.width;
		return this.width - 1;
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
		if (this.mode === 0 && r % 2 === 1 && c === this.width - 1) return null;
		if (this.mode === 2 && r % 2 === 0 && c === this.width - 1) return null;
		return this.cells[r * this.width - Math.floor(r / 2) + c];
	}
	zzzgetCornerCoords(r, c, a = [0, 1, 2, 3, 4, 5]) {

		if (a instanceof Array) {
			return a.map(a => this.getCornerCoords(r, c, a));
		}
		var result = Corner.getCoords(r, c, a);
		return result;
	}
	get mazeWidth() {
		let result = this.width * this.cellWidth;
		if (this.height === 1) return result;
		if (this.mode % 2 === 0) return result;
		return result + this.cellWidth / 2;
	}
	get mazeHeight() {
		return (this.height + 1 / 3) * this.cellHeight;
	}
	// get cellWidth() {
	// 	return this.cellHeight * Math.sqrt(3) / 2;
	// }
}
class Corner extends CornerBase {
	static getCoords(a) {
		const coordsV = [
			[0, -2],
			[1, -1],
			[1, 1],
			[0, 2],
			[-1, 1],
			[-1, -1],
		];
		const coordsH = [
			[1, -1],
			[2, 0],
			[1, 1],
			[-1, 1],
			[-2, 0],
			[-1, -1],
		];
		return new Point(...coordsV[a]).mult([1 / 2, 1 / 3]);
	}
}
class Wall extends WallBase {
}
class Cell extends CellBase {
	static getCoords(maze, r, c) {
		let result = { x: maze.cellWidth * (c + .5), y: maze.cellHeight * (r + 4 / 6) };
		return result;
		if (r < 0 || r >= this.height || c < 0 || c >= this.width) return null;
		if (this.mode === 0 && r % 2 === 1 && c === this.width - 1) return null;
		if (this.mode === 2 && r % 2 === 0 && c === this.width - 1) return null;
		return this.cells[r * this.width - Math.floor(r / 2) + c];
	}
	// Usless for now
	static getCornerCoords(r, c, a = [0, 1, 2, 3, 4, 5]) {

		if (a instanceof Array) {
			return a.map(a => this.getCornerCoords(r, c, a));
		}
		var result = Corner.getCoords(r, c, a);
		return result;
	}
	// Usless for now
	static zzzcreateCorners(maze, r, c, from = 0, to = 5) {
		var angles = [0, 1, 2, 3, 4, 5];
		var result = this.getCornerCoords(r, c, angles.slice(from, to - from + 1));
		result = result.map(coords => new Corner(maze, ...coords));
		return result;
	}
}