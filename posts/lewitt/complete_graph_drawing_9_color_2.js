console.log('complete_graph_drawing_9_color_lab_2.js')

const windowSize = {
  width: window.innerWidth,
  height: window.innerHeight
}

qtyVertices = 40
// qtyVertices = 50

const vertices = []
const pairs = []

// 40 colors
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
    .attr("width", windowSize.width * 0.4) // Narrower canvas
    .attr("height", windowSize.height * 0.87)
    .style("background-color", "#fff3e3")

// https://www.freshconsulting.com/insights/blog/d3-js-gradients-the-easy-way/
const svgDefs = svg.append('defs');

/**
 * Create and combine vertices
 * Run only once on page load
 */
function combineVertices() {
  // console.log("combineVertices TOP")
  // Generate vertices
  for (let i = 0; i < qtyVertices; i++) {
    vertices.push({
      // x: randomIntFromInterval(10, windowSize.width - 20),
      // x: randomIntFromInterval(10, windowSize.width * 0.4 -10),
      // y: randomIntFromInterval(10, windowSize.height * 0.85),
      rgb: rgbColors[i], // unique color
      id: i
    })
  } // end generate vertices
  // console.log('vertices:')
  // console.log(vertices)

  // Assemble combinatorially complete pairs of vertices
  for (let i = 0; i < vertices.length; i++) {
    // console.log('combineVertices, outer for loop')
    for (let j = i+1; j < vertices.length; j++) {
      // console.log('combineVertices, inner for loop')
      // if (vertices[i.id] != vertices[j.id]) { // This should always be true
        // console.log('combineVertices, inside if self check')
        const pair = {
          v1: vertices[i],
          v2: vertices[j],
          id: i + "_" + j
        }
        // console.log('pair:', pair)
        pairs.push(pair)
      // } // end pairing (end if - self pairing check)
    } // end inner loop
  } // end outer loop
  // console.log('combineVertices BOTTOM, pairs:')
  // console.log(pairs)
} // end combineVertices

/**
 * Create one permanent gradient per pair just once at page load
 */
function loadGradientDefs() {
  // console.log('loadGradientDefs TOP')
  // console.log('pairs:')
  // console.log(pairs)
  // Loop through all pairs
  pairs.forEach(pair => {
    const gradient = svgDefs.append("linearGradient")
        .attr("id", pair.id)
        .attr("x1", "0%")
        .attr("x2", "100%")
        .attr("y1", "0%")
        .attr("y2", "100%")

    gradient.append("stop")
        .attr('class', 'start')
        .attr("offset", "0%")
        // .attr("stop-color", `rgb(${rgbColors[i][0]} ${rgbColors[i][1]} ${rgbColors[i][2]} / 70%`)
        .attr("stop-color", `rgb(${pair.v1.rgb[0]} ${pair.v1.rgb[1]} ${pair.v1.rgb[2]})`)
        // .attr("stop-color", `rgb(${pair.v2.rgb[0]} ${pair.v2.rgb[1]} ${pair.v2.rgb[2]})`)
        // .attr("stop-color", `rgb(${leftVertex.rgb[0]} ${leftVertex.rgb[1]} ${leftVertex.rgb[2]})`)
        // .attr("stop-opacity", 1)
        .attr("stop-opacity", 0.75)

    gradient.append("stop")
        .attr('class', 'end')
        .attr("offset", "100%")
        // .attr("stop-color", `rgb(${rgbColors[j][0]} ${rgbColors[j][1]} ${rgbColors[j][2]} / 70%`)
        .attr("stop-color", `rgb(${pair.v2.rgb[0]} ${pair.v2.rgb[1]} ${pair.v2.rgb[2]})`)
        // .attr("stop-color", `rgb(${rightVertex.rgb[0]} ${rightVertex.rgb[1]} ${rightVertex.rgb[2]})`)
        // .attr("stop-opacity", 1)
        .attr("stop-opacity", 0.75)

    // console.log(gradient)
  }) // end pairs forEach
} // end loadGradientDefs

/**
 * Iterate through pairs and verices on each draw to generate and set coordinates
 */
function genCoordinates() {
  // console.log('genCoordinates TOP')
  pairs.forEach(pair => {
    pair.v1.x = randomIntFromInterval(10, windowSize.width * 0.4 -10)
    pair.v1.y = randomIntFromInterval(10, windowSize.height * 0.85)
    pair.v2.x = randomIntFromInterval(10, windowSize.width * 0.4 -10)
    pair.v2.y = randomIntFromInterval(10, windowSize.height * 0.85)
  })
} // end genCoordinates

function drawFirstGraph() {
  // console.log('drawFirstGraph TOP')
  // Lines
  svg.selectAll('line')
      .data(pairs)
      .join(
        enter => enter.append('line'), // PROBLEM: Need update on key instead of successive enters.
        // update => update,
        update => {
          console.log('update')
          return update
        },
        // exit => exit.remove()
      )
        // .style("stroke", "rgb(85 85 85 / 70%") // b&w
        .attr("stroke", function(d) { // color
          // console.log(d.id) // DIAGNOSTIC
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
  // console.log('drawNewGraph TOP')
  // Lines
  svg.selectAll('line')
      .data(pairs)
      .join(
        enter => enter.append('line'), // PROBLEM: Need update on key instead of successive enters.
        // update => update,
        update => {
          console.log('update')
          return update
        },
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
  combineVertices()
  loadGradientDefs()
  genCoordinates()
  drawFirstGraph() // d3.js enter-update-exit pattern
 }

 /**
 * All subsequent transitions to new vertices data after first static drawing on page delivery
 */
function genNewDrawing() {
  genCoordinates()
  drawNewGraph() // d3.js enter-update-exit pattern (with transition)
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

