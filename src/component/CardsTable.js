import React, { Component } from 'react';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import TablePagination from '@material-ui/core/TablePagination';
import Checkbox from '@material-ui/core/Checkbox';
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles } from '@material-ui/core/styles';
import elementOptions from '../constants/elementOptions.json';

const CustomTablePagination = withStyles(() => ({
  root: {
    '& .MuiTablePagination-spacer': {
      display: 'none'
    }
  },
}))(TablePagination);

class CardsTable extends Component {
  constructor (props) {
    super(props);
    this.state = {
      order: 'desc',
      orderBy: 'rarity',
      selectedCardIds: [],
      rowsPerPage: 25,
      page: 0,
      tableHeight: 600
    };
    this.handleChangePage = this.handleChangePage.bind(this);
    this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this);
    this.setCardsLength = this.setCardsLength.bind(this);
    this.makeRarityLabel = this.makeRarityLabel.bind(this);
    this.makeElementLabel = this.makeElementLabel.bind(this);
  }

  componentDidMount() {
    this.setTableHeight();
    window.addEventListener('resize', () => {
      this.setTableHeight();
    });
  }

  setTableHeight () {
    const haederHeight = 119
    const conditionsRowHeight = 62
    const tableFooterHeight = 52
    let tableHeight = window.innerHeight - haederHeight - conditionsRowHeight - tableFooterHeight
    this.setState({ tableHeight: tableHeight });
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

  changeSelectCardCheckbox (selectCardId, event) {
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

  selectReset () {
    this.setState({ selectedCardIds: [] });
  }

  renderSelectCheckBox () {
    if (this.props.clientId) {
      return(
        <TableCell>
          <Checkbox onChange={event => this.onSelectAllClick(event)}/>
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
      return (
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

  

  makeRarityLabel (rarity) {
    switch (rarity) {
      case 5: return 'UR'
      case 4: return 'SSR'
      case 3: return 'SR'
      case 2: return 'R'
      case 1: return 'N'
      default: return 'N'
    } 
  }

  makeElementLabel (type) {
    if (type) {
      return elementOptions.find(option => option.element === type).label
    } else {
      return ''
    }
  }

  tableBodyCell (card) {
    const {
      headers,
      clientId
    } = this.props;
    return (
      <TableRow key={card.ID}>
        {clientId ?
          <TableCell key={`${card.ID}-check`}>
            <Checkbox
              checked={this.isChecked(card.ID)}
              onChange={event => this.changeSelectCardCheckbox(card.ID, event)}/>
          </TableCell> :
          null}
        {clientId ?
          <TableCell key={`${card.ID}-isPossession`}>
            <Checkbox
              disabled
              checked={this.isPossession(card.ID)}/>
          </TableCell> :
          null}
        {headers.filter(h => h.display).map(header => {
          switch (header.id) {
            case 'partyAbility1':
              if (card.partyAbility1Conditions) {
                return (
                  <Tooltip
                    key={`${card.ID}-${header.id}`}
                    title={`条件:${card.partyAbility1Conditions}`}
                    placement="right"
                    arrow>
                    <TableCell>{ `${card[header.id]}*` }</TableCell>
                  </Tooltip>
                  )
              } else {
                return <TableCell key={`${card.ID}-${header.id}`}>{ card[header.id] }</TableCell>
              }
            case 'partyAbility2':
              if (card.partyAbility2Conditions) {
                return (
                  <Tooltip
                    key={`${card.ID}-${header.id}`}
                    title={`条件:${card.partyAbility2Conditions}`}
                    placement="right"
                    arrow>
                    <TableCell>{ `${card[header.id]}*` }</TableCell>
                  </Tooltip>
                )
              } else {
                return <TableCell key={`${card.ID}-${header.id}`}>{ card[header.id] }</TableCell>
              }
            case 'ability1':
              if (card.ability1Conditions) {
                return (
                  <Tooltip
                    key={`${card.ID}-${header.id}`}
                    title={`条件:${card.ability1Conditions}`}
                    placement="right"
                    arrow>
                    <TableCell>{ `${card[header.id]}*` }</TableCell>
                  </Tooltip>
                )
              } else {
                return <TableCell key={`${card.ID}-${header.id}`}>{ card[header.id] }</TableCell>
              }
            case 'ability2':
              if (card.ability2Conditions) {
                return (
                  <Tooltip
                    key={`${card.ID}-${header.id}`}
                    title={`条件:${card.ability2Conditions}`}
                    placement="right"
                    arrow>
                    <TableCell>{ `${card[header.id]}*` }</TableCell>
                  </Tooltip>
                )
              } else {
                return <TableCell key={`${card.ID}-${header.id}`}>{ card[header.id] }</TableCell>
              }
            case 'ability3':
              if (card.ability3Conditions) {
                return (
                  <Tooltip
                    key={`${card.ID}-${header.id}`}
                    title={`条件:${card.ability3Conditions}`}
                    placement="right"
                    arrow>
                    <TableCell>{ `${card[header.id]}*` }</TableCell>
                  </Tooltip>
                )
              } else {
                return <TableCell key={`${card.ID}-${header.id}`}>{ card[header.id] }</TableCell>
              }
            case 'ability4':
              if (card.ability4Conditions) {
                return (
                  <Tooltip
                    key={`${card.ID}-${header.id}`}
                    title={`条件:${card.ability3Conditions}`}
                    placement="right"
                    arrow>
                    <TableCell>{ `${card[header.id]}*` }</TableCell>
                  </Tooltip>
                )
              } else {
                return <TableCell key={`${card.ID}-${header.id}`}>{ card[header.id] }</TableCell>
              }
            case 'rarity':
              return <TableCell key={`${card.ID}-${header.id}`}>{ this.makeRarityLabel(card.rarity) }</TableCell>
            case 'bonusAbilityActiveElement':
              return <TableCell key={`${card.ID}-${header.id}`}>{ this.makeElementLabel(card.bonusAbilityActiveElement) }</TableCell>
            case 'limited':
              return(
                <TableCell key={`${card.ID}-${header.id}`}>
                  <Checkbox
                    disabled
                    checked={card.limited}/>
                </TableCell>
              )
            default:
              return <TableCell key={`${card.ID}-${header.id}`}>{ card[header.id] }</TableCell>
          }
        })}
      </TableRow>
    )
  }

  isChecked (id) {
    if (this.props.selectedCardIds.find(card => card === id)) return true
    return false
  }

  isPossession (id) {
    if (this.props.myCards.find(card => card === id)) return true
    return false
  }
  
  handleChangePage (event, newPage) {
    this.setState({ page: newPage });
  };

  handleChangeRowsPerPage (event) {
    this.setState({ rowsPerPage: event.target.value });
    this.setState({ page: 0 });
  };

  setCardsLength (cardsLength) {
    this.setState({ cardsLength });
  }

  render () {
    const {
      orderBy,
      order,
      rowsPerPage,
      page,
      tableHeight
    } = this.state;
    const {
      cards,
      eitherCondition,
      partyAbilityCondition,
      abilityCondition,
      bonusAbilityCondition,
      bonusAbilityActiveElementCondition,
      possessionDisplay,
      myCards,
      headers
    } = this.props;

    let cardsLength = 0;

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
      if (eitherCondition) {
        result = result.filter(card =>
          card.partyAbility1Type === eitherCondition ||
          card.partyAbility2Type === eitherCondition ||
          card.ability1Type === eitherCondition ||
          card.ability2Type === eitherCondition ||
          card.ability3Type === eitherCondition ||
          card.ability4Type === eitherCondition ||
          card.bonusAbilityType === eitherCondition)
      }
      if (partyAbilityCondition) {
        result = result.filter(card =>
          card.partyAbility1Type === partyAbilityCondition ||
          card.partyAbility2Type === partyAbilityCondition)
      }
      if (abilityCondition) {
        result = result.filter(card =>
          card.ability1Type === abilityCondition ||
          card.ability2Type === abilityCondition ||
          card.ability3Type === abilityCondition ||
          card.ability4Type === abilityCondition)
      }
      if (bonusAbilityCondition) {
        result = result.filter(card => card.bonusAbilityType === bonusAbilityCondition)
      }
      if (bonusAbilityActiveElementCondition) {
        result = result.filter(card => card.bonusAbilityActiveElement === bonusAbilityActiveElementCondition)
      }
      if (possessionDisplay) {
        result = result.filter(card => myCards.includes(card.ID))
      }
      cardsLength = result.length
      return stableSort(result, getComparator(order, orderBy))
    }

    return (
      <div>
        <TableContainer style={{ overflow: "scroll", maxHeight: `${tableHeight}px` }}>
          <Table
            size="small"
            dense="true"
            stickyHeader>
            <TableHead>
              <TableRow>
                {this.renderSelectCheckBox()}
                {this.renderPossessionCheckBox()}
                {headers.filter(h => h.display).map(headCell => (
                  <TableCell
                    key={headCell.id}
                    sortDirection={orderBy === headCell.id ? order : false}
                    style={{ whiteSpace: 'nowrap', minWidth: '100px' }}>
                    <TableSortLabel
                      active={orderBy === headCell.id}
                      direction={orderBy === headCell.id ? order : 'asc'}
                      onClick={() => this.handleRequestSort(headCell.id)}>
                      {headCell.label}
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filterSort().slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(card => this.tableBodyCell(card))}
            </TableBody>
          </Table>
        </TableContainer>
        <CustomTablePagination
          rowsPerPageOptions={[25, 50, 100]}
          rowsPerPage={rowsPerPage}
          page={page}
          count={cardsLength}
          component="div"
          onChangePage={this.handleChangePage}
          onChangeRowsPerPage={this.handleChangeRowsPerPage}
        />
      </div>
    );
  }
}

export default CardsTable;
