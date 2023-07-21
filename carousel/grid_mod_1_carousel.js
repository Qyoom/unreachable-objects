console.log('grid_mod_1_carousel.js');

/*
 * Spacial parameters
 */

/* const windowSize = {
  width: window.innerWidth,
  height: window.innerHeight
} */

/* const svgSize = {
  width: windowSize.width * 0.9,
  height: windowSize.height * 0.82 // 0.90
} */

const vertSpacer = 112; // 115; // 120; // approx space between horizontal lines
const horizSpacer = 87; // 90; // approx space between vertical lines

const numVertLines = Math.floor(svgSize.width / horizSpacer);
const numHorizLines = Math.floor(svgSize.height / vertSpacer);

const vertSpacerAdjust = svgSize.height / numHorizLines;
const horizSpacerAdjust = svgSize.width / numVertLines;

const lineWidth = 7; // 8;

/*
 * Functions, operations
 */

// randomization
function flip() {
  return Math.random() > 0.5;
}

// Catch divide by 0 UTILITY
function dbz(n) {
  return n == 0 ? .0001 : n;
}

// Vertical displacement
function vertDis(n) {
  return flip() ? n + Math.random() * vertSpacerAdjust : n - Math.random() * vertSpacerAdjust;
}

// Horizontal displacement
function horizDis(n) {
  return flip() ? n + Math.random() * horizSpacerAdjust : n - Math.random() * horizSpacerAdjust;
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

https://stackoverflow.com/questions/1484506/random-color-generator
function randomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

/*
 * SVG
 */

 let svg_grid_mod = d3.select("#grid-modern")
  .append("svg")
  // size not responsive
  .attr("width", svgSize.width)
  .attr("height", svgSize.height);

/*
 Bloody hack for generating each new drawing
 Starting over with blunt force. Not using elegant and efficient D3js
*/ 
function genGridModDrawing() {
  console.log('genGridModDrawing');

  svg_grid_mod.remove(); // Must fix per D3 norms

  svg_grid_mod = d3.select("#grid-modern")
    .append("svg")
    .attr("width", svgSize.width)
    .attr("height", svgSize.height);

  /*
  * Element objects
  */
  const vertLines = [];
  const horizLines = [];
  const intersections = [];
  const quads = [];

  /*
  * Assemble data structures
  */

  // Leftmost vertLine
  const leftMostVertLine = {
    endpoints: {
      x1: 0,
      y1: 0,
      x2: 0,
      y2: svgSize.height
    },
    intersections: [],
    quads: []
  }

  vertLines.push(leftMostVertLine); // Order matters, this has to be first

  // Assemble vertical lines
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

    vertLines.push(vertLine);
  }

  // Rightmost vertLine
  const rightMostVertLine = {
    endpoints: {
      x1: svgSize.width,
      y1: 0,
      x2: svgSize.width,
      y2: svgSize.height
    },
    intersections: [],
    quads: []
  }

  vertLines.push(rightMostVertLine); // Order matters, this has to be last

  // topmost horizLine
  const topmostHorizLine = {
    endpoints: {
      x1: 0,
      y1: 0,
      x2: svgSize.width,
      y2: 0
    }
  }

  horizLines.push(topmostHorizLine); // Order matters, must come first

  // Assemble horizontal lines
  for (let i = 1; i < numHorizLines; i++) {

    const horizLine = {
      endpoints: {
        x1: 0,
        y1: vertDis(vertSpacerAdjust * i),
        x2: svgSize.width,
        y2: vertDis(vertSpacerAdjust * i)
      }
    }

    horizLines.push(horizLine);
  }

  // Bottommost horizLine
  const bottommostHorizLine = {
    endpoints: {
      x1: 0,
      y1: svgSize.height,
      x2: svgSize.width,
      y2: svgSize.height
    }
  }

  horizLines.push(bottommostHorizLine); // Order matters, must come last

  /*
  * Quads
  */

  // Combinatorial intersections
  vertLines.forEach(vertLine => {
    horizLines.forEach(horizLine => {
      const intersection = findIntersection(vertLine.endpoints, horizLine.endpoints);
      
      vertLine.intersections.push(intersection); // because of lifo, reads left to right (x,y)
    });
  });

  // Create quads
  // Loop vertical lines
  for (let vi = 0; vi < vertLines.length - 1; vi++) { // length minus 1 used until border quads are added.
    const vertLine = vertLines[vi];
    
    // Loop intersections
    for (let ii = 0; ii < vertLine.intersections.length -1; ii++) {
      // This is the heart of the matter
      // Assumes quadrilateral polygon, but seems to work with triangles. More analysis needed.
      const quad = {
        upLeftCorner: vertLine.intersections[ii],
        upRightCorner: vertLines[vi + 1].intersections[ii],
        dnLeftCorner: vertLine.intersections[ii + 1],
        dnRightCorner: vertLines[vi + 1].intersections[ii + 1]
      }

      vertLine.quads.push(quad); // not used
      quads.push(quad);
    }
  }

  /*
  * SVG
  */

  // Display quads
  // https://stackoverflow.com/questions/13204562/proper-format-for-drawing-polygon-data-in-d3
  svg_grid_mod.selectAll(".quad")
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

  // Display horizontal lines
  svg_grid_mod.selectAll('.horizLine')
    .data(horizLines)
    .enter()
    .append('line')
    .attr('class', 'horizLine')
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

  // Display vertical lines
  svg_grid_mod.selectAll('.vertLine')
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

    const border = svg_grid_mod.append('rect')
    .style("stroke", "rgb(0 0 0)") // b&w
    .style("stroke-width", lineWidth * 2)
    .attr("fill", "none")
    .attr("width", svgSize.width)
    .attr("height", svgSize.height);
} // end genDrawing

/*
 * Page load
 */

// Entry point, called once on pageload and subsequently by click event handler.
genGridModDrawing()




