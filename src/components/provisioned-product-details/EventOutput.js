import React from 'react';
import { connect } from 'react-redux';
import './EventOutput.scss';

function EventOutput({ eventOutput, ...props }) {
  return (
    <tr className="ouputEvent">
      <td>{eventOutput.OutputKey}</td>
      <td>{eventOutput.OutputValue}</td>
      <td>{eventOutput.Description}</td>
    </tr>
  )
}

export default connect()(EventOutput);
