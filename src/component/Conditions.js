import React, { Component } from 'react';
import axios from 'axios';
import HeaderSettingDialog from './HeaderSettingDialog';
import ConditionDialog from './ConditionDialog'
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Autocomplete from '@material-ui/lab/Autocomplete';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import SettingsIcon from '@material-ui/icons/Settings';
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import SearchIcon from '@material-ui/icons/Search';
import CloseIcon from '@material-ui/icons/Close';
import Select from '@material-ui/core/Select';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Drawer from '@material-ui/core/Drawer';
import elementOptions from '../constants/elementOptions.json';
import { withStyles } from '@material-ui/core/styles';
import css from '../css/Conditions.module.css';


const CustomIconButton = withStyles(() => ({
  root: {
    position: 'fixed',
    top: '5px',
    right: '8px',
    padding: '3px'
  },
}))(IconButton);

const CustomDrawer = withStyles(() => ({
  root: {
    width: '280px',
    '& .MuiDrawer-paper': {
      padding: '8px',
      boxSizing: 'border-box'
    }
  },
}))(Drawer);

const CustomTextField = withStyles(() => ({
  root: {
    '& > .MuiFilledInput-root': {
      backgroundColor: 'transparent',
      '&:hover': {
        backgroundColor: 'transparent',
      },
      '&:before': {
        border: 'none',
      }
    }
  },
}))(TextField);

const CustomSelect = withStyles(() => ({
  root: {
    padding: '15.5px 14px',
  },
}))(Select);

const CustomAccountTreeButton = withStyles(() => ({
  root: {
    minWidth: '48px'
  },
}))(Button);

class Conditions extends Component {
  constructor (props) {
    super(props);
    this.state = {
      eitherCondition: null,
      partyAbilityCondition: null,
      abilityCondition: null,
      bonusAbilityCondition: null,
      bonusAbilityActiveElement: '',
      openDialogType: '',
      possessionDisplay: false,
      headerSettingDialog: false,
      conditionDialog: false,
      buttonDisabled: false
    };
    this.changeEitherCondition = this.changeEitherCondition.bind(this);
    this.changePartyAbilityCondition = this.changePartyAbilityCondition.bind(this);
    this.changeAbilityCondition = this.changeAbilityCondition.bind(this);
    this.changeBonusAbilityCondition = this.changeBonusAbilityCondition.bind(this);
    this.changebonusAbilityActiveElementCondition = this.changebonusAbilityActiveElementCondition.bind(this);
    this.headerSettingDialogClose = this.headerSettingDialogClose.bind(this);
    this.conditionDialogClose = this.conditionDialogClose.bind(this);
    this.headerSet = this.headerSet.bind(this);
    this.conditionSet = this.conditionSet.bind(this);
  }

  handleSubmit (event) {
    event.preventDefault();
  }

  changeEitherCondition (newValue) {
    this.setState({ eitherCondition: newValue })
  }

  changePartyAbilityCondition (newValue) {
    this.setState({ partyAbilityCondition: newValue })
  }

  changeAbilityCondition (newValue) {
    this.setState({ abilityCondition: newValue })
  }

  changeBonusAbilityCondition (newValue) {
    this.setState({ bonusAbilityCondition: newValue })
  }

  changebonusAbilityActiveElementCondition (event) {
    this.setState({ bonusAbilityActiveElement: event.target.value !== 'none' ? event.target.value : ''})
  }

  conditionSet (selectVal) {
    const { openDialogType } = this.state
    const {
      setEitherCondision,
      setCondisionPartyAbility,
      setCondisionAbility,
      setCondisionBonusAbility
    } = this.props
    // this.conditionDialogClose();
    if (!selectVal) return
    switch (openDialogType) {
      case 'either':
        this.changeEitherCondition(selectVal)
        setEitherCondision(selectVal)
        break
      case 'partyAbility':
        this.changePartyAbilityCondition(selectVal)
        setCondisionPartyAbility(selectVal)
        break
      case 'ability':
        this.changeAbilityCondition(selectVal)
        setCondisionAbility(selectVal)
        break
      case 'bonusAbility':
        this.changeBonusAbilityCondition(selectVal)
        setCondisionBonusAbility(selectVal)
        break
      default: return
    }
  }

