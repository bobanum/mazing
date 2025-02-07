export default class Point {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
	mult(scalar) {
		if (Array.isArray(scalar)) {
			this.x *= scalar[0];
			this.y *= scalar[1];
			return this;
		}
		if (typeof scalar === "object") {
			this.x *= scalar.x;
			this.y *= scalar.y;
			return this;
		}
		this.x *= scalar;
		this.y *= scalar;
		return this;
	}
	add(point) {
		if (point instanceof Point) {
			this.x += point.x;
			this.y += point.y;
			return this;
		}
		if (arguments.length === 2) {
			this.x += arguments[0];
			this.y += arguments[1];
			return this;
		}
		if (Array.isArray(point)) {
			return this.add(...point);
		}
		return this.add(point, point);
	}
}