import Cell from "./Cell.js";
import Corner from "./Corner.js";
import Maze from "./Maze.js";
import Wall from "./Wall.js";

export default class Maze3D extends Maze {
	constructor(width, height, depth, cellSize = 10) {
		super(width, height, cellSize);
		this.depth = depth;
	}
}