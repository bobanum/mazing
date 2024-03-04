import Wall from './Wall.js';
export default class Cell {
	_visited = false;
	constructor(walls = []) {
		this.walls = walls;
		this.corners = walls.map(wall => wall.start);
	}
	toString(scale = 1) {
		var result = this.walls.map(wall => wall.open);
		return `[${result.join(",")}]`;
	}
	static fromCorners(...corners) {
		var result = new this();
		for (let i = 0; i < corners.length; i++) {
			let start = corners[i];
			let end = corners[(i + 1) % corners.length];
			let wall = Wall.fromCorners(start, end, result);
			result.walls.push(wall);
		}
		result.corners = corners;
		return result;
	}
	getAjoining(cell) {
		return this.walls.find(wall => wall.cells.includes(cell));
	}
	get isDeadEnd() {
		return this.walls.filter(wall => wall.open !== 0).length === 1;
	}
	/**
	 * Returns the cells that are adjacent to this cell (open only)
	 * @returns {Cell[]}
	 */
	get neighbors() {
		return this.openWalls.map(wall => wall.cells.find(cell => cell !== this)).filter(cell => cell);
	}
	/**
	 * Returns the cells that are adjacent to this cell (open or not)
	 * @returns {Cell[]}
	 */
	get adjacentCells() {
		return this.walls.map(wall => wall.cells.find(cell => cell !== this)).filter(cell => cell);
	}
	get closedNeighbors() {
		return this.closedWalls.map(wall => wall.cells.find(cell => cell !== this)).filter(cell => cell);
	}
	get unvisitedNeighbors() {
		return this.closedWalls.map(wall => wall.getAjoiningTo(this)).filter(cell => cell && !cell.visited);
	}
	getUnvisited2NdNeighbors(excluding = []) {
		var adjacentCells = this.adjacentCells.filter(cell => !excluding.includes(cell));
		var unvisited = adjacentCells.map(oneCell => oneCell.unvisitedNeighbors);
		var unvisited = unvisited.flat();
		return unvisited.removeDuplicates();
	}
	communNeighbours(cell) {
		var adj1 = cell.adjacentCells;
		var adj2 = this.adjacentCells;
		return adj1.filter(oneCell => adj2.includes(oneCell));
	}
	/**
	 * Returns the walls that are open
	 * @returns {Wall[]}
	 */
	get openWalls() {
		return this.walls.filter(wall => wall.open !== 0);
	}
	/**
	 * Returns the walls that are closed
	 * @returns {Wall[]}
	 */
	get closedWalls() {
		return this.walls.filter(wall => wall.open === 0);
	}
	/**
	 * Returns true if the cell has been visited
	 */
	get visited() {
		return this._visited;
	}
	set visited(value) {
		this._visited = value;
		return this;
	}
	
}