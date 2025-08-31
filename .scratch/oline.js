// 
/*
  Flow
  1. Render View with loading or default state
  2. 
  
*/

import { Model } from './model.js';
import { View } from './view.js';

const app = document.querySelector('#app');
const appBody = document.querySelector('#app-body')
const containers = document.querySelectorAll('.container')

const view1 = new View('list-node')
const view2 = new View('list-node')
const model = new Model()
console.warn('view2', view2.dom)
model.registerListener('update', view1)
model.registerListener('update', view2)

view1.addEventListener('update', e => {
	console.log("heard poop in view1", e);
});

view2.addEventListener('update', e => {
	console.log("heard poop in view2", e);
});

let cnt = 0
// setInterval(() => {
// 	cnt++
// 	model.dispatch('update', { cnt })
// 	// model.dispatchEvent(new CustomEvent('update', { bubbles: true, detail:cnt }));
// }, 1000)

setTimeout(() => {
	model.unregisterListener('update', view1)
	console.log('unregister  view1', '');
}, 3000)