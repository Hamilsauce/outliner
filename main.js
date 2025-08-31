import { TreeNode } from './models/node.model.js';
import { AppView } from './app.view.js';
import { store } from './store/index.db.js'
import dummy1 from '/store/dummynodes.js';
import emptyData from '/store/emptyData.js';
import { ColumnStore } from '/columndb.js';

const { forkJoin, Observable, iif, BehaviorSubject, AsyncSubject, Subject, interval, of, fromEvent, merge, empty, delay, from } = rxjs;
const { take, flatMap, reduce, groupBy, toArray, mergeMap, switchMap, scan, map, tap, filter } = rxjs.operators;
const { fromFetch } = rxjs.fetch;

const app = document.querySelector('#app');
const topbar = document.querySelector('#topbar');
const activeView = document.querySelector('#active-view')
const containers = document.querySelectorAll('.container')
const nodeEls = [...app.querySelectorAll('.content-block')]

const tree = new TreeNode()
console.log('tree', tree)
const appview = new AppView('#app', tree)


const cdb = ColumnStore.initDb('nodes')
const cdbmat = cdb
cdb.set('name', 0, 'ransom text')
cdb.set('name', 1, 'djrchy poop text')
cdb.set('name', 2, 'Just hanging')
cdb.set('parentId', 0, 'paremt001')
cdb.set('parentId', 1, 'paremt00120')
cdb.set('parentId', 2, 'paremt0456')
console.time('all');
console.time('rec2');
console.warn('cdb.get(name,2)', cdb.get('name', 2));
console.warn('cdb.get(parentId,2)', cdb.get('parentId', 2));
console.timeEnd('rec2');
console.time('rec1');
console.warn('cdb.get(name,1)', cdb.get('name', 1));
console.warn('cdb.get(name,1)', cdb.get('parentId', 1));
console.timeEnd('rec1');
console.timeEnd('all');

setTimeout(() => {
	;
	[...document.querySelectorAll('.node-content')].forEach((el, i) => {
		console.log({ el });
		el.addEventListener('focus', e => {
			console.warn('~~~~~~SOMEBODY GOT FOCUSED', { e });
		});
	});
}, 1000);


tree.addEventListener('node:create', e => {
	console.warn('CREATE EVENT', { e });
});

document.querySelector('#show-store').addEventListener('click', e => {
	const btn = e.target;
	btn.dataset.show = btn.dataset.show === 'true' ? false : true
	store.printState$()
		.pipe(
			tap(x => console.log('printState IN MAIN ', x))
		)
		.subscribe()
	if (btn.dataset.show === 'true') {}
	// console.log('EVRNT', { e });
});


appview.onCreateNode((value, pid = 10, index = 0) => {
	const node = tree.createNode(value);
	const nodeEl = appview.insert({ node, value: value, index: 0 })
	tree.append(node, pid);
	nodeEl.contentElement.focus()
	appview.setFocusOn(nodeEl)
});

appview.onRemoveNode(async ({ target }) => {
	appview.removeNode(target)
});

appview.onFocusNode(async (target) => {
	// appview.insert({ content: value })
	appview.setFocusOn(target)
});

// store.load(dummy1);
store.load(emptyData);

let cnt = 0
setTimeout(() => {
	tree.nodesSubscription = store.select('nodes')
		.pipe(
			// map(state => state),
			// map(state => ({ ...state, data: state.data.filter(_ => _.id === 10) })),
			tap(x => console.warn('nodes Subscription: NODE UPDATE PUSHED FROM STORE', x)),
			
			tap(s => {
				if (cnt == 0) {
					appview.render(s.data)
					
					cnt++
					appview.onEditNode(node => {
						// console.log('node', node)
						s.update.bind(store)({ ...node });
						
					})
					
				}
			}),
			switchMap(nodes => fromEvent('node:update', appview)
				.pipe(
					map(x => x),
					tap(x => console.log('TAP', x))
				)
			)
		)
	// .subscribe()
}, 100);

const showStoreBtn = document.querySelector('#show-store');
let shouldDisplayPanel = false

let stateJson = store.printState()
store.printState$().pipe(
		tap(x => console.log('x', x)),
		map(_ => JSON.stringify(_, null, 2)),
		tap(x => stateJson = x.replaceAll('"', ''))
	)
	.subscribe()

showStoreBtn.addEventListener('click', e => {
	e.preventDefault()
	e.stopImmediatePropagation()
	shouldDisplayPanel = !shouldDisplayPanel
	// panel.dataset.show = shouldDisplayPanel;
	if (shouldDisplayPanel && !document.querySelector('#store-panel')) {
		
		const panel = document.createElement('div');
		const view = document.querySelector('#active-view')
		const outlineEl = document.querySelector('#outliner');
		// panel.classList.add('show-store-panel')
		panel.id = 'store-panel';
		
		const panelContent = document.createElement('pre');
		panelContent.id = 'panel-content';
		panelContent.textContent = stateJson
		view.style.display = false
		panel.appendChild(panelContent);
		app.insertBefore(panel, view);
		
		
	} else {
		const view = document.querySelector('#active-view')
		document.querySelector('#store-panel')
			.remove()
		view.style.display = true
	}
	
	
	console.log({ tree });
	// console.warn(store.getState.bind(store)());
	// console.warn('VKB', vkb)
});

// const showVkb = async () => {
// 	vkb = await navigator.virtualKeyboard;
// 	vkb.overlaysContent = true
	
// 	app.addEventListener('click', async (e) => {
// 		await vkb.show()
// 		console.warn('click', vkb)
		
// 	});
// };

// showVkb()

// vkb.hide()
// vkb.show()


// nodeEls.forEach((n, i) => {
//   n.contentEditable = true
// });