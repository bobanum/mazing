import CornerBase from "./Corner.js";
import Maze from "./Maze.js";
import CellBase from "./Cell.js";
import WallBase from "./Wall.js";
import Cursor from "./Cursor.js";

export default class Maze3D extends Maze {
	constructor(width, height, depth, cellSize = 10) {
		super(width, height, cellSize);
		this.depth = depth;
	}
	createCells() {
		// 4----5
		// |0---+1
		// 7+---6|
		// 	3----2
		for (let f = 0; f < this.depth; f++) {
			for (let r = 0; r < this.height; r++) {
				for (let c = 0; c < this.width; c++) {
					let cellL = this.getCell(c - 1, r, f);
					let cellT = this.getCell(c, r - 1, f);
					let cellB = this.getCell(c, r, f - 1);
					let crf = [c, r, f];
					let corners = [
						/*0*/ cellB?.corners[4] || cellT?.corners[3] || cellL?.corners[1] || this.createCellCorner(crf, 0),
						/*1*/ cellB?.corners[5] || cellT?.corners[2] || this.createCellCorner(crf, 1),
						/*2*/ cellB?.corners[6] || this.createCellCorner(crf, 2),
						/*3*/ cellB?.corners[7] || cellL?.corners[2] || this.createCellCorner(crf, 3),
						/*4*/ cellT?.corners[7] || cellL?.corners[5] || this.createCellCorner(crf, 4),
						/*5*/ cellT?.corners[6] || this.createCellCorner(crf, 5),
						/*6*/ this.createCellCorner(crf, 6),
						/*7*/ cellL?.corners[6] || this.createCellCorner(crf, 7),
					];
					let cell = new this.Cell(crf);
					this.addCell(...corners);
				}
			}
		}
		return this;
	}
	getCornerCoords(crf, a) {
		if (a instanceof Array) {
			return a.map(a => this.getCornerCoords(crf, a));
		}
		var result = Corner.getCoords(crf, a);
		return [result[0] * this.cellWidth, result[1] * this.cellHeight, result[2] * this.cellDepth];
	}

	createCellCorner(crf, a) {
		if (a instanceof Array) {
			return a.map(a => this.createCellCorner(crf, a));
		}
		var result = this.getCornerCoords(crf, a);
		result = new Corner(...result);
		return result;
	}
	addCell(...corners) {
		var cell = this.Cell.fromCorners(...corners);
		this.appendCells(cell);
		this.appendWalls(...cell.walls);
		this.appendCorners(...cell.corners);
		return cell;
	}
	getCell(c, r, f) {
		if (f < 0 || f >= this.depth || r < 0 || r >= this.height || c < 0 || c >= this.width) return null;
		return this.cells[f * this.width * this.height + r * this.width + c];
	}
	generate() {
		this.createCells();
		var cell = this.getCell(Math.floor(this.depth / 2), Math.floor(this.height / 2), Math.floor(this.width / 2));
		var cursor = new Cursor(this, cell);
		cursor.run();
	}
}
class Corner extends CornerBase {
	constructor(...coords) {
		super(...coords);
	}
	get f() {
		return this.coords[2];
	}
	get id() {
		return this.coords.map(coord => coord.toString().padStart(2,0)).join(",");
	}
	toString(scale = 1) {
		return this.id;
	}
	/**
	 * Returns the coordinates f,r,c of the corner (of a cell crf) 
	 * @param {array} crf - [floor, row, column] of the cell
	 * @returns 
	 */
	static getCoords(crf, a = 0) {
		const offset = [
			[0, 0, 0],
			[1, 0, 0],
			[1, 1, 0],
			[0, 1, 0],
			[0, 0, 1],
			[1, 0, 1],
			[1, 1, 1],
			[0, 1, 1],
		][a];
		var result = crf.reduce((acc, one, i) => { acc[i] += one; return acc}, [...offset]);
		return result;
	}
}
Maze3D.Corner = Maze3D.prototype.Corner = Corner;

class Wall {
	_open = 0;
	corners = [];
	constructor(corners) {
		// console.log(corners.join("•"));
		this.corners = corners;
		this.cells = [];
		this._open = 0;	// 0:close, 1:open cell 0 to cell 1, 2:open cell 1 to cell 2, 3: closed
	}
	get start() {
		return this.corners[0];
	}
	get end() {
		return this.corners.slice(-1)[0];
	}
	get id() {
		return this.corners.map(corner => corner.id).sort().join("¦");
	}
	toString(scale = 1) {
		return this.id;
		// return this.corners.join("¦");
	}
	static fromCorners(corners, cell = null) {
		// 1----2
		// |    |
		// 0----3 <- bottom
		// console.log(corners.join("¤"));
		var wall;
		corners.forEach(corner => {
			corner.appendCells(cell);
		});
		// Check if the wall already exists
		// console.log(corners[0].walls.join("¶"));
		var id = corners.map(corner => corner.id).sort().join("¦");

		var walls = corners.map(corner => corner.walls).flat();
		var wall = walls.find(wall => wall.id === id);
		// var wall = wallIds.find(id);
		// var wall = corners[0].walls.find(wall => wall.corners.includes(corners[1]) && wall.corners.includes(corners[3]));
		if (wall) {
			return wall;
		}
		// var start = corners[0];
		// var end = corners.slice(-1)[0];
		// if (wall = start.wallTo(end)) {
		// 	wall.cells[1] = cell;
		// 	return wall;
		// }
		// if (wall = end.wallTo(start)) {
		// 	wall.cells[0] = cell;
		// 	return wall;
		// }
		wall = new this(corners);
		corners.forEach(corner => {
			corner.appendWalls(wall);
		});
		return wall;
	}
	getAjoiningTo(cell) {
		return this.cells.find(oneCell => oneCell !== cell);
	}

	getOpposite(corner) {
		if (!this.corners.includes(corner)) {
			return null;
		}
		return this.corners.find(oneCorner => oneCorner !== corner);
	}
	get open() {
		return this._open;
	}
	set open(value) {
		this._open = value & 3;
		return this;
	}
}
Maze3D.Wall = Maze3D.prototype.Wall = Wall;
class Cell extends CellBase {
	constructor(...args) {
		super(...args);
	}
	static fromCorners(...corners) {
		var result = new this();
		// Floor
		result.walls.push(Wall.fromCorners(corners.slice(0, 4), result));
		// North
		result.walls.push(Wall.fromCorners([corners[0], corners[4], corners[5], corners[1]], result));
		// East
		result.walls.push(Wall.fromCorners([corners[1], corners[5], corners[6], corners[2]], result));
		// South
		result.walls.push(Wall.fromCorners([corners[2], corners[6], corners[7], corners[3]], result));
		// West
		result.walls.push(Wall.fromCorners([corners[3], corners[7], corners[4], corners[0]], result));
		// Ceiling
		result.walls.push(Wall.fromCorners(corners.slice(-4), result));
		
		// for (let j = 0; j < 2; j++) {
		// 	let cs = corners.slice(j * corners.length / 2, (j + 1) * corners.length / 2);
		// 	for (let i = 0; i < cs.length; i++) {
		// 		let start = cs[i];
		// 		let end = cs[(i + 1) % cs.length];
		// 		let wall = Wall.fromCorners([start, end], result);
		// 		result.walls.push(wall);
		// 	}
		// }
		result.corners = corners;
		return result;
	}
	
}

Maze3D.Cell = Maze3D.prototype.Cell = Cell;