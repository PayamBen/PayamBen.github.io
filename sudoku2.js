var answer = [];
var quitPuzzle = false;


function isLegal(grid, position, value) {
	//find row number
	var puzzelSize = 81;
	var gridSize = 9;
	
	var rowNumber = Math.floor(position/gridSize);
	
	//search row
	var startRow = rowNumber * gridSize;
	for(var a = startRow; a < startRow + 9; a++) {
		if (value == grid[a]) {
			return false;
		}
	}
	
	//search column
	var startCol = position - (rowNumber * 9);
	for(var a = startCol; a < puzzelSize; a += 9) {
		if(value == grid[a]) {
			return false;
		}
	}
	
	//search remaining boxes in square
	startRow = Math.floor( rowNumber / 3);
	startCol = Math.floor( startCol/ 3);
	var startSquare = (startRow * 27) + (startCol * 3);
	for(var a = startSquare; a < startSquare + 21 ; a +=9) {
		for(var b = 0; b < 3; b++) {
			if(value == grid[a + b]) {
				return false;
			}
		}
	}
	return true;
}


function solve(grid, position)
{
	if( position > 80 ) {// Solution found
		//copy array by value
		answer = grid.slice();
	    return
	}
	// If the cell is not empty, continue with the next cell
	if( grid[position] != 0)
	   solve(grid,position + 1) ;
	else
	{
	   var found = false;
	   // Find a valid number for the empty cell
	   for( var num = 1; num < 10; num++ )
	   {
		  if( isLegal(grid, position, num))
		  {
			 grid[position] = num;

			 // Delegate work on the next cell to a recursive call
			 solve(grid,position + 1);
		  }
	   }
	   // No valid number was found, clean up and return to caller
	  
		grid[position ] = 0;
	   
	}
}

function oneSolution(grid, position, count)
{
	if (count > 1) {
		return count;
	}

	if( position > 80 ) {// Solution found
		//copy array by value
		answer = grid.slice();
	    return count + 1;
	}
	// If the cell is not empty, continue with the next cell
	if( grid[position] != 0) {
	   count = oneSolution(grid,position + 1, count);
	}
	else
	{
	   var found = false;
	   // Find a valid number for the empty cell
	   for( var num = 1; num < 10; ++num )
	   {
		  //console.log("position = " + position + " number " + num );
		  if( isLegal(grid, position, num))
		  {
			 grid[position] = num;
			 // Delegate work on the next cell to a recursive call
			 count = oneSolution(grid,position + 1, count);
		  }
	   }
	   // No valid number was found, clean up and return to caller
	  
		grid[position ] = 0;
		
	}
	return count;
}

function makeArray() {
	var grid = new Array;
	for(var i = 1; i <= 81; ++i)
	{
		//only 
		if($('#' + i).hasClass('changeable')) 
		{
			grid[i - 1] = 0;
		}else
		{
			grid[i - 1] = parseInt($('#' + i).html());
		}
	}
	return grid;
}

function getBoard() {
	var grid = new Array;
	for(var i = 1; i <= 81; ++i)
	{
		grid[i - 1] = parseInt($('#' + i).html()) || 0;
	}
	return grid;
}

function make2DArray() {
	let result = [];
	var grid = getBoard();
	for(let i = 0; i < grid.length; i+= 9) {
		result.push(grid.slice(i, i + 9));
	}
	return result;
}

function resetBorderColor() {
	for(var i = 1; i <= 81; i++) {
		$('#' + i).removeClass("wrongAnswer");
	}
}

function logPrint(grid) {
	var output;
	for(var a = 0; a < 9;a++){
		output = "";
		for(var b = 0;b < 9; b++) 
		{
			output += grid[(a * 9) + b];
			output += ",";
		}
		console.log(output);
		if(a == 27 || a == 54) {
			console.log("-----------------\n");
		}
	}
}

function updateDisplay(grid) {
	for(var i = 1; i <= 81; i++) {
		if (grid[i - 1] == 0) {
			$('#' + i).html('&nbsp;');
		}else
		{ 
			$('#' + i).html(grid[i - 1]);
		}
	}
}

function clearDisplay() {
	for(var i = 1; i <= 81; i++) {
		$('#' + i).html('&nbsp;');
		$('#' + i).removeClass('unchangeable');
	}
	
}

