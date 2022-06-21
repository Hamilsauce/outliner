import { EventEmitter } from '../models/node.model.js';

export class View extends EventEmitter {
  constructor(el) {
    super();
    this.self = el;
    this.listeners = []
  }

  render() {}

  dispatch(name, detail = {}) {
    this.self.dispatchEvent(new CustomEvent(name, { bubbles: true, detail }));

    this.listeners.forEach((l, i) => {
      l.dispatchEvent(new CustomEvent(name, { bubbles: true, detail }));
    });
  }

  select(sel, el = this.self) {
    return el.querySelector(sel);
  }

  selectAll(sel, el = this.self) {
    return [...el.querySelectorAll(sel)]
  }

  get dataset() {
    return this.self.dataset
  }

  get dom() { return this.self }
}