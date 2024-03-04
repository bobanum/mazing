export default class Cursor {
	constructor(maze, start) {
		this.maze = maze;
		this.path = [start];
		start.visited = true;
	}
	run() {
		while (this.path.length > 0) {
			var cell = this.path[this.path.length - 1];
			const walls = cell.closedWalls;
			// const neighbors = walls.map(wall => wall.getAjoiningTo(cell)).filter(oneCell => oneCell && !oneCell.visited);
			const neighbors = cell.unvisitedNeighbors;
			neighbors.shuffle();
			
			if (neighbors.length === 0) {
				var back = Math.max(1, Math.floor(this.path.length * .2));
				back = 1;
				this.path.splice(-back);
				continue;
			}
			var newCell = neighbors[0];
			this.path.push(newCell);
			newCell.visited = true;
			const ajoining = cell.getAjoining(newCell);
			ajoining.open = 3;
		}
	}
}