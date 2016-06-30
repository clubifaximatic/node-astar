

// A* Search for nodejs based on 
// http://www.briangrinstead.com/blog/astar-search-algorithm-in-javascript

const Node = require('./node.js');



function Astar (neighboursFunction) {
  this.allNodes = [];
  this.openNodes = [];
  this.nodeStart = null;
  this.nodeEnd = null;
  this.callback = null;
  
  this.lastBestNode = null;

  this.neighboursFunction = neighboursFunction;
}

//----------------------------------------------------------------------------
//  search
//    start - start node
//    end - end node
//    cb - response callback f(err,result)
//----------------------------------------------------------------------------

Astar.prototype.search = function (start, end, cb) {
  this.nodeStart = start;
  this.nodeEnd = end;
  this.callback = cb;

  // find last node
  var self = this;
  this.nodeStart.closed = true;
  this.lastBestNode = this.nodeStart;    
  this.allNodes[this.nodeStart.id] = this.nodeStart;
  findNeighbours(this, this.nodeStart);
};

//----------------------------------------------------------------------------
//  continueSearch
//----------------------------------------------------------------------------

Astar.prototype.continueSearch = function () {

  if (this.openNodes.length > 0) {

    // choose best node
    this.lastBestNode = this.allNodes[this.openNodes[0]];
      
    for(var i=1; i < this.openNodes.length; i++) {
      var n = this.allNodes[this.openNodes[i]];

      if(n.f < this.lastBestNode.f) { 
        this.lastBestNode = n; 
      }
    }

    // Check if we have ended
    if(this.lastBestNode.id == this.nodeEnd.id) {
      var ret = [ ];
      var bestNode = this.lastBestNode;


      while(bestNode) {
        ret.push(bestNode);
        bestNode = this.allNodes[bestNode.parent];
      }

      // return result                
      if (this.callback) {
        return this.callback (undefined, ret.reverse());
      }
    }

    // Close node and remove form set
    this.lastBestNode.closed = true;
    var i = this.openNodes.indexOf(this.lastBestNode.id);
    if(i != -1) {
      this.openNodes.splice(i, 1);
    }

    // find last node
    findNeighbours(this, this.lastBestNode);
  }
  else {
    return this.callback (undefined, []);
  }
};

//----------------------------------------------------------------------------
//  processNewNodes
//----------------------------------------------------------------------------

Astar.prototype.processNewNodes = function (neighborsIds) {

  if (!neighborsIds) {
    return; 
  }

  for(var i = 0; i < neighborsIds.length; i++) {

    var newNode = this.allNodes[neighborsIds[i]];

    // if closed, continue
    if (!newNode || newNode.closed) {
      continue;
    }

    // g score is the shortest distance from start to current node, we need to check if
    //   the path we have arrived at this neighbor is the shortest one we have seen yet
    var tentativeGScore = this.lastBestNode.g + this.lastBestNode.distanceTo(newNode);

    var gScoreIsBest = false;

    // check if we already calculated heuristic
    if(newNode.h < 0) {
      gScoreIsBest = true;
      newNode.h = newNode.distanceTo(this.nodeEnd);
      this.openNodes.push(newNode.id);
    }
    else if(tentativeGScore < newNode.g) {
      // We have already seen the node, but last time it had a worse g (distance from start)
      gScoreIsBest = true;
    }

    if(gScoreIsBest) {
      // Found an optimal (so far) path to this node.  Store info on how we got here and
      //  just how good it really is...
      newNode.parent = this.lastBestNode.id;
      newNode.g = tentativeGScore;
      newNode.f = newNode.g + newNode.h;
    }
  }
};


const findNeighbours = function (self, node) {
  self.neighboursFunction(node, function (nodes) {
    add(self, nodes);
  });
}

//----------------------------------------------------------------------------
//  add
//----------------------------------------------------------------------------

const add = function (self, nodes) {

  // check nodes exists
  if (!nodes || (nodes.length == 0)) {

    self.continueSearch();
    return;
  }

  var myneighbors = [];
  
  // for each node (except first)
  for(var i=0; i < nodes.length; i++) {

    var node = nodes[i];

    var n = self.allNodes[node.id];
    if (!n) {
      self.allNodes[node.id] = node;
      n = node;
    }

    if (!n.closed) {
      myneighbors.push(n.id);
    }
  }
  
  self.processNewNodes(myneighbors);

  self.continueSearch();        
};


module.exports = Astar;

module.exports.Node = function (id, latitude, longitude) {
  return new Node(id, latitude, longitude);
}
