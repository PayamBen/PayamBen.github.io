/***
 * Connect Four Game, with AI player
 * Developer: Payam Behjat
 * Created: 14/9/14
 */

var player;
var computer;
var playersTurn;
var gameState = [[]];
var INFTY = 100000;
var boardSize = [300, 257];
var maxDepth = 3; //4 = hard, 3=medium, 2=easy
var useBookMoves = true;

// function used to allow future improvements 
function earlyMoves() {
	useBookMoves =false;
	return 3;
}

function nextMove() {
	if (!useBookMoves) {
		//Set best as lowest possible
		var best = {score:-INFTY, move:-1}
		
		var temp_score = 0;
		var j;
		leaf_count=0;
		
		for(var i=0; i<7; i++) {
			if(gameState[i][5] == 'n') {
				//Make possible move
				for(j = 0; j < 6 ; j++) {
					if(gameState[i][j] == 'n') {
						gameState[i][j] = computer;
						break;
					}
				}
				//Compute best move score for human player
				temp_score = -negaMax(player,-INFTY, INFTY,  0);
				
				//Undo previous move
				gameState[i][j]='n';
				//Take greatest score and move
				if(temp_score > best.score) {
					best.move = i;
					best.score = temp_score;
				}
			}
		}
		console.log(best);
		addCoin(best.move, computer);
	}else {
		addCoin(earlyMoves(), computer);
	}
	//if there is a winner it must be the computer
	if (checkWinner() != 0) {
		status("computer has won");
		return;
	}
	if (checkTie()) {
		status("It's a draw");
	}else {
		playersTurn = true;
		status("It's your move");
	}
}

function max(v1, v2) {
	return  v1>=v2 ? v1:v2;
}

function negaMax(thisPlayer, alpha, beta, depth) {
	var r = checkWinner();
	if(r != 0) {
		if(r==thisPlayer) return 100;
		else return -100;
	}

	if(checkTie()) {
		return 0;
	}
	
	if (depth > maxDepth) {
		return alpha;
	}

	//Initiate temporary variables
	var bestValue = -INFTY;
	var temp = 0;
	var j;
	//Perform and compute all further possible moves
	for(var i=0; i<7; i++) {
		if(gameState[i][5] == 'n') {
			//Do possible move
			for(j = 0; j < 6 ; j++) {
				if(gameState[i][j] == 'n') {
					gameState[i][j] = thisPlayer;
					break;
				}
			}
			//Compute best score
			temp = -negaMax(thisPlayer==player ? computer:player, -beta, -alpha, depth + 1)*.5;
			
			//Undo previous move
			gameState[i][j]='n';
			//Swap max if necessary
			bestValue = max(temp, bestValue);
			
			alpha = max(alpha, temp);
			if (alpha >= beta) {
				console.log("alpha break");
				break;
			}
		}
	}
	return bestValue;
}

/**
 *check for winner
 * return the winning colour
 */
function checkWinner() {
	var prevCoin = 'n';
	var noConnection = 0;
	
	//check Vertically
	for(var c = 0; c < 7; c++) {
		for(var r = 0; r < 6; r++) {
			if(gameState[c][r] == 'n') {
				noConnection = 0;
			}else if(prevCoin == gameState[c][r]) {
				noConnection++;
			}else {
				noConnection = 0;
			}
			if (noConnection >= 3) {
				//console.log("found v " + noConnection + " coin = " + prevCoin + " col " + c);
				return prevCoin;
				
			}
			prevCoin = gameState[c][r];
		}
		prevCoin = 'n';
		noConnection = 0;
	}
	
	//check horizontally, every horizontal victory will have a coin at 4th column 
	for(var r = 0; r < 6; r++) {
		if (gameState[3][r] != 'n') {
			for(var c = 0; c < 7; c++) {
				if(gameState[c][r] == 'n') {
					noConnection = 0;
				}else if(prevCoin == gameState[c][r]) {
					noConnection++;
				}else {
					noConnection = 0;
				}
				if (noConnection >= 3) {
					//console.log("found h " + noConnection + " coin = " + prevCoin + " row " + r);
					return prevCoin;	
				}
				prevCoin = gameState[c][r];
			}
			prevCoin = 'n';
			noConnection = 0;
		}
	}

	//check diagonally,
	for(var r = 0; r < 6; r++) {
		if (gameState[3][r] != 'n') {
			prevCoin = gameState[3][r];
			//nw
			for(var i = 1; i <= 3; i++) {
				if (r + i > 5) {
					break;
				}
				if (gameState[3 - i][r + i] != prevCoin) {
					break;
				}
				noConnection++;
			}
			
			//se
			for(var i = 1; i <= 3; i++) {
				if (r - i < 0) {
					break;
				}
				if (gameState[3 + i][r - i] != prevCoin) {
					break;
				}
				noConnection++;
			}
			if (noConnection >= 3) {
				//console.log("found d " + noConnection + " coin = " + prevCoin);
				return prevCoin;	
			}
			noConnection = 0;
			
			//ne
			for(var i = 1; i <= 3; i++) {
				if (r + i > 5) {
					break;
				}
				if (gameState[3 + i][r + i] != prevCoin) {
					break;
				}
				noConnection++;
			}
			
			//sw
			for(var i = 1; i <= 3; i++) {
				if (r - i < 0) {
					break;
				}
				if (gameState[3 - i][r - i] != prevCoin) {
					break;
				}
				noConnection++;
			}
			if (noConnection >= 3) {
				//console.log("found d2 " + noConnection + " coin = " + prevCoin);
				return prevCoin;	
			}
			noConnection = 0;
			prevCoin = 'n';
		}
	}
	return 0;	
}

