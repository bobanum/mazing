// import Maze from "./src/SquareMaze.js";
import Maze from "./src/HexMaze.js";
import Cursor from "./src/Cursor.js";

Object.defineProperty(Array.prototype, "shuffle", {
	value: function () {
		for (let i = this.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[this[i], this[j]] = [this[j], this[i]];
		}
		return this;
	}
});
Object.defineProperty(Array.prototype, "removeDuplicates", {
	value: function () {
		for (let i = this.length - 1; i > 0; i--) {
			if (this.indexOf(this[i]) !== i) {
				this.splice(i, 1);
			}
		}
		return this;
	}
});

export default class App {
	/**
	 * Méthode principale. Sera appelée après le chargement de la page.
	 */
	static main() {
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
	/**
	 * Charge un fichier JSON.
	 * @param {string} url URL du fichier JSON ou de l'API
	 * @returns {Promise} Promise résolue avec le JSON
	 */
	static chargerJson(url) {
		return new Promise(function (resolve) {
			var xhr = new XMLHttpRequest();
			xhr.open("GET", url);
			xhr.responseType = "json";
			xhr.addEventListener("load", e => {
				resolve(xhr.response);
			});
			xhr.send();
		});
	}
}
