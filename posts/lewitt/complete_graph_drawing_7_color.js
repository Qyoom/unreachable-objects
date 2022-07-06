console.log('complete_graph_drawing_7_color.js')

const windowSize = {
  width: window.innerWidth,
  height: window.innerHeight
}

qtyVertices = 40
// qtyVertices = 50

let vertices = []
let pairs = []

// https://medialab.github.io/iwanthue/
const rgbColors = [
[72,148,64],
[194,66,214],
[119,216,71],
[108,63,207],
[209,223,67],
[83,92,200],
[218,176,59],
[167,113,220],
[104,221,140],
[218,79,185],
[202,220,124],
[143,56,139],
[140,148,51],
[98,134,210],
[220,58,38],
[99,216,192],
[210,58,86],
[93,183,203],
[222,101,51],
[147,181,224],
[205,129,55],
[99,81,140],
[199,229,173],
[216,76,139],
[64,97,49],
[211,146,211],
[138,170,117],
[149,65,96],
[187,214,206],
[146,65,39],
[65,123,110],
[220,122,120],
[70,104,132],
[222,184,134],
[111,81,87],
[226,181,197],
[117,96,43],
[159,132,160],
[132,138,114],
[175,129,107]]

/**
 * Utilities
 */
function randomNumFromInterval(min, max) { // min and max included 
  return Math.random() * (max - min + 1) + min
}

function randomIntFromInterval(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min)
}

/**
 * SVG
 */
const svg = d3.select("#lewitt-color-drawing")
  .append("svg")
    // .attr("width", windowSize.width - 20) // Not responsive
    // .attr("height", windowSize.height * 0.87)
    .attr("width", windowSize.width * 0.4) // Narrower canvas
    .attr("height", windowSize.height * 0.87)
    .style("background-color", "#fff3e3")

// https://www.freshconsulting.com/insights/blog/d3-js-gradients-the-easy-way/
const svgDefs = svg.append('defs');

/**
 * generate vertices and edges
 */
function genGraphData() {
  vertices = []
  pairs = []

  // Generate vertices
  for (let i = 1; i <= qtyVertices; i++) {
    vertices.push({
      // x: randomIntFromInterval(10, windowSize.width - 20),
      x: randomIntFromInterval(10, windowSize.width * 0.4 -10),
      y: randomIntFromInterval(10, windowSize.height * 0.85),
      rgb: rgbColors[i], // unique color
      id: i
    })
  }
  // console.log(vertices)

  // Assemble combinatorially complete pairs of vertices
  for (let i = 0; i < vertices.length; i++) {
    for (let j = i+1; j < vertices.length; j++) {
      if (vertices[i] != vertices[j]) {
        const id = i + "_" + j
        pairs.push({
          v1: vertices[i],
          v2: vertices[j],
          id: id
        }) // end pairs push

        var gradient = svgDefs.append("linearGradient")
            .attr("id", id)
            .attr("x1", "0%")
            .attr("x2", "100%")
            .attr("y1", "0%")
            .attr("y2", "100%")

        gradient.append("stop")
            // .attr('class', 'start')
            .attr("offset", "0%")
            // .attr("stop-color", `rgb(${rgbColors[i][0]} ${rgbColors[i][1]} ${rgbColors[i][2]} / 70%`)
            .attr("stop-color", `rgb(${rgbColors[i][0]} ${rgbColors[i][1]} ${rgbColors[i][2]}`)
            // .attr("stop-opacity", 1)
            .attr("stop-opacity", 0.75)

        gradient.append("stop")
            // .attr('class', 'end')
            .attr("offset", "100%")
            // .attr("stop-color", `rgb(${rgbColors[j][0]} ${rgbColors[j][1]} ${rgbColors[j][2]} / 70%`)
            .attr("stop-color", `rgb(${rgbColors[j][0]} ${rgbColors[j][1]} ${rgbColors[j][2]}`)
            // .attr("stop-opacity", 1)
            .attr("stop-opacity", 0.75)
      } // end if
    } // end inner for loop
  } // end outer for loop
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
        // .style("stroke", "rgb(85 85 85 / 70%") // b&w
        .attr("stroke", function(d) { // color
          return `url(#${d.id})`
        })
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
        // .style("stroke", "rgb(85 85 85 / 70%") // b&w
        .attr("stroke", function(d) { // color
          return `url(#${d.id})`
        })
        .style("stroke-width", 1)
        .transition().duration(1000)  // HACK: THIS IS THE ONLY DIFFERENCE
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

