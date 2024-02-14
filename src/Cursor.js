export default class Cursor {
	constructor(maze, start) {
		this.maze = maze;
		this.path = [start];
		start.visited = true;
	}
	run() {
		while (this.path.length > 0) {
			var room = this.path[this.path.length - 1];
			const walls = [...room.walls].filter(wall => wall.open === 0);
			const neighbors = walls.reduce((acc, wall) => {
				acc.push(...wall.rooms.filter(oneRoom => oneRoom !== undefined && oneRoom !== room && !oneRoom.visited));
				return acc;
			}, []).shuffle();
			if (neighbors.length === 0) {
				this.path.pop();
				continue;
			}
			var newRoom = neighbors[0];
			this.path.push(newRoom);
			newRoom.visited = true;
			const ajoining = room.getAjoining(newRoom);
			ajoining.open = 3;
			ajoining.svg.classList.add("open");
			newRoom.svg.classList.add("current");
		}
	}
}