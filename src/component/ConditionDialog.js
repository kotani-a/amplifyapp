import React, { Component } from 'react';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import CheckIcon from '@material-ui/icons/Check';
import TreeItem from '@material-ui/lab/TreeItem';
import abilityOptions from '../constants/abilityOptions.json';

class ConditionDialog extends Component {
  constructor (props) {
    super(props);
    this.state = {
      selectVal: {},
      selectValId: ''
    };
  }

  conditionDialogClose () {
    this.props.conditionDialogClose();
  }

  treeItemClick (optionVal) {
    if (optionVal.type) {
      this.setState({
        selectVal: optionVal,
        selectValId: optionVal.id
      });
    }
  }

  render () {
    const {
      selectVal,
      selectValId
    } = this.state
    const {
      conditionDialog,
      conditionSet
    } = this.props
    return (
      <Dialog
        open={conditionDialog}
        onClose={() => this.conditionDialogClose()}>
        <h2>条件選択</h2>
        <TreeView
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<ChevronRightIcon />}>
          {abilityOptions.map((option, index) => 
            <TreeItem
              nodeId={`parent-${index}`}
              key={`parent-${index}`}
              label={option.label}>
              {option.children ?
                option.children.map((children1Option, children1Index) =>
                  <TreeItem
                    nodeId={`children1-${children1Index}`}
                    key={`children1-${children1Index}`}
                    label={
                      <div>
                        {children1Option.label}
                        <CheckIcon style={children1Option.id === selectValId ? { color: "initial" } : { color: "transparent" }} />
                      </div>
                    }
                    onClick={() => this.treeItemClick(children1Option)}>
                      {children1Option.children ?
                        children1Option.children.map((children2Option, children2Index) =>
                          <TreeItem
                            nodeId={`children2-${children2Index}`}
                            key={`children2-${children2Index}`}
                            label={
                              <div>
                                {children2Option.label}
                                <CheckIcon style={children2Option.id === selectValId ? { color: "initial" } : { color: "transparent" }} />
                              </div>
                            }
                            onClick={() => this.treeItemClick(children2Option)} />
                        )
                      :null}
                  </TreeItem>
                )
              :null}
            </TreeItem>
          )}
        </TreeView>
        <Button
          variant="outlined"
          onClick={() => conditionSet(selectVal)}>
          確定
        </Button>
      </Dialog>
    );
  }
}

export default ConditionDialog;
