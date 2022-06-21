import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
const { pipeline, array, utils } = ham;

class SvgTransformListApi {
  #TransformTypes = {
    translate: 'Translate',
    rotate: 'Rotate',
    scale: 'Scale',
    skew: 'Skew',
    get(k) { return this[k.toLowerCase()] ? this[k.toLowerCase()] : null }
  };

  constructor(svg) {
    this.svg = svg;
    this.transforms = new Map();
    this.#self;
    this.translate;
    this.scale;
    this.rotate;
    this.init();
  }

  init(initialValues = {}) {
    this.createTransform('translate');
    this.setTranslate(0, 0);
    this.append(this.transforms.get('translate'));

    this.createTransform('rotate');
    this.setRotate(initialValues.rotate ? initialValues.rotate : 0);
    this.append(this.transforms.get('rotate'));

    this.createTransform('scale');
    this.setScale(initialValues.scale ? initialValues.scale : 1);
    this.append(this.transforms.get('scale'));
  }

  getItem(i) { return this.#self.getItem(i) }

  setTranslate(x = 0, y = 0) {
    this.transforms.get('translate').setTranslate(x, y);
    return this;
  }

  setRotate(degrees = 0) {
    this.transforms.get('rotate').setRotate(degrees, 0, 0);
    return this;
  }

  setScale(s = 1) {
    this.transforms.get('scale').setScale(s, s);
    return this;
  }

  append(transform) {
    this.#self.appendItem(transform)
    return this
  }

  insert(transform) {
    this.#self.appendItem(transform)
    return this
  }

  createTransform(transformType = 'translate') {
    const t = this.svg.createSVGTransform();

    if (!this.transforms.has(transformType.toLowerCase())) {
      this.transforms.set(transformType.toLowerCase(), t)
    }

    return t;
  }

  get #self() { return this.svg.transform.baseVal };
}


class SvgViewBox {
  constructor(svg) {
    this.svg = svg;
    this.init();
  }

  originCenter(w = this.width, h = this.height) {
    this.x = -(w / 2);
    this.y = -(h / 2);
  }

  originTopLeft() {
    this.x = 0;
    this.y = 0;
  }

  get #self() { return this.svg.viewBox.baseVal };

  get x() { return this.#self.x };
  set x(x) { Object.assign(this.#self, { x }) };

  get y() { return this.#self.y }
  set y(y) { Object.assign(this.#self, { y }) }

  get width() { return this.#self.width };
  set width(width) { Object.assign(this.#self, { width }) };

  get height() { return this.#self.height };
  set height(height) { Object.assign(this.#self, { height }) };


  init(initialValues = {}) {}
}



const DEFAULT_CANVAS_CONFIG = {
  id: 'canvas',
  x: 0,
  y: 0,
  width: window.innerWidth,
  height: window.innerHeight,
  background: '#C7C7C7',
  viewBox: {
    x: -(window.innerWidth / 2),
    y: -(window.innerHeight / 2),
    width: window.innerWidth,
    height: window.innerHeight,
  }
}


const PatternTypes = {
  grid: 'grid',
  none: 'none',
}


export class SvgApi extends EventTarget {
  #self;
  #transformList;
  #viewBox;
  #layers = new Map();

  constructor(svg) {
    super()
    this.#self = svg
    this.#transformList = new SvgTransformListApi(this.#self)
    this.#viewBox = new SvgViewBox(this.#self)
  }
  
  initializeCanvas(config=DEFAULT_CANVAS_CONFIG){
    Object.assign(this,config)
  }
  
  
  on(evt, handler) {
    this.#self.addEventListener(evt, handler)
    return () => this.#self.removeEventListener(evt, handler)
  }

  getPoint(element, x, y) {
    return new DOMPoint(x, y).matrixTransform(
      element.getScreenCTM().inverse()
    );
  }

  composeTransformPipeline(element, ...transforms) {
    const xpipe = pipeline(element, ...transforms);
  }

  setViewBox(x, y, width, height) {
    this.viewBox = { x, y, width, height };
  }

  setSize(width, height) {
    this.width = width
    this.height = height
  }

  setOrigin(viewPoint = 'center') {
    this.#viewBox.originCenter(this.width, this.height)

  }

  orginToCenter() {
    this.#viewBox.originCenter(this.width, this.height)
  }

setScale(x, y) {}
setTranslate(x, y) {
  this.#transformList.setTranslate(x,y)
}

  setPosition(x, y) {}

  drawRect(vector) {
    const rect = document.createElementNS(this.namespaceURI, 'rect')
    rect.setAttribute('x', vector.p1.x)
    rect.setAttribute('y', vector.p1.y)
    rect.setAttribute('width', vector.p2.x - vector.p1.x)
    rect.setAttribute('height', vector.p2.y - vector.p1.y)
  }
  drawCircle(x=0,y=0,r=100,fill='#FF00FF',stroke='#000000') {
    const c = document.createElementNS(this.namespaceURI, 'circle')
    c.setAttribute('cx',x)    
    c.setAttribute('cy',y) 
    c.setAttribute('r', r)
    c.setAttribute('fill', 'red')
    c.setAttribute('fill', 'red')
c.setAttribute('stroke', stroke)

// c.setAttribute('stroke-width', strokeWidth||1)

this.#self.appendChild(c)
  }

  makeDraggable(el) {
    const stopDrag = draggable(this.#self, el);
    el.dataset.draggable = true;
    el.removeDrag = () => {
      stopDrag()
      el.dataset.draggable = false;
    }
  }


  // get transformList() { return this.#self.transform.baseVal };

  set transforms(newValue) { this._transforms = newValue };
  set background(newValue) { this.#self.style.background = newValue };

  // get viewBox() { return this.#self.viewBox.baseVal }
  set viewBox({ x, y, width, height }) {
    Object.assign(this.#viewBox, { x: x || 0, y: y || 0, width: width || 0, height: height || 0 })
  }

  get namespaceURI() { return 'http://www.w3.org/2000/svg' }

  get dataset() { return this.#self.dataset }

  set dataset(val) { Object.entries(val).forEach(([prop, value]) => this.#self.dataset[prop] = value) }

  get classList() { return this.#self.classList }

  set classList(val) { this.#self.classList.add(...val) }

  get draggables() { return [...this.#self.querySelectorAll('[data-draggable="true"]')] }

  get layers() { return [...this.#self.querySelectorAll('[data-layer="true"]')] }

  // set background(val) { this.layers[0].querySelector('.face').style.fill = val }

  get id() { return this.#self.id }

  set id(val) { this.#self.id = val }

  get width() { return this.#self.width.baseVal.value };

  set width(newValue) { this.#self.width.baseVal.value = newValue };

  get height() { return this.#self.height.baseVal.value };

  set height(newValue) { this.#self.height.baseVal.value = newValue };
}

// function transformMe(evt) {
//   // svg root element to access the createSVGTransform() function
//   var svgroot = evt.target.parentNode;

//   // SVGTransformList of the element that has been clicked on
//   var tfmList = evt.target.transform.baseVal;

//   // Create a seperate transform object for each transform
//   var translate = svgroot.createSVGTransform();
//   translate.setTranslate(50, 5);

//   var rotate = svgroot.createSVGTransform();
//   rotate.setRotate(10, 0, 0);

//   var scale = svgroot.createSVGTransform();
//   scale.setScale(0.8, 0.8);

//   // apply the transformations by appending the SVGTranform objects to the SVGTransformList associated with the element
//   tfmList.appendItem(translate);
//   tfmList.appendItem(rotate);
//   tfmList.appendItem(scale);
// }
