console.log('lewitt_118_color_1_carousel.js')

function Lewitt118ColorDrawing() {

  const windowSize = {
    width: window.innerWidth,
    height: window.innerHeight
  }

  const svgSize = {
    width: windowSize.width * 0.9,
    height: windowSize.height * 0.82 // 0.90
  }

  const qtyVertices_118_color = 40
  // qtyVertices_118_color = 50

  const vertices_118_color = []
  const pairs_118_color = []

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
  const svg_lewitt_118_color = d3.select("#lewitt-118-color")
    .append("svg")
      .attr("width", svgSize.width) // Narrower canvas
      .attr("height", svgSize.height)
      .style("background-color", "#fff3e3")

  const svgDefs = svg_lewitt_118_color.append('defs');

  /**
   * Create and combine vertices
   * Run only once on page load
   */
  function combineVertices() {
    // console.log("combineVertices TOP")
    // Generate vertices
    for (let i = 0; i < qtyVertices_118_color; i++) {
      vertices_118_color.push({
        // Coordinates set in separate function
        rgb: rgbColors[i], // unique color
        id: i
      })
    } // end generate vertices

    // Assemble combinatorially complete pairs of vertices
    for (let i = 0; i < vertices_118_color.length; i++) {
      for (let j = i+1; j < vertices_118_color.length; j++) {
        const pair = {
          v1: vertices_118_color[i],
          v2: vertices_118_color[j],
          id: i + "_" + j
        }
        pairs_118_color.push(pair)
      }
    }
  } // end combineVertices

  /**
   * Create one permanent gradient per pair just once at page load
   */
  function loadGradientDefs() {
    pairs_118_color.forEach(pair => {
      const gradientLeft = svgDefs.append("linearGradient")
          .attr("id", pair.id + 'l')
          .attr("x1", "0%")
          .attr("x2", "100%")
          .attr("y1", "0%")
          .attr("y2", "100%")

      gradientLeft.append("stop")
          .attr('class', 'start')
          .attr("offset", "0%")
          .attr("stop-color", `rgb(${pair.v1.rgb[0]} ${pair.v1.rgb[1]} ${pair.v1.rgb[2]})`)
          .attr("stop-opacity", 0.75)

      gradientLeft.append("stop")
          .attr('class', 'end')
          .attr("offset", "100%")
          .attr("stop-color", `rgb(${pair.v2.rgb[0]} ${pair.v2.rgb[1]} ${pair.v2.rgb[2]})`)
          .attr("stop-opacity", 0.75)

      // THIS HAS A BAD CODE SMELL, but I'll improve it.
      const gradientRight = svgDefs.append("linearGradient")
          .attr("id", pair.id + 'r')
          .attr("x1", "0%")
          .attr("x2", "100%")
          .attr("y1", "0%")
          .attr("y2", "100%")

      gradientRight.append("stop")
          .attr('class', 'start')
          .attr("offset", "0%")
          .attr("stop-color", `rgb(${pair.v2.rgb[0]} ${pair.v2.rgb[1]} ${pair.v2.rgb[2]})`)
          .attr("stop-opacity", 0.75)

      gradientRight.append("stop")
          .attr('class', 'end')
          .attr("offset", "100%")
          .attr("stop-color", `rgb(${pair.v1.rgb[0]} ${pair.v1.rgb[1]} ${pair.v1.rgb[2]})`)
          .attr("stop-opacity", 0.75)
    }) // end pairs forEach
  } // end loadGradientDefs

  /**
   * Iterate through pairs and verices on each draw to generate and set coordinates
   */
  function genCoordinates() {
    // console.log('genCoordinates TOP')
    pairs_118_color.forEach(pair => {
      pair.v1.x = randomIntFromInterval(10, svgSize.width - 10)
      pair.v1.y = randomIntFromInterval(10, svgSize.height - 20)
      pair.v2.x = randomIntFromInterval(10, svgSize.width - 10)
      pair.v2.y = randomIntFromInterval(10, svgSize.height -20)
    })
  } // end genCoordinates

  function drawFirstGraph() {
    // console.log('drawFirstGraph TOP')
    // Lines
    svg_lewitt_118_color.selectAll('line')
        .data(pairs_118_color)
        .join(
          enter => enter.append('line'), // PROBLEM: Need update on key instead of successive enters.
          update => {
            // console.log('drawFirstGraph update')
            return update
          },
          // exit => exit.remove()
        )
          // .style("stroke", "rgb(85 85 85 / 70%") // b&w
          .attr("stroke", function(d) { // color
            return d.v1.x <= d.v2.x ? `url(#${d.id + 'l'})` : `url(#${d.id + 'r'})`
            // return `url(#${d.id})`
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
          })
  } // end drawFirstGraph

  function drawNewGraph_color() {
    // console.log('drawNewGraph_color TOP')
    // Lines
    svg_lewitt_118_color.selectAll('line')
        .data(pairs_118_color)
        .join(
          enter => enter.append('line'), // PROBLEM: Need update on key instead of successive enters.
          // update => update,
          update => {
            // console.log('drawNewGraph_color update')
            return update
          },
          // exit => exit.remove()
        )
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
          })
          .transition().duration(1000)
          .attr("stroke", function(d) { // color
            return d.v1.x <= d.v2.x ? `url(#${d.id + 'l'})` : `url(#${d.id + 'r'})`
          })
  } // drawNewGraph_color

  /**
   * Hack to avoid transition on first drawing with delivery of page.
   */
  function genFirst118ColorDrawing() {
    // console.log('genFirst118ColorDrawing');
    combineVertices();
    loadGradientDefs();
    genCoordinates();
    drawFirstGraph(); // d3.js enter-update-exit pattern
  }

  /**
   * All subsequent transitions to new vertices data after first static drawing on page delivery
   */
  function genNew118ColorDrawing() {
    genCoordinates()
    drawNewGraph_color() // d3.js enter-update-exit pattern (with transition)
  }

  return {
    genFirst118ColorDrawing: genFirst118ColorDrawing,
    genNew118ColorDrawing: genNew118ColorDrawing
  }
} // end Lewitt118ColorDrawing

