import Renderer from "./Renderer.js";

export default class SVGFlat extends Renderer {	
	render() {
		const maze = this.maze;
		var result = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		result.setAttribute("viewBox", `${-maze.cellSize} ${-maze.cellSize} ${2*(maze.width + 1) * maze.cellSize} ${(1.5*(maze.height)+.5+4) * maze.cellSize}`);
		// result.setAttribute("width", maze.width * this.scale);
		// result.setAttribute("height", maze.height * this.scale);
		var rect = result.appendChild(document.createElementNS("http://www.w3.org/2000/svg", "rect"));
		rect.setAttribute("x", 0);
		rect.setAttribute("y", 0);
		rect.setAttribute("width", 3 * maze.cellWidth);
		rect.setAttribute("height", (maze.height+1/3) * maze.cellSize);
		rect.setAttribute("fill", "#FF0");

		result.appendChild(this.renderRooms(maze.rooms));
		result.appendChild(this.renderWalls(maze.walls));
		result.appendChild(this.renderCorners(maze.corners));
		
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
		wall.svg = result;
		result.obj = wall;
		return result;
	}
	renderRooms(rooms) {
		var result = document.createElementNS("http://www.w3.org/2000/svg", "g");
		result.classList.add("rooms");
		rooms.forEach(room => {
			result.appendChild(this.renderRoom(room));
		});
		return result;
	}
	renderRoom(room) {
		var result = document.createElementNS("http://www.w3.org/2000/svg", "path");
		result.classList.add("room");
		result.setAttribute("d", room.toString());
		room.svg = result;
		result.obj = room;
		return result;
	}
}