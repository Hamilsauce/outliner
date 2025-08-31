import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
const { template, utils } = ham;
import { EventEmitter } from '../event-emitter.js';
console.warn('template', template)

export class View extends EventEmitter {
	#self;
	#id;
	
	constructor(name) {
		super();
		this.#self = View.getViewTemplate(name)
	}
	
	static getViewTemplate(name, options) {
		return template(name)
	}
	
	get dom() { return this.#self };
}