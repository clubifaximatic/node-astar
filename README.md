# node-astar

A* search algorithm implementation

This is a generic asynchronous implementation of the A* search algorithm to be user together with databases such as mongodb, elastic, etc.

The algorithm is based on an article of Brian Grinstead found named [A* Search Algorithm in JavaScript](http://www.briangrinstead.com/blog/astar-search-algorithm-in-javascript)

## usage

1. Each node is a Astar.Node object with an unique id, a latitude and a longitude.

  ```js
  const Astar = require('node-astar');

  const n1 = Astar.Node('edinburgh', 55.947065, -3.187989);
  const n2 = Astar.Node('london', 51.508530, -0.129603);

  ```

2. Create a function for getting the neighbours of a node. 

   The function get two parameters: the current node and the method to call once the neighbours are retrived. 

   You have to pass an array of Astar.Node objects to the callback.

  ```js
  const findNeighbours = function (node, next) {
  
      mongodb.collection('cities').findOne(
          { city: node.id },
          function (err, doc) {
              if (err) return next([]);
              
              var result = [];
              doc.neighbours.forEach(function (doc) {
                  var node = Astar.Node(doc.city, doc.lat, doc.lng);
                  result.push(node);
              });
              
              next(result);
          }   
      );
  }
  ```

3. Create a Astar object passing the neighbours function as a parameter

  ```js
  var astar = new Astar(findNeighbours);
  ```

4. Search for the sorted route pasing the start and end nodes. As a result you get the list of nodes or empty if not path found

  ```js
  astar.search (n1, n2, function (err, result) {

      result.forEach(function (doc) {
        console.log(doc.id);
      });

  });
  ```

