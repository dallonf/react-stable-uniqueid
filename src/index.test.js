import 'raf/polyfill';
import React from 'react';
import { configure as configureEnzyme, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import StableUniqueId, { withStableUniqueId } from './index';
import 'jest-enzyme';

configureEnzyme({ adapter: new Adapter() });

var mockUniqueIdFn;
jest.mock('lodash.uniqueid', () => {
  mockUniqueIdFn = jest.fn();
  return mockUniqueIdFn;
});

beforeEach(() => {
  mockUniqueIdFn.mockReset();
  mockUniqueIdFn.mockImplementation(
    prefix =>
      `${prefix || ''}|mock-unique-id${mockUniqueIdFn.mock.calls.length}`
  );
});

it('renders a uniqueId', () => {
  const wrapper = shallow(
    <StableUniqueId
      prefix="testPrefix"
      render={({ uniqueId }) => <div>{uniqueId}</div>}
    />
  );
  expect(wrapper).toContainReact(<div>testPrefix|mock-unique-id1</div>);
});

it('keeps the uniqueId stable when re-rendered', () => {
  const wrapper = shallow(
    <StableUniqueId
      prefix="testPrefix"
      render={({ uniqueId }) => <div>{uniqueId}</div>}
    />
  );
  wrapper.setProps({ updatedProp: 1 }).update();
  expect(wrapper).toContainReact(<div>testPrefix|mock-unique-id1</div>);
});

it('renders OK without a prefix', () => {
  const wrapper = shallow(
    <StableUniqueId render={({ uniqueId }) => <div>{uniqueId}</div>} />
  );
  expect(wrapper).toContainReact(<div>|mock-unique-id1</div>);
});

it('allows customizing the uniqueIdFn', () => {
  const uniqueIdFn = jest.fn(() => '|Mocked Unique ID');
  const wrapper = shallow(
    <StableUniqueId
      prefix="myPrefix"
      uniqueIdFn={uniqueIdFn}
      render={({ uniqueId }) => <div>{uniqueId}</div>}
    />
  );
  expect(wrapper).toContainReact(<div>myPrefix|Mocked Unique ID</div>);
  expect(uniqueIdFn).toHaveBeenCalledWith();
});

describe('withStableUniqueId', () => {
  // eslint-disable-next-line react/prop-types
  const TestComponent = ({ uniqueId, ...props }) => (
    <div {...props}>{uniqueId}</div>
  );

  it('wraps with an HOC', () => {
    const WrappedComponent = withStableUniqueId({ prefix: 'testPrefix' })(
      TestComponent
    );
    const wrapper = shallow(<WrappedComponent prop1={true} prop2={false} />);
    const stableUniqueId = wrapper.find(StableUniqueId);
    expect(stableUniqueId).toBePresent();
    expect(stableUniqueId).toHaveProp('prefix', 'testPrefix');
    expect(stableUniqueId).toHaveProp('render');
    const renderFn = stableUniqueId.prop('render');
    const result = shallow(
      <div>{renderFn({ uniqueId: '_injectedUniqueId_' })}</div>
    );
    expect(result).toContainReact(
      <TestComponent uniqueId="_injectedUniqueId_" prop1={true} prop2={false} />
    );
  });

  it('renames prop', () => {
    const WrappedComponent = withStableUniqueId({
      prefix: 'testPrefix',
      name: 'myRenamedUniqueId',
    })(TestComponent);
    const wrapper = shallow(<WrappedComponent prop1={true} prop2={false} />);
    const stableUniqueId = wrapper.find(StableUniqueId);
    const renderFn = stableUniqueId.prop('render');
    const result = shallow(
      <div>{renderFn({ uniqueId: '_injectedUniqueId_' })}</div>
    );
    expect(result).toContainReact(
      <TestComponent
        myRenamedUniqueId="_injectedUniqueId_"
        prop1={true}
        prop2={false}
      />
    );
  });

  it('allows uniqueIdFn to be provided in options', () => {
    const uniqueIdFn = jest.fn(() => 'Mocked Unique ID');
    const WrappedComponent = withStableUniqueId({
      uniqueIdFn,
    })(TestComponent);
    const wrapper = shallow(<WrappedComponent prop1={true} prop2={false} />);
    const stableUniqueId = wrapper.find(StableUniqueId);
    expect(stableUniqueId).toHaveProp('uniqueIdFn', uniqueIdFn);
  });

  it('allows _uniqueIdFn to be provided in props', () => {
    const uniqueIdFn = jest.fn(() => 'Mocked Unique ID');
    const WrappedComponent = withStableUniqueId()(TestComponent);
    const wrapper = shallow(
      <WrappedComponent prop1={true} prop2={false} _uniqueIdFn={uniqueIdFn} />
    );
    const stableUniqueId = wrapper.find(StableUniqueId);
    expect(stableUniqueId).toHaveProp('uniqueIdFn', uniqueIdFn);
  });

  it('passes _uniqueIdFn down to child component', () => {
    const uniqueIdFn = jest.fn(() => 'Mocked Unique ID');
    const WrappedComponent = withStableUniqueId()(TestComponent);
    const wrapper = shallow(
      <WrappedComponent prop1={true} prop2={false} _uniqueIdFn={uniqueIdFn} />
    );
    const stableUniqueId = wrapper.find(StableUniqueId);
    const renderFn = stableUniqueId.prop('render');
    const result = renderFn({ uniqueId: '_injectedUniqueId_' });
    expect(result.props._uniqueIdFn).toEqual(uniqueIdFn);
  });
});
