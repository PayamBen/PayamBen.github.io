function permute(input, len) {
    var i, ch;
    for (i = 0; i < input.length; i++) {
        ch = input.splice(i, 1)[0];
        usedChars.push(ch);
        if (usedChars.length == len) {
            permArr.push(usedChars.slice());
        }
        permute(input, len);
        input.splice(i, 0, ch);
        usedChars.pop();
    }
    return permArr
};

function repeatedPermute(input, count, len) {
    var i, ch;
	if (count == len) {
        permArr.push(usedChars.slice());
    } else {
		for (i = 0; i < input.length; i++) {
			usedChars.push(input[i]);
			repeatedPermute(input, count + 1, len);
			usedChars.pop();
		}
	}
	return permArr
};

function calculate(numsArr, signsArrArr, target) {
	for(var i = 0; i < signsArrArr.length ; i++) {
		var sum = 0;
		for(var j = 0; j < numsArr.length ; j++) {
			if(j == 0) {
				sum = numsArr[0];
				//console.log('sum = ' + sum);
				continue
			}
			
			if (signsArrArr[i][j - 1] == '+') {
				sum += numsArr[j];
			}
			else if(signsArrArr[i][j - 1] == '-') {
				sum -= numsArr[j];
			}
			else if(signsArrArr[i][j - 1] == '*') {
				sum *= numsArr[j];
			}
			else if(signsArrArr[i][j - 1] == '/') {
				sum /= numsArr[j];
			}
		}
		if (sum == target) {
			//create answer
			
			var anaswer;
			answer = numsArr[0] + signsArrArr[i][0] + numsArr[1];
			for(var j = 1; j < signsArrArr[i].length ; j++) {
				answer += signsArrArr[i][j] + numsArr[j + 1];
			}
			return answer
		} 
	}
	return false
}


//permutation = n!
//repeatedPermutation = n^n
//repeatedPermuationslen = n^len
//permutationLen = n*n-1*..n-len

//console.log(permute([5, 3, 7, 1]));

var permArr = [], usedChars = [];
	
function solver(numbers, target) {
	var signs = ['+','-','/','*'];
	var permN;
	var permS;
	var found = false;
	var answer = "";
	console.log(numbers + " target = " + target);
	outer:
	for(var i = 2; i <= numbers.length; i++) {
		usedChars = [];
		permArr = [];
		permN = permute(numbers, i);
		usedChars = [];
		permArr = [];
		permS = repeatedPermute(signs, 0, i - 1);
		for(var j = 0; j < permN.length; j++) {
			answer = calculate(permN[j], permS, target);
			if (answer) {
				found = true;
				break outer; 
			}
		}
		
	}
	if (found) {
		return answer;
	}
}


