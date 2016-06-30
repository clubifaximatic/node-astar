// //
// //

// //----------------------------------------------------------------------------
// //----------------------------------------------------------------------------
// // ANode
// //----------------------------------------------------------------------------
// //----------------------------------------------------------------------------

// function ANode(id, latitude, longitude, neighbors) {
//   this.id = id;
//   this.lat = latitude;
//   this.lng = longitude;
  
//   if (typeof neighbors == "undefined") {
//     this.n = [];
//   }
//   else {
//     this.n = neighbors;
//   }
    

//   this.f = 0;
//   this.g = 0;
//   this.h = -1;
//   this.closed = false;
//   this.parent = 0;
// }

// ANode.prototype = {

//   distanceTo: function (node) {
//     return Math.abs(this.lat - node.lat) + Math.abs(this.lng - node.lng);
//   }
// }

//----------------------------------------------------------------------------
//----------------------------------------------------------------------------
//  Astar
//----------------------------------------------------------------------------
//----------------------------------------------------------------------------


function Astar () {
  this.allNodes = [];
  this.openNodes = [];
  this.nodeStartId = null;
  this.nodeEndId = null;
  this.nodeStart = null;
  this.nodeEnd = null;
  this.callbackNeighborsForNode = null;
  this.userCallback = null;
  
  this.lastBestNode = null;
  
  this.status = 0;  // 0 -> search for end node
            // 1 -> search for start node
            // 2 -> normal operation
  
}

//DEL Astar.super_ = EventEmitter;
Astar.prototype = {

//----------------------------------------------------------------------------
//  search
//    start - start node
//    end - end node
//    callbackNeigbors - functions that retrives neightbors (from mongo or
//              whatever f(AStar, nodeId))
//    callbackf - response callback f(err,result)
//----------------------------------------------------------------------------

  search: function (start, end, callbackNeighbors, callbackf) {
    this.nodeStartId = start;
    this.nodeEndId = end;
    this.callbackNeighborsForNode = callbackNeighbors;
    this.userCallback = callbackf;
    
    this.callbackNeighborsForNode(this, this.nodeEndId);
  },

//----------------------------------------------------------------------------
//  continueSearch
//----------------------------------------------------------------------------

  continueSearch: function () {

    console.log("F continueSearch ( )");

//DEL   while(this.openNodes.length > 0) {

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
            if(this.lastBestNode.id == nodeEndId) {
                var ret = [ ];
                var bestNode = this.lastBestNode;
                while(bestNode) {

                    bestNode = this.allNodes[bestNode.parent];
                    ret.push(bestNode);
                }

        // return result                
                if (userCallback) {
                  userCallback (0, ret.reverse());
                }
            }

            // Close node and remove form set
            this.lastBestNode.closed = true;
      var i = this.openNodes.indexOf(this.lastBestNode.id);
      if(i != -1) {
        this.openNodes.splice(i, 1);
      }

            callbackNeighborsForNode(this, this.lastBestNode.id);            
        }
        else {
          console.log ("ERROR!!! openNodes length == 0");
        }
  },

//----------------------------------------------------------------------------
//  continueSearch
//----------------------------------------------------------------------------

  processNewNodes: function (neighbors) {
    console.log("F processNewNodes ( " + JSON.stringify(neighbors) + " )");
    
    if (neighbors == null) {
      return; 
    }


    for(var i = 0; i < neighbors.length; i++) {
      
      var newNode = this.allNodes[ neighbors[i]];

      // if closed, continue
            if ((newNode == null) || (newNode.closed)) {
              console.log("continue...");
            continue;
      }

            // g score is the shortest distance from start to current node, we need to check if
            //   the path we have arrived at this neighbor is the shortest one we have seen yet
            var tentativeGScore = this.lastBestNode.g + this.lastBestNode.distanceTo(newNode);

            var gScoreIsBest = false;

      // check if we already calculated heuristic
            if(newNode.h < 0) {
              gScoreIsBest = true;
              newNode.h = newNode.distanceTo(nodeEnd);
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
  },
  
//----------------------------------------------------------------------------
//  add
//----------------------------------------------------------------------------

  add: function (nodes) {
    
    // check nodes exists
    if ((nodes == null) || (nodes.length == 0)) {
    
      if (this.status == 2) {
        continueSearch();
      }
      else {
        if (this.userCallback) {
          this.userCallback(1, null);
        }
      }
      this.continueSearch();        
      return;
    }

    // check status
    if (this.status == 0) {
      console.log ("STATUS == 0");
      // FOUND END NODE
      nodeEnd = nodes[0];

      this.status = 1;
      callbackNeighborsForNode(this, nodeStartId);
      return;
    }
    else if (this.status == 1) {
      console.log ("STATUS == 1");
      // FOUND START NODE
      nodeStart = nodes[0];
      nodeStart.closed = true;
      this.lastBestNode = nodeStart;
      
      console.log(" START NODE **** ** " + JSON.stringify(this.lastBestNode));
      console.log("\n----------\n");
      
      this.status = 2;
      this.allNodes[nodeStart.id] = nodeStart;
    }
    else {
      console.log ("STATUS == 2");
    }
        
    var myneighbors = [];
    
    // for each node (except first)
        for(var i=1; i < nodes.length; i++) {
            
            var node = nodes[i];
              
            var n = this.allNodes[node.id];
            if (n == null) {
        this.allNodes[node.id] = node;
        n = node;
            }

      if (!n.closed) {
            
          myneighbors.push(n.id);
        }
    }
    
        this.processNewNodes(myneighbors);

    this.continueSearch();        
  },
  
//----------------------------------------------------------------------------
//  paint
//----------------------------------------------------------------------------
  
  paint:function () {
    var matrix =  [];

    for (var i=0; i<this.maxValue; i++) {
      matrix[i] = [];
      for (var j=0; j<this.maxValue; j++) {
         matrix[i][j] = "·";
      }
    }

    for (i in this.allNodes) {
      var node = this.allNodes[i];
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
  }
};


module.exports = Astar;



/*
var Worker = require('webworker-threads').Worker;


require('http').createServer(function (req,res) {
  var fibo = new Worker(function() {
  console.log("new request");
    function fibo (n) {
      
      return n > 1 ? fibo(n - 1) + fibo(n - 2) : 1;
    }
    this.onmessage = function (event) {
      postMessage(fibo(event.data));
console.log("message posted");
    }
  });
  fibo.onmessage = function (event) {
    res.end('fib(40) = ' + event.data);
  console.log("RESPONSE: " + event.data);
  };
  fibo.postMessage(40);
}).listen(9900);

*/


