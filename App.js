import SquareMaze from "./src/SquareMaze.js";
import HexMaze from "./src/HexMaze.js";
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
		HexMaze.rendererClass = "SVGFlat";
		var maze = new HexMaze(15, 15);
		maze.createRooms();
		maze.render().then(svg => {
			app.appendChild(svg);
			var room = maze.getRoom(0,0);
			var cursor = new Cursor(maze, room);
			cursor.run();
		});
		// HexMaze.rendererClass = "SVGFlat";
		// var maze = new HexMaze(4, 5);
		// maze.createRooms();
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
