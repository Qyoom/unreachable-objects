/*
  This file has: 
  Ability to generate random colors.
  Automatic update interval.
  Select random cell.
  Update cell fill.
  Select random neighbor.
  Determine similarity.
  Adopt a trait (rgb value) per similarity based probability.
*/

// Window Size
var innerWidth = window.innerWidth;
var innerHeight = window.innerHeight;

// PARAMETERS
var data = new Array();
var xpos = 1; //starting xpos and ypos at 1 so the stroke will show when we make the grid below
var ypos = 1;
// var numRows = 6;
// var numCols = 10;
var numRows = 12;
var numCols = 20;
var cellSize = innerWidth <= innerHeight ? Math.floor(innerWidth / numCols) : Math.floor(innerHeight / numRows);

// https://stackoverflow.com/questions/1527803/generating-random-whole-numbers-in-javascript-in-a-specific-range
function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randProbability(min=0, max=1) {
  return Math.random() * (max - min) + min;
}

function randColor() {
	res = [getRandomInt(0, 255), getRandomInt(0, 255), getRandomInt(0, 255)];
	//console.log(res)
	return res;
}

// http://www.cagrimmett.com/til/2016/08/17/d3-lets-make-a-grid.html
// https://bl.ocks.org/cagrimmett/07f8c8daea00946b9e704e3efcbd5739
function gridData() {
	// iterate for rows	
	for (var row = 0; row < numRows; row++) {
		data.push( new Array() );
		
		// iterate for cells/columns inside rows
		for (var column = 0; column < numCols; column++) {
			data[row].push({
				x: xpos,
				y: ypos,
				width: cellSize,
				height: cellSize,
				fill: randColor()
			})
			// increment the x position. I.e. move it over by width variable.
			xpos += cellSize;
		}
		// reset the x position after a row is complete
		xpos = 1;
		// increment the y position for the next row. Move it down (height variable)
		ypos += cellSize;	
  }
	return data;
} // end gridData

var gridData = gridData();	
//console.log(gridData);

var grid = d3.select("#axelrod-color")
	.append("svg")
	.attr("width", numCols * cellSize + "px")
	.attr("height", numRows * cellSize + "px");
  
var rows = grid.selectAll(".row")
	.data(gridData) // RW: D3 sees numRows data elements to iterate over (each an [nested] array). It iterates over the numRows data elements (arrays) and creates numRows corresponding group elements.
	.enter().append("g")
	.attr("class", "row");
  
// RW: Note the 2nd selection layer to handle/process nested array structures.
var columns = rows.selectAll(".square") // RW: Iteration over all rows. rows are the group elements which have been assigned to each of the numRows nested arrays. Again, what data and enter process as args is the immediate array (iterable). Note that assignment to columns is never used.
	.data(function(d) { return d; }) // RW: Now data/enter is bound to each dictionary within each of the row arrays.
	.enter().append("rect") // Associate a rect with each dictionary.
	.attr("class","square")
	.attr("x", function(d) { return d.x; }) // d called in the above data function provides reference to each dictionary item.
	.attr("y", function(d) { return d.y; })
	.attr("width", function(d) { return d.width; })
	.attr("height", function(d) { return d.height; })
  .style("fill", function(d) {
		return "rgb(" + d.fill[0] + "," + d.fill[1] + "," + d.fill[2] + ")"
  });
  
function randomCell() {
  row = getRandomInt(0, numRows-1);
  col = getRandomInt(0, numCols-1);
  return [row, col]; // [y, x] i.e. [vert, horiz] i.e. [outer index, nested index]
}

function randBool() {
  return Math.random() >= 0.5;
}

// https://stackoverflow.com/questions/2532218/pick-random-property-from-a-javascript-object
var randomProperty = function (obj) {
  var keys = Object.keys(obj);
  return obj[keys[ keys.length * Math.random() << 0]];
};

function randomNeighbor(actvIdx) {
  actvRow = actvIdx[0]; // y, N/S
  actvCol = actvIdx[1]; // x, W/E

  dirs = {
    // [y, x] i.e. [row dim, col dim]
    W: [0, -1],
    E: [0, 1],
    S: [1, 0],
    N: [-1, 0]
  }

  // Constrain edge boundaries
  if(actvRow == 0) { delete dirs.N}
  else if(actvRow == numRows-1) { delete dirs.S}
  if(actvCol == 0) { delete dirs.W}
  else if(actvCol == numCols-1) { delete dirs.E}

  // Pick random direction
  neybDir = randomProperty(dirs)
  // Calculate neighbor indexes
  neybIdx = [actvIdx[0] + neybDir[0], actvIdx[1] + neybDir[1]]
  return neybIdx;
} // end randomNeighbor

function calcSimilar(actvCellData, neybCellData) {
  rDiffRatio = 1 - Math.abs((actvCellData.fill[0] / 255) - (neybCellData.fill[0] / 255));
  gDiffRatio = 1 - Math.abs((actvCellData.fill[1] / 255) - (neybCellData.fill[1] / 255));
  bDiffRatio = 1 - Math.abs((actvCellData.fill[2] / 255) - (neybCellData.fill[2] / 255));
  
  simRatio = (rDiffRatio + gDiffRatio + bDiffRatio) / 3; // average diff ratio value
  return simRatio;
} // end calcSimilar

function adoptTrait(actvCellData, neybCellData) {
  rgbChannel = getRandomInt(0, 2);
  actvCellData.fill[rgbChannel] = neybCellData.fill[rgbChannel];
}

function update(data) {
  // Select active cell
  actvIdx = randomCell();
  actvCellData = data[actvIdx[0]][actvIdx[1]]; // dict per [row, col]
  
  // Select Moore neighbor
  neybIdx = randomNeighbor(actvIdx);
  neybCellData = data[neybIdx[0]][neybIdx[1]]; // dict per [row, col]

  similarity = calcSimilar(actvCellData, neybCellData);
  if(randProbability() < similarity) { // falls within probability range
    adoptTrait(actvCellData, neybCellData) 
  }

  var rows = grid.selectAll(".row");

  // update
  rows.selectAll(".square")
    .data(function(d) { return d; })
    .style("fill", function(d) {
      return "rgb(" + d.fill[0] + "," + d.fill[1] + "," + d.fill[2] + ")"
    });
} // end update

// Repeat cycle with local feature adoption
var timer;
var timerCnt = 0;
timer = setInterval(function() {
  update(data);
}, 5);
