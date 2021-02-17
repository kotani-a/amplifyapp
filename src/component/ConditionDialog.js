import React, { Component } from 'react';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import CheckIcon from '@material-ui/icons/Check';
import TreeItem from '@material-ui/lab/TreeItem';
import abilityOptions from '../constants/abilityOptions.json';
import { withStyles } from '@material-ui/core/styles';
import css from '../css/ConditionDialog.module.css'


const CustomDialog = withStyles(() => ({
  root: {
    '& .MuiDialog-paper': {
      width: '50%',
      height: '50%',
      padding: '8px',
      overflowY: 'hidden'
    }
  },
}))(Dialog);


const CustomTreeView = withStyles(() => ({
  root: {
    margin: '8px 0',
    overflowY: 'auto'
  },
}))(TreeView);

const CustomButton = withStyles(() => ({
  root: {
    alignSelf: 'center',
    marginTop: 'auto'
  },
}))(Button);

class ConditionDialog extends Component {
  constructor (props) {
    super(props);
    this.state = {
      selectVal: {},
      selectValId: ''
    };
  }

  conditionDialogClose () {
    this.setState({
      selectVal: {},
      selectValId: ''
    });
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

  confirmCondition () {
    const { selectVal } = this.state
    const { conditionSet } = this.props
    this.conditionDialogClose();
    conditionSet(selectVal)
  }

  render () {
    const { selectValId } = this.state
    const { conditionDialog } = this.props
    return (
      <CustomDialog
        open={conditionDialog}
        onClose={() => this.conditionDialogClose()}>
        <h2 className={css.headerText}>条件選択</h2>
        <CustomTreeView
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
                    nodeId={`children1-${index}-${children1Index}`}
                    key={`children1-${index}-${children1Index}`}
                    label={
                      <div className={css.treeItem}>
                        <span className={css.treeItemLabel}>{children1Option.label}</span>
                        <CheckIcon style={children1Option.id === selectValId ? { color: "initial" } : { color: "transparent" }} />
                      </div>
                    }
                    onClick={() => this.treeItemClick(children1Option)}>
                      {children1Option.children ?
                        children1Option.children.map((children2Option, children2Index) =>
                          <TreeItem
                            nodeId={`children2-${index}-${children1Index}-${children2Index}`}
                            key={`children2-${index}-${children1Index}-${children2Index}`}
                            label={
                              <div className={css.treeItem}>
                                <span className={css.treeItemLabel}>{children2Option.label}</span>
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
        </CustomTreeView>
        <CustomButton
          variant="outlined"
          size="small"
          onClick={() => this.confirmCondition()}>
          確定
        </CustomButton>
      </CustomDialog>
    );
  }
}

export default ConditionDialog;
