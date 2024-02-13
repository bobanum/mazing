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

		var corners = result.appendChild(document.createElementNS("http://www.w3.org/2000/svg", "g"));
		corners.classList.add("corners");
		maze.corners.forEach(corner => {
			corners.appendChild(this.renderCorner(corner));
		});
		// var walls = result.appendChild(document.createElementNS("http://www.w3.org/2000/svg", "g"));
		// walls.classList.add("walls");
		// maze.walls.forEach(wall => {
		// 	walls.appendChild(this.renderWall(wall));
		// });
		var rooms = result.appendChild(document.createElementNS("http://www.w3.org/2000/svg", "g"));
		rooms.classList.add("rooms");
		maze.rooms.forEach(room => {
			rooms.appendChild(this.renderRoom(room));
		});
		// maze.walls.forEach(wall => {
		// 	walls.appendChild(wall.render(maze.cellSize));
		// });
		// var rooms = result.appendChild(document.createElementNS("http://www.w3.org/2000/svg", "g"));
		// rooms.style.fill = "#0f08";
		// maze.rooms.slice(11, 19).forEach(room => {
		// 	rooms.appendChild(room.render(maze.cellSize));
		// });
		return result;
	}
	renderCorner(corner) {
		var result = document.createElementNS("http://www.w3.org/2000/svg", "circle");
		result.classList.add("corner");
		result.setAttribute("cx", corner.x);
		result.setAttribute("cy", corner.y);
		result.setAttribute("r", 1);
		corner.svg = result;
		return result;
	}
	renderWall(wall) {
		var result = document.createElementNS("http://www.w3.org/2000/svg", "path");
		result.classList.add("wall");
		result.setAttribute("d", wall.toString());
		wall.svg = result;
		return result;
	}
	renderRoom(room) {
		var result = document.createElementNS("http://www.w3.org/2000/svg", "path");
		result.classList.add("room");
		result.setAttribute("d", room.toString());
		room.svg = result;
		return result;
	}
}