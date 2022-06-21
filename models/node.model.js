import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
const { date, array, utils, text } = ham;
import { uniqueId } from '/lib/id-generator.js';


export class EventEmitter extends EventTarget {
  constructor() {
    super();
    this.eventRegistry = new Map()
    this.listeners = [];
  }

  on(type, listener) {
    this.addEventListener(type, listener);
    return () => this.removeEventListener(type, listener)
  }

  off(type, listener) {

    this.removeEventListener(type, listener)
  }

  emit(evt, data) {
    if (!this.eventRegistry.has(evt)) return;
    this.eventRegistry.get(evt).forEach(_ => _(data))
  }
}

export class Model extends EventEmitter {
  constructor(config) {
    super()
    this.config = config
  }

  static create() {}
}


export class NodeModel extends Model {
  #parent
  constructor(id, value, parent, isRoot) {
    super()

    this.id = id
    this.listeners = []
    this.value = value
    this.isRoot = isRoot
    this.#parent = parent
  }

  static create(id, value, parent, isRoot) {
    return new NodeModel(id, value, parent, isRoot)
  }
}

export const EventTypes = {
  node: 'node:create'
}


export class TreeNode extends Model {
  #id = uniqueId();
  #parent;
  #value;
  #children = new Map()

  constructor(value, parent) {
    super();
    this.listeners = []

    this.#value = value || null

    this.parent = parent || null
  }

  get value() { return this.#value }

  set value(v) {
    this.emit()
    this.#value = v
  }

  get parent() { return this.#parent }

  set parent(newParent) {
    if (newParent !== this.#parent && (newParent === null || newParent instanceof TreeNode)) {
      if (this.#parent) { this.#parent.remove(this) }

      this.#parent = newParent;

      if (newParent) { newParent.append(this) }
    }
  }

  get children() { return [...this.#children.values()] }
  set children(v) { return this.#children.values() }

  notify(data) {
    this.listeners.forEach(_ => _(data))
  }

  // listen(listener) {
  //   this.listeners.push(listener)
  //   // super.listeners = [...super.listeners, listener]
  //   return () => this.listeners = this.listeners.filter(_ => _ != listener)
  // }

  #getTreeString = (node, spaceCount = 0) => {
    let str = "\n";

    node.#children.forEach((child) => {
      str += `${" ".repeat(spaceCount)}${child.name}${this.#getTreeString(child, spaceCount + 2)}`
    })

    return str;
  }

  get(key) {
    return this.#children.get(key)
  }

  query(key, comparer = (n) => { return true }) {
    this.children
  }

  find(value) {
    console.log('find in model', { value });
  }

  createNode(value) {
    const node = new TreeNode(value, this)
    console.log('addnode in model', this);
    return node
    // this.append.push(node)
  }

  insert(node) {
    this.nodes.push(node)
    console.log('addnode in model', this);
  }

  hasNode(node, parent) {}

  append(node, parentId = null) {
    const pn = this.get(parentId)
    if (!(node instanceof TreeNode)) return;

    if (node === this) throw new Error('Node cannot contain itself');

    let parent = this.parent;
    while (parent !== null) {
      console.warn('parent', parent)
      if (parent === node) throw new Error('Node cannot contain one of its ancestors');
      parent = parent.parent;
    }

    this.#children.set(node.id, node);
    node.parent = this;
  }

  removeNode(value) {
    this.nodes.push(value)
    console.log('addnode in model', this);
  }

  static create() {}

}
