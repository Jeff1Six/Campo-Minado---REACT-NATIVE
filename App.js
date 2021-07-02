import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Alert
} from 'react-native'

import params from './src/params'
import MineField from './src/components/MineField'
import { 
  createdMinedBoard,
  cloneBoard,
  openField,
  hadExplosion,
  wowGame,
  showMines,
  invertFlag,
  flagUsed
} from './src/Logica'
import Header from './src/components/Header';
import LevelSelect from './src/screens/LevelSelect';

export default class App extends Component {
  constructor(props){
    super(props)
    this.state = this.createState()
  }

  minesAmount = () => {
    const cols = params.getColumnsAmount()
    const rows = params.getRowsAmount()
    return Math.ceil(cols * rows * params.difficultLevel)
  }
  createState = () => {
    const cols = params.getColumnsAmount()
    const rows = params.getRowsAmount()
    return{
      board: createdMinedBoard(rows, cols, this.minesAmount() ),
      won: false,
      lost: false,
      showLevelSelection: false
    }
  }

  onOpenField = (row, column ) => {
    const board = cloneBoard(this.state.board)
    openField(board, row, column)
    const lost = hadExplosion(board)
    const won = wowGame(board)

    if(lost){
      showMines(board)
      Alert.alert('PERDEU TITULO !!', 'PERDEU CORPO TEXTO')
    }
    if(won){
      Alert.alert('GANHOW', 'VOCE GANHOU !! ')
    }
    this.setState({board, lost , won})
  }
  onSelectField = (row,column) => {
    const board = cloneBoard(this.state.board)
    invertFlag(board,row,column)
    const won = wowGame(board)
    if(won){
      Alert.alert(`PARABENS`,'VOCE GANHOU')
    }
    this.setState({board, won})
  }
  onLevelSelected = level => {
    params.difficultLevel = level
    this.setState(this.createState())
  }
  render() {
    return (
        <View style={style.container}>
          <LevelSelect 
            IsVisible={this.state.showLevelSelection}
            onLevelSelected={this.onLevelSelected}
            OnCancel={()=> this.setState({showLevelSelection: false})}
            />
          <Header 
          flagsLeft={this.minesAmount() - flagUsed(this.state.board)}
          onNewGame={() => this.setState(this.createState())}
          onFlagpress = {() => this.setState({showLevelSelection: true})}
          />
          <View style={style.board}>
            <MineField 
              board={this.state.board} 
              onOpenField={this.onOpenField}
              onSelectField={this.onSelectField}
            />
          </View>
        </View>
      
    );
  }
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },board:{
    alignItems: 'center',
    backgroundColor: '#AAA'
  }
})
