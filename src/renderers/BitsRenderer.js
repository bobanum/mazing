import Renderer from "./Renderer.js";

export default class BitsRenderer extends Renderer {	
	render() {
		const maze = this.maze;
		var result = [];
		for (let r = 0; r < maze.height; r++) {
			let row = [];
			for (let c = 0; c < maze.width; c++) {
				let cell = maze.getCell(r, c);
				var bits = cell.walls.reduce((acc, wall) => acc << 1 | (wall.open!==0), 0);
				row.push(bits);
			}
			result.push(row);
		}
		return result;
	}
}