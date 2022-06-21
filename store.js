export class Store {
  constructor() {
   this.state = {
     focusedNodeId: null,
     nodes: null
   }
  }
  
  setFocusedNodeId(){}
  
  get prop() { return this._prop };
  set prop(newValue) { this._prop = newValue };
}
