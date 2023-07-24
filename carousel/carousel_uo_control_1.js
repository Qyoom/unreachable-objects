console.log('carousel_uo_control_1.js');

let gridMod = GridModDrawing();
gridMod.genGridModDrawing();

let lewitt118bw = Lewitt118BwDrawing(); 
lewitt118bw.genFirst118BwDrawing();

let lewitt118color = Lewitt118ColorDrawing();
lewitt118color.genFirst118ColorDrawing();

let harlequin = HarlequinDrawing();
harlequin.generate();

// Click handler
// https://gomakethings.com/detecting-click-events-on-svgs-with-vanilla-js-event-delegation/
document.addEventListener('click', function (event) {
  if (!event.target.closest('.visualization')) {
    // console.log('no match!')
    return
  }

  if(event.target.closest('#grid-modern')) {
    // console.log('clicked grid-modern');
    gridMod.genGridModDrawing();
  }

  if(event.target.closest('#lewitt-118-bw')) {
    // console.log('clicked lewitt-118-bw');
    lewitt118bw.genNew118BwDrawing();
  }

  if(event.target.closest('#lewitt-118-color')) {
    // console.log('clicked lewitt-118-color');
    lewitt118color.genNew118ColorDrawing();
  }

  if(event.target.closest('#harlequin')) {
    // console.log('clicked harlequin');
    harlequin.generate();
  }
}, false)