/*
	Author: Yogita SHarma
	Date: 18 Jan 2016
	Time: 12: 22 : 48 AM
*/

//This file contains plain javasrcipt code written for a basic snake game. 

//Initializing game variables

//Direction variables

var left = 0, right = 2, up = 1, down = 3;

//Key Input variables

var left_key = 37, right_key = 39, up_key = 38, down_key = 40;

//Game arena dimensions, defualts: 30 each

var columns = 30, rows = 30;

//Game arena objects

var snakeLength =3, food = 2, snake = 1, empty = 0;

//Game display variables

var canvas, context, noOfFrames, keyselections, score;	

var Snake = {

	array: null,
	tail: null,
	direction: null,

	/**
	 * Initializes the array and sets the start position and direction
	 * 
	 * @param  {number} d start direction
	 * @param  {number} i start x-coordinate
	 * @param  {number} j start y-coordinate
	 */
	initialize: function(d, i, j) {
		this.array = [];
		this.direction = d;
		for(var k=0; k < snakeLength; ++k) {
			this.insertCell(i,j);	
		}
		
	},

	/**
	 * Adds an entry/cell to the array
	 * 
	 * @param  {number} x x-coordinate
	 * @param  {number} y y-coordinate
	 */
	insertCell: function(i, j) {
		this.array.unshift({i:i, j:j});
		this.last = this.array[0];
	},

	/**
	 * 
	 * @return {Object} the first element
	 */
	removeCell: function() {
		return this.array.pop();
	}
};

/**
 * GameArena to store the states of game objects and render the same in it.
 * 
 * @type {Object}
 */
var GameArena = {

	arena: null,
	width: null,
	height: null,

	/*
	 * Initialize the grid with values in specified columns and rows
	 * @param  val, default value
	 * @param   cols, number of columns
	 * @param   rows, number of rows

	*/
	initialize: function(val, cols, rows) {
		this.width = cols;
		this.height = rows;

		this.arena = [];

		for(var i = 0; i < cols; ++i) {
			this.arena.push([]);
			for(var j = 0; j < rows; ++j) {
				this.arena[i].push(val);
			}
		}

	},

	set: function(val, i ,j) {
		this.arena[i][j] = val;
	},

	get: function(i, j) {
		return this.arena[i][j];
	}
};

/**
 * Set a food id at a random free cell in the grid
 */
function setFood() {
	var emptyCells = [];
	
	// finding empty cells
	for (var i=0; i < GameArena.width; ++i) {
		for (var j=0; j < GameArena.height; ++j) {
			if (GameArena.get(i, j) === empty) {
				emptyCells.push({i:i, j:j});
			}
		}
	}

	// selecting one random cell
	var randomPos = emptyCells[Math.round(Math.random()*(emptyCells.length - 1))];
	GameArena.set(food, randomPos.i, randomPos.j);
}

function initializeGameSetup() {
	keyselections = {};
	noOfFrames = 0;
	
	canvas = document.createElement("canvas");
	canvas.width = columns * 15;
	canvas.height = rows * 15;
	context = canvas.getContext("2d");
	context.font = "12px Open_Sans";
	
	document.body.appendChild(canvas);

	document.addEventListener("keydown", function(event) {
		keyselections[event.keyCode] = true;
	});
	document.addEventListener("keyup", function(event) {
		delete keyselections[event.keyCode];
	});

	$('#start-game').show();
}

function startGame() {
	GameArena.initialize(empty, columns, rows)
	score = 0;

	var initPoint = {i: Math.floor(columns/2), j: Math.floor(rows/2)};

	Snake.initialize(up, initPoint.i, initPoint.j);
	GameArena.set(snake, initPoint.i, initPoint.j);

	setFood();
}

function initGameloop() {
	updateArena();
	drawArena();
	window.requestAnimationFrame(initGameloop, canvas);
}

function updateArena() {
	noOfFrames++;

	// changing direction of the snake depending on which keys
	// that are pressed
	if (keyselections[left_key] && Snake.direction !== right) {
		Snake.direction = left;
	}
	if (keyselections[up_key] && Snake.direction !== down) {
		Snake.direction = up;
	}
	if (keyselections[right_key] && Snake.direction !== left) {
		Snake.direction = right;
	}
	if (keyselections[down_key] && Snake.direction !== up) {
		Snake.direction = down;
	}

	// update game state in each 10 frames
	if (noOfFrames % 10 === 0) {
		// pop the last element from the snake queue i.e. the
		// head
		var lastX = Snake.last.i;
		var lastY = Snake.last.j;

		// updates the position depending on the snake direction
		switch (Snake.direction) {
			case left:
				lastX--;
				break;
			case up:
				lastY--;
				break;
			case right:
				lastX++;
				break;
			case down:
				lastY++;
				break;
		}

		// checking gameover conditions
		if (0 > lastX || lastX > GameArena.width-1  ||
			0 > lastY || lastY > GameArena.height-1 ||
			GameArena.get(lastX, lastY) === snake
		) {
			$('#game-over').show();
			$('#start-game').show();
		}

		// check if snake's head collides with food
		if (GameArena.get(lastX, lastY) === food) {
			score++;
			setFood();
		} else {
			// take out the first item from the snake queue i.e
			// the tail and remove id from grid
			var tail = Snake.removeCell();
			GameArena.set(empty, tail.i, tail.j);
		}

		GameArena.set(snake, lastX, lastY);
		Snake.insertCell(lastX, lastY);
	}
}

function updateScore(value) {
	var scoreEle = $('#score');
	scoreEle.find('span').text(value);
}

function drawArena() {
	var cellWidth = canvas.width/GameArena.width;
	var cellHeight = canvas.height/GameArena.height;
	
	for (var i=0; i < GameArena.width; ++i) {
		for (var j=0; j < GameArena.height; ++j) {
			// sets the fillstyle depending on the id of
			// each cell
			switch (GameArena.get(i, j)) {
				case empty:
					context.fillStyle = "#fff";
					break;
				case snake:
					context.fillStyle = "#73c7ab";
					break;
				case food:
					context.fillStyle = "#1697c7";
					break;
			}
			context.fillRect(i * cellWidth, j * cellHeight, cellWidth, cellWidth);
		}
	}
	// changes the fillstyle once more and draws the score
	// message to the canvas

	updateScore(score);
	
	//context.fillStyle = "#000";
	//context.fillText("SCORE: " + score, 10, canvas.height-10);
}

initializeGameSetup();


$('#start-game').click(function(event) {
		$('#game-over').hide();
		startGame();
		initGameloop();
		$(event.target).hide();
	})





