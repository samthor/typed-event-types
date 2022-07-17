import type { AddEvents, AddEvents2, EventTargetCtor } from '../index.js';



class ElementWithFoo extends (HTMLElement as AddEvents<typeof HTMLElement, WhateverEventMap>) {}


class WhateverEvent {
  whatever = 123;
}

interface WhateverEventMap {
  whatever: WhateverEvent;
  specific: WhateverEvent;
  custom: CustomEvent<number>;
}


const ElementWithMoreEventsType = HTMLElement as AddEvents<typeof HTMLElement, WhateverEventMap>;
class ElementWithMoreEvents extends ElementWithMoreEventsType {
  constructor(name: string) {
    super();
  }
}
const e = new ElementWithMoreEvents('hi');

e.addEventListener('custom', (e) => {
  console.info(e.detail);  // <-- TS now knows this is a number
});
e.addEventListener('click', (e) => {
  console.info(e.movementX);  // <-- TS still knows this is a MouseEvent
});


/**
 * This is the identity function which simply helps wrap up a 
 */
export function build<X extends new (...args: any[]) => X extends typeof EventTarget ? any : never, Q>(x: X, y: Q): AddEvents<X, Q> {
  return x;
}


class ExtraMoreEvents extends (ElementWithMoreEvents as AddEvents<typeof ElementWithMoreEvents, {
  foo: CustomEvent<number>;
}>) {
  constructor() {
    super('whatever');
    this.addEventListener('foo', ({ detail }) => {});
    this.addEventListener('custom', ({ detail }) => {

    });
  }
}

class SubHTMLElement extends HTMLElement {}
type ctorTest = EventTargetCtor<SubHTMLElement>;



// TODO: seems to work fine????
class SubEventHTMLElement extends (HTMLElement as AddEvents<typeof HTMLElement, {
  foo: Event;
}>) {}
type ctorEventTest = EventTargetCtor<SubEventHTMLElement>;


class Unrelated {};
type ctorShouldBeNever = EventTargetCtor<Unrelated>;



const FakeType = build(HTMLElement, {} as WhateverEventMap);
const x = new FakeType();

x.addEventListener('whatever', () => {

});