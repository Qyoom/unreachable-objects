console.log("rotation_squares_5_1.js")

// Configuration
const cellSize = 100;
const numCols = 4;
const numRows = 4;
const outerPadding = 50;
const innerPadding = 0;
const strokeWidth = 3;

// Initial position values
let xPos = outerPadding;
let xCtrPos = xPos + cellSize / 2;
let yPos = outerPadding;
let yCtrPos = yPos + cellSize / 2;

// Formulating Data-based positioning

// initial cell data
function newCell(xPos, xCtrPos, yPos, yCtrPos) {
  return {
    "xPos": xPos,
    "xCtrPos": xCtrPos,
    "yPos": yPos,
    "yCtrPos": yCtrPos
  }
}

const cellData = [];

// Create data for all remaining cells in grid
for (let row = 0; row < numRows; row++) {
  for (let col = 0; col < numCols; col++) {
    cellData.push(newCell(xPos, xCtrPos, yPos, yCtrPos));
    xPos = xPos + cellSize + innerPadding;
    xCtrPos = xPos + cellSize / 2;
  } // end col loop
  xPos = outerPadding; // reset
  xCtrPos = xPos + cellSize / 2;
  yPos = yPos + cellSize + innerPadding;
  yCtrPos = yPos + cellSize / 2;
} // end row loop

// D3js construction of elements

const svg = d3.select("#squares")
  .append("svg")
    .attr("width", (outerPadding * 2) + (cellSize * numCols) + (innerPadding * (numCols - 1)))
    .attr("height", (outerPadding * 2) + (cellSize * numRows) + (innerPadding * (numRows - 1)));

let cells = svg.selectAll("rect")
  .data(cellData)
  .join(
    function(enter) {
      // console.log("join enter:");
      // console.log(enter);
      return enter.append("rect")
        .attr("x", function(d) { return d.xPos })
        .attr("y", function(d) { return d.yPos})
        .attr("width", cellSize)
        .attr("height", cellSize)
        .on('click', function() {
          d3.select(this)
            .transition()
            .duration(5000)
            .attr("transform", function(d,i) {
              console.log("In transform. d:");
              console.log(d);
              return `rotate(180, ${d.xCtrPos}, ${d.yCtrPos})`;
            });
        }); // end on click
    } // end enter
  ) // end join

function rollCascade() {
  console.log("rollCascade TOP");
  cells
    .transition()
    .delay(function(d, i) { // WORKING
      console.log("In each delay");
      return i*500;
    })
    .duration(4000)
    .attr("transform", function(d,i) {
      console.log("In transform. d:");
      console.log(d);
      return `rotate(180, ${d.xCtrPos}, ${d.yCtrPos})`; // NOT WORKING
    });
} // end rollCascade