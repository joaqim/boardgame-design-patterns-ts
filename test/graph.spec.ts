import { expect } from "chai";
import Graph from "../src/graph/graph";
//import graphConf from "../src/graph/graph-config";
import GraphMap, { GraphNode } from "../src/graph/graph-map";

const flatNodeGraph: GraphMap =  {
    nodes: [0,1,2,3,4,5,6,7,8],
    edges: [[0,1], [1,2], [2,3], [3,4], [4,5], [5,6], [6,7], [7,8]]
}
/*
 *                ______
 *               |0    |
 *               |     |
 *    ___________|____0|______
 *   |0   0|0   0|     |0    |
 *   |0   0|     |  0  |  0  |
 *   |0___0|0___0|_____|____0|
 *               |0   0|
 *               |  0  |
 *               |0___0|
 */
const diceNodeGraph: GraphMap =  {
    //nodes: [1,2,3,4,5,6],
    nodes: [0,1,2,3,4,5],
    edges: [
        /*
        [1,2],
        [1,3],
        [1,4],
        [1,5],

        [2,1],
        [2,3],
        [2,4],
        [2,6],

        [3,1],
        [3,2],
        [3,5],
        [3,6],

        [4,1],
        [4,2],
        [4,5],
        [4,6]
        */
        [0,1],
        [0,2],
        [0,3],
        [0,4],

        [1,0],
        [1,2],
        [1,3],
        [1,5],

        [2,0],
        [2,1],
        [2,4],
        [2,5],

        [3,0],
        [3,1],
        [3,4],
        [3,5]
    ]
}

const printPath = (id: number, parents: GraphNode[]) => {
    if (id === null) {
        return;
    }
    printPath(parents[id], parents);
    console.log(id);
};

describe('graph', ()=> {

    it('flat node graph', () => {
        const graph = new Graph(flatNodeGraph)

        let {distances, path} = graph.dijkstra(0)

        // The longest path possible is 9
        expect(path.length).to.equal(9)
        // Since the graph is 1 dimensional, all distances between the nodes
        // are the same as their id which corresponds to their index in array
        expect(distances).deep.equal(flatNodeGraph.nodes)
    })

    it('dice node graph', () => {
        const graph = new Graph(diceNodeGraph);

        let {distances, path} = graph.dijkstra(0)

        expect(path.length).to.equal(distances.length)
        
        // How many 90 degrees turns do you have to rotate
        // a dice to go from 1 to 6 ( where index 0 is 1 and index 5 is 6)
        // distances = [0, 1, 1, 1, 1, 2]
        // Here distances[5] is the furthest point from the starting point (0)
        expect(distances[5]).to.equal(2);

        //({distances, path} = graph.dijkstra(5));

        // Longest possible path, covering all connected nodes,
        // where the starting node is null since you can never 
        // travel to the starting point ( you've reached goal)
        // path =  [null, 0, 0, 0, 0, 1]
        //expect(path.length).to.equal(diceNodeGraph.nodes.length)
        //console.log(path)

        let shortestPath = graph.dfsPath(1, 5)
        console.log(shortestPath)
        printPath(5, path)
        

        //printPath(5, path)
        //console.log(graph.dfsPath(5, 0))


    })
})