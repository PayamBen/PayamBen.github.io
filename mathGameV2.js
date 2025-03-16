var cardsDisplayed = 0;
var cards = [];
var largeValues = ['10','25','50','75','100'];
var smallValues = ['1','2','3','4','5','6','7','8','9'];
var formulas = [];
var answer;
var userVariables = [];
var timer;

Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};

function myTimer() {
    //var d = new Date();
    var time = document.getElementById("timer").innerHTML;
	if (time == 0) {
		clearTimeout(timer);
		var total = scoreGame();
		if (total == $('#total').text()) {
			$('#notice').text('Great Work!');
			$('#notice').fadeIn(300);
		}else {
			$('#answer').append(total);
		}
		setSolutuionStatus(true);
		$('#del').removeClass('enabled');
	}else {
		document.getElementById("timer").innerHTML = document.getElementById("timer").innerHTML - 1;
	}
	
}

function scoreGame()
{
	var userInput = $('#answer').text();
	var total= 0;
	var numbers = [];
	var currentN = 0;
	var op = [];
	var currentOp = 0, currentV = 0;
	var previous = "";
	console.log('answer = ' + userInput);
	for(var c = 0; c < userInput.length; c++) {
		if (userInput[c] == ';') {
			continue;
		}
		if (userInput[c] == '+' || userInput[c] == '-' || userInput[c] == '/' || userInput[c] == '*' || userInput[c] == '=' ) {
			if (numbers[currentN] == 0) {
				console.log('bad input');
				return;
			}else {
				op[currentOp] = userInput[c]
				if (op[currentOp] == '=') {
					total = numbers[0];
					for(var i = 1; i < numbers.length; i++)
					{
						if (op[i - 1] == '+') {
							total += numbers[i]
						}else if (op[i - 1] == '-') {
							total -= numbers[i]
						}else if (op[i - 1] == '*') {
							total *= numbers[i]
						}else if (op[i - 1] == '/') {
							total /= numbers[i]
						}
					}
				}else {
					currentN++;
					currentOp++;
				}
			}	
		}
		if (userInput[c] == 'x' && previous == '=') {
			userVariables[currentV] = total;
			currentV++;
			previous = userInput[c];
			c++;
			currentN = 0;
			currentOp = 0;
			numbers = [];
			op = [];
			continue;
		}
		//replace variable with it's true value 
		if (userInput[c] == 'x' && previous != '=') {
			var variableName = userInput[c] + userInput[c+1];
			var stringTotal = userVariables[parseInt(userInput[c + 1])].toString();
			
			var lengthDiff = stringTotal.length - 2;
			console.log('length = ')
			c = c + lengthDiff;
			var regex = new RegExp(variableName, "g");
			userInput = userInput.replace(regex, stringTotal)
			/*userInput.remove[c];
			userInput.remove[c + 1];
			var stringTotal = userVariables[parseInt(userInput[c + 1])];
			for(var i = 0; i < stringTotal.length; i++) {
				userInput.splice(c, 0, stringTotal.charAt(i) );
				c++;
			}*/
			
			currentV = 1;
		}
		if (parseInt(userInput[c]) || userInput[c] == '0') {
			if (numbers[currentN] === undefined) {
				numbers[currentN] = parseInt(userInput[c]);
			}else {
				numbers[currentN] *= 10;
				numbers[currentN] += parseInt(userInput[c]);
			}
		}
		previous = userInput[c];
	}
	console.log('you answered = ' + total);
	return total;
}

/**
 * Reveal hidden card (No. cardsDisplayed)  
 * Indicated size of card with either L or S
 */
function newCard(size) {
	if (cardsDisplayed == 6) {
		return;
	}
	/*$('#card' + (cardsDisplayed + 1)).css({"visibility": "visible"});*/
	
	if (size == 'large') {
		$('#card' + (cardsDisplayed + 1)).text('L');
	}else {
		$('#card' + (cardsDisplayed + 1)).text('S');
	}
	cardsDisplayed++;

	controlStartButton() 
}

function controlStartButton() {
	if (cardsDisplayed == 6 && $('#start').hasClass('disabled')) {
		$('#start').removeClass('disabled');
		$('#start').addClass('enabled');
		return;
	}
	if (cardsDisplayed < 6 && $('#start').hasClass('enabled')) {
		$('#start').removeClass('enabled');
		$('#start').addClass('disabled');
	}
}

function removeCard() {
	if (cardsDisplayed > 0) {
		cardsDisplayed--;
		$('#card' + (cardsDisplayed + 1)).html('&nbsp');
		controlStartButton() 
	}
}

