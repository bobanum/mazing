import SquareMaze from "./src/SquareMaze.js";
import Maze3D from "./src/Maze3D.js";
import HexMaze from "./src/HexMaze.js";

Object.defineProperty(Array.prototype, "appendNew", {
	value: function (...array) {
		array = array.filter(item => !this.includes(item));
		this.push(...array);
		return this;
	}
});
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

		// SquareMaze.rendererClass = "SVGFlat";
		// var maze = new SquareMaze(5, 5);
		// maze.generate();
		// maze.render().then(renders => {
		// 	app.appendChild(renders.SVGFlat);
		// });

		// HexMaze.rendererClass = "SVGFlat";
		// var maze = new HexMaze(5, 5);
		// maze.generate();
		// maze.render().then(renders => {
		// 	console.log(renders);
		// 	app.appendChild(renders.SVGFlat);
		// });

		Maze3D.rendererClass = "SVG3D";
		var maze = new Maze3D(5, 5, 3);
		maze.generate();
		maze.render().then(renders => {
			app.appendChild(renders.SVG3D);
		});

		return;
	}
}
