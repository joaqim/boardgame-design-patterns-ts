import { expect } from "chai";
import Graph from "../src/graph/graph";
//import graphConf from "../src/graph/graph-config";
import GraphMapData, { createGraph, Node } from "../src/graph/graph-map";

        
const flatNodeGraph: GraphMapData<9> = {
    length: 9,
    nodes: [0,1,2,3,4,5,6,7,8],
    edges: [[0,1], [1,2], [2,3], [3,4], [4,5], [5,6], [6,7], [7,8]]
}

// ------------------------------------------------------------------------------
/* Dice Node Graph
 * The layout of a die expressed as a node graph
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

const diceNodeGraph = Object.freeze(createGraph({
    length: 6,
    nodes: [0, 1, 2, 3, 4, 5],
    edges: [
        // 1 is adjacent to 4 numbers on the die
        [0, 1], [0, 2], [0, 3], [0, 4],
        // 6 is adjacent the same 4 numbers
        [5, 1], [5, 2], [5, 3], [5, 4],

        // The remaining edges goes between
        // the other 4 numbers of the die

        // 2 touches 3, and vice versa
        [1, 2],
        // 3 touches 4
        [2, 3],
        // 4 touches 5
        [3, 4],
        // 5 touches 2
        [4, 2],
    ],
}));

/**
 *  
 * @param {number} id
 * @param {Node[]} parents
 * @returns {void}
 */
function walkPath<TNodeSize extends number>(id: number, parents: Node<TNodeSize>[], retries = 0):void {
    if((id === undefined && parents[id] === undefined) || retries > 128) {
        throw new Error("Cannot travel to node")
    }
    if (id === null) {
        return;
    }

    retries +=1;
    walkPath(parents[id], parents, retries);
};

describe('graph', ()=> {

    it('flat node graph', () => {
        const graph = new Graph(flatNodeGraph)

        let {distances, path} = graph.dijkstra(0)

        // The longest path possible is 9
        //expect(path.length).to.equal(9)
        // Since the graph is 1 dimensional, all distances between the nodes
        // are the same as their id which corresponds to their index in array
        expect(distances).deep.equal(flatNodeGraph.nodes)
        expect(() => walkPath(8, path)).to.not.throw()
        expect(() => walkPath(9001, path)).to.throw("Cannot travel to node")

        // If it is impossible to reach a node or if it is the starting node
        // the value stored in path will be null, and it will be 0 in distances,
        // which implies that no travel is possible/necessary to reach goal.

        // Let's add a node that is impossible to reach, since no edges connects to it 
        graph.addNode(9)

        ;({distances, path} = graph.dijkstra(0))
        
        // For now, Number.MAX_VALUE is unreachable nodes
        expect(distances[9]).to.equal(Number.MAX_VALUE)
        expect(path[9]).to.equal(undefined)
        expect(() => walkPath(9, path)).to.throw("Cannot travel to node")


        // path = [null, 0, 1, 2, 3, 4, 5, 6, 7, undefined]
        // TODO: show use case of path e.g travel through nodes
        // and their children to find path to target
        // maybe add a function that determines slowest path
        // and returns that, with optional 50/50 path choice on
        // tie in distances of paths

    })

    it('dice node graph', () => {
        const graph = new Graph(diceNodeGraph);

        // Where 0 is the starting node that all distances are calculated from
        let {distances, path} = graph.dijkstra(0) 

        expect(path.length).to.equal(distances.length)
        
        // How many 90 degrees turns do you have to rotate
        // a dice to go from 1 to 6 ( where index 0 is 1 and index 5 is 6)
        // distances = [0, 1, 1, 1, 1, 2]
        // Here distances[5] is the furthest point from the starting point (0)
        expect(distances[5]).to.equal(2)


        // Here the starting node is null since you can never 
        // travel to the starting point
        // path =  [null, 0, 0, 0, 0, 1]
        expect(path.length).to.equal(diceNodeGraph.nodes.length)

        // TODO: Can't we replace distances, path with on 
        // definite shortest path

        expect(() => walkPath(5, path)).to.not.throw()
        expect(() => walkPath(6, path)).to.throw("Cannot travel to node")

        // Distance from 1 to 2 on the die is 1
        expect(graph.dfsPath(0, 1).length).to.equal(1)
        // Distance from 1 to 6 on the die is 2,
        // which is the maximum distance to travel
        expect(graph.dfsPath(0, 5).length).to.equal(2)
        // likiwise with 6 to 1
        expect(graph.dfsPath(5, 0).length).to.equal(2)
        // 5 to 2
        expect(graph.dfsPath(4, 1).length).to.equal(2)
        

        walkPath(5, path)
        //console.log(graph.dfsPath(5, 0))
    })
})