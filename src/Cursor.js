export default class Cursor {
	constructor(maze, start) {
		this.maze = maze;
		this.path = [start];
		start.visited = true;
	}
	run() {
		while (this.path.length > 0) {
			var cell = this.path[this.path.length - 1];
			const walls = [...cell.walls].filter(wall => wall.open === 0);
			const neighbors = walls.reduce((acc, wall) => {
				acc.push(...wall.cells.filter(oneCell => oneCell !== undefined && oneCell !== cell && !oneCell.visited));
				return acc;
			}, []).shuffle();
			if (neighbors.length === 0) {
				this.path.pop();
				continue;
			}
			var newCell = neighbors[0];
			this.path.push(newCell);
			newCell.visited = true;
			const ajoining = cell.getAjoining(newCell);
			ajoining.open = 3;
			ajoining.svg.classList.add("open");
			newCell.svg.classList.add("current");
		}
	}
}