function clearCanvas() {
	useBookMoves = true;
	drawBoard();
}

function startGame(rdOrYllw, level) {
	temp = [];
	for(var y = 0; y <= 5; y++) {
		temp[y] = 'n';
	}
	for(var x = 0; x <= 6 ; x++) {
		gameState[x] = temp.slice();
	}
	
	if (level == "easy") {
		maxDepth = 2;
		$('#DisplayLevel').text("Level: Easy");
	}else if (level == "medium") {
		maxDepth = 3;
		$('#DisplayLevel').text("Level: Medium");
	}else {
		maxDepth = 4;
		$('#DisplayLevel').text("Level: Hard");
	}
	
	if (rdOrYllw == 'y') {
		player = 'y';
		computer = 'r';
		playersTurn = true;
		//nextMove();
	}else {
		player = 'r';
		computer = 'y';
		playersTurn = false;
	}
}

function status(e) {
	$('#status').text(e);
}

//Check for a tie.
function checkTie() {
	for(var i=0; i<7; i++) {
		if(gameState[i][5] == 'n') return false;
	}
	return true;
}

function setCanvasSize(w, h, ctx) {
	ctx.canvas.height = h;
	ctx.canvas.width = w;
}

function viewport() {
    var e = window, a = 'inner';
    if (!('innerWidth' in window )) {
        a = 'client';
        e = document.documentElement || document.body;
    }
    return { width : e[ a+'Width' ] , height : e[ a+'Height' ] };
}

function drawBoard() {
	var c = document.getElementById("myCanvas");
	var ctx = c.getContext("2d");
	var vp = viewport();
	if (vp['width'] > 500) {
		setCanvasSize(500,428, ctx);
		w = 500;
		h = 428;
	}else {
		setCanvasSize(300,257, ctx);
		w = 300;
		h = 257;
	}
	$('#container').width(w);
	var clSze = Math.round(w / 7);
	
	//vertical lines
	for(var i = 1; i <= 6; i++) {
		ctx.moveTo(i * clSze, 0);
		ctx.lineTo(i * clSze, h);
		ctx.stroke();
	}
	//horizontal lines
	for(var i = 1; i <= 5; i++) {
		ctx.moveTo(0, i * clSze);
		ctx.lineTo(w , i * clSze);
		ctx.stroke();
	}
}

function calculateSelectedColumn(e) {
	var x = e.pageX - $('#myCanvas').offset().left;
	var cellSize = Math.round($('#myCanvas').width() / 7);
	return Math.floor(x / cellSize);
}

function addCoin(columnNo, rOrY) {
	var c = document.getElementById("myCanvas");
	var ctx = c.getContext("2d");
	
	var cellSize = Math.round($('#myCanvas').width() / 7);
	var y, available = false;
	for(y = 0; y < 6; y++) {
		if (gameState[columnNo][y] == 'n') {
			available = true;
			break;
		}
	}
	if (!available) {
		status("row is full");
		return
	}
	var row = 6 - (y + 1);
	
	ctx.beginPath();
	ctx.arc(cellSize * columnNo + (cellSize * 0.5),row * cellSize + (cellSize * 0.5),cellSize / 2,0,2*Math.PI);
	if (rOrY == 'r') {
		ctx.fillStyle="#FF0000";
	}else {
		ctx.fillStyle="#FFFF00";
	}
	ctx.fill();
	gameState[columnNo][y] = rOrY;
	$('#move').text("Computer's last move: row " + (columnNo + 1));
}

$(function() {
	$('#status').text("Game loaded you're Yellow");
	startGame('y', "medium");
	drawBoard(300,257);
	
	$('#newGame').click(function() {
		$('#popupLayer').slideDown(200);
	}); //end click
	
	$('#newGame2').click(function() {
		clearCanvas();
		var level = $('#level').val();
		startGame('y',level);
		$('#popupLayer').slideUp(200);
		$('#status').text("Game loaded you are playing as Yellow");
	}); //end click
	
	$('#newGame3').click(function() {
		clearCanvas();
		var level = $('#level').val();
		startGame('r', level);
		$('#popupLayer').slideUp(200);
		$('#status').text("Game loaded you are playing as Red");
		nextMove();
	}); //end click
	
	$('#close').click(function() {
		$('#popupLayer').slideUp(200);
		
	}); // end click
	
	$('#myCanvas').click(function(e) {
		if (!playersTurn) {
			return;
		}
		
		var col = calculateSelectedColumn(e);
		addCoin(col, player);
		if (checkWinner() != 0) {
			console.log("player = " + player);
			console.log(gameState);
			status("you won!");
			return;
		}
		if (checkTie()) {
			status("it's a draw");
		}
		playersTurn = !playersTurn;
		status("Exploring possible moves");
		nextMove();
		
	}); // end click
	
});//end ready