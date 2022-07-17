This package provides TypeScript types that help you add typed events to your `EventTarget` subclasses.

## Usage

To create a subclass of `EventTarget` that has custom events:

```ts
import type { AddEvents } from 'typed-event-types';

interface WhateverEventMap {
  whatever: CustomEvent<number>;
}

class CustomEvents extends (EventTarget as AddEvents<typeof EventTarget, WhateverEventMap>) {}
const c = new CustomEvents();

c.addEventListener('whatever', (e) => {
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
ee.addEventListener('anotherEvent', ({ detail }) => {
  // detail is knowably a string
});
ee.addEventListener('whatever', ({ detail }) => {
  // detail is knowably a number, we don't lose this
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
