export class MouseController {
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
    .forEach((k, h) => {
      h()
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


  controlClick() {
    // console.log('this.host.', this.host)
    this.host.on('click', e => {
      const { mousebtn, target, ctrlKey, shiftKey, altKey } = e

      switch (key) {
        case 'Enter': {
          if (shiftKey) {

          } else {
            e.preventDefault()

            this.host.dispatch('node:create', { target })
          }

          break;
        }

        case 'Backspace': {
          if (!target.textContent) {
            console.log('Backdpace no content detected', ctrlKey);
            this.host.dispatch('node:remove', { target })
          }
          break;
        }

        case 'Tab': {
          if (shiftKey) {
            event.selectAllContent(target)
          }
          break;
        }
        case 'a': {
          if (ctrlKey) {
            event.selectAllContent(target)
          }
          break;
        }
      }
    });
  }
  control() {
    this.host.on('click', e => {
      const { mousebtn, target, ctrlKey, shiftKey, altKey } = e

       console.log('key', key)
      switch (key) {
        case 'Enter': {
          if (shiftKey) {}
          else {
            e.preventDefault()
            this.host.dispatch('node:create', { target })
          }
          
          this.host.dispatch(new CustomEvent('node:create'))
          break;
        }

        case 'Backspace': {
          if (!target.textContent) {
            this.host.dispatch('node:remove', { target })
          }
          break;
        }

        case 'Tab': {
          if (shiftKey) {
            // event.selectAllContent(target)
            e.preventDefault()
            e.stopPropagation()
          }
          break;
        }
        case 'a': {
          if (ctrlKey) {
            // event.selectAllContent(target)
            e.preventDefault()
          }
          break;
        }
     
      }
    });
  }
}
export const keyboardController = new KeyboardController()