function generateNumber() {
	var ops = ['+','-', '*', '/'];
	var opsNumber = 0 ;
	var total = 0;
	var difficulty = Math.floor((Math.random() * 2) + 3);
	var forumla;
	
	while(total <= 100 || total > 999) {
		forumla ="";
		var availableNumbers = cards.slice();
		var cardIndex = Math.floor((Math.random() * (availableNumbers.length - 1)));
		var card = availableNumbers[cardIndex];
		
		// Pick one card for the intital total and remove from available list
		total = parseInt(card);
		console.log('total= ' + total);
		forumla += card.toString();
		availableNumbers.remove(cardIndex);
		
		for(var i = 0; i < difficulty && availableNumbers.length > 0; i++ )
		{
			opsNumber = Math.floor((Math.random() * 3));
			cardIndex = Math.floor((Math.random() * (availableNumbers.length - 1)));
			//console.log('cardINdex = ' + cardIndex);
			card = availableNumbers[cardIndex];
			if (ops[opsNumber] == '+')
			{
				total +=  parseInt(card);
				forumla += ops[opsNumber].toString() + card;
			}
			else if (ops[opsNumber] == '-')
			{
				if (total - card < 0)
				{
					total = card - total;
					forumla = card.toString() + ops[opsNumber].toString() + forumla;
				}else
				{
					total -= card;
					forumla += ops[opsNumber].toString() + card;
				}
			}else if (ops[opsNumber] == '*')
			{
				total *= card;
				forumla += ops[opsNumber].toString() + card.toString();
			}else {
				if (total % card == 0)
				{
					total /= card;
					forumla += ops[opsNumber].toString() + card.toString();
				}else
				{
					total *= card;
					forumla += '*' + card.toString();
				}
			}
			console.log(' total ' + total + ' opNum = ' + opsNumber + ' card = ' + card);
			//console.log('size of array ' + availableNumbers.length);
			availableNumbers.remove(cardIndex);
		}
	}
	$('#total').text(total);
	answer = forumla;
	console.log('answer =' + answer);	
	document.getElementById('solutionArea').innerHTML = answer;
}


function pickNumber() {
	$('#total').text(Math.floor((Math.random() * 900) + 100));
}

function printArray(arr)
{
	for(var i = 0; i < arr.length; i++)
	{
		console.log(arr[i]);
	}
}

function allproducts(nums, ops, formula)
{
	if (nums.length == 0) {	
		return;
	}
	for(var n = 0; n < nums.length; n++) {
		var reNums = nums.slice();
		reNums.remove(n);
		var oldformula = formula;
		var curNum = nums[n];
		for(var i = 0; i < ops.length; i++) {
			formula +=  curNum.toString() + ops[i].toString();
			formulas.push(formula);
			allproducts(reNums, ops, formula);
			formula = oldformula;
		}
	}
}

function allproducts2(nums, ops, formula)
{
	if (nums.length == 0) {	
		return;
	}
	for(var n = 0; n < nums.length; n++) {
		var reNums = nums.slice();
		reNums.remove(n);
		var oldformula = formula.slice();
		var curNum = nums[n];
		for(var i = 0; i < ops.length; i++) {
			formula.push(curNum);
			formula.push(ops[i]);
			formulas.push(formula);
			allproducts2(reNums, ops, formula.slice());
			formula = oldformula.slice()	;
		}
	}
}

function solve() {
	var ops = ['+',' /', '-', '*'];
	var target = $('#total').text();
	var bestResult = 0;
	var bestMethod = "";
	allproducts2(cards, ops, []);
	//allproducts2([1,2,3],['a','b'], []);
	console.log('1 - array length ' + formulas.length);
	printArray(formulas);
	//for (var i = 0; i < formulas.length; i++) {
	//	var s = formulas[i];
	//	s.split('');
	//}
	
}

/**
 * Run on starting of game,
 * 1) randomly choose the cards values, depending on it's size, store values into array 
 * 2) alter cards text to reveal it's value
 * 
 **/
function flipCard() {

	for(var i = 0; i <= 5; i++)
	{
		if($('#card' + (i + 1)).text() == 'L') {
			var c = Math.floor((Math.random() * largeValues.length));
			cards.push(largeValues[c]);
		}else {
			var c = Math.floor((Math.random() * smallValues.length));
			cards.push(smallValues[c]);
		}
		$('#card' + (i + 1)).text(cards[i]);
	}
}

/**
 * Reset Game
 * 1) reset all Global variables
 * 2) clear timer
 * 3) enable Number buttons
 *
 */
function resetGame() {
	cards = [];
	cardsDisplayed = 0;
	clearTimeout(timer);
	toggleNumbers();
	setSolutuionStatus(false);
	document.getElementById('solutionArea').innerHTML = "";
	$('#timer').html('30');
	$('.card').each(function() {
		$(this).html('&nbsp;');
		
	}); // end each
	$('#total').html('&nbsp;');
	$('#answer').text('');
	$('.card').each(function() {
		if ($(this).hasClass('disabled')) {
			$(this).removeClass('disabled');
		}
		if ($(this).hasClass('pause')) {
			$(this).removeClass('pause');
		}
	}); // end each
	$('#variables').html('');
	userVariables = [];
	$('#notice').fadeOut();
	
}


/**
 *
 * Toggle the number and del buttons.
 * 1) Check the large button state
 * 2) Add and remove classes accordingly
 * 
 */
