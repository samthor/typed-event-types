This package provides TypeScript types that help you add typed events to your `EventTarget` subclasses.

## Usage

To create a subclass of `EventTarget` that has custom events:

```ts
import type { AddEvents } from 'typed-event-types';

interface WhateverEventMap {
  whatever: CustomEvent<number>;
}

class ObjectWithEvents extends (EventTarget as AddEvents<typeof EventTarget, WhateverEventMap>) {}
const o = new ObjectWithEvents();

o.addEventListener('whatever', (e) => {
  console.info(e.detail);  // <-- TS now knows this is a number
});
```

This also works for Custom Elements (or anything else that _already has_ events), and keeps all the existing events:

```ts
class ElementWithMoreEvents extends (HTMLElement as AddEvents<typeof HTMLElement, WhateverEventMap>) {}
const e = new ElementWithMoreEvents();

e.addEventListener('whatever', (e) => {
  console.info(e.detail);  // <-- TS now knows this is a number
});
e.addEventListener('click', (e) => {
  console.info(e.movementX);  // <-- TS still knows this is a MouseEvent
});
```

Great!

You can also extend your types _again_, because that's the point:

```ts
class ExtendedEvenMoreEvents extends (ElementWithMoreEvents as AddEvents<typeof ElementWithMoreEvents, {
  anotherEvent: CustomEvent<string>;
}>) {}
const ee = new ExtendedEvenMoreEvents();
ee.addEventListener('anotherEvent', (e) => {
  console.info(e.detail);  // <-- TS now knows this is a string
});
ee.addEventListener('whatever', (e) => {
  console.info(e.detail);  // <-- TS still knows this is a number
});
```

## Background

This has historically been a hard problem.

TypeScript internally solves this by adding/replacing the `addEventListener` call on all its internal interfaces whenever it needs to add more types.
But this isn't _additive_, you need to replace all the events every time.

For example, on the media elements, TypeScript does this:

```ts
interface HTMLMediaElementEventMap extends HTMLElementEventMap {
    "encrypted": MediaEncryptedEvent;
    "waitingforkey": Event;
}
interface HTMLMediaElement extends HTMLElement {
    addEventListener<K extends keyof HTMLMediaElementEventMap>(type: K, listener: (this: HTMLMediaElement, ev: HTMLMediaElementEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
}
```

&hellip;which is fine, but annoying for developers to do _every time_: you can't extend something easily as you need to know what set of events your parent had.

The approach in this package solves this by adding specific `addEventListener` etc calls which accept a type literal, which TypeScript happily hoists and merges with the other keys.
(TypeScript could use this approach internally, too—it would be a bit more verbose in the _generated_ types, but make the built-in types much easier to write.)

So how does this work?
Well&hellip; check out the source.

## Attributions

This internally includes `UnionToIntersection` [from here](https://fettblog.eu/typescript-union-to-intersection/).
Thanks, [@ddprrt](https://twitter.com/ddprrt).

## Contributions

### Unknown This

Because of the way the `addEventListener` etc calls are added, we don't know what `this` is at the time.
Listeners added this way should get the `this` of the `EventTarget`.

This is a limitation but _only if you're using_ `function() { ... }`, which, &hellip;you probably aren't, anymore.
So if you're writing inline handlers, use `() => { ... }`.
To be clear, this isn't _dangerous_: we just say that `this` is `EventTarget`, which is true, but not very useful.
TypeScript will complain at you.

This doesn't effect self-referential cases like this:

```ts
class ElementWithMoreEvents extends (HTMLElement as AddEvents<typeof HTMLElement, WhateverEventMap>) {
  constructor() {
    super();
    this.addEventListener('whatever', this.unboundHandler);
  }
  unboundHandler() {
    // this will be from the caller, and for events, it's set correctly
  }
}
```

Maybe you can help fix&hellip; `this`? 👀

### Verbose Syntax

The syntax is pretty verbose.
I've tried to make it slightly nicer to work with a builder function—it doesn't do anything, just returns the argument but casts it—but it ends up being a bit unsafe.

Want to contribute?
[@-me](https://twitter.com/samthor) or you know, do GitHub things.

## Usage

Install via "typed-event-types".

But!
If you want to take this code and include it in a TS helper library—I'd love that!
It is a bit niche, as it specifically targets the DOM.
Just attribute me (Apache-2.0) or tell me where to contribute the PR.
