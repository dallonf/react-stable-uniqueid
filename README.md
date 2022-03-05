[![NPM](https://img.shields.io/npm/v/react-stable-uniqueid.svg)](https://www.npmjs.com/package/react-stable-uniqueid)
[![Build Status](https://travis-ci.org/dallonf/react-stable-uniqueid.svg?branch=master)](https://travis-ci.org/dallonf/react-stable-uniqueid)
[![Coverage Status](https://coveralls.io/repos/dallonf/react-stable-uniqueid/badge.svg?branch=master&service=github)](https://coveralls.io/github/dallonf/react-stable-uniqueid?branch=master)

# React Stable Unique ID

A utility to generate a unique ID (using [Lodash.uniqueId](https://lodash.com/docs/4.17.4#uniqueId)) that does not change on re-renders. This is useful for form inputs (ex: `htmlFor`), SVG effects (`<defs>`), and other scenarios.

## Installation

```
npm install --save react-stable-uniqueid
```

## Hook Usage

As a React hook:

```js
import { useStableUniqueId } from 'react-stable-uniqueid';

const uniqueId = useStableUniqueId('myPrefix', {
  uniqueIdFn: myCustomUniqueIdFn,
});
```

### Arguments

`prefix: string | undefined`

Optional. If provided, adds a prefix to the generated unique ID.

### Options

`uniqueIdFn: () => string`

Optional. If provided, uses this function instead of Lodash's to generate a unique ID. Useful for testing.

Note that this function will only be called once; if you update the prop, a new unique ID will not be generated using the new function.

### Returns

A string value

## Render Prop Usage

As a render prop component:

```js
import { StableUniqueId } from 'react-stable-uniqueid';

<StableUniqueId render={({ uniqueId }) => <div>Unique ID: {uniqueId}</div>} />;
```

### Props

`render: ({ uniqueId: string }) => JSX`

A fairly standard [render prop](https://cdb.reacttraining.com/use-a-render-prop-50de598f11ce). Pass it a function that returns React elements to render given a `uniqueId`. This function takes one argument, which is an object of type `{ uniqueId: string }` - note the destructuring in the examples.

`prefix: string`

Optional. If provided, adds a prefix to the generated unique ID.

`uniqueIdFn: () => string`

Optional. If provided, uses this function instead of Lodash's to generate a unique ID. Useful for testing.

Note that this function will only be called once; if you update the prop, a new unique ID will not be generated using the new function.

## Higher Order Component (HOC) Usage

```js
import { withStableUniqueId } from 'react-stable-uniqueid';

const MyComponent = ({ uniqueId }) => <div>Unique ID: {uniqueId}</div>;
const WrappedMyComponent = withStableUniqueId({ prefix: 'mycomponent' });
```

### Added props

`uniqueId: string`

The generated uniqueId.

### Options

`prefix: string`

Optional. If provided, adds a prefix to the generated unique ID.

`name: string`

Optional. If provided, renames the `uniqueId` prop added to the wrapped component.

`uniqueIdFn: () => string`

Optional. If provided, uses this function instead of Lodash's to generate a unique ID. Useful for testing.

### Wrapped component props

`_uniqueIdFn: () => string`

Optional. If provided, uses this function instead of Lodash's to generate a unique ID. Useful for testing. This prop will _not_ be consumed by the wrapper and will also be passed down to the wrapped component.

Note that this function will only be called once; if you update the prop, a new unique ID will not be generated using the new function.

## Gotchas

The generated id will not change on re-renders, but it will change if a component instance is unmounted and re-mounted. It is only guaranteed to be stable or unique as long as the component is mounted.

### Testing

I recommend stubbing this component or using the `uniqueIdFn` setting in tests, especially if you're snapshot testing or asserting on the generated, because the default function is not guaranteed to be deterministic.

### Server-side rendering

This component is very likely to generate different IDs on the server vs the client. This means your rendered DOM may be mismatched when you hydrate it on the client. I haven't done much with server-side rendering; maybe this isn't much of a problem. Let me know if you try to do server-side rendering with this library so I can update these docs!
