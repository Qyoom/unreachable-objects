console.log('carousel_uo_control_1.js')

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

  if(event.target.closest('#lewitt-bw-drawing')) {
    console.log('clicked lewitt-bw-drawing');
  }

  if(event.target.closest('#lewitt-color-drawing')) {
    console.log('clicked lewitt-color-drawing');
  }

  // console.log(event.target)
  //genNewDrawing() // performs transition
}, false)