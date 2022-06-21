const { forkJoin, iif, BehaviorSubject, AsyncSubject, Subject, interval, of , fromEvent, merge, empty, delay, from } = rxjs;
const { flatMap, reduce, groupBy, toArray, mergeMap, switchMap, scan, map, tap, filter } = rxjs.operators;
const { fromFetch } = rxjs.fetch;


export class GraphNode {
  constructor(nodeData, initializerFn = (node) => {}) {
    if (!nodeData) throw new Error('néeed node data');

    this.init(nodeData,initializerFn);
  }

  init(nodeData,initializerFn) {
    Object.assign(this, nodeData);
    if (!initializerFn) initializerFn(this);
    
    return this.asEntry()
  }

  static create(data, initializerFn = (node) => {}) {
    return new NodeModel(data, initializerFn)
  }

  get path() { return this._path };
  
  get id() { return this._id };
  set id(newid) { this._id = newid };

  get value() { return this._value };
  set value(newValue) { this._value = newValue };

  get parent() { return this._parent };
  set parent(newparent) { this._parent = newparent };

  get children() { return this._children };
  set children(newchildren) { this._children = newchildren };

  asEntry() {
    return [this.id, this];
  }
}

export const initialState = {
  focusedNodeId: '',
  cachedNodes: new Map(),
  root: new Map(),
};

class Store {
  #stateSubject
  #state

  constructor() {
    this.#stateSubject = new BehaviorSubject({
      focusedNodeId: '',
      cachedNodes: new Map(),
      nodes: null,
    });

    this.#state = this.#stateSubject.asObservable()
      .pipe(
        scan((prev, curr) => ({ ...prev.nodes, ...curr })),
        tap(x => console.warn('STORE STATE PIPE AFTER SCAN()', x))
      );
  }

  printState() {
    return this.#stateSubject
      .pipe(
        tap(x => console.log('printState', x))
      )
  }


  getState() {
    return this.#stateSubject.getValue();
  }



  select(key) {
    return this.#state.pipe(
      map(state => state[key] ? state[key] : null),
      filter(stateSlice => stateSlice),
      map(stateSlice => ({
        data: stateSlice,
        update(data) {
          this.#stateSubject.next({
            [key]: [{ ...data, value: data.self.querySelector('.node-content').textContent }]
          })
        },
        remove(k) {}
      })),
    );
  }

  cacheNode(key) {
    return this.#state.pipe(
      tap(x => console.warn('store.select', x)),
      map(state => state[key] ? state[key] : null),
    );
  }



  load(dataset) {
    const name = dataset.metadata.name;
    const data = dataset[name];
    // this.state[name] = data
    this.#stateSubject.next({
      [name]: data
    })
    console.log('getState', this.getState());

  }
  getData(url) {

  }
}

export const store = new Store()
