console.log('gsap-timeline-squares_4.js');

let squareData = [];

const svgSize = 500;
const stepSize = 10;
const qtySquares = (svgSize / stepSize) / 2;

https://stackoverflow.com/questions/1484506/random-color-generator
function randomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function makeSquareData() {
  console.log("makeSquareData() called");
  squareData = [];
  for (let i = 0; i < qtySquares; i++) {
    squareData.push({
      squareSize: svgSize - (i * stepSize * 2),
      color: randomColor(),
      x: i * stepSize,
      y: i * stepSize
    })
  }
}

const svg = d3.select("#squares")
  .append("svg")
    .attr("width", svgSize)
    .attr("height", svgSize);

function makeSquares() {
  console.log("makeSquares() called");
  const squares = svg.selectAll('.square')
    .data(squareData)
    .join("rect")
      .attr("x", (d) => { return d.x; })
      .attr("y", (d) => { return d.y; })
      .attr("width", (d) => { return d.squareSize; })
      .attr("height", (d) => { return d.squareSize; })
      .attr("fill", (d) => { return d.color })
      .attr("class", 'square');
  // console.log('makeSquares squares:', squares);
}

let tl = gsap.timeline();

function play() {
  console.log("play() called");
  makeSquareData();
  svg.selectAll('.square').remove(); // Not sure of my footing with D3 yet!
  makeSquares();
  tl = null;
  // console.log("play<1> tl: ", tl);
  tl = gsap.timeline();
  // console.log("play<2> tl: ", tl);
  tl.from('.square', {
    rotation: 360,
    transformOrigin: "50%, 50%",
    scale: 0.001,
    duration: 2.5,
    ease: "power1.inOut",
    stagger: 1
  })
  // console.log("play<3> tl: ", tl);
}

function reverse() { 
  console.log("reverse() called");
  tl.reverse();
}




