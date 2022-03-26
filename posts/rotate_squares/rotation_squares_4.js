// Configuration
const cellSize = 200;
const numCols = 2;
const numRows = 2;
const outerPadding = 50;
const innerPadding = 20;
const strokeWidth = 4;

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
      console.log("join enter:");
      console.log(enter);
      return enter.append("rect")
        .attr("x", function(d) { return d.xPos })
        .attr("y", function(d) { return d.yPos})
        .attr("width", cellSize)
        .attr("height", cellSize)
        .on('click', function() {
          d3.select(this)
            .transition()
            .duration(5000)
            .attrTween("transform", rotTween);
        }); // end on click
    } // end enter
  ) // end join

// rotation function (closure)
function rotTween(d) {
  console.log("rotTween d:");
  console.log(d);
  const interp = d3.interpolate(0, 360);
  return function(t) {
    return `rotate(${interp(t)}, ${d.xCtrPos}, ${d.yCtrPos})`;
  };
}