
// Each entry in registry is
// <EventName, ListenerSet>

//Must enforce above

export class EventRegistry extends Map {
  constructor(entries) {
    super(entries);
  }

  set(k, v) {
    if (!k) return this;
    return super.set(k, v);
  }

  insertAtIndex(index, key, value) {
    // NOTE: Must assign temp to maintain object references
    const temp = [...this.entries()]
    
    temp.splice(index, 0, [key, value]);
    this.clear()
    temp.forEach(([k, v]) => this.set(k, v));
  }

  setAtIndex(index, value) {
    return super.set(this.getAtIndex(index), value);
  }

  getAtIndex(i) {
    return super.get(this.#index[i])
  }

  indexOf(k, fromIndex = 0) {
    return this.#index.indexOf(k, fromIndex)
  }

  get #index() { return [...super.keys()] };
  get _index() { return [...super.keys()] };
}
