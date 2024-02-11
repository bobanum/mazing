import Room from "./Room.js";
import Corner from "./Corner.js";
import Wall from "./Wall.js";

export default class Laby {
	constructor(w, h, scale = 10) {
		this.w = w;
		this.h = h;
		this.scale = scale;
		this.corners = [];
		this.walls = [];
		this.rooms = [];
		this.start = null;
		this.end = null;
	}
	createRooms() {
		for (let r = 0; r < this.h; r++) {
			for (let c = 0; c < this.w; c++) {
				this.corners.push(new Corner(c, r));
			}
		}
		for (let r = 0; r < this.h; r++) {
			for (let c = 1; c < this.w; c++) {
				this.walls.push(new Wall(this.getCorner(r, c-1), this.getCorner(r, c)));
			}
		}
		for (let r = 1; r < this.h; r++) {
			for (let c = 0; c < this.w; c++) {
				this.walls.push(new Wall(this.getCorner(r-1, c), this.getCorner(r, c)));
			}
		}
		for (let r = 1; r < this.h; r++) {
			for (let c = 1; c < this.w; c++) {
				this.rooms.push(Room.fromCorners([
					this.getCorner(r-1, c-1), 
					this.getCorner(r-1, c),
					this.getCorner(r, c), 
					this.getCorner(r, c-1)
				]));
			}
		}
	}
	getCorner(row, col) {
		return this.corners[row * this.w + col];
	}
	render(scale = 10) {
		var result = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		result.setAttribute("viewBox", `${-this.scale} ${-this.scale} ${2*(this.w + 1) * this.scale} ${2*(this.h + 1) * this.scale}`);
		result.setAttribute("width", this.w * scale);
		result.setAttribute("height", this.h * scale);
		var corners = result.appendChild(document.createElementNS("http://www.w3.org/2000/svg", "g"));
		this.corners.forEach(corner => {
			corners.appendChild(corner.render(this.scale));
		});
		var walls = result.appendChild(document.createElementNS("http://www.w3.org/2000/svg", "g"));
		this.walls.forEach(wall => {
			walls.appendChild(wall.render(this.scale));
		});
		var rooms = result.appendChild(document.createElementNS("http://www.w3.org/2000/svg", "g"));
		rooms.style.fill = "#00f8";
		this.rooms.forEach(room => {
			rooms.appendChild(room.render(this.scale));
		});
		// var rooms = result.appendChild(document.createElementNS("http://www.w3.org/2000/svg", "g"));
		// rooms.style.fill = "#0f08";
		// this.rooms.slice(11, 19).forEach(room => {
		// 	rooms.appendChild(room.render(this.scale));
		// });
		return result;
	}
}