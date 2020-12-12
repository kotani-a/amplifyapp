import React, { Component } from 'react';
import './App.css';
import axios from 'axios';

import CardsTable from './component/CardsTable.js'
import Conditions from './component/Conditions.js'
import Header from './component/Header.js'
import { Auth } from "aws-amplify"

class App extends Component {
  constructor (props) {
    super(props);
    this.state = {
      cards: [],
      abilityTypeOptoins: [],
      partyAbilityCondition: '',
      abilityCondition: '',
      bonusAbilityCondition: '',
      bonusAbilityActiveElementCondition: '',
      userName: '',
      clientId: '',
      selectedCardIds: []
    };
    this.setCondisionPartyAbility = this.setCondisionPartyAbility.bind(this);
    this.setCondisionAbility = this.setCondisionAbility.bind(this);
    this.setCondisionBonusAbility = this.setCondisionBonusAbility.bind(this);
    this.setCondisionBonusAbilityActiveElement = this.setCondisionBonusAbilityActiveElement.bind(this);
    this.setUserData = this.setUserData.bind(this);
    this.setSelectedCardIds = this.setSelectedCardIds.bind(this);
  }

  // getUserCards = async () => {
  //   // getUserCards API call
  // }

  getUserData = async () => {
    try {
      const currentSession = await Auth.currentSession();
      const userName = currentSession.getAccessToken().payload.username
      const clientId = currentSession.getAccessToken().payload.client_id
      this.setState({
        userName,
        clientId
      });
      // this.getUserCards(clientId);
    } catch {
      console.log('no user data');
    }
  }

  craeteAbilityTypeOptoins (cards) {
    const result = [];
    cards.forEach(card=> {
      // パーティーアビリティ1
      if (!result.some(option => option.id === card.partyAbility1Type)) {
        result.push({
          id: card.partyAbility1Type,
          label: card.partyAbility1TypeLabel
        });
      }
      // パーティーアビリティ2
      if (card.partyAbility2Type && !result.some(option => option.id === card.partyAbility2Type)) {
        result.push({
          id: card.partyAbility2Type,
          label: card.partyAbility2TypeLabel
        });
      }
      // 付加効果1
      if (!result.some(option => option.id === card.ability1Type)) {
        result.push({
          id: card.ability1Type,
          label: card.ability1TypeLabel
        });
      }
      // 付加効果2
      if (card.ability2Type && !result.some(option => option.id === card.ability2Type)) {
        result.push({
          id: card.ability2Type,
          label: card.ability2TypeLabel
        });
      }
      // ボーナスアビリティ
      if (card.bonusAbilityType && !result.some(option => option.id === card.bonusAbilityType)) {
        result.push({
          id: card.bonusAbilityType,
          label: card.bonusAbilityTypeLabel
        });
      }
    });
    this.setState({ abilityTypeOptoins: result });
  }

  getCards = async () => {
    try {
      const result = await axios.get("https://ie5xbafoi6.execute-api.ap-northeast-1.amazonaws.com/dev");
      this.setState({ cards: result.data });
      this.craeteAbilityTypeOptoins(result.data);
    } catch (error) {
      console.log(error);
    }
  }

  setCondisionPartyAbility (id) {
    this.setState({ partyAbilityCondition: id || '' });
  }

  setCondisionAbility (id) {
    this.setState({ abilityCondition: id || '' });
  }

  setCondisionBonusAbility (id) {
    this.setState({ bonusAbilityCondition: id || '' });
  }

  setCondisionBonusAbilityActiveElement (id) {
    this.setState({ bonusAbilityActiveElementCondition: id || '' });
  }

  setUserData (clientId, userName) {
    this.setState({
      clientId: clientId || '',
      userName: userName || ''
    });
  }

  setSelectedCardIds (ids) {
    this.setState({ selectedCardIds: ids || [] });
  }

  componentDidMount () {
    this.getUserData()
    this.getCards();
  }

  render () {
    const {
      userName,
      clientId,
      abilityTypeOptoins,
      cards,
      partyAbilityCondition,
      abilityCondition,
      bonusAbilityCondition,
      bonusAbilityActiveElementCondition,
      selectedCardIds
    } = this.state
    return (
      <div className="App">
        <Header
          setUserData={this.setUserData}
          userName={userName}
          clientId={clientId}
        />
        <Conditions
          abilityTypeOptoins={abilityTypeOptoins}
          setCondisionPartyAbility={this.setCondisionPartyAbility}
          setCondisionAbility={this.setCondisionAbility}
          setCondisionBonusAbility={this.setCondisionBonusAbility}
          setCondisionBonusAbilityActiveElement={this.setCondisionBonusAbilityActiveElement}
          clientId={clientId}
          selectedCardIds={selectedCardIds}
        />
        <CardsTable
          cards={cards}
          partyAbilityCondition={partyAbilityCondition}
          abilityCondition={abilityCondition}
          bonusAbilityCondition={bonusAbilityCondition}
          bonusAbilityActiveElementCondition={bonusAbilityActiveElementCondition}
          clientId={clientId}
          setSelectedCardIds={this.setSelectedCardIds}
        />
      </div>
    );
  }
}

export default App;
