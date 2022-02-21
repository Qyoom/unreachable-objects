/*** PARAMETERS ***/
//var data = new Array();
// var xpos = 1; //starting xpos and ypos at 1 so the stroke will show when we make the grid below
// var ypos = 1;
var cellSize = 70;
var numRows = 4;
var numCols = 4;
var up, left = -cellSize;
var down, right = cellSize;
var transitionDuration = 500;

/*** SVG ***/
var svg = d3.select("#grid")
	.append("svg")
	.attr("width", (numCols * cellSize) + 2 + "px")
  .attr("height", (numRows * cellSize) + 2 + "px");

/*** DATA ***/

// Generate 1-D data. This reference called just once per game. 
// This 1-D array should be persistant as records the number sort throughout the game.
var numbers = cellNumbers();
// Transforms data into 2-D array of dicts with added parameters. Called on each "play" (cell move).
var gridData = generateGridData(numbers);
// initial drawing of grid
updateGridData(gridData)

// Display numbers on page
document.getElementById("current_sort").innerHTML = "Current sort: " + numbers.toString();

/*** FUNCTIONS ***/
  
// Selection.join pattern, D3v5
function updateGridData(gridData) {
  console.log("---updateGridData---------------------")

  // update, data[0], rows
  var cells = svg.selectAll(".cell")
    .data(gridData, function(d) { 
      //console.log(`${d.id}`);
      return d.id })
    .join(
      // This function has a single parameter (by convention named enter) which is a selection of entering elements.
      function(enter) { // on 1st pass enter contains all (five) rows (arrays), each with all (5) columns (arrays of dict per column).
        console.log("join enter:");
        console.log(enter);

        return enter.append("g")
          .attr("class", function(d) { // At enter/append, d becomes the cell dicts.
            if(d.id != -1) {
              return "number cell "
            } else {
              return "space cell" // id -1
            }
          })
          .each(function(d) {
            if(d.id != -1) { // filtering out the space data. Unfortunately not able to figure out how to select it properly.
              // append rect (except for space), a hack, I believe
              d3.select(this) // group element
                .append("rect")
                .attr("x", function(d) { return d.x; })
                .attr("y", function(d) { return d.y; })
                .attr("width", function(d) { return d.width; })
                .attr("height", function(d) { return d.height; })
                .style("fill", "#222")
                .style("stroke", "#fff");

              // append number text (except for space), a hack, I believe
              d3.select(this)
                .append("text")
                .text(function(d) { return d.id; })
                .attr("font-family", "sans-serif")
                .attr("font-size", "40px")
                .attr("fill", "#fff")
                .attr("text-anchor", "middle")
                .attr("x", function(d) { return d.x + 35; })
                .attr("y", function(d) { return d.y + 48; });

              // click handler
              d3.select(this)
                .on('click', function(d) {
                  console.log(">>>on click");
                  clickedCellData = d; // more specific label for clarity
                  spaceData = d3.select(".space").data()
                  spaceCellData = Object.entries(spaceData)[0][1]; // TODO: This is the only way so far I've been able to access the space data via d3.select. So I'm doing something wrong structurally.
            
                  if(isSpaceNeighbor(clickedCellData, spaceCellData)) {
                    swapNumberData(clickedCellData, spaceCellData, numbers);
                    newGridData = generateGridData(numbers);
                    updateGridData(newGridData);
                  }
                }); // end on click
          }}); // end each
      }, // end enter

      function(update) { // on first pass group is empty and this each (below) isn't activated.
        console.log("join update:");
        console.log(update);

        return update
          .each(function(d) {
            rect = d3.select(this) // group svg element
              .select("rect")
                .transition()
                .duration(transitionDuration)
                .attr("x", function(d) { return d.x; })
                .attr("y", function(d) { return d.y; });

            text = d3.select(this) // group svg element
              .select("text")
                .transition()
                .duration(transitionDuration)
                .attr("text-anchor", "middle")
                .attr("x", function(d) { return d.x + 35; })
                .attr("y", function(d) { return d.y + 48; });
            }); 
      }, // end join update

      function(exit) { // should always be empty
        return exit;
      } // end join exit
    ); // end join

  // Display numbers on page
  document.getElementById("current_sort").innerHTML = "Current sort: " + numbers.toString();
   
} // end updateGridData

function swapNumberData(clickedCellData, spaceCellData, numbers) {
  console.log("---swapNumberData---")
  // Transfer Parameter Values
  clkId = clickedCellData["id"];
  spcId = spaceCellData["id"];

  clkIdIdx = numbers.indexOf(clkId);
  spcIdIdx = numbers.indexOf(spcId);

  numbers[clkIdIdx] = spcId;
  numbers[spcIdIdx] = clkId;

  console.log("numbers:");
  console.log(numbers);
}

function isSpaceNeighbor(clickedCellData, spaceCellData) {
  console.log("---isSpaceNeighbor---");
  clkRow = clickedCellData.row;
  clkCol = clickedCellData.col;
  spcRow = spaceCellData.row;
  spcCol = spaceCellData.col;

  vertHorizCheck = (clkRow === spcRow) ^ (clkCol === spcCol);
  vertDistCheck = Math.abs(clkRow - spcRow) < 2;
  horizDistCheck = Math.abs(clkCol - spcCol) < 2;
  distCheck = vertDistCheck && horizDistCheck;
  bothChecks = vertHorizCheck && distCheck;

  console.log(`Boolean(bothChecks) ${Boolean(bothChecks)}`);

  return Boolean(bothChecks);
} // end isSpaceNeighbor

// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
// https://bost.ocks.org/mike/shuffle/
function shuffle(array) {
  console.log("---shuffle---");

  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

/*
  Sequential Integers, then shuffled.
  Addition of -1 represents space in data array. [I would like to do away with this "magic number."]
*/
function cellNumbers() {
  console.log("---cellNumbers---");
  cellNums = Array.from(Array((numRows * numCols)-1), (_, i) => i + 1); // 1 through size of grid
  cellNums.push(-1); // space id
  cellNumsShuffled = shuffle(cellNums);
  console.log("cellNums:");
  console.log(cellNums);
  return cellNumsShuffled;
}

/*
  Generate data. Called each time a legitimate cell is "slid/moved."
  This is where data sequence 1...N is transfered from a 1-D two 2-D structure.
  numbers arg is reordered throughout the game by swaping pairs of elements (clicked cell, space cell).
*/
function generateGridData(numbers) {
  console.log("---generateGridData---");

  var xpos = 1; //starting xpos and ypos at 1 so the stroke will show when we make the grid below
  var ypos = 1;

  data = new Array()

	// iterate for rows	
	for (var row = 0; row < numRows; row++) {
    // I WANT TO SEE IF I CAN AVOID 2-D. WANT TO KEEP IT FLAT!
    //data.push( new Array() ); // per row
		
		// iterate for cells/columns inside rows
		for (var column = 0; column < numCols; column++) {
      cellData = {
				x: xpos,
				y: ypos,
				width: cellSize,
        height: cellSize,
        id: numbers[(column) + (numCols * row)],
        row: row,
        col: column
      };
      if(cellData.id === -1) {
        spaceCellData = cellData; // TODO: I've come up with a way where I can access this specific datum with D3.select so this may not be necessary here.
      }
			data.push(cellData);
			// increment the x position. I.e. move it over by width variable.
			xpos += cellSize;
		} // end iter cols
		// reset the x position after a row is complete
		xpos = 1;
		// increment the y position for the next row. Move it down 50 (height variable)
		ypos += cellSize;	
  } // end iter rows

  console.log("data:");
  console.log(data);

	return data;
} // end generateGridData
