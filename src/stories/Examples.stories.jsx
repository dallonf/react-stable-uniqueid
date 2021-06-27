import * as React from 'react';
import StableUniqueId, { withStableUniqueId } from '../index';

export default {
  title: 'Examples',
};

export const Simple = (args) => {
  return (
    <StableUniqueId
      render={({ uniqueId }) => <div>Unique ID: {uniqueId}</div>}
    />
  );
};

export const WithState = (args) => {
  const [counter, setCounter] = React.useState(0);
  return (
    <StableUniqueId
      render={({ uniqueId }) => (
        <div>
          Unique ID: {uniqueId}
          <br />
          Counter: {counter}
          <br />
          <button onClick={() => setCounter((prevState) => prevState + 1)}>
            Increment counter
          </button>
        </div>
      )}
    />
  );
};

export const UsingHOC = (args) => (
  <ComponentWithHOC customProp="Hello world!" />
);

const ComponentWithHOC = withStableUniqueId()(({ customProp, uniqueId }) => (
  <div>
    Unique ID: {uniqueId}
    <br />
    Custom Prop: {customProp}
  </div>
));
