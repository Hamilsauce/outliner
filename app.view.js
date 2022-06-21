import { NodeView } from '/views/node.view.js'
import { keyboardController } from '/lib/keyboard.controller.js'
import { View } from '/views/view.js';

const { forkJoin, Observable, iif, BehaviorSubject, AsyncSubject, Subject, interval, of , fromEvent, merge, empty, delay, from } = rxjs;
const { flatMap, reduce, groupBy, toArray, mergeMap, switchMap, scan, map, tap, filter } = rxjs.operators;
const { fromFetch } = rxjs.fetch;

export class AppView extends EventTarget {
  #domNodeMap = new Map();
  #self
  #selector

  constructor(selector = '#app') {
    super(document.querySelector('#app'));
    this.#self = document.querySelector('#app')

    this.#selector = selector
    this.children = [];
    this.listeners = [];

    this.ui = {
      addNode: document.querySelector('#add-node-form'),
      addNode: document.querySelector('#add-node-form'),
      outliner: document.querySelector('#outliner')
    }

    this.kb = keyboardController
    this.kb.init(this, {})

    this.clickHandler = this.handleClick.bind(this)
    this.on('click', this.clickHandler)
    this.blurHandler = this.handleCursorFocusChange.bind(this)
    this.on('blur', this.blurHandler)
  }




  update(data) { console.warn('AppView - Received Update', { data }) }

  on(evt, handler, target = this.#self) {
    target.addEventListener(evt, handler)

    return () => target.removeEventListener(evt, handler)
  }

  handleClick(e) {
    const nodeel = this.getNodeElement(e.target);
    const node = this.#domNodeMap.get(nodeel);

    if (e.target.classList.contains('list-bullet')) {
      node.isExpanded = !node.isExpanded
    } else {
      this.setFocusOn(node)
    }
  }

  handleCursorFocusChange(e) {
    console.log('Appview, handle Cursor Focus Change', { e });
    const nodeel = this.getNodeElement(e.target);
    const node = this.#domNodeMap.get(nodeel);
    if (node) {
      this.emit('node:focus')
    } else {
      this.setFocusOn(node)
      // node.focus()
    }
  }

  onCreateNode(handler = (value, pid) => {}) {
    this.on('node:create', ({ detail }) => {
      // console.log('detail', detail.detail)
      const n = this.getNodeElement(detail.detail.target)
      const pn = this.getParentNodeElement(n)
      const index = [...this.getNodeListElement(pn).children].indexOf(n)

      handler(n.textContent.trim(), pn.id, index)
    });
  }

  onEditNode(handler) {
    this.on('node:update', e => {
      console.log(e);
      if (e.detail.target.classList.contains('node-content')) {
        const activeNodeEl = this.getNodeElement(e.detail.target);
        const activeNode = this.#domNodeMap.get(activeNodeEl);

        handler(activeNode);
      }

      // if (value) { handler(value) }
    });
  }

  onRemoveNode(handler) {
    this.on('node:remove', ({ detail }) => {
      handler({
        target: this.getNodeElement(detail.target)
      });
    });
  }

  onMoveNode(handler) { this.on() }

  onCopyNode(handler) { this.on() }

  onFocusNode(handler) {
    this.on('click', e => {
      if (e.target.classList.contains('node-left')) {
        const activeNodeEl = this.getNodeElement(e.target);
        const activeNode = this.#domNodeMap.get(activeNodeEl);

        handler(activeNode);
      }
    });
  }

  render(list) {
    const rendered = list
      .reduce((frag, item) => {
        const node = this.createNode(item);
        frag.appendChild(node.dom);

        return frag
      }, new DocumentFragment())

    this.ui.outliner.innerHTML = '';
    this.ui.outliner.appendChild(rendered);

    const outlineChildren = [...this.ui.outliner.children];
    outlineChildren.forEach((ch, i) => ch.classList.add('root'));
  }

  createNode(node) {
    if (!node) return Object.assign(new NodeView(), {
      id: null,
      value: '',
      children: []
    });

    const n = Object.assign(new NodeView(), node);

    this.children.push(n);
    this.#domNodeMap.set(n.dom, n);

    if (node.children && node.children.length) {
      node.children.forEach(ch => {
        if (ch.value) {
          const n2 = this.createNode(ch);
          n.listElement.appendChild(n2.dom);
        }
      });
    }

    return n;
  }

  removeNode(nodeEl) {
    if (!nodeEl) return;
    const newFocus = this.getNodeByElement(nodeEl.previousElementSibling || nodeEl.parentElement)

    if (newFocus) {
      this.setFocusOn(newFocus)
      this.focusedNode

    }
    console.log('newFocus', newFocus)
    nodeEl.remove();
  }

  insert(nodeModel) {
    nodeModel.value = ''
    const node = this.createNode(nodeModel);
    const list = this.activeNode ? this.activeNode.parentElement.querySelector('.list') : document.activeElement.parentElement.querySelector('.list')
    const sib = document.activeElement.closest('.list-node');

    if (sib.nextElementSibling) { list.insertBefore(node.dom, sib.nextElementSibling) }
    else { list.appendChild(node.dom); }

    this.setFocusOn(node);

    return node;
  }

  setFocusOn(targetNode, cursorToEnd = true) {
    if (!(targetNode instanceof NodeView)) return
    if (this.focusedNode) this.focusedNode.focus(false)
    targetNode.focus(true, cursorToEnd);
    return;
  }

  bindAddItem(handler) {
    $on(this.$newTodo, 'change', ({ target }) => {
      const title = target.value.trim();

      if (title) { handler(title) }
    });
  }

  emit(name, detail) {
    this.#self.dispatchEvent(new CustomEvent(name, { bubbles: true, detail }));

    this.listeners.forEach((l, i) => {
      l.dispatchEvent(new CustomEvent(name, { bubbles: true, detail }));
    });
  }

  getParentNodeElement(el = this.#self) {
    return el.parentElement.closest('.list-node');
  }

  getNodeElement(el = this.#self) {
    return el instanceof NodeView ? el.self : el.closest('.list-node');
  }

  getNodeListElement(node = this.#self) { return this.select('.list', node); }

  select(sel, el = this.ui.outliner) {
    el = el ? el : this.ui.outliner

    console.warn('APP VIEW SELECT', { outliner: this.outliner, sel, el });
   console.log('el.querySelector(sel);', el.querySelector(sel))
    return el.querySelector(sel);
  }

  selectAll(sel, el = this.#self) {
    return [...el.querySelectorAll(sel)]
  }

  getNodeByElement(el) {
    return this.#domNodeMap.get(el.closest('.list-node'))
  };

  get dom() { return this.select(this.#selector, document) }

  get nodes() { return this.selectAll('.list-node', this.ui.outliner) || [] };

  get activeNode() {
    const el = document.activeElement.closest('.list-node')
    return this.#domNodeMap.get(el)
  };


  get focusedNode() {
    const el = this.nodes.find(n => n.dataset && n.dataset.focused === 'true') || null //his.ui.outliner
    return this.#domNodeMap.get(el)
  };

  set focusedNode(idOrNode) {
    if (idOrNode) {
      console.warn('NODE FOCUSED, idOrNode: ', idOrNode)
      const newFocused = idOrNode instanceof Element ? idOrNode : this.nodes.find(n => (n && n.id === idOrNode) || n === idOrNode)

      this.focusedNode.dataset.focused = false;
      if (this.focusedNode === newFocused) {} else {
        this.focusedNode.dataset.focused = false;
        newFocused.dataset.focused = true;
      }
    }
  };
}