  addMyCards = async () => {
    this.setState({ buttonDisabled: true });

    const {
      clientId,
      selectedCardIds,
      myCards,
      loadingStart,
      loadingEnd
    } = this.props;

    const params = {
      id: clientId,
      selectedCardIds: myCards.concat(selectedCardIds)
    };


    if (!selectedCardIds.length || !clientId) {
      return
    } else {
      loadingStart();
    }

    try {
      await axios.post("https://8ey8makec1.execute-api.ap-northeast-1.amazonaws.com/dev", params);
      this.props.setMyCards(selectedCardIds);
      this.props.setSelectedCardIds([], true);
      loadingEnd();
      this.setState({ buttonDisabled: false });
    } catch (error) {
      console.log(error)
    }
  }

  removeMyCards = async () => {
    this.setState({ buttonDisabled: true });

    const {
      clientId,
      selectedCardIds,
      myCards,
      loadingStart,
      loadingEnd
    } = this.props;

    let removeResults = [...myCards];
    selectedCardIds.forEach(cardId => {
      removeResults = removeResults.filter(myCardId => myCardId !== cardId);
    });
    const params = {
      id: clientId,
      selectedCardIds: removeResults
    };

    if (!selectedCardIds.length || !clientId) {
      return
    } else {
      loadingStart();
    }

    try {
      await axios.post("https://8ey8makec1.execute-api.ap-northeast-1.amazonaws.com/dev", params);
      this.props.setMyCards(removeResults, true);
      this.props.setSelectedCardIds([], true);
      loadingEnd();
      this.setState({ buttonDisabled: false });
    } catch (error) {
      console.log(error)
    }
  }

  headerSettingDialogOpen () {
    this.setState({ headerSettingDialog: true });
  }

  headerSettingDialogClose () {
    this.setState({ headerSettingDialog: false });
  }

  conditionDialogOpen (openDialogType) {
    this.setState({
      openDialogType,
      conditionDialog: true
    });
  }

  conditionDialogClose () {
    this.setState({ conditionDialog: false });
  }

  headerSet (headers) {
    this.props.headerSet(headers);
  }

