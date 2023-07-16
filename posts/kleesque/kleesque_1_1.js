console.log('kleesque_1_1.js');

/*
 * Spacial parameters
 */

const windowSize = {
  width: window.innerWidth,
  height: window.innerHeight
}

const svgSize = {
  width: windowSize.width * 0.90,
  height: windowSize.height * 0.90
}

const vertSpacer = 120; // approx space between horizontal lines
const horizSpacer = 90; // approx space between vertical lines

const numVertLines = Math.floor(svgSize.width / horizSpacer);
const numHorizLines = Math.floor(svgSize.height / vertSpacer);

const vertSpacerAdjust = svgSize.height / numHorizLines;
const horizSpacerAdjust = svgSize.width / numVertLines;

const lineWidth = 8;

const vertLines = [];
const horizLines = [];
const intersections = [];
const quads = [];

/*
 * Functions, operations
 */

// randomization
const flip = Math.random() > 0.5;

// Catch divide by 0 UTILITY
function dbz(n) {
  return n == 0 ? .0001 : n;
}

// Vertical displacement
function vertDis(n) {
  return flip ? n + Math.random() * vertSpacerAdjust : n - Math.random() * vertSpacerAdjust;
}

// Horizontal displacement
function horizDis(n) {
  return flip ? n + Math.random() * horizSpacerAdjust : n - Math.random() * horizSpacerAdjust;
}

// Find Intersection of two lines
// https://plantpot.works/8673
function findIntersection(line1, line2) {

  const slope1 = (line1.y2 - line1.y1) / dbz(line1.x2 - line1.x1);
  const yIntercept1 = line1.y1 - slope1 * line1.x1;
  
  const slope2 = (line2.y2 - line2.y1) / dbz(line2.x2 - line2.x1);
  const yIntercept2 = line2.y1 - slope2 * line2.x1;

  const x = (yIntercept2 - yIntercept1) / dbz(slope1 - slope2);
  const y = slope1 * x + yIntercept1;

  return { x, y };
}

/*
 * SVG
 */
const svg = d3.select("#drawing")
  .append("svg")
  .attr("width", windowSize.width * 0.90)
  .attr("height", windowSize.height * 0.90);

const border = svg.append('rect')
  .style("stroke", "rgb(0 0 0)") // b&w
  .style("stroke-width", lineWidth * 2)
  .attr("fill", "none")
  .attr("width", windowSize.width * 0.90)
  .attr("height", windowSize.height * 0.90);

// Append vertical lines
for (let i = 1; i < numVertLines; i++) {

  const vertLine = {
    endpoints: {
      x1: horizDis(horizSpacerAdjust * i),
      y1: 0,
      x2: horizDis(horizSpacerAdjust * i),
      y2: svgSize.height
    },
    intersections: [],
    quads: []
  }

  /* svg.append('line')
    .style("stroke", "rgb(0 0 0)")
    .style("stroke-width", lineWidth)
    .attr("x1", vertLine.endpoints.x1)
    .attr("y1", vertLine.endpoints.y1)
    .attr("x2", vertLine.endpoints.x2)
    .attr("y2", vertLine.endpoints.y2); */

  vertLines.push(vertLine);
}

// Append horizontal lines
for (let i = 1; i < numHorizLines; i++) {

  const horizLine = {
    endpoints: {
      x1: 0,
      y1: vertDis(vertSpacerAdjust * i),
      x2: svgSize.width,
      y2: vertDis(vertSpacerAdjust * i)
    }
  }

  svg.append('line')
    .style("stroke", "rgb(0 0 0)")
    .style("stroke-width", lineWidth)
    .attr("x1", horizLine.endpoints.x1)
    .attr("y1", horizLine.endpoints.y1)
    .attr("x2", horizLine.endpoints.x2)
    .attr("y2", horizLine.endpoints.y2);

  horizLines.push(horizLine);
}

// Combinatorial intersections
vertLines.forEach(vertLine => {
  horizLines.forEach(horizLine => {
    const intersection = findIntersection(vertLine.endpoints, horizLine.endpoints);
    
    vertLine.intersections.push(intersection); // because of lifo, reads left to right (x,y)

    // Diagnostic: Red dot at the intersections
    /* const intrsctCircle = svg.append('circle')
      .style("stroke", "rgb(0 0 0)")
      .attr('cx', intersection.x)
      .attr('cy', intersection.y)
      .attr('r', 5)
      .style('fill', 'red'); */
  });

  //console.log('vertLine.intersections:', vertLine.intersections);
  //console.log('vertLine:', vertLine);
});

console.log('-------Quads-------');

// Loop vertical lines
for (let vi = 0; vi < vertLines.length - 1; vi++) { // length minus 1 used until border quads are added.
  const vertLine = vertLines[vi];
  //console.log('vertLine:', vertLine);
  
  // Loop intersections
  for (let ii = 0; ii < vertLine.intersections.length - 1; ii++) {
    const quad = {
      upLeftCorner: vertLine.intersections[ii],
      upRightCorner: vertLines[vi + 1].intersections[ii],
      dnLeftCorner: vertLine.intersections[ii + 1],
      dnRightCorner: vertLines[vi + 1].intersections[ii + 1]
    }

    vertLine.quads.push(quad);
    quads.push(quad);
  }

  //console.log('quads:', vertLine.quads);
}

console.log('quads:', quads);

https://stackoverflow.com/questions/1484506/random-color-generator
function randomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// Display quads
// https://stackoverflow.com/questions/13204562/proper-format-for-drawing-polygon-data-in-d3
svg.selectAll(".quad")
  .data(quads)
  .enter()
  .append("polygon")
  .attr('class', 'quad')
  .attr("points",function(d) {
    return[
      [d.upLeftCorner.x, d.upLeftCorner.y],
      [d.upRightCorner.x, d.upRightCorner.y], 
      [d.dnRightCorner.x, d.dnRightCorner.y], 
      [d.dnLeftCorner.x, d.dnLeftCorner.y]
    ];})
  .attr('fill', function(d) { return randomColor(); });

// Display vertical lines
svg.selectAll('.vertLine')
  .data(vertLines)
  .enter()
  .append('line')
  .attr('class', 'vertLine')
  .style("stroke", "rgb(0 0 0)")
  .style("stroke-width", lineWidth)
  .attr("x1", function(d) {
    return d.endpoints.x1;
  })
  .attr("y1", function(d) {
    return d.endpoints.y1;
  })
  .attr("x2", function(d) {
    return d.endpoints.x2
  })
  .attr("y2", function(d) {
    return d.endpoints.y2;
  });





