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
			var cell = maze.getCell(0,0);
			var cursor = new Cursor(maze, cell);
			cursor.run();
			// console.log(maze.corners);
			// maze.decimate(.9, 3);
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
