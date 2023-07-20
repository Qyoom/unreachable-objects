console.log('complete_graph_drawing_6.js')

const windowSize = {
  width: window.innerWidth,
  height: window.innerHeight
};

const qtyVertices = 40;
// qtyVertices = 50;

let vertices = [];
let pairs = [];

/**
 * Utilities
 */
function randomNumFromInterval(min, max) { // min and max included 
  return Math.random() * (max - min + 1) + min;
}

function randomIntFromInterval(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * SVG
 */
const svg = d3.select("#lewitt-bw-drawing")
  .append("svg")
    .attr("width", windowSize.width - 20) // Not responsive
    .attr("height", windowSize.height * 0.87)
    .style("background-color", "#fff3e3")

/**
 * generate vertices and edges
 */
function genGraphData() {
  vertices = []
  pairs = []

  // Generate vertices
  for (let i = 1; i <= qtyVertices; i++) {
    vertices.push({
      x: randomIntFromInterval(10, windowSize.width - 20),
      y: randomIntFromInterval(10, windowSize.height * 0.85),
      id: i
    })
  }
  // console.log(vertices)

  // Assemble combinatorially complete pairs of vertices
  for (let i = 0; i < vertices.length; i++) {
    for (let j = i+1; j < vertices.length; j++) {
      if (vertices[i] != vertices[j]) {
        pairs.push({
          v1: vertices[i],
          v2: vertices[j],
          id: i + "_" + j
        })
      }
    }
  }
  // console.log(pairs)
} // end genGraphData

function drawFirstGraph() {
  // Lines
  svg.selectAll('line')
      .data(pairs)
      .join(
        enter => enter.append('line'), // PROBLEM: Need update on key instead of successive enters.
        // update => update,
        // update => {
        //   console.log('update')
        //   return update
        // },
        // exit => exit.remove()
      )
        .style("stroke", "rgb(85 85 85 / 70%")
        .style("stroke-width", 1)
        // .transition().duration(1000) // HACK: THIS IS THE ONLY DIFFERENCE
        .attr("x1", function(d) {
          return d.v1.x
        })
        .attr("y1", function(d) {
          return d.v1.y
        })
        .attr("x2", function(d) {
          return d.v2.x
        })
        .attr("y2", function(d) {
          return d.v2.y
        });
} // end drawFirstGraph

function drawNewGraph() {
  // Lines
  svg.selectAll('line')
      .data(pairs)
      .join(
        enter => enter.append('line'), // PROBLEM: Need update on key instead of successive enters.
        // update => update,
        // update => {
        //   console.log('update')
        //   return update
        // },
        // exit => exit.remove()
      )
        .style("stroke", "rgb(85 85 85 / 70%")
        .style("stroke-width", 1)
        .transition().duration(1200)  // HACK: THIS IS THE ONLY DIFFERENCE
        .attr("x1", function(d) {
          return d.v1.x
        })
        .attr("y1", function(d) {
          return d.v1.y
        })
        .attr("x2", function(d) {
          return d.v2.x
        })
        .attr("y2", function(d) {
          return d.v2.y
        });
} // drawNewGraph

/**
 * Hack to avoid transition on first drawing with delivery of page.
 */
 function genFirstDrawing() {
  genGraphData()
  drawFirstGraph()
 }

 /**
 * All subsequent transitions to new vertices data after first static drawing on page delivery
 */
function genNewDrawing() {
  genGraphData()
  drawNewGraph()
}

/**
 * Click handler
 */
// https://gomakethings.com/detecting-click-events-on-svgs-with-vanilla-js-event-delegation/
document.addEventListener('click', function (event) {
  if (!event.target.closest('.visualization')) {
    // console.log('no match!')
    return
  }
  // console.log(event.target)
  genNewDrawing() // performs transition
}, false)

// On page delivery. Entry point
genFirstDrawing() // no transition

