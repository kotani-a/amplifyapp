import React, { Component } from 'react';
import { DragSource, DropTarget } from 'react-dnd';
import Switch from '@material-ui/core/Switch';
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';

const itemTarget = {
  canDrop() {
    return false;
  },

  hover(props, monitor) {
    const { id } = monitor.getItem();
    const draggedId = props.findHeader(id).index;
    const { id: overId } = props;
    if (draggedId !== overId) {
      const { index: overIndex } = props.findHeader(overId);
      props.moveHeader(draggedId, overIndex, id);
    }
  }
};

const itemTargetCollect = connect => {
  return {
    connectDropTarget: connect.dropTarget()
  };
};

const itemSource = {
  beginDrag(props) {
    return {
      id: props.id,
      originalIndex: props.findHeader(props.id).index
    };
  },

  endDrag(props, monitor) {
    const { id, originalIndex } = monitor.getItem();
    const droppedIndex = props.findHeader(id).index
    if (!monitor.didDrop()) {
      props.moveHeader(droppedIndex, originalIndex, id);
    }
  }
};

const itemSourceCollect = (connect, monitor) => {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  };
};

class DraggableItem extends Component {
  constructor (props) {
    super(props);
    this.state = {
    };
  }

  render () {
    const {
      connectDragSource,
      connectDropTarget,
      header,
      checked,
      changeHeaderDisplay
    } = this.props;
    return connectDragSource(
      connectDropTarget(
        <div style={{backgroundColor: "#dddddd"}}>
          <DragIndicatorIcon />
          <span>{header.label}</span>
          <Switch
            name={header.id}
            checked={checked}
            onChange={event => changeHeaderDisplay(event, header)}
          />
        </div>
      )
    );
  }
}

export default DropTarget('DraggableheaderItem', itemTarget, itemTargetCollect)(
  DragSource('DraggableheaderItem', itemSource, itemSourceCollect)(DraggableItem)
);
