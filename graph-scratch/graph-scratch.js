import { getColor } from '../lib/colors.js'
import { draggable } from 'https://hamilsauce.github.io/hamhelper/draggable.js'
import { Stack } from '../lib/stack.js'
import { Line } from './Line.js';
const app = document.querySelector('#app');
const appBody = document.querySelector('#app-body')
const containers = document.querySelectorAll('.container')
const SVG_NS = 'http://www.w3.org/2000/svg';

function getPoint(element, x, y) {
  return new DOMPoint(x, y).matrixTransform(
    element.getScreenCTM().inverse()
  );
}


export class Node {
  #value
  #point
  #adjacentNodes

  constructor({ value, point }) {
    this.#value = value;
    this.#point = point;
    this.#adjacentNodes = new Set();
  }

  removeAdjacent(node) {
    return this.#adjacentNodes.delete(node);
  }

  addAdjacent(node) {
    return this.#adjacentNodes.add(node);
  }

  get adjacentNodes() { return [...this.#adjacentNodes.values()] }

  get value() { return this.#value }
  get point() { return this.#point }
  set value(newValue) { this.#value = newValue };
}

export class Edge extends Node {
  constructor(pos, color, graph) {
    super(document.createElementNS('http://www.w3.org/2000/svg', 'line'))
    this.graph = graph;
    // this.self = document.createElement('');
    this.self.classList.add('line');
    this.self.setAttribute('stroke', color);
    this.self.setAttribute('width', 9);
    this.self.setAttribute('stroke-width', '');
    this.position(pos);
    // console.log('line.', this);

  }

  get element() { return this._element };
  set element(newValue) { this._element = newValue }

  set y1(newValue) {
    this.self.y1.baseVal.value = newValue
    this._y1 = newValue
  }
  set x1(newValue) {
    this.self.x1.baseVal.value = newValue
    this._x1 = newValue
  }
  set x2(newValue) {
    this.self.x2.baseVal.value = newValue
    this._x2 = newValue
  }
  set y2(newValue) {
    this.self.y2.baseVal.value = newValue
    this._y2 = newValue
  }

  set position(pos) {
    this.self.setAttribute('x1', pos.x1);
    this.self.setAttribute('y1', pos.y1);
    this.self.setAttribute('x2', pos.x2);
    this.self.setAttribute('y2', pos.y2);
  }

  get position() {
    return {
      x1: this.self.getAttribute('x1'),
      y1: this.self.getAttribute('y1'),
      x2: this.self.getAttribute('x2'),
      y2: this.self.getAttribute('y2'),
    };
  }

  setRotate(angle) {
    let newPos = pos = this.position();
    newPos.x2 = pos - radius * Math.cos(angle);
    newPos.y2 = pos - radius * Math.sin(angle);
    this.position = newPos;
  }

  getHtmlEl() {
    return this.self;
  }
}

// Used when nodes share edge/are paired
export class EdgeGroup {
  #self
  #edge
  #source
  #destination

  constructor(sourceNode, destinationNode, parent) {
    this.#source = sourceNode;

    this.#destination = destinationNode;

    this.init(parent)
  }

  init(parent) {
    if (!parent) return;
    this.#self = document.createElementNS(SVG_NS, 'g');
    this.#self.classList.add('edge-group')
    parent.appendChild(this.#self)
    this.#self.appendChild(this.#source);
    this.#self.appendChild(this.#destination);
    this.attachEdge();
    
    this.#source.addEventListener('pointermove', this.onNodeDrag.bind(this));
    this.#destination.addEventListener('pointermove', this.onNodeDrag.bind(this));

    // n1.addEventListener('pointermove', e => {
    //     console.log('~~~~~~~~Movr', n1.shapeEl.cx.animVal.value);
    //   })

  }

  attachEdge() {
    const n1 = this.#source;
    const n2 = this.#destination;

    const line = document.createElementNS(SVG_NS, 'line');
    line.x1.baseVal.value = n1.shapeEl.cx.baseVal.value
    line.y1.baseVal.value = n1.shapeEl.cy.baseVal.value
    line.x2.baseVal.value = n2.shapeEl.cx.baseVal.value
    line.y2.baseVal.value = n2.shapeEl.cy.baseVal.value
    line.setAttribute('stroke', 'black')
    line.setAttribute('stroke-width', 5)

    this.#edge = line
    this.#self.prepend(line);
  }

  onNodeDrag(e) {
    e.preventDefault()
    const srcCheck = [...e.path].some(el => el === this.#source)
    const destCheck = [...e.path].some(el => el === this.#destination)
    const targ = e.target.closest('.node')
    if (srcCheck) {
      const p = getPoint(this.#self, e.pageX,e.pageY)
      console.log('p true', p);
      // console.log('srcCheck true', srcCheck);
      this.#edge.x1.baseVal.value = p.x
      this.#edge.y1.baseVal.value = p.y
    } else if (destCheck) {
      // console.log('destCheck true', destCheck);
      const p = getPoint(this.#self, e.clientX,e.clientY)
      console.log('p true', p);
      this.#edge.x2.baseVal.value = p.x
      this.#edge.y2.baseVal.value = p.y

    }
    // console.log('onNodeDrag in edge groiyp', e);
  }

  get dom() { return this.#self }
}

export class Graph extends EventTarget {
  #nodes

  constructor(direction = 'DIRECTED') {
    super();
    this.#nodes = new Map();
    this.direction = direction
    this.events = new Map([
      ['graph:change', new Set()],
      ['node:add', new Set()],
      ['node:remove', new Set()],
      ['edge:add', new Set()],
      ['edge:remove', new Set()],
    ])
  }

  on(evt, listener) {
    if (!this.events.has(evt)) {
      this.events.set(evt, new Set())
    } else {
      this.events.get(evt).add(listener)
    }
  }
  emit(evt, detail) {
    if (!this.events.has(evt)) { return }
    const listeners = [...this.events.get(evt)];
    listeners.forEach(_ => _({ detail }))
  }

  addNode(data) {
    if (this.#nodes.has(data.value)) { return this.#nodes.get(data.value); }
    const node = new Node(data);
    this.#nodes.set(node.value, node);
    this.emit('node:add', node)

    return node;
  }

  get(nodeValue = -1) {
    return this.#nodes.get(nodeValue)
  }

  removeNode(value) {
    const current = this.#nodes.get(value);
    if (current) { this.nodes.forEach((node) => node.removeAdjacent(current)); }

    return this.#nodes.delete(value);
  }

  addEdge(source, destination) {
    const sourceNode = this.addNode(source);
    const destinationNode = this.addNode(destination);

    sourceNode.addAdjacent(destinationNode);

    if (this.edgeDirection === Graph.UNDIRECTED) {
      destinationNode.addAdjacent(sourceNode);
    }

    this.emit('edge:add', { source, destination })

    return [sourceNode, destinationNode];
  }

  get nodes() { return [...this.#nodes.values()] };
  set nodes(newValue) { this.#nodes = newValue };
}

// APP
const graph = new Graph();

const state = {
  graph,
  currentNode: null,
  _selectedNodes: [],
  currentNodeValue: 0,
  get nextValue() {
    this.currentNodeValue++
    return this.currentNodeValue;
  },
  history: new Stack(50),
  selectNode(n) {
    this._selectedNodes.push(n);
    if (this._selectedNodes.length >= 2) {
      this.graph.addEdge(this._selectedNodes[0], this._selectedNodes[1])
      this._selectedNodes = []

      return
    }
  },
}

window.graph = graph
window.graphState = state
// window.graphState = state


const ui = {
  graph: document.querySelector('#graph'),
  get surface() { return this.graph.querySelector('#surface') },
  get nodes() { return [...this.surface.querySelectorAll('.node')] },
  get edgeGroups() { return [...this.surface.querySelectorAll('.edge-group')] },
  queryNodes(value) { return this.nodes.find(n => n.value == value).closest('.node') },
}




// ui.surface['stopDrag'] = draggable(ui.graph, ui.surface)
const createText = (value, parent) => {
  const textNode = document.createElementNS(SVG_NS, "text");
  const text = document.createTextNode(value);
  textNode.appendChild(text);
  textNode.classList.add('node-value');
  textNode.setAttributeNS(null, 'text-anchor', 'middle');
  textNode.setAttributeNS(null, 'alignment-baseline', 'middle')
  textNode.setAttribute('fill', 'white')
  textNode.setAttribute('font-size', '28px')
  textNode.setAttribute('font-weight', '600')
  textNode.setAttribute('transform', 'translate(0,0)')

  return textNode;
}

const drawNode = (node) => {
  const n = document.createElementNS(SVG_NS, 'g');
  const shape = document.createElementNS(SVG_NS, 'circle');
  const valueEl = createText(node.value)

  shape.r.baseVal.value = 35;
  shape.cx.baseVal.value = node.point.x;
  shape.cy.baseVal.value = node.point.y;
  shape.setAttribute('stroke', 'black')
  shape.setAttribute('stroke-width', 5)

  valueEl.setAttribute('transform', `translate(${node.point.x},${node.point.y})`)
  n.setAttribute('fill', `${getColor()}`)

  n['stopDrag'] = draggable(ui.graph, n)
  // co/nsole.log(n.stopDrag);
  n.classList.add('node');
  shape.classList.add('node-shape');
  n.appendChild(shape);
  n.appendChild(valueEl);

  n['valueEl'] = valueEl;
  n['value'] = valueEl.textContent;
  n['shapeEl'] = shape;

  ui.surface.appendChild(n);
  state.history.push(n)
  const hist = state.history.toString()
}



const drawEdge = (n1, n2, parent) => {
  console.log({ n1, n2 });
  n1 = ui.queryNodes(n1.value)
  n2 = ui.queryNodes(n2.value)



  console.warn({ n1, n2 });
  const group = new EdgeGroup(n1, n2, parent)
  console.log({ group });
  console.log('edge group dom', group.dom);
  // const line = document.createElementNS(SVG_NS, 'line');
  // line.x1.baseVal.value = n1.point.x
  // line.y1.baseVal.value = n1.point.y
  // line.x2.baseVal.value = n2.point.x
  // line.y2.baseVal.value = n2.point.y
  // line.setAttribute('stroke', 'black')
  // line.setAttribute('stroke-width', 5)

  ui.surface.appendChild(group.dom)
  // ui.surface.insertBefore(line, ui.surface.children[0 + 1])
  return group;
};

const renderer = {
  createText,
  drawNode,
  drawEdge,
  onAddEdge({ detail }) {
    console.warn('ADD EDGE', detail)
    const { source, destination } = detail
    console.warn('ADD EDGE', detail.source, detail.destination);
    this.drawEdge.bind(this)(source, destination, ui.surface)
  },
  onAddNode({ detail }) {
    console.log('in onAddNode', detail);
    return this.drawNode.bind(this)(detail);
  }
}

graph.on('node:add', renderer.onAddNode.bind(renderer))
graph.on('edge:add', renderer.onAddEdge.bind(renderer))

ui.surface.addEventListener('click', e => {
  let { target, clientX, clientY } = e
  if (target.classList.contains('node-shape') || target.classList.contains('node-value')) {
    const n = target.closest('.node')
    n.classList.add('selected')
    let v = +n.valueEl.textContent
    console.log('n.valueEl.value', v)

    state.selectNode(graph.get(v))
    return
  }
  const point = getPoint(ui.surface, clientX, clientY);
  const node = graph.addNode({ value: state.nextValue, point })
});

// import Node from '../models/Node.model.js';


ui.graph.addEventListener('drag', e => {
  const { target } = e



  // console.log("~~~~~~DRAG", [...e.target.classList]);
  if (
    (
      target.classList.contains('node') ||
      target.classList.contains('node-shape') ||
      target.classList.contains('node-value')
    ) //&& graph.get(+target.closest('.node').valueEl.textContent).adjacentNodes.size != 0
  ) {
    // const n = target.closest('.node').valueEl.textContent
    const n = graph.get(+target.closest('.node').valueEl.textContent)
    console.warn('n', n)


    // const n = target.closest('.node');
    n.classList.add('selected')
    let v = +n.valueEl.textContent
    console.log('n.valueEl.value', v)

    state.selectNode(graph.get(v))
    return
  }
})
