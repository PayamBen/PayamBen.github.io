var player;
var computer;
var playersTurn;
var gameState = [];
var leaf_count=0;
var INFTY = 100000;

function nextMove() {
	//Set best as lowest possible
	var best = {score:-INFTY, move:-1}
	
	var temp_score = 0;

	leaf_count=0;
	
	for(var i=0; i<9; i++) {
		if(isEmpty(i)) {
			//Make possible move
			gameState[i]=computer;

			//Compute best move score for human player
			temp_score = -negaMax(player);
			
			//Undo previous move
			gameState[i]='n';

			//Take greatest score and move
			if(temp_score > best.score) {
				best.move = i;
				best.score = temp_score;
			}
		}
	}

	gameState[best.move] = computer;

	$('#' + best.move).text(computer);
	console.log(best);
	
	//if there is a winner it must be the computer
	if (checkWinner() != 0) {
		status("you lost");
		return;
	}
	if (checkTie()) {
		status("It's a draw");
	}else {
		playersTurn = true;
		status("your move");
	}
}

function negaMax(thisPlayer) {
	var r = checkWinner();
	if(r != 0) {
		leaf_count++;
		if(r==thisPlayer) return 100;
		else return -100;
	}

	if(checkTie()) {
		leaf_count++;
		return 0;
	} 

	//Initiate temporary variables
	var max = -INFTY;
	var temp = 0;

	//Perform and compute all further possible moves
	for(var i=0; i<9; i++) {
		if(isEmpty(i)){
			//Do possible move
			gameState[i]=thisPlayer;

			//Compute best score
			temp = -negaMax(thisPlayer==player ? computer:player)*.5;
			
			//Undo previous move
			gameState[i]='n';

			//Swap max if necessary
			if(temp > max) {
				max = temp;
			}
		}
	}
	return max;
}

//Just a crapload of cases
function checkWinner() {
	if(gameState[4]!='n') {
		if(gameState[4]==gameState[8] && gameState[4]==gameState[0])
			return gameState[4];
		else if(gameState[4]==gameState[2] && gameState[4]==gameState[6])
			return gameState[4];
		else if(gameState[1]==gameState[4] && gameState[4]==gameState[7])
			return gameState[4];
		else if(gameState[3]==gameState[4] && gameState[4]==gameState[5])
			return gameState[4]
	}
	if(gameState[0]!='n') {
		if(gameState[1]==gameState[0] && gameState[0]==gameState[2])
			return gameState[0];
		if(gameState[0]==gameState[3] && gameState[0]==gameState[6])
			return gameState[0]
	}
	if(gameState[2]!='n') {
		if(gameState[2]==gameState[5] && gameState[8]==gameState[5])
			return gameState[2];
	}
	if(gameState[6]!='n') {
		if(gameState[7]==gameState[8] && gameState[6]==gameState[7])
			return gameState[6];
	}
	return 0;
}

function startGame(xorO) {
	for(var i = 0; i < 9; i++) {
		$('#' + i).html("&nbsp;");
		gameState[i] = 'n';
	}
	
	if (xorO == 'O') {
		player = 'O';
		computer = 'X';
		playersTurn = false;
		nextMove();
	}else {
		player = 'X';
		computer = 'O';
		playersTurn = true;
	}
}

//Check for empty 
function isEmpty(cellno) {
	return gameState[cellno]=='n';
}

function status(e) {
	$('#status').text(e);
}

//Check for a tie. Run only after checking for a winner
function checkTie() {
	for(var i=0; i<9; i++) {
		if(gameState[i]=='n') return false;
	}
	return true;
}
	
$(function() {
	
	$('#status').text("Game loaded you are playing as X");
	startGame('x');
	
	$(".cell").click(function() {
		if (!playersTurn) {
			return;
		}
		$(this).text(player);
		gameState[parseInt($(this).attr("id"))] = player;
		playersTurn = false;
		if (checkWinner() != 0) {
			alert("You have won");
			return;
		}
		if (checkTie()) {
			status("It's a draw");
		}else {
			nextMove();
		}
	}); // end click
	
	$('#newGame').click(function() {
		$('#popupLayer').slideDown(200);
	}); //end click
	
	$('#newGame2').click(function() {
		startGame('X');
		$('#popupLayer').slideUp(200);
		$('#status').text("Game loaded you are playing as X");
	}); //end click
	
	$('#newGame3').click(function() {
		startGame('O');
		$('#popupLayer').slideUp(200);
		$('#status').text("Game loaded you are playing as O");
	}); //end click
	
	$('#close').click(function() {
		$('#popupLayer').slideUp(200);
		
	}); // end click
	console.log(gameState);
});//end ready