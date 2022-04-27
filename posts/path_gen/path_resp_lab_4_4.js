console.log('path_resp_lab_4_4.js');

// Line generator
const lineGen = d3.line()
// const pathBefore = lineGen(ptsBefore);
// const pathAfter = lineGen(ptsAfter);

// SVG dimensions
const svgWidth = 390;
const svgHeight = 500;

// SVG
const svg = d3.select("#drawing")
  .append("svg")
  .attr("width", svgWidth) // Not responsive
  .attr("height", svgHeight);
  // .attr('viewBox', `0 0 ${svgWidth} ${svgHeight}`); // appropriately responsive for small screens with portrait orientation.

// Path element
const pathContex = svg.append("path");

// function activateImage() {
//   d3.select('path')
//   .attr('d', pathBefore)
//   .transition()
//   .duration(dur)
//   .attr('d', pathAfter);
// }

// Start and End points of the diagonal line
const A = {x: 180, y: 0};
const B = {x: 390, y: 500};

// Slope
function svgSlope(A, B) {
  const x1 = A.x;
  const y1 = A.y;
  const x2 = B.x;
  const y2 = B.y;
  const s = (y2 - y1) / (x2 - x1);
  return s;
}

const slope = svgSlope(A, B);

// Find x given y
const findX = (A, slope) => (y2) => {
  const x1 = A.x;
  const y1 = A.y;
  const x2 = ((y2 - y1) / slope) + x1;
  return x2;
}

// Tests
// console.log('s:', svgSlope(A, B));
// const xGivenY = findX(A, s);
// const res = xGivenY(300);
// console.log('res:', res);

// De-regularizing the spaces (distances) between Y coordinates
const deregY = (y) => (dy) => {
  return Math.random() > 0.5 ? // flip a coin as to whether to move up or down
    (y + dy * 0.5 * Math.random()) : // move y up a little
    (y - dy * 0.5 * Math.random());  // move y down a little
}

const pointPos = (sx, i) => {
  // 1:left, 0:right
  const side = i & 1;
  const px = side ? Math.random() * sx : sx + ((svgWidth - sx) * Math.random());
  return px;
}

// PATH

// Orchestrator
const pathGenerator = (startPoint, endPoint) => numSegmts => {
  const dx = (endPoint.x - startPoint.x) / numSegmts; 
  const dy = (endPoint.y - startPoint.y) / numSegmts;

  const interiorPoints = [];

  // generate interior points
  for (let i = 1; i < numSegmts; i++) {
    const x = startPoint.x + i * dx;
    const y = deregY(startPoint.y + i * dy)(dy);
    const sx = findX(A, slope)(y); // x at y on slope
    const px = pointPos(sx, i);

    interiorPoints.push({
      x: x, 
      y: y,
      sx: sx,
      px: px
    });

    startPoint.sx = startPoint.x;
    endPoint.sx = endPoint.x;
    startPoint.px = startPoint.x;
    endPoint.px = endPoint.x;
  }
  return [startPoint, ...interiorPoints, endPoint];
}

const pathObjs = pathGenerator(A, B)(10);
const pathCoords = pathObjs.map(obj => [obj.px, obj.y]);
const path = lineGen(pathCoords);

// Diagnostic
svg.selectAll('circle')
  .data(pathObjs)
  .enter()
  .append('circle')
  .attr('cx', function(d, i){
    console.log("index", i, d.px, d.y);
    return d.px;
  })
  .attr('cy', function(d){
    return d.y;
  })
  .attr('r', 3)
  .style('fill', 'red');

// Path Drawing

const dur = 1000; // transition duration

d3.select('path')
  .attr('d', path);


