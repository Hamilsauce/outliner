
import {EventEmitter} from '../event-emitter.js';

export class Model extends EventEmitter {
  constructor() {
    super();

  }



  get prop() { return this._prop };
  set prop(newValue) { this._prop = newValue };
}
