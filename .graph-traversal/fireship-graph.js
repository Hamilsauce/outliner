const airports = 'PHX BKK OKC JFK LAX MEX EZE HEL LOS LAP LIM'.split(' ');

const routes = [
    ['PHX', 'LAX'],
    ['PHX', 'JFK'],
    ['JFK', 'OKC'],
    ['JFK', 'HEL'],
    ['JFK', 'LOS'],
    ['JFK', 'EZE'],
    ['MEX', 'LAX'],
    ['MEX', 'BKK'],
    ['MEX', 'LIM'],
    ['EZE', 'MEX'],
    ['MEX', 'EZE'],
    ['LIM', 'BKK'],
];


// The graph
const adjacencyList = new Map();

// Add node
function addNode(airport) {
  adjacencyList.set(airport, []);
}

// Add edge, undirected
function addEdge(origin, destination) {
  adjacencyList.get(origin).push(destination);
  adjacencyList.get(destination).push(origin);
}

function bfs(start) {
  console.group('bfs')

  const visited = new Set();
  const queue = [start];

  while (queue.length > 0) {
    const airport = queue.shift(); // mutates the queue
    const destinations = adjacencyList.get(airport);

    for (const destination of destinations) {
      if (destination === 'BKK') {
        console.log(`BFS found Bangkok!`)
      }

      if (!visited.has(destination)) {
        visited.add(destination);
        queue.push(destination);
      }
    }
  }
  console.groupEnd('bfs')
}
let cnt = 0



function dfs(curr, goal, visited = new Set()) {
  cnt++
  visited.add(curr);

  // get array of connexted nodes for curr
  const destinations = adjacencyList.get(curr);

  for (const destination of destinations) {
    if (destination === goal) { return goal }

    if (!visited.has(destination)) {
      dfs(destination, goal, visited);
    }
  }
}


// Create the Graph
airports.forEach(addNode);
routes.forEach(route => addEdge(...route))

console.warn('adjacencyList', [...adjacencyList])

// bfs('PHX')

setTimeout(() => {
  dfs('PHX', 'EZE')
}, 1000)