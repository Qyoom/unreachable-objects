console.log('carousel_uo_control_1.js');

const windowSize = {
  width: window.innerWidth,
  height: window.innerHeight
};

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
    getLewittColorDrawing();
  }

  // console.log(event.target)
  //genNewDrawing() // performs transition
}, false)