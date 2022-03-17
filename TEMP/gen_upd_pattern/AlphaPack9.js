var data = {
    "id": "charContainer",
    "value": "100",
    "children": []
};

var alphabet = "abcdefghijklmnopqrstuvwxyz".split("");

// var diameter = 600;
var headerHeight = 76;
var divWidth = parseInt(d3.select('.visualization').style('width'), 10)
var innerWidth = window.innerWidth;
var innerHeight = window.innerHeight;
var clientWidth = window.document.documentElement.clientWidth;
var clientHeight = window.document.documentElement.clientHeight;
var svgSize = innerWidth <= innerHeight ? innerWidth - headerHeight : innerHeight - headerHeight;
var exitDistance = svgSize * 0.83;

// Diagnostic (responsify)
console.log(`divWidth: ${divWidth}`);
console.log(`innerWidth: ${innerWidth}`);
console.log(`innerHeight: ${innerHeight}`);
console.log(`clientWidth: ${clientWidth}`);
console.log(`clientHeight: ${clientHeight}`);
console.log(`svgSize: ${svgSize}`);

var svg = d3.select("#alpha-pack-9").append("svg")
    // .attr("width", diameter)
    // .attr("height", diameter)
    .attr("width", svgSize)
    .attr("height", svgSize)
    .append("g");

var alphaBubble = d3.layout.pack()
    // .size([diameter - 50, diameter - 50])
    .size([svgSize - 50, svgSize - 50])
    .padding(5);

function update(data) {

    var nodes = alphaBubble.nodes(data);

    // Data join by key to <g> nodes
    var node = svg.selectAll(".node")
        .data(nodes, function(d) {
            return d.id; 
        });

    // Data join by key to circles
    var circles = svg.selectAll("circle")
        .data(nodes, function(d) {
            return d.id; 
        });

    // UPDATE
    node.selectAll("circle")
        .attr("class", function(d, i) {
        // console.log("UPDATE, d.id: " + d.id)
        var result = d.id === "charContainer" ? "container" : "update";
            return result;
    });

    // ENTER
    var enterNode = node.enter().append("g")
        .attr("class", "node")
        
    enterNode.append("circle")
        .attr("class", function(d, i) {
            var result = d.id === "charContainer" ? "container" : "enter";
            return result;
        })
        .style("fill-opacity", 1e-6);
     
    enterNode.append("text")
        .attr("dx", -8)
        .attr("dy", ".50rem")
        .text(function(d) {
            return d.id === "charContainer" ? "" : d.id;
        });   

    node.transition().duration(750)
        .attr("transform", function(d) {
            return "translate(" + d.x + ", " + d.y + ")";
        })
        
    node.selectAll("circle")
      .transition()
        .duration(750)
        .attr("r", function(d) {
            return d.r; 
        })
        .style("fill-opacity", 1);

    // EXIT
    node.exit().selectAll("circle")
        .attr("class", "exit");
      
    node.exit()
      .transition()
        .duration(750)
        .attr("transform", function(d) {
            // return "translate(" + (+500) + ", " + (+500) + ")";
            return "translate(" + (+exitDistance) + ", " + (+exitDistance) + ")";
        })
        .remove();;

    node.exit().selectAll("circle")
      .transition()
        .duration(750)
        .style("fill-opacity", 1e-6);    
}

function objectify(alphArr) {
    var objArr = [];
    for(var i = 0; i < alphArr.length; i++) {
        objArr.push({"id": alphArr[i], "value": 25});
    }
    return objArr;
}

data.children = objectify(alphabet);

update(data);

setInterval(function() {
    var newChildren = d3.shuffle(alphabet)
        .slice(0, Math.floor(Math.random() * 26))
        .sort();
    data.children = objectify(newChildren);
    update(data);
}, 1500);
