export class Dataset {
  constructor(name) {
    this.name = name;
    this.data = new Map();
    this.columns = new Map()
  }

  load(data, type = 'json') {
    if (type === 'json') { this.parseJson(data); };
  }

  setSchema(data, type = 'json') {
    if (type === 'json') { this.parseJson(data) };
  }

  addColumn(key, dataItems = []) {
    this.columns.set(key, dataItems)
  }

  profile(data) {}

  create(data) {}
}


export class ValuesMap {
  constructor(name) {
    this.name = name;
    this.data = new Map();
    this.columns = new Map();
  }

  load(data, type = 'json') {
    if (type === 'json') { this.parseJson(data); };
  }

  setSchema(data, type = 'json') {
    if (type === 'json') { this.parseJson(data); };
  }

  addColumn(key, dataItems = []) {
    // validate agsinst schema first!
    this.columns.set(key, dataItems)
  }

  profile(data) {}

  create(data) {}
}


// Ex. values['fieldId']['recordId'] = 3.14
export class ColumnStore {
  constructor(name) {

    this.values = new Map([
      ['initFieldId', new Map([
        ['initRecordId', { value: null }]
      ])]
    ]);

    this.datasets = new Map();

    this.keys = { field: new Map() }
  }

  get(fieldId, record) {
    if (!fieldId || !record) return;
    return this.values.get(fieldId).get(record)
  }

  set(field, id, value = null) {
    if (!field || !id) return;

    if (!this.values.has(field)) {
      this.values.set(field, new Map())
    }

    return this.values.get(field).set(id, value)
  }

  column(fieldId) {
    if (!fieldId) return;

    return this.values.get(fieldId);
  }

  load(data, type = 'json') {
    if (type === 'json') { this.parseJson(data); };
  }

  create() {}

  parseJson(data) {}

  static initDb(name) {
    const db = new ColumnStore(name);

    return db;
  }
}