function toggleNumbers() {
	if ($('#large').hasClass('enabled')) {
		$('#large').removeClass('enabled');
		$('#small').removeClass('enabled');
		$('#del').removeClass('enabled');
		$('#large').addClass('disabled');
		$('#small').addClass('disabled');
		$('#del').addClass('disabled');
	}else {
		$('#large').removeClass('disabled');
		$('#small').removeClass('disabled');
		$('#del').removeClass('disabled');
		$('#large').addClass('enabled');
		$('#small').addClass('enabled');
		$('#del').addClass('enabled');
	}
}

function setTimer() {
	var e = document.getElementById("time");
	var value = Number(e.value);
	document.getElementById("timer").innerHTML = value;
}

function setSolutuionStatus(flag) {
	if (flag == false) {
		$('#showASolution').removeClass('enabled');
		$('#showASolution').addClass('disabled');
	} else {
		$('#showASolution').removeClass('disabled');
		$('#showASolution').addClass('enabled');
	}
}

function setCheckAnswerStatus(flag) {
	if (flag == false) {
		$('#checkAnswer').removeClass('enabled');
		$('#checkAnswer').addClass('disabled');
	} else {
		$('#checkAnswer').removeClass('disabled');
		$('#checkAnswer').addClass('enabled');
	}
}

$(function() {
	$('#large').click(function() {
		if ($(this).hasClass('disabled')) {
			return;
		}
		newCard('large');
	}); // end click
	
	$('#small').click(function() {
		if ($(this).hasClass('disabled')) {
			return;
		}
		newCard('small');
	}); // end click
	
	$('#del').click(function() {
		if ($(this).hasClass('disabled')) {
			return;
		}
		removeCard();
	}); // end click
	
	/**
	 * Start Game.
	 * 1 - Check that six cards have been choosen
	 */
	$('#start').click(function() {
		if (!$(this).hasClass('enabled')) {
			return;
		}
		flipCard();
		generateNumber();
		toggleNumbers();
		setSolutuionStatus(false);
		setCheckAnswerStatus(true);
		setTimer();
		$('#answer').text('');
		timer=setInterval(function(){myTimer()},1000);
	}); // end click
	
	$('#restart').click(function() {
		// check that a game has been started
		if (!$('#start').hasClass('enabled')) {
			return;
		}
		resetGame();
	}); // end click

	$('#showASolution').click(function() {
		// check that a game has been started
		if (!$('#start').hasClass('enabled')) {
			return;
		}
		resetGame();
	}); // end click
	
	$('.sign').click(function() {
		
		if ($(this).hasClass('pause')) {
			return;
		}
		
		$('.card').each(function() {
			if ($(this).hasClass('pause')) {
				$(this).removeClass('pause');
			}
		}); // end each
		
		if ($(this).text() == 'C') {
			$('#answer').text('');
			$('#variables').text('');
			userVariables = [];
			$('.card').each(function() {
				if ($(this).hasClass('disabled')) {
					$(this).removeClass('disabled');
				}
			}); //end each*/
			return;
		}
		$('#answer').append( $(this).text());
		
		if ($(this).text() == '=') {
			var tmp = userVariables.length;
			$('#answer').append('x' + tmp);
			userVariables.push('x' +  tmp );
			$('#variables').append('<div class="variable" id="' + tmp + '">x' +  tmp +'</div>');
			$('#' + tmp).bind( "click", function() {
				$('#answer').append( $(this).text());
				
				//aim: enable operators
				$('.sign').each(function() {
					if ($(this).hasClass('pause')) {
						$(this).removeClass('pause');
					}		
				}); // end each
				
				$('#' + tmp).unbind("click");
			}); // end bind
			$('#answer').append(';<br>');
		}
		
		//disable operators
		//aim: only allow one number to be inserted at a time
		$('.sign').each(function() {
			if ($(this).attr("id") != "clear") {
				$(this).addClass('pause');
		}
		}); // end each
		
	}); // end click
	
	$('.card').click(function() {
		if ($(this).hasClass('disabled') || $(this).hasClass('pause')) {
			return;
		}
		if ($(this).html() == "&nbsp;") {
			return;
		}
		$('#answer').append( $(this).text());
		$(this).addClass('disabled');
		
		//aim: only allow one number to be inserted at a time
		$('.card').each(function() {
			if (!$(this).hasClass('disabled')) {
				$(this).addClass('pause');
			}
			
		}); // end each
		
		//aim: enable operators
		$('.sign').each(function() {
			if ($(this).hasClass('pause')) {
				$(this).removeClass('pause');
			}
			
		}); // end each
	}); // end click
	
	$('#notice').click(function() {
		$(this).fadeOut(300);
	}); // end click
	
	/*
	$('.variable').click(function() {
		$('#answer').append( $(this).text());
		
		//aim: enable operators
		$('.sign').each(function() {
			if ($(this).hasClass('pause')) {
				$(this).removeClass('pause');
			}
			
		}); // end each
		
	}); // end click*/
	
}); // end Ready