import Point from "./Point.js";
export default class Size extends Point {
	constructor(w, h) {
		super(w, h);
	}
	get w() {
		return this.x;
	}
	set w(value) {
		this.x = value;
	}
	get h() {
		return this.y;
	}
	set h(value) {
		this.y = value;
	}
	get width() {
		return this.x;
	}
	set width(value) {
		this.x = value;
	}
	get height() {
		return this.y;
	}
	set height(value) {
		this.y = value;
	}
}