import Corner from "./Corner.js";
import Laby from "./Laby.js";
import Room from "./Room.js";

export default class HexLaby extends Laby {
	createRooms() {
		const s3 = Math.sqrt(3)*3/4;
		for (let r = 0; r < this.h+1; r++) {
			if (r%2) {
				this.corners.push(new Corner(0, r));
			}
			for (let c = 0; c < this.w; c++) {
				this.corners.push(new Corner((2*c+r%2+1)/2*s3, r));
			}
			for (let c = 0; c < this.w +1 - r % 2; c++) {
				this.corners.push(new Corner((c+r%2/2)*s3, r+1/3));
			}
		}
	}
}