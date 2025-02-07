Object.defineProperty(Array.prototype, "shuffle", {
	value: function () {
		for (let i = this.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[this[i], this[j]] = [this[j], this[i]];
		}
		return this;
	}
});
Object.defineProperty(Array.prototype, "removeDuplicates", {
	value: function () {
		for (let i = this.length - 1; i > 0; i--) {
			if (this.indexOf(this[i]) !== i) {
				this.splice(i, 1);
			}
		}
		return this;
	}
});
Object.defineProperty(Math, "SQRT3", {
	value: Math.sqrt(3)
});
Object.defineProperty(Math, "SQRT1_3", {
	value: 1/Math.sqrt(3)
});
