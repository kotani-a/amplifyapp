import React, { Component } from 'react';
import axios from 'axios';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Autocomplete from '@material-ui/lab/Autocomplete';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import Select from '@material-ui/core/Select';
import elementOptions from '../constants/elementOptions.json';

class Conditions extends Component {
  constructor (props) {
    super(props);
    this.state = {
      partyAbilityCondition: '',
      abilityCondition: '',
      bonusAbilityCondition: '',
      bonusAbilityActiveElement: '',
    };
    this.changePartyAbilityCondition = this.changePartyAbilityCondition.bind(this);
    this.changeAbilityCondition = this.changeAbilityCondition.bind(this);
    this.changeBonusAbilityCondition = this.changeBonusAbilityCondition.bind(this);
    this.changebonusAbilityActiveElementCondition = this.changebonusAbilityActiveElementCondition.bind(this);
  }

  handleSubmit (event) {
    event.preventDefault();
  }

  changePartyAbilityCondition (newValue) {
    this.setState({ partyAbilityCondition: newValue ? newValue.id : '' })
  }

  changeAbilityCondition (newValue) {
    this.setState({ abilityCondition: newValue ? newValue.id : '' })
  }

  changeBonusAbilityCondition (newValue) {
    this.setState({ bonusAbilityCondition: newValue ? newValue.id : '' })
  }

  changebonusAbilityActiveElementCondition (event) {
    this.setState({ bonusAbilityActiveElement: event.target.value !== 'none' ? event.target.value : ''})
  }

  addMyCards = async () => {
    console.log('log addMyCards')
    const {
      clientId,
      selectedCardIds
    } = this.props;
    const params = {
      'ID': clientId,
      'cards': selectedCardIds
    };

    if (!selectedCardIds.length || !clientId) {
      return
    }

    try {
      console.log('log addMyCards try')
      await axios.put("https://60cr9yr87e.execute-api.ap-northeast-1.amazonaws.com/dev", params);
    } catch (error) {
      console.log(error)
    }
  }

  render () {
    const {
      setCondisionPartyAbility,
      setCondisionAbility,
      setCondisionBonusAbility,
      setCondisionBonusAbilityActiveElement,
      abilityTypeOptoins,
      clientId,
      selectedCardIds
    } = this.props
    return (
      <div style={{margin: "0 24px"}}>
        <h2>conditions</h2>
        <div style={{display: "flex", margin: "0 12px"}}>
          <div style={{display: "flex", margin: "0 4px"}}>
            <form
              noValidate
              autoComplete="off"
              onBlur={() => setCondisionPartyAbility(this.state.partyAbilityCondition)}
              onSubmit={event => this.handleSubmit(event)}>
              <Autocomplete
                id="combo-box-partyAbility"
                options={abilityTypeOptoins}
                getOptionLabel={option => option.label}
                style={{ width: 250 }}
                onChange={(event, newValue) => {this.changePartyAbilityCondition(newValue);}}
                renderInput={params => <TextField {...params} label="パーティーアビリティ" variant="outlined" />}
              />
            </form>
            <Button>O.D.</Button>
          </div>
          <div style={{display: "flex", margin: "0 4px"}}>
            <form
              noValidate
              autoComplete="off"
              onBlur={() => setCondisionAbility(this.state.abilityCondition)}
              onSubmit={event => this.handleSubmit(event)}>
              <Autocomplete
                id="combo-box-ability"
                options={abilityTypeOptoins}
                getOptionLabel={option => option.label}
                style={{ width: 250 }}
                onChange={(event, newValue) => {this.changeAbilityCondition(newValue);}}
                renderInput={params => <TextField {...params} label="付加効果" variant="outlined" />}
              />
            </form>
            <Button>O.D.</Button>
          </div>
          <div style={{display: "flex", margin: "0 4px"}}>
            <form
              noValidate
              autoComplete="off"
              onBlur={() => setCondisionBonusAbility(this.state.bonusAbilityCondition)}
              onSubmit={event => this.handleSubmit(event)}>
              <Autocomplete
                id="combo-box-bonus-ability"
                options={abilityTypeOptoins}
                getOptionLabel={option => option.label}
                style={{ width: 250 }}
                onChange={(event, newValue) => {this.changeBonusAbilityCondition(newValue)}}
                renderInput={params => <TextField {...params} label="ボーナスアビリティ" variant="outlined" />}
              />
            </form>
            <Button>O.D.</Button>
          </div>
          <div>
            <FormControl
              variant="outlined"
              autoComplete="off"
              onBlur={() => setCondisionBonusAbilityActiveElement(this.state.bonusAbilityActiveElement)}
              onSubmit={event => this.handleSubmit(event)}>
              <InputLabel htmlFor="elementOption-select">ボーナスアビリティ発動属性</InputLabel>
              <Select
                native
                value={this.state.elementOption}
                style={{ width: 250 }}
                onChange={event => this.changebonusAbilityActiveElementCondition(event)}
                label="Age"
                inputProps={{
                  name: 'age',
                  id: 'elementOption-select',
                }}
              >
                {elementOptions.map(option => {
                  return (
                    <option
                      key={option.element}
                      value={option.element}
                    >
                      {option.label}
                    </option>
                  );
                })}
              </Select>
            </FormControl>
          </div>
        </div>
        <Button
          disabled={!clientId || !selectedCardIds.length}
          startIcon={<AddCircleIcon />}
          onClick={() => this.addMyCards()}
        >
          add myCards
        </Button>
      </div>
    );
  }
}

export default Conditions;
