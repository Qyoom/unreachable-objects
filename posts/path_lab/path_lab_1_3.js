console.log('path_lab_1_3.js');
// https://www.geeksforgeeks.org/d3-js-line-method/
// https://observablehq.com/@d3/d3-line

// Line generator
const gen = d3.line();

// Points
const ptsBegin = [
  [250, 0],
  [250, 30],
  [250, 50],
  [250, 125],
  [250, 125],
  [250, 175],
  [250, 175],
  [250, 225],
  [250, 275],
  [250, 300],
  [250, 325],
  [250,375],
  [250,400],
  [250, 500],
  [250, 500]
];

const ptsEnd = [
  [200, 0],
  [20, 30],
  [400, 50],
  [175, 125],
  [350, 125],
  [100, 175],
  [500, 175],
  [200, 225],
  [450, 275],
  [125, 300],
  [450, 325],
  [0,375],
  [500,400],
  [150, 500],
  [500, 500]
];

// Path
const pathBegin = gen(ptsBegin);
const pathEnd = gen(ptsEnd);

// SVG
const svg = d3.select("#lab_space")
  .append("svg")
  .attr("width", 500)
  .attr("height", 500);

// Path element
const pathContex = svg.append("path");

const dur = 1000; // transition duration

function activateImage() {
  d3.select('path')
  .attr('d', pathBegin)
  .transition()
  .duration(dur)
  .attr('d', pathEnd);
}