function markWrongAnswers(grid) {
	for(var i = 1; i <= 81; i++) {
		if( parseInt($('#' + i).text()) != grid[i - 1] && $('#' + i).html() != "&nbsp;") {
			$('#' + i).addClass("wrongAnswer");
		}
	}
}

function puzzleComplete(grid) {
	for(var i = 1; i <= 81; i++) {
		if( parseInt($('#' + i).text()) != grid[i - 1] || $('#' + i).html() == "&nbsp;") {
			return -1;
		}
	}
	return 1;
}

// Simple Sudoku generator with difficulty settings
class SudokuGenerator {
	constructor() {
	  this.board = this.generateFullBoard();
	}
  
	generateFullBoard() {
	  const board = Array.from({ length: 9 }, () => Array(9).fill(0));
	  this.fillBoard(board);
	  return board;
	}
  
	fillBoard(board) {
	  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  
	  const shuffle = (array) => array.sort(() => Math.random() - 0.5);
  
	  const isSafe = (board, row, col, num) => {
		for (let x = 0; x < 9; x++) {
		  if (board[row][x] === num || board[x][col] === num) return false;
		}
		const startRow = row - (row % 3), startCol = col - (col % 3);
		for (let r = 0; r < 3; r++) {
		  for (let c = 0; c < 3; c++) {
			if (board[r + startRow][c + startCol] === num) return false;
		  }
		}
		return true;
	  };
  
	  const solve = (board) => {
		for (let row = 0; row < 9; row++) {
		  for (let col = 0; col < 9; col++) {
			if (board[row][col] === 0) {
			  const shuffled = shuffle([...numbers]);
			  for (let num of shuffled) {
				if (isSafe(board, row, col, num)) {
				  board[row][col] = num;
				  if (solve(board)) return true;
				  board[row][col] = 0;
				}
			  }
			  return false;
			}
		  }
		}
		return true;
	  };
  
	  solve(board);
	  return board;
	}
  
	removeNumbers(board, level) {
	  let attempts;
	  switch (level) {
		case "easy": attempts = 30; break;
		case "medium": attempts = 40; break;
		case "hard": attempts = 50; break;
		default: attempts = 40;
	  }
  
	  const puzzle = board.map(row => row.slice());
  
	  while (attempts > 0) {
		const row = Math.floor(Math.random() * 9);
		const col = Math.floor(Math.random() * 9);
  
		if (puzzle[row][col] !== 0) {
		  puzzle[row][col] = 0;
		  attempts--;
		}
	  }
	  return puzzle;
	}
  
	getPuzzle(level = "medium") {
	  const fullBoard = this.generateFullBoard();
	  return this.removeNumbers(fullBoard, level);
	}
  }
  
  



function loadPuzzle(level)
{
	var newPuzzle;
	var count = 0;
	$('#container').css('cursor','wait');
	// Usage
	const sudoku = new SudokuGenerator();
	do {
		newPuzzle = flatten2DArray(sudoku.getPuzzle(level));
		console.table(newPuzzle);
	} while(oneSolution(newPuzzle,0,0) > 1)
	
	clearDisplay();
	
	for(var i = 1; i <= 81; i++) {
		if (newPuzzle[i - 1] == 0) {
			count++;
			$('#' + i).html('&nbsp;');
			$('#' + i).removeClass('unchangeable');
			$('#' + i).addClass('changeable');
		}else
		{ 
			$('#' + i).html(newPuzzle[i - 1]);
			$('#' + i).removeClass('changeable');
			$('#' + i).addClass('unchangeable');
		}
	}
	console.log('empty squares ' + count);
	$('#container').css('cursor','default');
	 
}

function flatten2DArray(arr) {
	return arr.flat();
}

function legalTable(grid)
{
	var puzzelSize = 81;
	var gridSize = 9;
	
	
	for(var i = 0; i <= 80; i++)
	{
		var rowNumber = Math.floor(i/gridSize);
		//search row
		var startRow = rowNumber * gridSize;
		for(var a = startRow; a < startRow + 9; a++) {
			if (grid[i] != 0 && grid[i] != 0 && a != i && grid[i] == grid[a]) {
				return false;
			}
		}
		
		//search column
		var startCol = i - (rowNumber * 9);
		for(var a = startCol; a < puzzelSize; a += 9) {
			if(grid[i] != 0 && grid[i] != 0 && a != i && grid[i]== grid[a]) {
				return false;
			}
		}
		
		//search remaining boxes in square
		startRow = Math.floor( rowNumber / 3);
		startCol = Math.floor( startCol/ 3);
		var startSquare = (startRow * 27) + (startCol * 3);
		for(var a = startSquare; a < startSquare + 21 ; a +=9) {
			for(var b = 0; b < 3; b++) {
				if(grid[i] != 0 && grid[i] != 0&& (a + b != i) && grid[i] == grid[a + b] ) {
					return false;
				}
			}
		}
	}
	return true
}

