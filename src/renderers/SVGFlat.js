import SVGRenderer from "./SVGRenderer.js";

export default class SVGFlat extends SVGRenderer {	
	render() {
		const maze = this.maze;
		var result = this.createElement("svg.maze", {
			viewBox: `${-maze.cellSize} ${-maze.cellSize} ${(maze.width + 2) * maze.cellWidth} ${((maze.height)+2) * maze.cellHeight}`,
		});
		var rect = result.appendChild(this.createElement("rect"), {
			fill: "#FF08",
			x: 0,
			y: 0,
			width: maze.width * maze.cellWidth + (maze.height > 1 ? maze.cellSize*.5 : 0),
			height: (maze.height+1/3) * maze.cellSize,
		});

		result.appendChild(this.renderCells(maze.cells));
		result.appendChild(this.renderWalls(maze.walls));
		result.appendChild(this.renderCorners(maze.corners));
		result.obj = maze;
		maze.svg = result;
		return result;
	}
	renderCorners(corners) {
		var result = this.createElement("g.corners");
		corners.forEach(corner => {
			result.appendChild(this.renderCorner(corner));
		});
		return result;
	}
	renderCorner(corner) {
		var result = this.createElement("circle.corner", {
			fill: "red",
			cx: corner.x,
			cy: corner.y,
			r: 1.5,
		});
		corner.svg = result;
		result.obj = corner;
		return result;
	}
	renderWalls(walls) {
		var result = this.createElement("g");
		result.classList.add("walls");
		walls.forEach(wall => {
			result.appendChild(this.renderWall(wall));
		});
		return result;
	}
	renderWall(wall) {
		var result = this.createElement("path.wall");
		var vertices = wall.corners.map(corner => `${corner.c},${corner.r}`);
		result.setAttribute("d", "M" + vertices.join(" "));
		if (wall.open) {
			result.classList.add("open");
		}
		wall.svg = result;
		result.obj = wall;
		return result;
	}
	renderCells(cells) {
		var result = this.createElement("g.cells");
		cells.forEach(cell => {
			result.appendChild(this.renderCell(cell));
		});
		return result;
	}
	renderCell(cell) {
		var result = this.createElement("path.cell", {
			d: cell.toString(),
		});
		result.setAttribute("d", cell.toString());
		cell.svg = result;
		result.obj = cell;
		return result;
	}
}