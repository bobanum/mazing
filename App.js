import Maze from "./src/SquareMaze.js";
// import Maze from "./src/HexMaze.js";

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
		// Maze.rendererClass = "SVGFlat";
		// Maze.rendererClass = "BitsRenderer";
		Maze.rendererClass = ["BitsRenderer", "SVGFlat"];
		var maze = new Maze(5, 5);
		maze.generate();
		maze.render().then(renders => {
			app.appendChild(renders.SVGFlat);
		});
		return;
	}
}
