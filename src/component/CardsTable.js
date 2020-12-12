import React, { Component } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Checkbox from '@material-ui/core/Checkbox';
import elementOptions from '../constants/elementOptions.json';

class CardsTable extends Component {
  constructor (props) {
    super(props);
    this.state = {
      headers: [
        { id: 'rarity', label: 'レアリティ' },
        { id: 'name', label: '名前' },
        { id: 'partyAbility1', label: 'パーティーアビリティ' },
        { id: 'bonusAbility', label: 'ボーナスアビリティ' },
        { id: 'bonusAbilityActiveElement', label: 'ボーナスアビリティ発動属性' },
        { id: 'ability1', label: '付加効果' },
        { id: 'hp', label: 'HP' },
        { id: 'power', label: '攻撃' },
        { id: 'magic', label: '魔力' }
      ],
      order: 'desc',
      orderBy: 'rarity',
      selectedCardIds: []
    };
  }

  handleRequestSort (property) {
    const { orderBy, order } = this.state;
    const isAsc = orderBy === property && order === 'asc';
    this.setState({ order: isAsc ? 'desc' : 'asc' });
    this.setState({ orderBy: property });
  };

  onSelectAllClick (event) {
    if (event.target.checked) {
      const allCardIds = this.props.cards.map(card => card.ID)
      this.setState({ selectedCardIds: allCardIds });
      this.props.setSelectedCardIds(allCardIds);
    } else {
      this.setState({ selectedCardIds: [] });
      this.props.setSelectedCardIds([]);
    }
  };

  onSelectClick (selectCardId, event) {
    if (event.target.checked) {
      this.setState({
        selectedCardIds: [
          ...this.state.selectedCardIds,selectCardId
        ]
      });
      this.props.setSelectedCardIds([
        ...this.state.selectedCardIds,selectCardId
      ]);
    } else {
      this.setState({
        selectedCardIds: this.state.selectedCardIds.filter(cardId => cardId !== selectCardId)
      });
      this.props.setSelectedCardIds(
        this.state.selectedCardIds.filter(cardId => cardId !== selectCardId)
      );
    }
  };

  renderSelectCheckBox () {
    if (this.props.clientId) {
      return(
        <TableCell>
          <Checkbox
            onChange={event => this.onSelectAllClick(event)}
          />
        </TableCell>
      )
    } else {
      return null
    }
  };

  renderPossessionCheckBox () {
    const { orderBy, order } = this.state;
    const { clientId } = this.props;
    if (clientId) {
      return(
        <TableCell>
          <TableSortLabel
            style={{ whiteSpace: 'nowrap', minWidth: '50px' }}
            active={orderBy === 'possession'}
            direction={orderBy === 'possession' ? order : 'asc'}
            onClick={() => this.handleRequestSort('possession')}
          >
            所持
          </TableSortLabel>
        </TableCell>
      )
    } else {
      return null
    }
  }

  isChecked (id) {
    if (this.state.selectedCardIds.find(card => card === id)) return true
    return false
  }

  render () {
    const { orderBy, order, headers } = this.state;
    const { cards, partyAbilityCondition, abilityCondition, bonusAbilityCondition, bonusAbilityActiveElementCondition, clientId } = this.props;

    function stableSort (array, comparator) {
      const stabilizedThis = array.map((el, index) => [el, index]);
      stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
      });
      return stabilizedThis.map((el) => el[0]);
    }

    function descendingComparator (a, b, orderBy) {
      if (b[orderBy] < a[orderBy]) {
        return -1;
      }
      if (b[orderBy] > a[orderBy]) {
        return 1;
      }
      return 0;
    }

    function getComparator (order, orderBy) {
      return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
    }

    function filterSort () {
      let result = cards;
      if (partyAbilityCondition) {
        const filterCards = result.filter(card => card.partyAbility1Type === partyAbilityCondition)
        return stableSort(filterCards, getComparator(order, orderBy))
      }
      if (abilityCondition) {
        const filterCards = result.filter(card => card.ability1Type === abilityCondition)
        return stableSort(filterCards, getComparator(order, orderBy))
      }
      if (bonusAbilityCondition) {
        const filterCards = result.filter(card => card.bonusAbilityType === bonusAbilityCondition)
        return stableSort(filterCards, getComparator(order, orderBy))
      }
      if (bonusAbilityActiveElementCondition) {
        console.log(bonusAbilityActiveElementCondition)
        const filterCards = result.filter(card => card.bonusAbilityActiveElement === bonusAbilityActiveElementCondition)
        return stableSort(filterCards, getComparator(order, orderBy))
      }
      return stableSort(result, getComparator(order, orderBy))
    }

    function makeRarityLabel (rarity) {
      switch (rarity) {
        case 5: return 'UR'
        case 4: return 'SSR'
        case 3: return 'SR'
        case 2: return 'R'
        case 1: return 'N'
        default: return 'N'
      } 
    }

    function makeUnitTypeLabel (type) {
      if (type) {
        return elementOptions.find(option => option.element === type).label
      } else {
        return ''
      }
    }

    return (
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            {this.renderSelectCheckBox()}
            {this.renderPossessionCheckBox()}
            {headers.map((headCell) => (
              <TableCell
                key={headCell.id}
                sortDirection={orderBy === headCell.id ? order : false}
                style={{ whiteSpace: 'nowrap', minWidth: '100px' }}
              >
                <TableSortLabel
                  active={orderBy === headCell.id}
                  direction={orderBy === headCell.id ? order : 'asc'}
                  onClick={() => this.handleRequestSort(headCell.id)}
                >
                  {headCell.label}
                </TableSortLabel>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {filterSort().map(card => {
            return (
              <TableRow key={card.ID}>
                {clientId ?
                  <TableCell>
                    <Checkbox
                      checked={this.isChecked(card.ID)}
                      onChange={event => this.onSelectClick(card.ID, event)}
                    />
                  </TableCell> :
                  null}
                {clientId ?
                  <TableCell>
                    <Checkbox
                      disabled
                      checked={this.isChecked(card.ID)}
                    />
                  </TableCell> :
                  null}
                <TableCell component="th" scope="card">{ makeRarityLabel(card.rarity) }</TableCell>
                <TableCell>{card.name}</TableCell>
                <TableCell>{card.partyAbility1}</TableCell>
                <TableCell>{card.bonusAbility}</TableCell>
                <TableCell>{ makeUnitTypeLabel(card.bonusAbilityActiveElement) }</TableCell>
                <TableCell>{card.ability1}</TableCell>
                <TableCell>{card.hp}</TableCell>
                <TableCell>{card.power}</TableCell>
                <TableCell>{card.magic}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    );
  }
}

export default CardsTable;
