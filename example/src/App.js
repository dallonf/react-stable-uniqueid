import React, { Component } from 'react';
import StableUniqueId, { withStableUniqueId } from 'react-stable-uniqueid';

class App extends Component {
  render() {
    return (
      <div>
        <h4>Simple usage:</h4>
        <StableUniqueId
          render={({ uniqueId }) => <div>Unique ID: {uniqueId}</div>}
        />
        <h4>Stable across re-renders:</h4>
        <ExampleWithState />
        <h4>As a higher-order component:</h4>
        <ExampleWithHOC customProp="Hello world!" />
      </div>
    );
  }
}

class ExampleWithState extends Component {
  state = { counter: 0 };

  render() {
    return (
      <StableUniqueId
        render={({ uniqueId }) => (
          <div>
            Unique ID: {uniqueId}
            <br />Counter: {this.state.counter}
            <br />
            <button
              onClick={() =>
                this.setState(prevState => ({
                  counter: prevState.counter + 1,
                }))
              }
            >
              Increment counter
            </button>
          </div>
        )}
      />
    );
  }
}

const ExampleWithHOC = withStableUniqueId()(({ customProp, uniqueId }) => (
  <div>
    Unique ID: {uniqueId}
    <br />Custom Prop: {customProp}
  </div>
));

export default App;
