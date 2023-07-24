console.log('harlequin_1_carousel.js');

function HarlequinDrawing() {

  const windowSize = {
    width: window.innerWidth,
    height: window.innerHeight
  };

  const svgSize = {
    width: windowSize.width * 0.9,
    height: windowSize.height * 0.82 // 0.90
  }

  // Line generator
  const lineGen = d3.line()

  // SVG dimensions
  // const svgWidth_harlequin = 390;
  // const svgHeight_harlequin = 500;
  const svgWidth_harlequin = svgSize.width * .37;
  const svgHeight_harlequin = svgSize.height;

  // SVG
  const svg_harlequin = d3.select("#harlequin")
    .append("svg")
    .attr("width", svgWidth_harlequin) // Not responsive
    .attr("height", svgHeight_harlequin);
    // .attr('viewBox', `0 0 ${svgWidth} ${svgHeight}`); // appropriately responsive for small screens with portrait orientation.

  // Path element
  const pathContex = svg_harlequin.append("path");

  function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  function randomNumFromInterval(min, max) { // min and max included 
    return Math.random() * (max - min + 1) + min;
  }

  // Start and End points of the diagonal line
  const genEndPts = (width, height) => {
    const half = width / 2;
    const leftX = Math.floor(Math.random() * half);
    const rightX = half + (Math.floor(Math.random() * half));

    const topLeft = {x: leftX, y: 0};
    const topRight = {x: rightX, y: 0};
    const bottomLeft = {x: leftX, y: height};
    const bottomRight = {x: rightX, y: height};

    const flip = Math.random() > 0.5;
    return flip ? [topLeft, bottomRight] : [topRight, bottomLeft];
  }

  // Slope
  function svgSlope(A, B) {
    const x1 = A.x;
    const y1 = A.y;
    const x2 = B.x;
    const y2 = B.y;
    const s = (y2 - y1) / (x2 - x1);
    return s;
  }

  // Find x given y
  const findX = (A, slope) => (y2) => {
    const x1 = A.x;
    const y1 = A.y;
    const x2 = ((y2 - y1) / slope) + x1;
    return x2;
  }

  // De-regularizing the spaces (distances) between Y coordinates
  const deregY = (y) => (dy) => {
    return Math.random() > 0.5 ? // flip a coin as to whether to move y up or down
      (y + dy * 0.5 * Math.random()) : // move y up a little
      (y - dy * 0.5 * Math.random());  // move y down a little
  }

  const pointPos = (sx, i) => {
    // 1:left, 0:right
    const side = i & 1;
    const px = side ? Math.random() * sx : sx + ((svgWidth_harlequin - sx) * Math.random());
    return px;
  }

  // Random integer output each time called
  let numSegmts = () => randomIntFromInterval(4, 16); /* called from activate function

  /* 
  * Returns array of objects with coordinates.
  */
  const pathGenerator = (startPoint, endPoint) => numSegmts => {
    const dx = (endPoint.x - startPoint.x) / numSegmts; 
    const dy = (endPoint.y - startPoint.y) / numSegmts;
    const slope = svgSlope(startPoint, endPoint);

    const interiorPoints = [];

    // generate interior points
    for (let i = 1; i < numSegmts; i++) {
      const x = startPoint.x + i * dx; // this x is not relevant nor used
      const y = deregY(startPoint.y + i * dy)(dy); // accentuated randomized y adjustment
      const sx = findX(startPoint, slope)(y); // x at y on slope
      const px = pointPos(sx, i); // accentuated randomized x adjustment

      interiorPoints.push({
        x: x, 
        y: y,
        sx: sx, // x that lies on the slope at y
        px: px  // x that is modified to stick out as a point where two line segments meet
      });

      // x coordinate for first and last points is not modified
      startPoint.sx = startPoint.x;
      endPoint.sx = endPoint.x;
      startPoint.px = startPoint.x;
      endPoint.px = endPoint.x;
    }
    return [startPoint, ...interiorPoints, endPoint];
  }

  // Path Drawing

  const dur = 1000; // transition duration

  // Activation function
  function generate() {
    // console.log('generate');
    
    [A, B] = genEndPts(svgWidth_harlequin, svgHeight_harlequin);

    const pathObjs = pathGenerator(A, B)(numSegmts()); // call to the orchestrator
    const pathCoords = pathObjs.map(obj => [obj.px, obj.y]); // simple [x, y] coordinates
    let path = lineGen(pathCoords);

    d3.select('path')
      .attr('d', path);

    svg_harlequin.selectAll('circle')
    .data(pathObjs)
    .join(
      enter => enter.append('circle'),
      update => update,
      exit => exit.remove()
    )
    .attr('cx', function(d, i){
      return d.px;
    })
    .attr('cy', function(d){
      return d.y;
    })
    .attr('r', 3)
    .style('fill', 'red');
  } // end generate

  return {
    generate: generate
  }
}

