import React from 'react';
import PropTypes from 'prop-types';
import reactHoc from 'react-hoc';
import uniqueId from 'lodash.uniqueid';

/**
 * @class StableUniqueId
 */
class StableUniqueId extends React.Component {
  componentWillMount() {
    const { uniqueIdFn } = this.props;
    this.setState({ uniqueId: uniqueIdFn() });
  }

  render() {
    const { render, prefix, uniqueIdFn } = this.props;
    const { uniqueId } = this.state;
    return render({ uniqueId: `${prefix || ''}${uniqueId}` });
  }
}
StableUniqueId.propTypes = {
  /**
   * ({ uniqueId: string }) => JSX
   */
  render: PropTypes.func.isRequired,
  /**
   * Optionally applies a prefix to the generated ID.
   */
  prefix: PropTypes.string,
  /**
   * () => string
   * Provide a custom function to generate the unique ID. Useful for testing.
   * Defaults to lodash's `uniqueId` function.
   *
   * NOTE: will only be called once, when the function is mounted. Updating this function will not change the uniqueId.
   */
  uniqueIdFn: PropTypes.func,
};
StableUniqueId.defaultProps = {
  uniqueIdFn: uniqueId,
};
export default StableUniqueId;

/**
 * @param {object} opts
 * @param {string} opts.prefix
 * @param {string} opts.name The name of the string prop that will be passed to the component
 */
export const withStableUniqueId = (
  { prefix, name = 'uniqueId', uniqueIdFn } = {}
) =>
  reactHoc(
    // eslint-disable-next-line react/display-name
    Component => ({ _uniqueIdFn, ...props }) => (
      <StableUniqueId
        prefix={prefix}
        render={({ uniqueId }) =>
          React.createElement(Component, {
            [name]: uniqueId,
            _uniqueIdFn,
            ...props,
          })
        }
        uniqueIdFn={_uniqueIdFn || uniqueIdFn}
      />
    ),
    'withStableUniqueId'
  );
