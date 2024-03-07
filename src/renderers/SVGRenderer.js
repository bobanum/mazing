import Renderer from "./Renderer.js";

export default class SVG extends Renderer {	
	createElement(selector, attrs = {}, parent = null) {
		var [tag, rest] = /([a-z-]+)((?:[#.][a-z-]+)*)/.exec(selector).slice(1);
		var result = document.createElementNS("http://www.w3.org/2000/svg", tag);
		if (rest) {
			var attributes = rest.match(/[#.][a-z-]+/g).sort();
			while (attributes.length) {
				var attribute = attributes.shift();
				if (attribute[0] === "#") {
					result.id = attribute.slice(1);
				} else if (attribute[0] === ".") {
					result.classList.add(attribute.slice(1));
				}
			}
		} 
		for (let key in attrs) {
			result.setAttribute(key, attrs[key]);
		}
		if (parent) {
			parent.appendChild(result);
		}
		return result;
	}

}