$(function() {
	$('#solveit').click(function() {
		resetBorderColor();
		var grid = makeArray();
		if(!legalTable(grid)) {
			$('#message').text("The table is illegal");
			$('#message').show();
			return;
		}
		var status = oneSolution(grid,0,0);
		
		if(status > 1) {
			$('#message').text("No unique solutions!");
			$('#message').show();
			return;
		}
		updateDisplay(answer);
		quitPuzzle = true;
	});//end click
	
	$('.txtBox').click(function() {
		if ($(this).hasClass('changeable') || $('#inputPuzzle').hasClass('largeButton')) {
				
			if ($('.selected').html() == '&nbsp;') {
				$(this).html('&nbsp;');
				$(this).removeClass('wrongAnswer');
				return
			}
			var num = parseInt($('.selected').text());
			$(this).removeClass('wrongAnswer');
			$(this).text(num);
			if (!$('#inputPuzzle').hasClass('largeButton'))
			{
				if (answer.length <= 0) {
					var grid = makeArray();
					solve(grid, 0);
				}
				if (puzzleComplete(answer) > 0) {
					if (quitPuzzle) {
						alert("Finished, however you requested the solution during the game");
					}
					else {
						alert("Puzzle Correctly Finished!");
					}
				}
			}
			
		}
	});//end click
	
	$('.num').click(function() {
		if ($(this).text() == $('.selected').text()) {
			return
		} else
		{
			$('.selected').removeClass('selected');
			$(this).addClass('selected');
		}
	});// end click
	
	$('#check').click(function() {
		resetBorderColor();
		var grid = makeArray();
		if(!legalTable(grid)) {
			$('#message').text("The table is illegal");
			$('#message').show();
			return;
		}
		var status = oneSolution(grid,0,0)
		if(status > 1) {
			$('#message').text("No unique solutions!");
			$('#message').show();
			return;
		}
		$('#message').text("");
		$('#message').hide();
		markWrongAnswers(answer);
	}); // end click
	
	$('#newPuzzle').click(function() {
		$('#popupLayer').slideDown(200);
	}); //end click
	
	$('#inputPuzzle').click(function() {
		if ($('#inputPuzzle').hasClass('largeButton')) {
			//check for bad values
			$('.txtBox').each(function() {
				if(parseInt($(this).text())) {
					$(this).removeClass('changeable');
					$(this).addClass('unchangeable');
				}else
				{
					$(this).removeClass('unchangeable');
					$(this).addClass('changeable');
				}
			});// end each
			
			
			$('.button').removeClass('largeButton');
			$('#clear').addClass('hidden');
			$('#inputPuzzle').text('Input Puzzle')
			$('.button').each(function() {
				if ($(this).attr('id') != 'inputPuzzle' && $(this).attr('id') != 'clear') {
					$(this).show();
				}
			}); // end each
			answer = [];
			quitPuzzle = false;
			return;
		}
		resetBorderColor();
		$('#proNum').text("");
		$('#inputPuzzle').text('Finish')
		$('.button').each(function() {
			if ($(this).attr('id') != 'inputPuzzle' && $(this).attr('id') != 'clear') {
				$(this).hide();
			}
			
		}); // end each
		$('#clear').removeClass('hidden');
		$('#inputPuzzle').addClass('largeButton');
	}); //end click
	
	$('#clear').click(function() {
		clearDisplay();
		
	}); // end click
	
	$('#message').click(function() {
		$(this).hide();
		
	}); //end click
	
	$('#close').click(function() {
		$('#popupLayer').slideUp(200);
		
	}); // end click
	
	$('#newPuzzle2').click(function() {
		resetBorderColor();
		answer = [];
		quitPuzzle = false;
		loadPuzzle('easy');
		$('#popupLayer').slideUp(200);
	}); //easy end click
	$('#newPuzzle3').click(function() {
		resetBorderColor();
		answer = [];
		quitPuzzle = false;
		loadPuzzle('medium');
		$('#popupLayer').slideUp(200);
	}); //medium end click
	$('#newPuzzle4').click(function() {
		resetBorderColor();
		answer = [];
		quitPuzzle = false;
		loadPuzzle('hard');
		$('#popupLayer').slideUp(200);
	}); //hard end click

	$('#hint').click(function() {
		$('#message').text("looking for hint");
		$('#message').show();
		var twoDGrid = make2DArray();
		let messageText = getSudokuHint(twoDGrid); 
		if(messageText.length == 0) {
			$('#message').text(findPossibleSquare(twoDGrid));
		} else {
			$('#message').text(messageText);
		}
	});//end click

	function findPossibleSquare(twoDGrid) {
		
		//console.log(twoDGrid);
		var possibleNumbers;
		var BestSoFar = 9;
		var BestX;
		var BestY;
		for(let y = 0; y < 9; y++) {
			for(let x = 0; x < 9; x++) {
				if (twoDGrid[y][x] == 0) {
					possibleNumbers = getPossibleNumbers(twoDGrid,y,x);
					console.log(possibleNumbers);
					if (possibleNumbers.length == 1) {
						return "Check row=" + (y + 1) + " col=" + (x + 1);
					} else {
						if(possibleNumbers.length <= BestSoFar) {
							BestSoFar = possibleNumbers.length;
							BestX = x + 1;
							BestY = y + 1
						}
					}
				}
			}
		}
		return "There are " + BestSoFar + " possible numbers at row " +  BestY + " col " + BestX;
	}

	function getSudokuHint(board) {
		for (let num = 1; num <= 9; num++) {
			for (let boxRow = 0; boxRow < 3; boxRow++) {
				for (let boxCol = 0; boxCol < 3; boxCol++) {
					let possibleCells = [];
	
					// Iterate over the 3x3 square
					for (let row = boxRow * 3; row < boxRow * 3 + 3; row++) {
						for (let col = boxCol * 3; col < boxCol * 3 + 3; col++) {
							if (board[row][col] === 0 && canPlace(board, row, col, num)) {
								possibleCells.push({ row, col });
							}
						}
					}
	
					// If exactly one cell can contain this number, return a hint
					if (possibleCells.length === 1) {
						return `Place ${num} in Grid row ${Math.ceil((possibleCells[0].row + 1) / 3)}, col ${Math.ceil((possibleCells[0].col + 1) / 3)}`;
					}
				}
			}
		}
		return ""//"Sorry I couldn't find anything";
	}
	
	// Check if a number can be placed at board[row][col]
	function canPlace(board, row, col, num) {
		// Check row
		for (let c = 0; c < 9; c++) {
			if (board[row][c] === num) return false;
		}
		// Check column
		for (let r = 0; r < 9; r++) {
			if (board[r][col] === num) return false;
		}
		// Check 3x3 box
		let boxRowStart = Math.floor(row / 3) * 3;
		let boxColStart = Math.floor(col / 3) * 3;
		for (let r = 0; r < 3; r++) {
			for (let c = 0; c < 3; c++) {
				if (board[boxRowStart + r][boxColStart + c] === num) return false;
			}
		}
		return true;
	}

	function getPossibleNumbers(grid, row, col) {
		if (grid[row][col] !== 0) {
			return []; // If already filled, return empty list
		}
	
		let possibleNumbers = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]);
	
		// Remove numbers in the same row
		for (let i = 0; i < 9; i++) {
			possibleNumbers.delete(grid[row][i]);
		}
	
		// Remove numbers in the same column
		for (let i = 0; i < 9; i++) {
			possibleNumbers.delete(grid[i][col]);
		}
	
		// Remove numbers in the same 3x3 box
		let boxRowStart = Math.floor(row / 3) * 3;
		let boxColStart = Math.floor(col / 3) * 3;
		for (let i = 0; i < 3; i++) {
			for (let j = 0; j < 3; j++) {
				possibleNumbers.delete(grid[boxRowStart + i][boxColStart + j]);
			}
		}
	
		return Array.from(possibleNumbers);
	}
	
	
	// Example: Get possible numbers for position (0,2)
	//let row = 0, col = 2;
	//console.log(`Possible numbers for (${row}, ${col}):`, getPossibleNumbers(sudokuGrid, row, col));
	
});//end ready
	
