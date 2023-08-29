console.log('gsap-timeline-squares_4.js');

function GsapSquaresDrawing() { // module, closure
  console.log("In GsapSquaresDrawing TOP");

  let squareData = [];

  const svgSize = 500;
  const stepSize = 10;
  const qtySquares = (svgSize / stepSize) / 2;

  let playingFlag = false;
  let playCompleteFlag = false;

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

  const svg = d3.select("#gsap-squares")
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

  let tl = null;

  function play() {
    console.log("play() called");
    makeSquareData();
    svg.selectAll('.square').remove(); // Not sure of my footing with D3 yet!
    makeSquares(); // start with whole new set of rects
    tl = null; // wipe out vestages of previous rects
    tl = gsap.timeline({ 
      onStart: () => console.log("the tween started"),
      onComplete: () => {
        console.log("the tween is complete");
        playingFlag = false;
        playCompleteFlag = true;
      },
      onReverseComplete: () => console.log("the reverse tween is complete")
    });
    tl.from('.square', {
      rotation: 360,
      transformOrigin: "50%, 50%",
      scale: 0.001,
      duration: 2.5,
      ease: "power1.inOut",
      stagger: 1
    });
    playingFlag = true; 
    playCompleteFlag = false;
  } // end play

  function reverse() { 
    console.log("reverse() called");
    tl.reverse();
    playingFlag = false;
    playCompleteFlag = false;
  }

  // Toggle play/reverse logic
  function toggleGsapSquares() {
    console.log("In toggleGsapSquares TOP");
    // DIAGNOSTIC
    console.log(`playingFlag: ${playingFlag}, playCompleteFlag: ${playCompleteFlag}`);

    if(playingFlag == false && playCompleteFlag == false) { 
      play();
    } else if(playingFlag == true || playCompleteFlag == true){
      reverse();
    };
  }

  return {
    toggleGsapSquares: toggleGsapSquares
  };
} // end GsapSquaresDrawing



