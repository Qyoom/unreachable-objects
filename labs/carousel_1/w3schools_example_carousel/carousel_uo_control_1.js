console.log('carousel_uo_control_1.js');

const windowSize = {
  width: window.innerWidth,
  height: window.innerHeight
};

const svgSize = {
  width: windowSize.width * 0.9,
  height: windowSize.height * 0.82 // 0.90
}

// Click handler
// https://gomakethings.com/detecting-click-events-on-svgs-with-vanilla-js-event-delegation/
document.addEventListener('click', function (event) {
  console.log('click!')
  if (!event.target.closest('.visualization')) {
    console.log('no match!')
    return
  }

  if(event.target.closest('#grid-modern')) {
    console.log('clicked grid-modern');
    genGridModDrawing();
  }

  if(event.target.closest('#lewitt-118-bw')) {
    console.log('clicked lewitt-118-bw');
    genNew118BwDrawing();
  }

  if(event.target.closest('#lewitt-118-color')) {
    console.log('clicked lewitt-118-color');
    genNew118ColorDrawing();
  }

  // console.log(event.target)
  //genNewDrawing() // performs transition
}, false)