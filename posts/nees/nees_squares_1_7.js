console.log("nees_squares_lab_1_7.js")

// Configuration
const cellSize = 25;
const numCols = 12;
const numRows = 24;
const outerPadding = 30;
const innerPadding = 0;
const rotDur = 3000; // rotation duration

// Initial position values
let xPos = outerPadding;
let xCtrPos = xPos + cellSize / 2;
let yPos = outerPadding;
let yCtrPos = yPos + cellSize / 2;

// Rotation values
let rotDeg = 0; // degree of rotation
let rotDegRange = 0; // range (limit) of degree of rotation
let rotDegRangeStep = 45 / (numCols * numRows); // upper limit of degree of rotation

// Centerpoint values
let xPosAdj = 0;
let yPosAdj = 0;
let posAdjRange = 0; // upper limit of position adjustment range
let posAdjStep = 11 / (numCols * numRows); // position adjustment step

// Formulating Data-based positioning

// cell data object instantiator
function newCell(xPos, xPosAdj, xCtrPos, yPos, yPosAdj, yCtrPos) {
  return {
    "xPos": xPos,
    "xPosAdj": xPosAdj,
    "xCtrPos": xCtrPos,
    "yPos": yPos,
    "yPosAdj": yPosAdj,
    "yCtrPos": yCtrPos,
    "rotDeg": rotDeg
  }
}

const cellData = []; // all cells

// Generate data for all cells in grid
for (let row = 0; row < numRows; row++) { // for each row of cells
  for (let col = 0; col < numCols; col++) { // for each column (cell) in current row
    // Instantiate current cell
    cellData.push(newCell(xPos, xPosAdj, xCtrPos, yPos, yPosAdj, yCtrPos));
    xPos = xPos + cellSize + innerPadding; // advance one col to right
    xCtrPos = xPos + cellSize / 2; // advance one col to right
    // Advance rotation value
    rotDeg = Math.random() * rotDegRange;
    rotDeg = Math.random() < 0.5 ? -rotDeg : rotDeg;
    rotDegRange = rotDegRange + rotDegRangeStep;
    // Advance position adjustment values
    xPosAdj = Math.random() * posAdjRange;
    xPosAdj = Math.random() < 0.5 ? -xPosAdj : xPosAdj;
    yPosAdj = Math.random() * posAdjRange;
    yPosAdj = Math.random() < 0.5 ? -yPosAdj : yPosAdj;
    posAdjRange = posAdjRange + posAdjStep;
  } // end col loop
  xPos = outerPadding; // reset to left-most column
  xCtrPos = xPos + cellSize / 2; // reset to left-most column
  yPos = yPos + cellSize + innerPadding; // advance down one row
  yCtrPos = yPos + cellSize / 2; // advance down one row
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
      return enter.append("rect")
        .attr("x", function(d) { return d.xPos })
        .attr("y", function(d) { return d.yPos})
        .attr("width", cellSize)
        .attr("height", cellSize);
    } // end enter
  ) // end join

// rotation function (closure)
function rotTween(d) { // d is cellData
  const interp = d3.interpolate(0, d.rotDeg);
  return function(t) {
    return `rotate(${interp(t)}, ${d.xCtrPos}, ${d.yCtrPos})`;
  };
}

function activateCascade() {
  cells
  .each(function(d) {
    d3.select(this)
      .transition()
      .attr("x", function(d) { return d.xPos})
      .attr("y", function(d) { return d.yPos})
      .transition()
      .duration(rotDur)
      .attrTween("transform", rotTween)
      .attr("x", function(d) { return d.xPos + d.xPosAdj})
      .attr("y", function(d) { return d.yPos + d.yPosAdj});
  })
} // end rolling cascade