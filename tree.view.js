import getDataType from './utils/getDataType';
import { listen, detach, element } from './utils/dom';

 export class TreeView {
  constructor() {
    this.root;
    this.classes = {
      HIDDEN: 'hidden',
      CARET_ICON: 'caret-icon',
      CARET_RIGHT: 'fa-caret-right',
      CARET_DOWN: 'fa-caret-down',
      ICON: 'fas'
    }
  }

  static element(name) { return document.createElement(name) }

   append(target, node) { target.appendChild(node) }

   listen(node, event, handler) {
    node.addEventListener(event, handler);
    return () => node.removeEventListener(event, handler)
  }

   detach(node) { node.parentNode.removeChild(node) }

   getDataType(val) {
    if (Array.isArray(val)) return 'array';
    if (val === null) return 'null';
    return typeof val
  }

  traverseObject(target, callback) {
    callback(target);
    if (typeof target === 'object') {
      for (let key in target) {
        traverseObject(target[key], callback);
      }
    }
  }

  expandedTemplate(params = {}) {
    const { key, size } = params;
    return `
    <div class="line">
      <div class="caret-icon"><i class="fas fa-caret-right"></i></div>
      <div class="json-key">${key}</div>
      <div class="json-size">${size}</div>
    </div>
  `
  }

  notExpandedTemplate(params = {}) {
    const { key, value, type } = params;
    return `
    <div class="line">
      <div class="empty-icon"></div>
      <div class="json-key">${key}</div>
      <div class="json-separator">:</div>
      <div class="json-value json-${type}">${value}</div>
    </div>
  `
  }

  createContainerElement() {
    const el = FileTree.element('div');
    el.className = 'json-container';
    return el;
  }

  hideNodeChildren(node) {
    node.children.forEach((child) => {
      child.el.classList.add(classes.HIDDEN);
      if (child.isExpanded) { hideNodeChildren(child); }
    });
  }

  showNodeChildren(node) {
    node.children.forEach((child) => {
      child.el.classList.remove(classes.HIDDEN);
      if (child.isExpanded) { showNodeChildren(child) }
    });
  }

  setCaretIconDown(node) {
    if (node.children.length > 0) {
      const icon = node.el.querySelector('.' + classes.ICON);
      if (icon) { icon.classList.replace(classes.CARET_RIGHT, classes.CARET_DOWN) }
    }
  }

  setCaretIconRight(node) {
    if (node.children.length > 0) {
      const icon = node.el.querySelector('.' + classes.ICON);
      if (icon) { icon.classList.replace(classes.CARET_DOWN, classes.CARET_RIGHT) }
    }
  }

  toggleNode(node) {
    if (node.isExpanded) {
      node.isExpanded = false;
      setCaretIconRight(node);
      hideNodeChildren(node);
    } else {
      node.isExpanded = true;
      setCaretIconDown(node);
      showNodeChildren(node);
    }
  }

  /**
   * Create node html element
   * @param {object} node 
   * @return html element
   */
  createNodeElement(node) {
    let el = FileTree.element('div');

    const getSizeString = (node) => {
      const len = node.children.length;
      if (node.type === 'array') return `[${len}]`;
      if (node.type === 'object') return `{${len}}`;
      return null;
    }

    if (node.children.length > 0) {
      el.innerHTML = expandedTemplate({
        key: node.key,
        size: getSizeString(node),
      })

      const caretEl = el.querySelector('.' + classes.CARET_ICON);
      node.dispose = listen(caretEl, 'click', () => toggleNode(node));
    } else {
      el.innerHTML = notExpandedTemplate({
        key: node.key,
        value: node.value,
        type: typeof node.value
      })
    }

    const lineEl = el.children[0];

    if (node.parent !== null) { lineEl.classList.add(classes.HIDDEN); }

    lineEl.style = 'margin-left: ' + node.depth * 18 + 'px;';
    return lineEl;
  }

  /**
   * Recursively traverse Tree object
   * @param {Object} node
   * @param {Callback} callback
   */
  traverse(node, callback) {
    callback(node);
    if (node.children.length > 0) {
      node.children.forEach((child) => traverse(child, callback));
    }
  }

  /**
   * Create node object
   * @param {object} opt options
   * @return {object}
   */
  createNode(opt = {}) {
    return {
      key: opt.key || null,
      parent: opt.parent || null,
      value: opt.hasOwnProperty('value') ? opt.value : null,
      isExpanded: opt.isExpanded || false,
      type: opt.type || null,
      children: opt.children || [],
      el: opt.el || null,
      depth: opt.depth || 0,
      dispose: null
    }
  }

  /**
   * Create subnode for node
   * @param {object} Json data
   * @param {object} node
   */
  createSubnode(data, node) {
    if (typeof data === 'object') {
      for (let key in data) {
        const child = createNode({
          value: data[key],
          key: key,
          depth: node.depth + 1,
          type: getDataType(data[key]),
          parent: node,
        });
        node.children.push(child);
        createSubnode(data[key], child);
      }
    }
  }

  getJsonObject(data) {
    return typeof data === 'string' ? JSON.parse(data) : data;
  }

  /**
   * Create tree
   * @param {object | string} jsonData 
   * @return {object}
   */
  create(jsonData) {
    const parsedData = getJsonObject(jsonData);
    const rootNode = createNode({
      value: parsedData,
      key: getDataType(parsedData),
      type: getDataType(parsedData),
    });
    createSubnode(parsedData, rootNode);
    return rootNode;
  }

  /**
   * Render JSON string into DOM container
   * @param {string | object} jsonData
   * @param {htmlElement} targetElement
   * @return {object} tree
   */
  renderJSON(jsonData, targetElement) {
    const parsedData = getJsonObject(jsonData);
    const tree = createTree(parsedData);
    render(tree, targetElement);
    return tree;
  }

  /**
   * Render tree into DOM container
   * @param {object} tree
   * @param {htmlElement} targetElement
   */
  render(tree, targetElement) {
    const containerEl = createContainerElement();

    traverse(tree, function(node) {
      node.el = createNodeElement(node);
      containerEl.appendChild(node.el);
    });

    targetElement.appendChild(containerEl);
  }

  expand(node) {
    traverse(node, function(child) {
      child.el.classList.remove(classes.HIDDEN);
      child.isExpanded = true;
      setCaretIconDown(child);
    });
  }

  collapse(node) {
    traverse(node, function(child) {
      child.isExpanded = false;
      if (child.depth > node.depth) child.el.classList.add(classes.HIDDEN);
      setCaretIconRight(child);
    });
  }

  destroy(tree) {
    traverse(tree, (node) => {
      if (node.dispose) { node.dispose() }
    })
    detach(tree.el.parentNode);
  }
}

/**
 * public interface
 */

// export default {
//   render,
//   create,
//   renderJSON,
//   expand,
//   collapse,
//   traverse,
//   destroy
// }
