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
				if (this.maze.allowTunnels && cell.openWalls.length === 1) {

					// var adjacentCells = cell.adjacentCells;
					// var unvisited = adjacentCells.map(oneCell => oneCell.unvisitedNeighbors).flat();
					// if (unvisited.length > 0) {
					// 	console.log(unvisited.flat().join("| "));
					// 	debugger;
					// }
					var unvisited = cell.getUnvisited2NdNeighbors(this.path.slice(-2,-1)).shuffle();
					if (unvisited.length > 0) {
						// console.log(unvisited.join("| "));
						unvisited = unvisited[0];
						unvisited.visited = true;
						var between = unvisited.communNeighbours(cell)[0];
						between.getAjoining(unvisited).svg.classList.add("tunnel");
						between.getAjoining(cell).svg.classList.add("tunnel");
						console.log(between);
						// 	oneCell.svg.classList.add("visited");
						// });
						// debugger;
					}
				}
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
			ajoining.svg.classList.add("open");
			newCell.svg.classList.add("current");
		}
	}
}