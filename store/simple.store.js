const { iif, BehaviorSubject, ReplaySubject, AsyncSubject, Subject, interval, of , fromEvent, merge, empty, delay, from } = rxjs;
const { distinctUntilChanged, throttleTime, mergeMap, switchMap, scan, take, takeWhile, map, tap, startWith, filter, mapTo } = rxjs.operators;
const { fromFetch } = rxjs.fetch;


const seed = {
  users: {
    tom: { firstName: 'tom', lastName: 'mot', age: 47 },
    john: { firstName: 'john', lastName: 'ham', age: 75 },
    jill: { firstName: 'jill', lastName: 'jam', age: 33 },
    butt: { firstName: 'butt', lastName: 'hole', age: 5 },
  },
  chats: {
    chat1: { name: 'Awesome chat', members: ['jill', 'tom'] },
    chat2: { name: 'dumb chat', members: ['john', 'butt'] },
    chat3: { name: 'solo chat', members: ['butt'] },
  },
}



export const assign = () => {
  return scan((oldValue, newValue) => {
    return { ...oldValue, ...newValue }
  })
}

export class CarService {
  constructor(seed) {
    this.collections = Object.entries(seed)
      .reduce((acc, curr, i) => {
        return acc.set(curr[0], new BehaviorSubject(curr[1]))
      }, new Map());

    this.carBhvSubj = new BehaviorSubject(seed)
      .pipe()

    this.car$ = this.carBhvSubj.asObservable().pipe(
        assign(),
        distinctUntilChanged((a, b) => { return a === b }),
        tap(x => console.log(' after distinctUntilChanged', x)),
      );
  }

  updateCar(carPart) {
    this.carBhvSubj.next(carPart);
  }

  connect() {

  }
}


let cnt = 0
const log = () => {
  cnt++
  let sub = 'Subscriber #' + cnt
  return (data) => {
    console.groupCollapsed(sub)
    console.log(sub);
    console.log('data', data)
    console.groupEnd(sub)
    return data
  }
}
