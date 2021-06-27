import * as React from 'react';
import StableUniqueId, {
  useStableUniqueId,
  withStableUniqueId,
} from '../index';

export default {
  title: 'Examples',
};

export const Simple = (args) => {
  return (
    <StableUniqueId
      prefix={args.prefix}
      render={({ uniqueId }) => <div>Unique ID: {uniqueId}</div>}
    />
  );
};
Simple.argTypes = {
  prefix: { control: 'text' },
};

export const WithState = (args) => {
  const [counter, setCounter] = React.useState(0);
  return (
    <StableUniqueId
      prefix={args.prefix}
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
WithState.argTypes = {
  prefix: { control: 'text' },
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

export const UsingHook = (args) => {
  const uniqueId = useStableUniqueId(args.prefix);
  return <div>Unique ID: {uniqueId}</div>;
};
UsingHook.argTypes = {
  prefix: { control: 'text' },
};
