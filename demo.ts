import type { TypedEventConstructor } from './index.js';


class WhateverEvent {
  whatever = 123;
}

interface WhateverEventMap {
  whatever: WhateverEvent;
  specific: WhateverEvent;
  custom: CustomEvent<number>;
}



// class Whatever extends (HTMLElement as TypedEventConstructor<HTMLElement, WhateverEventMap>) {
//   constructor() {
//     super();

//     this.addEventListener('click', (e) => {
//       console.debug(e.movementX, e.whatever);
//     });
//     this.addEventListener('specific', (e) => {
//       console.info(e.whatever);
//     });
//     this.addEventListener('whatever', (e) => {
//       console.info(e.whatever);
//     });
//     this.addEventListener('custom', (e) => {
//       console.info(e.detail);  // should be number
//     });
//   }
// }


class Foo extends EventTarget {
  constructor(name: string) {
    super();

    if (name === undefined) {
      throw new Error(`missing name`);
    }
  }
}

class FooEvents extends (Foo as TypedEventConstructor<Foo, WhateverEventMap>) {
  constructor() {
    super();
  }
}


const x = new FooEvents();






class CustomEvents extends (EventTarget as TypedEventConstructor<EventTarget, WhateverEventMap>) {}
const c = new CustomEvents();
c.addEventListener('whatever', (e) => {
  console.info(e.whatever);
});
