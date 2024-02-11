export default class Cursor extends Point {
	constructor(x, y, color, size) {
		super(x, y);
		this.color = color;
		this.size = size;
	}
	draw(ctx) {
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
		ctx.fillStyle = this.color;
		ctx.fill();
	}
}