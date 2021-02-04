import React, { Component } from 'react';
import './App.css';
import axios from 'axios';

import CardsTable from './component/CardsTable.js'
import Conditions from './component/Conditions.js'
import Header from './component/Header.js'
import Progress from './component/Progress.js'
import { Auth } from "aws-amplify"

class App extends Component {
  constructor (props) {
    super(props);
    this.state = {
      cards: [],
      abilityTypeOptoins: [],
      eitherCondition: '',
      partyAbilityCondition: '',
      abilityCondition: '',
      bonusAbilityCondition: '',
      bonusAbilityActiveElementCondition: '',
      userName: '',
      clientId: '',
      selectedCardIds: [],
      myCards: [],
      possessionDisplay: false,
      loading: true,
      headers: [
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
    this.setEitherCondision = this.setEitherCondision.bind(this);
    this.setCondisionPartyAbility = this.setCondisionPartyAbility.bind(this);
    this.setCondisionAbility = this.setCondisionAbility.bind(this);
    this.setCondisionBonusAbility = this.setCondisionBonusAbility.bind(this);
    this.setCondisionBonusAbilityActiveElement = this.setCondisionBonusAbilityActiveElement.bind(this);
    this.setUserData = this.setUserData.bind(this);
    this.setSelectedCardIds = this.setSelectedCardIds.bind(this);
    this.setMyCards = this.setMyCards.bind(this);
    this.changePossessionDisplay = this.changePossessionDisplay.bind(this);
    this.headerSet = this.headerSet.bind(this);
    this.loadingStart = this.loadingStart.bind(this);
    this.loadingEnd = this.loadingEnd.bind(this);
    this.CardsTable = React.createRef();
  }

  getUserCards = async (clientId) => {
    try {
      const result = await axios.get("https://b91beyilhg.execute-api.ap-northeast-1.amazonaws.com/dev");
      const userCardData = result.data.filter(data => data.ID === clientId)[0];
      this.setState({ myCards: userCardData.cards });
    } catch(error) {
      console.log(error);
    }
  }

  getUserData = async () => {
    try {
      const currentSession = await Auth.currentSession();
      const userName = currentSession.getAccessToken().payload.username
      const clientId = currentSession.getAccessToken().payload.client_id
      this.setState({
        userName,
        clientId
      });
      this.getUserCards(clientId);
    } catch {
      console.log('no user data');
    }
  }

  craeteAbilityTypeOptoins (cards) {
    const result = [];
    cards.forEach(card=> {
      // パーティーアビリティ1
      if (!result.some(option => option.type === card.partyAbility1Type)) {
        result.push({
          type: card.partyAbility1Type,
          label: card.partyAbility1TypeLabel
        });
      }
      // パーティーアビリティ2
      if (card.partyAbility2Type && !result.some(option => option.type === card.partyAbility2Type)) {
        result.push({
          type: card.partyAbility2Type,
          label: card.partyAbility2TypeLabel
        });
      }
      // 付加効果1
      if (!result.some(option => option.type === card.ability1Type)) {
        result.push({
          type: card.ability1Type,
          label: card.ability1TypeLabel
        });
      }
      // 付加効果2
      if (card.ability2Type && !result.some(option => option.type === card.ability2Type)) {
        result.push({
          type: card.ability1Type,
          label: card.ability2TypeLabel
        });
      }
      // 付加効果3
      if (card.ability3Type && !result.some(option => option.type === card.ability3Type)) {
        result.push({
          type: card.ability3Type,
          label: card.ability3TypeLabel
        });
      }// 付加効果4
      if (card.ability4Type && !result.some(option => option.type === card.ability4Type)) {
        result.push({
          type: card.ability4Type,
          label: card.ability4TypeLabel
        });
      }
      // ボーナスアビリティ
      if (card.bonusAbilityType && !result.some(option => option.type === card.bonusAbilityType)) {
        result.push({
          type: card.bonusAbilityType,
          label: card.bonusAbilityTypeLabel
        });
      }
    });
    this.setState({ abilityTypeOptoins: result });
  }

  getCards = async () => {
    this.setState({ loading: true });
    try {
      const result = await axios.get("https://ie5xbafoi6.execute-api.ap-northeast-1.amazonaws.com/dev");
      this.setState({
        cards: result.data,
        loading: false
      });
      this.craeteAbilityTypeOptoins(result.data);
    } catch (error) {
      console.log(error);
    }
  }
  
  setEitherCondision (val) {
    this.setState({ eitherCondition: val ? val.type : '' });
  }

  setCondisionPartyAbility (val) {
    this.setState({ partyAbilityCondition: val ? val.type : '' });
  }

  setCondisionAbility (val) {
    this.setState({ abilityCondition: val ? val.type : '' });
  }

  setCondisionBonusAbility (val) {
    this.setState({ bonusAbilityCondition: val ? val.type : '' });
  }

  setCondisionBonusAbilityActiveElement (id) {
    this.setState({ bonusAbilityActiveElementCondition: id || '' });
  }

  changePossessionDisplay (event) {
    this.setState({ possessionDisplay: event.target.checked })
  }

  setUserData (clientId, userName) {
    this.setState({
      clientId: clientId || '',
      userName: userName || ''
    });
  }

  setSelectedCardIds (ids, reset) {
    this.setState({ selectedCardIds: ids || [] });
    if (reset) {
      this.CardsTable.current.selectReset();
    }
  }

  setMyCards (cards, remove) {
    if (remove) {
      this.setState({ myCards: cards });
    } else {
      this.setState({ myCards: this.state.myCards.concat(cards) });
    }
  }

  headerSet (headers) {
    this.setState({ headers: headers });
  }

  loadingStart () {
    this.setState({ loading: true });
  }

  loadingEnd () {
    this.setState({ loading: false });
  }

  componentDidMount () {
    this.getUserData();
    this.getCards();
  }

  render () {
    const {
      userName,
      clientId,
      abilityTypeOptoins,
      cards,
      eitherCondition,
      partyAbilityCondition,
      abilityCondition,
      bonusAbilityCondition,
      bonusAbilityActiveElementCondition,
      selectedCardIds,
      myCards,
      possessionDisplay,
      headers,
      loading
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
          setEitherCondision={this.setEitherCondision}
          setCondisionPartyAbility={this.setCondisionPartyAbility}
          setCondisionAbility={this.setCondisionAbility}
          setCondisionBonusAbility={this.setCondisionBonusAbility}
          setCondisionBonusAbilityActiveElement={this.setCondisionBonusAbilityActiveElement}
          clientId={clientId}
          selectedCardIds={selectedCardIds}
          setSelectedCardIds={this.setSelectedCardIds}
          myCards={myCards}
          setMyCards={this.setMyCards}
          changePossessionDisplay={this.changePossessionDisplay}
          headers={headers}
          headerSet={this.headerSet}
          possessionDisplay={possessionDisplay}
          loadingStart={this.loadingStart}
          loadingEnd={this.loadingEnd}
        />
        <CardsTable
          ref={this.CardsTable}
          cards={cards}
          eitherCondition={eitherCondition}
          partyAbilityCondition={partyAbilityCondition}
          abilityCondition={abilityCondition}
          bonusAbilityCondition={bonusAbilityCondition}
          bonusAbilityActiveElementCondition={bonusAbilityActiveElementCondition}
          clientId={clientId}
          selectedCardIds={selectedCardIds}
          setSelectedCardIds={this.setSelectedCardIds}
          myCards={myCards}
          possessionDisplay={possessionDisplay}
          headers={headers}
        />
        <Progress
          loading={loading} />
      </div>
    );
  }
}

export default App;
