import React, { Component } from 'react';
import { DropTarget } from 'react-dnd';
import  DraggableItem from './DraggableItem.js';

const itemTarget = {
  drop() {}
};

const itemTargetCollect = connect => {
  return {
    connectDropTarget: connect.dropTarget()
  };
};

class DraggableItemGroup extends Component {
  constructor (props) {
    super(props);
    this.state = {};
    this.moveHeader = this.moveHeader.bind(this);
    this.findHeader = this.findHeader.bind(this);
    this.changeHeaderDisplay = this.changeHeaderDisplay.bind(this);
  }

  moveHeader (fromIndex, toIndex, dragId) {
    const { header } = this.findHeader(dragId);
    const { tmpHeaders } = this.props;
    const newHeaders = [...tmpHeaders.slice(0, fromIndex), ...tmpHeaders.slice(fromIndex + 1)];
    newHeaders.splice(toIndex, 0, header);
    this.props.setTmpHeader(newHeaders);
  }

  findHeader (id) {
    const { tmpHeaders } = this.props;
    const header = tmpHeaders.filter(h => h.id === id)[0];
    return {
      header,
      index: tmpHeaders.indexOf(header)
    };
  }

  changeHeaderDisplay (event, header) {
    const { tmpHeaders } = this.props;
    const newHeaders = tmpHeaders.map(tmpHeader => {
      if (tmpHeader.id === header.id) {
        let newHeader =  tmpHeader
        newHeader.display = event.target.checked
        return newHeader 
      }
      return tmpHeader
    });
    this.props.setTmpHeader(newHeaders);
  }

  render () {
    const {
      connectDropTarget,
      tmpHeaders
    } = this.props;
    return  connectDropTarget(
      <div>
        {tmpHeaders.map((header, i) => (
          <DraggableItem
            key={header.id}
            id={header.id}
            index={i}
            checked={header.display}
            moveHeader={this.moveHeader}
            findHeader={this.findHeader}
            changeHeaderDisplay={this.changeHeaderDisplay}
            header={header} />
        ))}
      </div>
    )
  }
}


export default DropTarget(
  'DraggableheaderItem', itemTarget, itemTargetCollect
)(DraggableItemGroup);
