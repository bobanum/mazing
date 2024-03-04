import Renderer from "./Renderer.js";

export default class SVGFlat extends Renderer {	
	render() {
		const maze = this.maze;
		var result = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		result.classList.add("maze");
		result.setAttribute("viewBox", `${-maze.cellSize} ${-maze.cellSize} ${(maze.width + 2) * maze.cellWidth} ${((maze.height)+2) * maze.cellHeight}`);
		// result.setAttribute("width", maze.width * this.scale);
		// result.setAttribute("height", maze.height * this.scale);
		var rect = result.appendChild(document.createElementNS("http://www.w3.org/2000/svg", "rect"));
		rect.setAttribute("x", 0);
		rect.setAttribute("y", 0);
		rect.setAttribute("width", maze.width * maze.cellWidth + (maze.height > 1 ? maze.cellSize*.5 : 0));
		rect.setAttribute("height", (maze.height+1/3) * maze.cellSize);
		rect.setAttribute("fill", "#FF00");

		result.appendChild(this.renderCells(maze.cells));
		result.appendChild(this.renderWalls(maze.walls));
		result.appendChild(this.renderCorners(maze.corners));
		result.obj = maze;
		maze.svg = result;
		return result;
	}
	renderCorners(corners) {
		var result = document.createElementNS("http://www.w3.org/2000/svg", "g");
		result.classList.add("corners");
		corners.forEach(corner => {
			result.appendChild(this.renderCorner(corner));
		});
		return result;
	}
	renderCorner(corner) {
		var result = document.createElementNS("http://www.w3.org/2000/svg", "circle");
		result.classList.add("corner");
		result.setAttribute("cx", corner.x);
		result.setAttribute("cy", corner.y);
		result.setAttribute("r", 1);
		corner.svg = result;
		result.obj = corner;
		return result;
	}
	renderWalls(walls) {
		var result = document.createElementNS("http://www.w3.org/2000/svg", "g");
		result.classList.add("walls");
		walls.forEach(wall => {
			result.appendChild(this.renderWall(wall));
		});
		return result;
	}
	renderWall(wall) {
		var result = document.createElementNS("http://www.w3.org/2000/svg", "path");
		result.classList.add("wall");
		result.setAttribute("d", wall.toString());
		if (wall.open) {
			result.classList.add("open");
		}
		wall.svg = result;
		result.obj = wall;
		return result;
	}
	renderCells(cells) {
		var result = document.createElementNS("http://www.w3.org/2000/svg", "g");
		result.classList.add("cells");
		cells.forEach(cell => {
			result.appendChild(this.renderCell(cell));
		});
		return result;
	}
	renderCell(cell) {
		var result = document.createElementNS("http://www.w3.org/2000/svg", "path");
		result.classList.add("cell");
		result.setAttribute("d", cell.toString());
		cell.svg = result;
		result.obj = cell;
		return result;
	}
}