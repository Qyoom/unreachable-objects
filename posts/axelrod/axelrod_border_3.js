/** Axelrod border lab 3 *******************/
// Static version. TODO: parameterize from UI.

// Global variables

var anchorElement = '#axelrod-bw';

// Grid layout dimensions
// var numRows = 15;
// var numCols = 38;
// var numRows = 6;
// var numCols = 10;
var numRows = 12;
var numCols = 20;
// var cellSize = 18;
// Window Size
var innerWidth = window.innerWidth;
var innerHeight = window.innerHeight;
var wallThickness = 4;
var cellSize = innerWidth <= innerHeight ? Math.floor(innerWidth / numCols) -wallThickness : Math.floor(innerHeight / numRows) -wallThickness;
var gridSize = numRows * numCols;
var marginHoriz = 30;
var marginVert = 30;
// var width = numCols * cellSize;
// var height = numRows * cellSize;
var width = numCols * cellSize;
var height = numRows * cellSize;
var halfSize = cellSize / 2.0;

// Feature initialization. 
// Ranges are 0 (inclusive) to N (exclusive).
// Features have traits.
var numFeatures = 5;
var numTraits = 10;

// SVG origin [0,0] at upper left.
// [row, col] i.e. [vert, horiz] position.
var directions = [
    { "index": 0, "coord": [-1, 0] },  // north (up)
    { "index": 1, "coord": [ 0,-1] },  // west  (left)
    { "index": 2, "coord": [ 1, 0] },  // south (down)
    { "index": 3, "coord": [ 0, 1] }   // east  (right)
];

// Equilibrium feeler: if equilibrium > likely then stop();
var equilibriumLikely = true; // if no adoption made during complete cycle.
var noAdoptionCounter = 10; // Counter of population cycles with no adoption.

// svg:g element
// <div id="grid">
//     <svg class="grid>
//         <g>
//             // grid boundry border lines
//             // 
//         </g>
//     </svg">
// </div>
var grid = d3.select(anchorElement).append("svg")
    .attr("width", width + marginHoriz)
    .attr("height", height + marginVert)
    // .attr("width", width)
    // .attr("height", height)
    .attr("class", "grid")
    .append("g")
    .attr("transform", "translate(10, 10)");

// Grid top border
grid.append("line")
    .style("stroke", "#000000")
    .style("stroke-width", wallThickness)
    .style("stroke-linecap", "square")
    .attr("x1", 0) 
    .attr("y1", 0) 
    .attr("x2", numCols * cellSize) 
    .attr("y2", 0);

// Grid left border
grid.append("line")
    .style("stroke", "#000000")
    .style("stroke-width", wallThickness)
    .style("stroke-linecap", "square")
    .attr("x1", 0) 
    .attr("y1", 0) 
    .attr("x2", 0) 
    .attr("y2", numRows * cellSize);

// Grid bottom border
grid.append("line")
    .style("stroke", "#000000")
    .style("stroke-width", wallThickness)
    .style("stroke-linecap", "square")
    .attr("x1", 0) 
    .attr("y1", numRows * cellSize) 
    .attr("x2", numCols * cellSize) 
    .attr("y2", numRows * cellSize);

// Grid right border
grid.append("line")
    .style("stroke", "#000000")
    .style("stroke-width", wallThickness)
    .style("stroke-linecap", "square")
    .attr("x1", numCols * cellSize) 
    .attr("y1", 0) 
    .attr("x2", numCols * cellSize) 
    .attr("y2", numRows * cellSize);

function gridFun() {
    // Join data by key to <g> (.cell)
    var cells = grid.selectAll(".cell")
        .data(cellData, function (d) { 
            return d.id; // Bind by key, which is id (unique)
        });

    // UPDATE
    cells.selectAll(".north")
        .style("stroke", function(d) { return d.opacities[0]; })
        .style("stroke-width", wallThickness);

    cells.selectAll(".west")
        .style("stroke", function(d) { return d.opacities[1]; })
        .style("stroke-width", wallThickness);

    // ENTER happens just once at the beginning.
    var enterCell = cells.enter().append("svg:g")
        .attr("class", "cell")
        .attr("id", function(d) { return d.id; });

    // North, top
    enterCell.append("line")
        .attr("class", "north")
        .style("stroke", function(d) { return d.opacities[0]; })
        .style("stroke-width", wallThickness)
        .style("stroke-linecap", "square")
        .attr("x1", function(d) { return d.x - halfSize + 4}) 
        .attr("y1", function(d) { return d.y - halfSize })
        .attr("x2", function(d) { return d.x + halfSize - 4}) 
        .attr("y2", function(d) { return d.y - halfSize });

    // West, left
    enterCell.append("line")
        .attr("class", "west")
        .style("stroke", function(d) { return d.opacities[1]; })
        .style("stroke-width", wallThickness)
        .style("stroke-linecap", "square")
        .attr("x1", function(d) { return d.x - halfSize })//+ 2}) 
        .attr("y1", function(d) { return d.y - halfSize + 4}) 
        .attr("x2", function(d) { return d.x - halfSize })//+ 2}) 
        .attr("y2", function(d) { return d.y + halfSize - 4});

    // EXIT
    cells.exit().remove();

} // end grid

