import SVGRenderer from "./SVGRenderer.js";

export default class SVG3D extends SVGRenderer {	
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
		Promise.resolve().then(() => {
			// result.appendChild(this.renderFloors(maze.cells));
			// result.appendChild(this.renderCells(maze.cells));
			result.appendChild(this.renderWalls(maze.walls));
			// result.appendChild(this.renderCorners(maze.corners));
		});
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
		Promise.resolve().then(() => {
			result.classList.add("walls");
			walls.forEach(wall => {
				result.appendChild(this.renderWall(wall));
			});
		});
		return result;
	}
	renderWall(wall) {
		var result = this.createElement("path.wall");
		var d = wall.corners.reduce((d, corner, i) => {
			d += `${corner.x + corner.z * .2},${corner.y + corner.z * .3} `;
			return d;
		}, "M ");
		d += "Z";
		result.setAttribute("d", d);
		if (wall.open) {
			result.classList.add("open");
		}
		wall.svg = result;
		result.obj = wall;
		return result;
	}
	renderFloors(cells) {
		var result = this.createElement("g.floors");
		var cellsPerFloor = this.maze.width * this.maze.height;
		for (let f=0; f<1; f++) {
			result.appendChild(this.renderFloor(cells.slice(f*cellsPerFloor, (f+1)*cellsPerFloor)));
		}
		return result;
	}
	renderFloor(cells) {
		var result = this.createElement("g.floor");
		result.appendChild(this.renderCell(cells[1]));
		// cells.slice(0,2).forEach(cell => {
		// 	result.appendChild(this.renderCell(cell));
		// });
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
		var d = "M " + cell.walls[3].start + " " + cell.walls[3].end;
		// cell.walls.slice(0, 1).forEach(wall => {
		// 	d += " L " + wall.end;
		// });
		var result = this.createElement("path.cell", {
			d: d,
			stroke: "black",
			fill: "transparent",
			"stroke-width": "1px",
		});
		cell.svg = result;
		result.obj = cell;
		return result;
	}
}