  render () {
    const {
      setEitherCondision,
      setCondisionPartyAbility,
      setCondisionAbility,
      setCondisionBonusAbility,
      setCondisionBonusAbilityActiveElement,
      abilityTypeOptoins,
      clientId,
      selectedCardIds,
      changePossessionDisplay,
      possessionDisplay,
      headers,
      drawerOpen,
      openDrawer,
      closeDrawer
    } = this.props
    const {
      eitherCondition,
      partyAbilityCondition,
      abilityCondition,
      bonusAbilityCondition,
      bonusAbilityActiveElement,
      elementOption,
      headerSettingDialog,
      conditionDialog,
      openDialogType,
      buttonDisabled
    } = this.state
    return (
      <div className={css.conditionsWrap}>
        <CustomIconButton
          onClick={openDrawer}>
          <SearchIcon />
        </CustomIconButton>
        <CustomDrawer
          variant="persistent"
          anchor="right"
          open={drawerOpen}
          >
          <CustomIconButton
            onClick={closeDrawer}>
            <CloseIcon />
          </CustomIconButton>
          <h2 className={css.conditionHeader}>条件</h2>
          <div className={css.conditionBoxWrap}>
            <form
              noValidate
              autoComplete="off"
              onBlur={() => setEitherCondision(eitherCondition)}
              onSubmit={event => this.handleSubmit(event)}>
              <Autocomplete
                id="combo-box-either-condition"
                value={eitherCondition}
                options={abilityTypeOptoins}
                getOptionLabel={option =>  option.label}
                style={{ width: 210 }}
                onChange={(event, newValue) => this.changeEitherCondition(newValue)}
                renderInput={params =>
                  <CustomTextField
                    {...params}
                    label="いずれかに含む"
                    variant="filled"
                    size="small"
                    color="secondary"
                  />}
              />
            </form>
            <hr className={css.divider}/>
            <CustomAccountTreeButton
              size="small"
              onClick={() => this.conditionDialogOpen('either')}
              startIcon={<AccountTreeIcon />}
              />
          </div>
          <div className={css.conditionBoxWrap}>
            <form
              noValidate
              autoComplete="off"
              onBlur={() => setCondisionPartyAbility(partyAbilityCondition)}
              onSubmit={event => this.handleSubmit(event)}>
              <Autocomplete
                id="combo-box-partyAbility"
                value={partyAbilityCondition}
                options={abilityTypeOptoins}
                getOptionLabel={option => option.label}
                style={{ width: 210 }}
                onChange={(event, newValue) => {this.changePartyAbilityCondition(newValue)}}
                renderInput={params =>
                  <CustomTextField
                    {...params}
                    label="パーティーアビリティ"
                    variant="filled"
                    size="small"
                    color="secondary"
                  />}
              />
            </form>
            <hr className={css.divider}/>
            <CustomAccountTreeButton
              size="small"
              onClick={() => this.conditionDialogOpen('partyAbility')}
              startIcon={<AccountTreeIcon />}/>
          </div>
          <div className={css.conditionBoxWrap}>
            <form
              noValidate
              autoComplete="off"
              onBlur={() => setCondisionAbility(abilityCondition)}
              onSubmit={event => this.handleSubmit(event)}>
              <Autocomplete
                id="combo-box-ability"
                value={abilityCondition}
                options={abilityTypeOptoins}
                getOptionLabel={option => option.label}
                style={{ width: 210 }}
                onChange={(event, newValue) => {this.changeAbilityCondition(newValue)}}
                renderInput={params =>
                  <CustomTextField
                    {...params}
                    label="付加効果"
                    variant="filled"
                    size="small"
                    color="secondary"
                  />}
              />
            </form>
            <hr className={css.divider}/>
            <CustomAccountTreeButton
              size="small"
              onClick={() => this.conditionDialogOpen('ability')}
              startIcon={<AccountTreeIcon />}/>
          </div>
          <div className={css.conditionBoxWrap}>
            <form
              noValidate
              autoComplete="off"
              onBlur={() => setCondisionBonusAbility(bonusAbilityCondition)}
              onSubmit={event => this.handleSubmit(event)}>
              <Autocomplete
                id="combo-box-bonus-ability"
                value={bonusAbilityCondition}
                options={abilityTypeOptoins}
                getOptionLabel={option => option.label}
                style={{ width: 210 }}
                onChange={(event, newValue) => {this.changeBonusAbilityCondition(newValue)}}
                renderInput={params =>
                  <CustomTextField
                    {...params}
                    label="ボーナスアビリティ"
                    variant="filled"
                    size="small"
                    color="secondary"
                  />}
              />
            </form>
            <hr className={css.divider}/>
            <CustomAccountTreeButton
              size="small"
              onClick={() => this.conditionDialogOpen('bonusAbility')}
              startIcon={<AccountTreeIcon />}/>
          </div>
          <div className={css.elementBoxWrap}>
            <FormControl
              variant="outlined"
              autoComplete="off"
              onBlur={() => setCondisionBonusAbilityActiveElement(bonusAbilityActiveElement)}
              onSubmit={event => this.handleSubmit(event)}>
              <InputLabel htmlFor="elementOption-select">ボーナスアビリティ発動属性</InputLabel>
              <CustomSelect
                native
                value={elementOption}
                style={{ width: 210 }}
                onChange={event => this.changebonusAbilityActiveElementCondition(event)}
                label="Age"
                inputProps={{
                  name: 'age',
                  id: 'elementOption-select',
                }}>
                {elementOptions.map(option => {
                  return (
                    <option
                      key={option.element}
                      value={option.element}>
                      {option.label}
                    </option>);
                })}
              </CustomSelect>
            </FormControl>
          </div>
        </CustomDrawer>
        <div className={css.conditionButtons}>
          <FormControlLabel
            control={<Switch
              name="possessionDisplay"
              disabled={!clientId}
              checked={possessionDisplay}
              onChange={event => changePossessionDisplay(event)}/>
            }
            label="所持"
          />
          <Button
            disabled={!clientId || !selectedCardIds.length || buttonDisabled}
            startIcon={<AddCircleIcon />}
            onClick={() => this.addMyCards()}>
            add myCards
          </Button>
          <Button
            disabled={!clientId || !selectedCardIds.length || buttonDisabled}
            startIcon={<RemoveCircleIcon />}
            onClick={() => this.removeMyCards()}>
            remove myCards
          </Button>
          <Button
            startIcon={<SettingsIcon />}
            onClick={() => this.headerSettingDialogOpen()}>
            header setting
          </Button>
          <HeaderSettingDialog
            headerSettingDialog={headerSettingDialog}
            headerSettingDialogClose={this.headerSettingDialogClose}
            headerSet={this.headerSet}
            headers={headers}
            >
          </HeaderSettingDialog>
          <ConditionDialog
            conditionDialog={conditionDialog}
            conditionDialogClose={this.conditionDialogClose}
            conditionSet={this.conditionSet}
            openDialogType={openDialogType}
            eitherCondition={eitherCondition}
            partyAbilityCondition={partyAbilityCondition}
            abilityCondition={abilityCondition}
            bonusAbilityCondition={bonusAbilityCondition}>
          </ConditionDialog>
        </div>
      </div>
    );
  }
}

export default Conditions;
