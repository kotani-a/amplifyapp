import React, { Component } from 'react';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import  DraggableItemGroup from './DraggableItemGroup.js';
import { withStyles } from '@material-ui/core/styles';
import css from '../css/HeaderSettingDialog.module.css'

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

const CustomButton = withStyles(() => ({
  root: {
    alignSelf: 'center',
    marginTop: 'auto'
  },
}))(Button);

class HeaderSettingDialog extends Component {
  constructor (props) {
    super(props);
    this.state = {
      tmpHeaders: [
        { id: 'rarity', label: 'レアリティ', display: true },
        { id: 'name', label: '名前', display: true },
        { id: 'partyAbility1', label: 'パーティーアビリティ1', display: true },
        { id: 'partyAbility2', label: 'パーティーアビリティ2', display: false },
        { id: 'ability1', label: '付加効果1', display: true },
        { id: 'ability2', label: '付加効果2', display: false },
        { id: 'ability3', label: '付加効果3', display: false },
        { id: 'ability4', label: '付加効果4', display: false },
        { id: 'bonusAbility', label: 'ボーナスアビリティ', display: true },
        { id: 'bonusAbilityActiveElement', label: 'ボーナスアビリティ発動属性', display: true },
        { id: 'visionAbility', label: 'ビジョンアビリティ', display: false },
        { id: 'visionAbilityConditions', label: 'ビジョンアビリティ発動条件', display: false },
        { id: 'hp', label: 'HP', display: true },
        { id: 'maxHp', label: 'maxHP', display: false },
        { id: 'tp', label: 'TP', display: false },
        { id: 'maxTp', label: 'maxTP', display: false },
        { id: 'ap', label: 'AP', display: false },
        { id: 'maxAp', label: 'maxAP', display: false },
        { id: 'power', label: '攻撃', display: true },
        { id: 'maxPower', label: '最大攻撃', display: false },
        { id: 'magic', label: '魔力', display: true },
        { id: 'maxMagic', label: '最大魔力', display: false },
        { id: 'shield', label: '防御', display: false },
        { id: 'maxShield', label: '最大防御', display: false },
        { id: 'barrier', label: '精神', display: false },
        { id: 'maxBarrier', label: '最大精神', display: false },
        { id: 'dexterity', label: '器用さ', display: false },
        { id: 'maxDexterity', label: '最大器用さ', display: false },
        { id: 'speed', label: '素早さ', display: false },
        { id: 'maxSpeed', label: '最大素早さ', display: false },
        { id: 'luck', label: '運', display: false },
        { id: 'maxLuck', label: '最大運', display: false },
        { id: 'limited', label: '限定', display: false }
      ]
    };
    this.setTmpHeader = this.setTmpHeader.bind(this);
  }

  headerSettingDialogClose () {
    this.props.headerSettingDialogClose();
  }

  setTmpHeader (headers) {
    this.setState({
      tmpHeaders: headers
    });
  }

  headerSet () {
    this.props.headerSet(this.state.tmpHeaders);
    this.props.headerSettingDialogClose();
  }

  render () {
    const { tmpHeaders } = this.state
    const { headerSettingDialog } = this.props
    return (
      <CustomDialog
        open={headerSettingDialog}
        onClose={() => this.headerSettingDialogClose()}>
        <h2 className={css.headerText}>テーブルヘッダー設定</h2>
        <DndProvider backend={HTML5Backend}>
          <DraggableItemGroup
            tmpHeaders={tmpHeaders}
            setTmpHeader={this.setTmpHeader} />
        </DndProvider>
        <CustomButton
          variant="outlined"
          onClick={() => this.headerSet()}>
          確定
        </CustomButton>
      </CustomDialog>
    );
  }
}

export default HeaderSettingDialog;
