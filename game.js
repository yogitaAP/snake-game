/*
	Author: Yogita SHarma
	Date: 18 Jan 2016
	Time: 12: 22 : 48 AM
*/

//This file contains plain javasrcipt code written for a basic snake game. 

//Initializing game variables

//Direction variables

var left, right, up, down;

//Key Input variables

var left_key, right_key, up_key, down_key;

//Game arena dimensions, defualts: 30 each

var columns = 30, rows = 30;

//Game arena objects

var food = 2, snake = 1, empty = 0;

//Game display variables

var canvas, context, noOfFrames, keyselections, score;	

var snake = {

	array: null,
	tail: null,
	direction: null

	/**
	 * Initializes the array and sets the start position and direction
	 * 
	 * @param  {number} d start direction
	 * @param  {number} i start x-coordinate
	 * @param  {number} j start y-coordinate
	 */
	init: function(d, i, j) {
		this.array = [];
		this.direction = d;
		this.insertCell(i,j);
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


