


var Astar = require('./lib/index.js');



const n1 = Astar.Node('1', 0, 0);
const n2 = Astar.Node('2', 1, 1);
const n3 = Astar.Node('3', 2, 1);
const n4 = Astar.Node('4', 2, 2);
const n5 = Astar.Node('5', 3, 2);
const n6 = Astar.Node('6', 3, 0);
const n7 = Astar.Node('7', 4, 3);
const n8 = Astar.Node('8', 1, 4);
const n9 = Astar.Node('9', 4, 4);


const paint = function (nodes) {
  var matrix =  [];

  this.maxValue = 5;

  for (var i=0; i<this.maxValue; i++) {
    matrix[i] = [];
    for (var j=0; j<this.maxValue; j++) {
      matrix[i][j] = "·";
    }
  }

  for (i in nodes) {
    var node = nodes[i];

    matrix[node.lat][node.lng] = node.id;
  }

  for (var i=0; i<this.maxValue; i++) {
    var line = "";

    for (var j=0; j<this.maxValue; j++) {
      line += matrix[i][j];
      line += "  ";
    }
    console.log(line);
  }
};



const getNeighbours = function (node, next) {


  if (node.id == '1') {
    ret = [ n2, n3];
  }
  else if (node.id == '2') {
    ret = [ n1, n4];
  }
  else if (node.id == '3') {
    ret = [ n1, n4];
  }
  else if (node.id == '4') {
    ret = [ n2, n3, n5, n6];
  }
  else if (node.id == '5') {
    ret = [ n7, n4];
  }
  else if (node.id == '6') {
    ret = [ n4, n8];
  }
  else if (node.id == '7') {
    ret = [ n5, n8];
  }
  else if (node.id == '8') {
    ret = [ n7, n6];
  }
  else {
    ret = [];
  }

  console.log('node:', node.id, 'neighbours:', ret.length);

  next (ret);
}






var a = new Astar(getNeighbours);

var start = n1;
var end = n6;

a.search (n1, n8, function (err, result) {

  console.log('RESULT:');
  result.forEach(function (doc) {
    console.log(doc.id);
  });

  paint(result);
});

a.search (n1, n6, function (err, result) {

  result.forEach(function (doc) {
    console.log(doc.id);
  });

  paint(result);
});




