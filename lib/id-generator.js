export const uniqueId = (() => {
  function* uniqueIdGenerator() {
    let id = Date.now();
    
    while(true) {
      yield `ln-${id++}`;
    }
  }
  
  const gen = uniqueIdGenerator();
  
  return () => gen.next().value;
})()
