import 'raf/polyfill';
import React from 'react';
import { render } from '@testing-library/react';
import StableUniqueId, { useStableUniqueId, withStableUniqueId } from './index';
import mockUniqueIdFn from 'lodash.uniqueid';

jest.mock('lodash.uniqueid', () => {
  return { __esModule: true, default: jest.fn() };
});

beforeEach(() => {
  mockUniqueIdFn.mockReset();
  mockUniqueIdFn.mockImplementation(
    (prefix) =>
      `${prefix || ''}|mock-unique-id${mockUniqueIdFn.mock.calls.length}`
  );
});

it('renders a uniqueId', () => {
  const { baseElement } = render(
    <StableUniqueId
      prefix="testPrefix"
      render={({ uniqueId }) => <div>{uniqueId}</div>}
    />
  );
  expect(baseElement).toHaveTextContent('testPrefix|mock-unique-id1');
});

it('keeps the uniqueId stable when re-rendered', () => {
  const { rerender, baseElement } = render(
    <StableUniqueId
      prefix="testPrefix"
      render={({ uniqueId }) => <div>{uniqueId}</div>}
    />
  );
  rerender(
    <StableUniqueId
      updatedProp={1}
      prefix="testPrefix"
      render={({ uniqueId }) => <div>{uniqueId}</div>}
    />
  );
  expect(baseElement).toHaveTextContent('testPrefix|mock-unique-id1');
});

it('renders OK without a prefix', () => {
  const { baseElement } = render(
    <StableUniqueId render={({ uniqueId }) => <div>{uniqueId}</div>} />
  );
  expect(baseElement).toHaveTextContent('|mock-unique-id1');
});

it('allows customizing the uniqueIdFn', () => {
  const uniqueIdFn = jest.fn(() => '|Mocked Unique ID');
  const { baseElement } = render(
    <StableUniqueId
      prefix="myPrefix"
      uniqueIdFn={uniqueIdFn}
      render={({ uniqueId }) => <div>{uniqueId}</div>}
    />
  );
  expect(baseElement).toHaveTextContent('myPrefix|Mocked Unique ID');
  expect(uniqueIdFn).toHaveBeenCalledWith();
});

describe('withStableUniqueId', () => {
  // eslint-disable-next-line react/prop-types
  const TestComponent = ({ uniqueId, ...props }) => (
    <div data-extra-props={JSON.stringify(props)}>{uniqueId}</div>
  );

  it('wraps with an HOC', () => {
    const WrappedComponent = withStableUniqueId({ prefix: 'testPrefix' })(
      TestComponent
    );
    const { baseElement } = render(
      <WrappedComponent prop1={true} prop2={false} />
    );
    expect(baseElement).toHaveTextContent('testPrefix|mock-unique-id1');
    expect(
      baseElement
        .querySelector('[data-extra-props]')
        .getAttribute('data-extra-props')
    ).toEqual('{"prop1":true,"prop2":false}');
  });

  it('renames prop', () => {
    const TestComponentExpectingRenamed = ({ myRenamedUniqueId }) => {
      return <div>{myRenamedUniqueId}</div>;
    };
    const WrappedComponent = withStableUniqueId({
      prefix: 'testPrefix',
      name: 'myRenamedUniqueId',
    })(TestComponentExpectingRenamed);
    const { baseElement } = render(
      <WrappedComponent prop1={true} prop2={false} />
    );
    expect(baseElement).toHaveTextContent('testPrefix|mock-unique-id1');
  });

  it('allows uniqueIdFn to be provided in options', () => {
    const uniqueIdFn = jest.fn(() => 'Mocked Unique ID');
    const WrappedComponent = withStableUniqueId({
      uniqueIdFn,
    })(TestComponent);
    const { baseElement } = render(<WrappedComponent />);
    expect(baseElement).toHaveTextContent('Mocked Unique ID');
  });

  it('allows _uniqueIdFn to be provided in props', () => {
    const uniqueIdFn = jest.fn(() => 'Mocked Unique ID');
    const WrappedComponent = withStableUniqueId()(TestComponent);
    const { baseElement } = render(
      <WrappedComponent _uniqueIdFn={uniqueIdFn} />
    );
    expect(baseElement).toHaveTextContent('Mocked Unique ID');
  });

  it('passes _uniqueIdFn down to child component', () => {
    const TestChildComponentExpectingUniqueIdFn = ({ _uniqueIdFn }) => {
      <div>{_uniqueIdFn()}</div>;
    };
    const uniqueIdFn = jest.fn(() => 'Mocked Unique ID');
    const WrappedComponent = withStableUniqueId()(TestComponent);
    const { baseElement } = render(
      <WrappedComponent _uniqueIdFn={uniqueIdFn} />
    );
    expect(baseElement).toHaveTextContent('Mocked Unique ID');
  });
});

describe('useStableUniqueId', () => {
  it('renders a uniqueId', () => {
    const TestComponent = () => {
      const uniqueId = useStableUniqueId('testPrefix');
      return <div>{uniqueId}</div>;
    };

    const { baseElement } = render(<TestComponent />);
    expect(baseElement).toHaveTextContent('testPrefix|mock-unique-id1');
  });

  it('keeps the uniqueId stable when re-rendered', () => {
    const TestComponent = () => {
      const uniqueId = useStableUniqueId('testPrefix');
      return <div>{uniqueId}</div>;
    };
    const { baseElement, rerender } = render(<TestComponent />);
    rerender(<TestComponent updatedProp={1} />);
    expect(baseElement).toHaveTextContent('testPrefix|mock-unique-id1');
  });

  it('renders OK without a prefix', () => {
    const TestComponent = () => {
      const uniqueId = useStableUniqueId();
      return <div>{uniqueId}</div>;
    };
    const { baseElement } = render(<TestComponent />);
    expect(baseElement).toHaveTextContent('|mock-unique-id1');
  });

  it('allows customizing the uniqueIdFn', () => {
    const uniqueIdFn = jest.fn(() => '|Mocked Unique ID');
    const TestComponent = () => {
      const uniqueId = useStableUniqueId('myPrefix', { uniqueIdFn });
      return <div>{uniqueId}</div>;
    };
    const { baseElement } = render(<TestComponent />);

    expect(baseElement).toHaveTextContent('myPrefix|Mocked Unique ID');
    expect(uniqueIdFn).toHaveBeenCalledWith();
  });
});
