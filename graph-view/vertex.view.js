export class GraphView {
  constructor(svg) {
   this.svg = svg;
   
    this.root;
  }
  
  drawVertex(){}
  
  drawEllipses(){}
  
  get prop() { return this._prop };
  set prop(newValue) { this._prop = newValue };
}
