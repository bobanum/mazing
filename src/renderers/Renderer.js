export default class Renderer {
	/**
	 * @param {Maze} maze 
	 * @param {number} scale 
	 */
	constructor(maze, scale = 10) {
		this.maze = maze;
		this.scale = scale;
	}
}