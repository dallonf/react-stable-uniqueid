import React from 'react';
import PropTypes from 'prop-types';
import reactHoc from 'react-hoc';
import uniqueId from 'lodash.uniqueid';

/**
 * @class StableUniqueId
 */
class StableUniqueId extends React.Component {
  componentWillMount() {
    this.setState({ uniqueId: uniqueId() });
  }

  render() {
    const { render, prefix } = this.props;
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
};
export default StableUniqueId;

/**
 * @param {object} opts
 * @param {string} opts.prefix
 * @param {string} opts.name The name of the string prop that will be passed to the component
 */
export const withStableUniqueId = ({ prefix, name = 'uniqueId' } = {}) =>
  reactHoc(
    // eslint-disable-next-line react/display-name
    Component => props => (
      <StableUniqueId
        prefix={prefix}
        render={({ uniqueId }) =>
          React.createElement(
            Component,
            Object.assign({ [name]: uniqueId }, props)
          )
        }
      />
    ),
    'withStableUniqueId'
  );
