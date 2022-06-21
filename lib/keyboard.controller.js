import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
const { event } = ham;
import { store } from '../store/index.db.js';

const isKeyEventArrow = (e) => {
  return e.key && e.key.toLowerCase().includes('arrow')
}

export const keyboardEventActions = {
  node: {
    selectAllContent: 'selectAllContent',
  },
}


export class KeyboardController {
  #host;
  #config;
  #listeners = new Map()

  constructor() {}

  init(host, config) {
    this.removeAllListeners.bind(this)()
    this.host = host;
    this.config = config;
    this.control()
  }

  addListener(key, listener) {
    // console.log('this.host.', this.host)
    this.#listeners.set(key, this.host.on(key, listener))
  }

  removeListener(key, l) {
    if (this.#listeners.has(key)) {
      this.#listeners.get(key)()
      this.#listeners.delete(key)
    }
  }

  removeAllListeners() {
   [...this.#listeners.entries()]
    .forEach((k, l) => {
      l()
      this.#listeners.delete(k)
    })
  }

  get host() { return this.#host }

  set host(v) { this.#host = v }

  get config() { return this.#config }

  set config(v) {
    this.#config = v
    Object.assign(this, v)
  }

  dispatchOnHost(evt, detail) {
    this.host.emit(evt, { detail })
  }


  async control() {
    this.host.on('keydown', async (e) => {
      const { key, target, ctrlKey, shiftKey, altKey } = e
      console.warn(document.activeElement);
      console.warn(document.activeElement.id || document.activeElement.innerHTML);

      if (isKeyEventArrow(e)) {
        // e.preventDefault()
        
        isKeyEventArrow(key)

        return;
      }

      switch (key) {
        case 'Enter': {
          if (shiftKey) {}
          else {
            e.preventDefault()
            this.dispatchOnHost('node:create', { target })
          }
          
          break;
        }

        case 'Backspace': {
          if (!target.textContent) {
            this.host.emit('node:remove', { target })
            console.log('store.getState()', store.getState())
          }
          break;
        }

        case 'Tab': {
          if (shiftKey) {
            e.preventDefault();
            event.selectAllContent(target)
          }
          break;
        }

        case 'a': {
          if (ctrlKey) {
            // this.host.emit('node:selectAllContent', { target })

            // event.selectAllContent(target)
            // e.preventDefault()
          }
          break;
        }

        case 'x': {
          const sel = await window.getSelection()
          if (ctrlKey && target.classList.contains('node-content')) {
            this.host.emit('node:remove', { target })
          }

          break;
        }

        default: {
          this.host.emit('node:update', { target })
        }
      }
    });
  }
}
export const keyboardController = new KeyboardController()
