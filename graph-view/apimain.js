// import {SvgCanvas} from '/SVG_API/SvgCanvas.js';
import { SvgApi } from '/SVG_API/SvgApi.js';

const svgConfig = {
  id: 'cta-map',
  x: 0,
  y: 0,
  width: window.innerWidth,
  height: window.innerHeight,
  background: '#C7C7C7',
  pattern: 'grid',
  viewBox: {
    get x() { return -(this.width / 2) },
    get y() { return -(this.height / 2) },
    width: 400,
    height: 400
  }
}




let svg = document.querySelector('svg')

let NS = 'http://www.w3.org/2000/svg';

const svgapi = new SvgApi(svg)

window.svgapi = svgapi
// svgapi.initializeCanvas()
// const tforms = new SvgTransformListApi(svg)

// tforms.setTranslate(5, 5)

let line = document.createElementNS(NS, 'line');

svgapi.setViewBox(-200, -200, 400, 400)
console.log('sex');
svgapi.setTranslate(0,0)
svgapi.drawCircle()
