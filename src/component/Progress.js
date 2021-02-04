import React, { Component } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';

class Progress extends Component {
  constructor (props) {
    super(props);
    this.state = {};
  }

  render () {
    const { loading } = this.props
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "fixed",
          top: "0",
          left: "0",
          zIndex: "1000",
          backgroundColor: "rgba(0,0,0,0.5)",
          display: loading ? "initial" : "none"
        }}>
        {loading ?
          <CircularProgress
            color="secondary"
            style={{position: "fixed", top: "50%", left: "50%"}}
          />:
          null
        }
      </div>
    );
  }
}

export default Progress;
