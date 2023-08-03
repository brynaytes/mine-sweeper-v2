import React from 'react';
import ReactDOM from 'react-dom/client';

import './index.css';
let bombArray = [];

const xSize = 10;
const ySize = 10;
const numberOfBombs = 10;
let cnt = 0;
let arr = [];
let clearedSquares = 0;

//populates bomb array
bombArray = createBombArray(numberOfBombs);

//generates grid
for (let y = 0; y < ySize; y++) {
    let ar = []
    for (let x = 0; x < xSize; x++, cnt++) {
        ar.push(cnt);
    }
    arr.push(ar);
}

class Square extends React.Component {

    render() {
        return (
            <button
                className="square"
                onClick={() => { this.props.onClick() }}
                onContextMenu={() => { this.props.onQuestion() }}>
                {this.props.value}
            </button>
        );
    }
}

class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            squares: Array(9).fill(null),
            winOrLoose: null,
        };

    }

    checkForWin() {
        if ((xSize * ySize) - bombArray.length === clearedSquares) {
            this.state.winOrLoose = true;
        }
    }
    question(i) {
        const squares = this.state.squares.slice();
        squares[i] = "?"
        this.setState({
            squares: squares
        });
    }

    handleClick(i) {

        const squares = this.state.squares.slice();

        if (this.state.winOrLoose == null) {

            if (squares[i] == null || squares[i] == "?") {

                squares[i] = calculateProximityToBomb(i);



                if (squares[i] === "X") {
                    this.state.winOrLoose = false
                }

                this.setState({
                    squares: squares
                });
                
                clearedSquares++;

                //clear all zeros at once
                if(squares[i] === 0){
                    this.setState({
                        squares: clearAllTouchingZeros(squares,i)
                    }); 
                }
            }
        }

        this.checkForWin();
    }
    


    handleRestart() {
        window.location.reload();
    }

    renderSquare(i) {
        return <Square value={this.state.squares[i]}
            onClick={() => this.handleClick(i)}
            onQuestion={() => this.question(i)}
        />;
    }
    info(){
        window.alert("This is a work in progress minesweeper game built with react.js. It needs some polish, but its here for testing some ci/cd work.");
    }
    render() {
        return (
            <div className="GameAndMessage">
                <Response winOrLoose={this.state.winOrLoose} />

                <div className="status">{ }</div>
                {arr.map(items => {
                    return <div className="board-row">
                        {items.map(squares => {
                            return <a>{this.renderSquare(squares)}</a>
                        })}
                    </div>
                })}
                <button class="restart-button ui" onClick={this.handleRestart}>restart</button>
                <button class="ui" onClick={this.info}>?</button>
            </div>

        )
    }
}

class Response extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            message: null
        };

    }
    render() {
        let message = " ";

        if (this.props.winOrLoose == null) {
            message = " "
        } else if (this.props.winOrLoose) {
            message = "You win"
        } else if (this.props.winOrLoose == false) {
            message = "You loose"
        }

        return (
            <div class="message">
                <h1>{message}</h1>
            </div>
        );
    }
}



class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            squares: Array(9).fill(null),
            winOrLoose: null
        };
    }


    render() {
        return (
            <div className="game">
                <div className="game-board">
                    <Board state={this.state} />
                </div>
            </div>
        );
    }
}


// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(<Game />);


function calculateProximityToBomb(i) {
    let temp = findXY(i);
    let x1 = temp[0], y1 = temp[1];

    let count = 0;
    for (let o = 0; o < bombArray.length; o++) {
        if ((bombArray[o][0] + 1 == x1 || bombArray[o][0] == x1 || bombArray[o][0] - 1 == x1) && (bombArray[o][1] + 1 == y1 || bombArray[o][1] == y1 || bombArray[o][1] - 1 == y1)) {
            if (bombArray[o][0] == x1 && bombArray[o][1] == y1) {
                return "X";
            }
            count++;
        }
    }
    return count;
}

//makes a random array of bombs
function createBombArray(numberOfBombs) {
    let arr = [];
    for (let i = 0; i < numberOfBombs; i++) {
        arr.push(getGoodBomblocation(arr));
    }
    return arr;
}

//creates unique bomb coordinates
function getGoodBomblocation(array) {
    let x = Math.floor(Math.random() * xSize);
    let y = Math.floor(Math.random() * ySize);
    let arr = [x, y]
    for (let i = 0; i < array.length; i++) {
        if (array[i][0] === x && array[i][1] === y) {
            arr = getGoodBomblocation(array)
        }
    }
    return arr;
}

//if zero if clicked find all other zeros
function clearAllTouchingZeros(squares,i){


    let largestI = xSize * ySize -1; 
    //up
    let temp, tempCoords;

    tempCoords = findXY(i);

    temp = i-xSize;
    if( temp >= 0   && temp <= largestI && squares[temp] !== 0 && calculateProximityToBomb(temp) === 0){
        clearedSquares++;
        squares[temp] = 0;
        clearAllTouchingZeros(squares,temp)
    }
    //down
    temp = i+xSize
    if(temp >= 0  && temp <= largestI && squares[temp] !== 0 && calculateProximityToBomb(temp) === 0){
        clearedSquares++;
        squares[temp] = 0;
        clearAllTouchingZeros(squares,temp)

    }
    //left
    temp = i-1

    if(temp >= 0 && tempCoords[0] > 0 && temp <= largestI &&squares[temp] !== 0 && calculateProximityToBomb(temp) === 0){
        clearedSquares++;
        squares[temp] = 0;
        clearAllTouchingZeros(squares,temp)

    }
    //right 
    temp = i+1

    if(temp >= 0 && tempCoords[0] < xSize-1 && temp <= largestI && squares[temp] !== 0 &&calculateProximityToBomb(temp) === 0){
        clearedSquares++;
        squares[temp] = 0;        
        clearAllTouchingZeros(squares,temp)

    }
    return squares;
}

//find x y coordinates for any integer
function findXY(i){
    let x, y;
    for (y = 0; y < ySize ; y++) {
        for ( x = 0; x < xSize; x++) {
            if (arr[y][x] == i) {
                return [x,y];
            }
        }
    }
}