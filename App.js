import Maze from "./src/SquareMaze.js";
// import Maze from "./src/HexMaze.js";
import Cursor from "./src/Cursor.js";
import "./src/utils.js";

export default class App {
	/**
	 * Méthode principale. Sera appelée après le chargement de la page.
	 */
	static main() {
		return;
		var app = document.getElementById("app");
		Maze.rendererClass = "SVGFlat";
		var maze = new Maze(15, 15);
		maze.createCells();
		maze.render().then(svg => {
			app.appendChild(svg);
			var cell = maze.getCell(7, 7);
			var cursor = new Cursor(maze, cell);
			cursor.run();
			maze.svg.addEventListener("click", e => {
				if (e.shiftKey) {
					maze.decimate(1, 4);
					return;
				}
				if (e.ctrlKey) {

					var deadends = maze.findDeadEnds();
					deadends.slice(0).forEach(cell => {
						cell.svg.classList.add("dead-end");
						var limit = 1000;
						var next = cell.neighbors[0];
						var neighbors = next.neighbors.filter(neighbor => neighbor !== cell);
						while (neighbors.length === 1 && limit-- > 0) {
							cell = next;
							cell.svg.classList.add("dead-end");
							next = neighbors[0];
							neighbors = next.neighbors.filter(neighbor => neighbor !== cell);
						}
					});
					// console.log(maze.corners);
					var corridors = maze.cells.filter(cell => cell.openWalls.length === 2);
					corridors.forEach(cell => {
						cell.svg.classList.add("corridor");
					});
					var intersections = maze.cells.filter(cell => cell.openWalls.length > 2);
					intersections.forEach(cell => {
						cell.svg.classList.add("intersection");
					});
				}
			});
		});
		// HexMaze.rendererClass = "SVGFlat";
		// var maze = new HexMaze(4, 5);
		// maze.createCells();
		// maze.render().then(svg => {
		// 	app.appendChild(svg);
		// });
	}
}
