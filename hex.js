// import Maze from "./src/SquareMaze.js";
import Maze from "./src/HexMaze.js";
import Cursor from "./src/Cursor.js";
import "./src/utils.js";

class HexMaze extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: 'open' });
	}
	get width() {
		return parseInt(this.getAttribute("width"));
	}
	set width(value) {
		this.setAttribute("width", value);
	}
	get height() {
		return parseInt(this.getAttribute("height"));
	}
	set height(value) {
		this.setAttribute("height", value);
	}

	/**
	 * Méthode principale. Sera appelée après le chargement de la page.
	 */
	connectedCallback() {		
		let style = document.createElement('link');
		style.rel = 'stylesheet';
		style.href = 'css/maze.css';
		this.shadowRoot.appendChild(style);
		Maze.rendererClass = "SVGFlat";
		var maze = new Maze(this.width, this.height);
		
		this.render(maze).then(svg => {			
			this.shadowRoot.appendChild(svg);
		});
	}
	render(maze) {
		// maze.createCells();
		return maze.render().then(svg => {
			// this.shadowRoot.appendChild(svg);
			
			var cell = maze.getCell(0, 0);
			// var cursor = new Cursor(maze, cell);
			// cursor.run();
			// maze.svg.addEventListener("click", e => {
			// 	if (e.shiftKey) {
			// 		maze.decimate(1, 4);
			// 		return;
			// 	}
			// 	if (e.ctrlKey) {

			// 		var deadends = maze.findDeadEnds();
			// 		deadends.slice(0).forEach(cell => {
			// 			cell.svg.classList.add("dead-end");
			// 			var limit = 1000;
			// 			var next = cell.neighbors[0];
			// 			var neighbors = next.neighbors.filter(neighbor => neighbor !== cell);
			// 			while (neighbors.length === 1 && limit-- > 0) {
			// 				cell = next;
			// 				cell.svg.classList.add("dead-end");
			// 				next = neighbors[0];
			// 				neighbors = next.neighbors.filter(neighbor => neighbor !== cell);
			// 			}
			// 		});
			// 		// console.log(maze.corners);
			// 		var corridors = maze.cells.filter(cell => cell.openWalls.length === 2);
			// 		corridors.forEach(cell => {
			// 			cell.svg.classList.add("corridor");
			// 		});
			// 		var intersections = maze.cells.filter(cell => cell.openWalls.length > 2);
			// 		intersections.forEach(cell => {
			// 			cell.svg.classList.add("intersection");
			// 		});
			// 	}
			// });
			return svg;
		});
	}
	static get observedAttributes() {
		return ['width', 'height'];
	}
	attributeChangedCallback(name, oldValue, newValue) {
		if (oldValue === newValue) return;

		let oldSvg = this.shadowRoot.querySelector("svg");
		if (!oldSvg) return;
		
		var maze = new Maze(this.width, this.height);
		
		this.render(maze).then(svg => {			
			oldSvg.replaceWith(svg);
		});
		
	}
}
customElements.define('hex-maze', HexMaze);