import { Canvas } from '../graph-view/SvgCanvas.js';
import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
ham

const { template, utils } = ham;
export class Node {
  constructor(value) {
    this.adjacencyList = []
  };
}


export class Edge {
  constructor() {
    this.root;
  };
  get prop() { return this._prop };
  set prop(newValue) { this._prop = newValue };
}

export class Tree {
  constructor() {
    this.root;
  };
  get prop() { return this._prop };
  set prop(newValue) { this._prop = newValue };
}

const svg = document.querySelector('#canvas')
const nodes = [...svg.querySelectorAll('.node')]
const node1 = nodes[0]


const canvas = new Canvas(svg)
// const rect = svg.createSVGRect(20,20,20,20)
const rect = svg.transform