// This function only runs once at start.
function cellDataFun() {
    var data = new Array();

    var startX = cellSize / 2;
    var startY = cellSize / 2;
    var stepX = cellSize;
    var stepY = cellSize;
    var xPos = startX;
    var yPos = startY;
    var newValue = 0;

    // Row iterator, y
    for (var row = 0; row < numRows; row++){

        // Column/cell iterator, x
        for (var col = 0; col < numCols; col++){

            // cell data
            data.push({
                index: [row, col],
                id: 'r' + row + 'c' + col,
                value: newValue,
                x: xPos,
                y: yPos,
                features: randomFeatures(), // Randomized feature adoption has already taken place (data is in original order)
                opacities: [ // [0:north, 1:west, 2:south, 3:east] TODO: This initialization of wall shade does not acurately reflect initial similarity with neighbors. Also, I believe only two sides are utilized for each cell (west and north).
                    "#000000",
                    "#000000"//,
                    //"#000000",
                    //"#000000"
                ]
            });

            xPos += stepX;
        } // end column iterator

        xPos = startX;
        yPos += stepY;
    } // end row iterator

    return data;
} // end cellDataFun

// Initialize feature set for one cell.
function randomFeatures() {
    var features = [];
    for(var i = 0; i < numFeatures; i++){
        features[i] = Math.floor(Math.random() * numTraits);
    }
    return features;
}

function updateInfluence(){
    equilibriumLikely = true; // Reset. Any adoption sets to false for cycle.
    // Randomization, no cell is favored.
    // Shuffling separate index array to randomly process cells (feature similarity).
    var randomCellOrder = _.shuffle(_.range(gridSize));
    for(var i = 0; i < gridSize; i++){
        interactNeighbor(cellData[randomCellOrder[i]]);
    }
    if(equilibriumLikely) noAdoptionCounter -= 1; // count down to limit.
}

// Potentially modifies cell feature.
function interactNeighbor(cell) {
    // Random iteration of all 4 directions
    var randDirOrder = _.shuffle(_.range(directions.length));
    for(var i = 0; i < directions.length; i++) {
        var direction = directions[randDirOrder[i]];

        var neighborIndex = [
            cell.index[0] + direction.coord[0], // x
            cell.index[1] + direction.coord[1]  // y
        ];

        if(gridContains(neighborIndex)) {
            var neighbor = d3.select("#r" + neighborIndex[0] + "c" + neighborIndex[1]);
            neighbor = neighbor[0][0].__data__; // TODO: Hack!

            // Calculate similarity percentage
            var pctSim = Math.pow((percentSimilar(cell, neighbor)), 2.7);

            // Generate random probability
            var prob = Math.random();

            // Determine (probability based on similarity) if can interact.
            if(prob <= pctSim && pctSim < 1) {
                adoptFeature(cell, neighbor);
                equilibriumLikely = false;
            }
            // else no interaction for this cell this cycle.
            return; // Either way
        }
        // else continue with next direction since this direction not in grid.
    } // end loop of directions/neighbors
} // end function neighbors

function updateWalls() {
     // for each cell...
     for(var i = 0; i < gridSize; i++) {
         var cell = cellData[i];

         // for north and west only...
         for(var j = 0; j < directions.length / 2; j++) {
            var direction = directions[j];

            var neighborIndex = [
                cell.index[0] + direction.coord[0], // x
                cell.index[1] + direction.coord[1]  // y
            ];

            if(gridContains(neighborIndex)) {
                var neighbor = d3.select("#r" + neighborIndex[0] + "c" + neighborIndex[1]);
                neighbor = neighbor[0][0].__data__; // TODO: Hack!

                // Calculate similarity percentage
                var pctSim = percentSimilar(cell, neighbor);

                // opacities: [0:north, 1:west, 2:south, 3:east]
                cell.opacities[direction.index] = wallColor(pctSim);
            }
         } // end loop each direction
     } // end loop each cell
}

function wallColor(pctSim) {
    var color = Math.round(pctSim * 255);
    var color_str = color.toString(16);
    if( color < 16) color_str = '0' + color_str;
    return '#' + color_str + color_str + color_str;    
}

function adoptFeature(cell, neighbor) {
    var unmatchedIndexes = [];
    for(var i = 0; i < numFeatures; i++){
        if(cell.features[i] !== neighbor.features[i]){
            unmatchedIndexes.push(i);
        }
    }
    var randomIndex = Math.floor(Math.random() * unmatchedIndexes.length);
    randomIndex = unmatchedIndexes[randomIndex];
    cell.features[randomIndex] = neighbor.features[randomIndex];
}

function percentSimilar(cell, neighbor) {
    var matchCount = 0;
    for(var i = 0; i < numFeatures; i++){
        if(cell.features[i] === neighbor.features[i]) matchCount += 1;
    }
    var similiarity = round(matchCount / numFeatures);
    return similiarity;
}

function gridContains(neighbor) {
    result = true;
    // test on range
    if(
        neighbor[0] < 0 || numRows <= neighbor[0] ||
        neighbor[1] < 0 || numCols <= neighbor[1]
    ) result = false;

    return result;
}

function round(value) {
    return Math.round(value*100)/100;
}

//**** Starts here ***********************/

var cellData = cellDataFun(); // Data in array of cells, each with x and y postion and array of feature traits.

gridFun(); // Bind data to Dom

// Repeat cycle with local feature adoption
var timer;
var timerCnt = 0;
timer = setInterval(function() {
    if(timerCnt % 100 == 0) console.log("setInterval, timerCnt: " + timerCnt);
    updateInfluence();
    updateWalls();
    gridFun();
    timerCnt += 1;
    if(noAdoptionCounter <= 0 || timerCnt > 10000) clearInterval(timer); // Hard to be absolutely sure because of random selections.
}, 50);






