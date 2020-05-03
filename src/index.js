import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>{props.value}</button>
  );
}

function Board(props) {
  function renderSquares(start, end) {
    let squares = [];
    for (let i=start; i<=end; i++) {
      squares.push(<Square value={props.board[i]} onClick={() => props.onClick(i)}/>);
    }
    return squares;
  }

  return (
    <div className="board">
      <div className="board-row">{renderSquares(0, 2)}</div>
      <div className="board-row">{renderSquares(3, 5)}</div>
      <div className="board-row">{renderSquares(6, 8)}</div>
    </div>
  );
}

class Game extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      history: [
        Array(9).fill(null),
      ],
      currentIndex: 0,
      turn1: true,
      winner: null,
    };
  }

  handleClick(i) {
    if (this.state.winner !== null) {
      return;
    }

    const copyBoard = this.state.history[this.state.currentIndex].slice();
    copyBoard[i] = this.state.turn1? 'x' : 'o';

    this.setState({
      history: this.state.history.concat([copyBoard]),
      currentIndex: this.state.currentIndex+1,
      turn1: !this.state.turn1,
      winner: calculateWinner(copyBoard),
    });
  }

  handleGoTo(i) {
    this.setState({
      history: this.state.history.slice(0, i+1),
      currentIndex: i,
      turn1: i%2 === 0? true: false,
      winner: null,
    });
  }

  render() {
    const currentBoard = this.state.history[this.state.currentIndex].slice();

    let status;
    if (this.state.winner) {
      status = 'Winner: ' + (this.state.winner);
    } else {
      status = 'Next player: ' + (this.state.turn1? 'x' : 'o');
    }

    const historyList = this.state.history.slice().map((board, i) => {
      return (
        <li key={i}><button onClick={() => this.handleGoTo(i)}>{i? 'go to move '+i : 'go to start'}</button></li>
      );
    });

    return (
      <div className="game">
        <div className="game-board">
          <Board board={currentBoard} onClick={(i) => this.handleClick(i)}/>
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{historyList}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(board) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
