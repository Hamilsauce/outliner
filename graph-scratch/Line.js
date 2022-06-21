// import Node from './SVGNode.model.js';

// Line 
export class Point {
  constructor(x, y) {
    this._x;
    this._y;
  }

  get y() { return this._y }
  set y(newValue) { this._y = newValue }

  get x() { return this._x }
  set x(newValue) { this._x = newValue }
}

export class Vector {
  constructor(p1, p2) {
    if (!(p1 instanceof Point) || !(p2 instanceof Point)) return;

    this.setPoints(points);
  }

  set x1(newValue) { this.self.x1.baseVal.value = newValue }
  get x1() { return this.self.x1.baseVal.value }

  set y1(newValue) { this.self.y1.baseVal.value = newValue }
  get y1() { return this.self.y1.baseVal.value }

  set x2(newValue) { this.self.x2.baseVal.value = newValue }
  get x2() { return this.self.x2.baseVal.value }

  set y2(newValue) { this.self.y2.baseVal.value = newValue }
  get y2() { return this.self.y2.baseVal.value }

  setPoints(pts = { x1: 0, y1: 0, x2: 0, y2: 0 }) {
    return Object.assign(this, pts);
  }

  getPoints() {
    return {
      x1: this.x1,
      y1: this.y1,
      x2: this.x2,
      y2: this.y2,
    };
  }

}

export class Line {
  constructor(points, color = '#000000', graph) {
    this.self = document.createElementNS('http://www.w3.org/2000/svg', 'line')
    this.graph = graph;
    this.self = this.value
    this.setPoints(points);
  }

  set x1(newValue) { this.self.x1.baseVal.value = newValue }

  get x1() { return this.self.x1.baseVal.value }

  set y1(newValue) { this.self.y1.baseVal.value = newValue }

  get y1() { return this.self.y1.baseVal.value }

  set x2(newValue) { this.self.x2.baseVal.value = newValue }

  get x2() { return this.self.x2.baseVal.value }

  set y2(newValue) { this.self.y2.baseVal.value = newValue }

  get y2() { return this.self.y2.baseVal.value }

  setPoints(pts = { x1: 0, y1: 0, x2: 0, y2: 0 }) {
    return Object.assign(this, pts);
  }

  getPoints() {
    return {
      x1: this.x1,
      y1: this.y1,
      x2: this.x2,
      y2: this.y2,
    };
  }

  setRotate(angle) {
    let newPos = pos = this.getPosition();
    newPos.x2 = pos - radius * Math.cos(angle);
    newPos.y2 = pos - radius * Math.sin(angle);
    this.setPoints(newPos);
  }

  getHtmlEl() {
    return this.self;
  }
}