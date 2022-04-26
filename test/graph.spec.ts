import { expect } from "chai";
import { GraphMetaData, NodePath } from "../src/graph";
import Graph from "../src/graph/graph";
import DiceNodeGraph from './graphs/dice-graph-config';
import DirectedEdgesWithLoopingNodeGraph from './graphs/directed-edges-with-loop-graph-config';
import TalismanGraphConf from './graphs/talisman-graph-config';

const flatNodeGraph: Readonly<GraphMetaData<9>> = {
    length: 9,
    edges: [[0,1], [1,2], [2,3], [3,4], [4,5], [5,6], [6,7], [7,8]]
}
/*
 * Example of node graph with unconnected/unreachable nodes
 */
const unconnectedNode: Readonly<GraphMetaData<6>> = {
    length: 6,
    edges: [
        [0, 1], [1, 2],
        [4, 5] /* 4 and 5 only see eachother, while 3 sees none */]
};

const oneWayNodeGraph: GraphMetaData<3> = {
    length: 3,
    /* edges with only one direction */
    directedEdges: [[0,1], [1, 2]]
};


const walkPath = <TNode extends number>(start: TNode, path: NodePath<TNode>): void => {
    if(start === null) return;
    console.log(start)
    walkPath(path[start], path)
}

describe('graph', ()=> {

    it('flat node graph', () => {
        const graph = new Graph(flatNodeGraph)

        let {distances, path} = graph.generateDistancesAndPath(0)

        // The longest path possible is 9
        expect(path.length).to.equal(9)
        // path = [null, 0, 1 ... 7] of length 9

        // Since the graph is 1 dimensional, all distances between the nodes
        // are the same as their id which corresponds to their index in array
        expect(distances.length).deep.equal(flatNodeGraph.length)
        expect(() => graph.walkPathToEnd(path)).to.not.throw()

        expect(() => graph.walkPathToTarget(path,8)).to.not.throw()


    })

    it("can't reach unconnected node", ()=> {
        const graph = new Graph(unconnectedNode)

        let {distances, path} = graph.generateDistancesAndPath()

        /**
         * path = [null, 0, 1, undefined, undefined, undefined]
         * Where null is the starting node,
         * 0 .. 1 are the next reachable nodes
         * [... undefined] indicates that the rest of nodes
         * are unreachable from 0
         */


        // For now, Number.MAX_VALUE is unreachable nodes
        expect(distances[3]).to.equal(Number.MAX_VALUE)

        // If it is impossible to reach a node or if it is the starting node
        // and the value stored in that index of path array will be undefined,
        // which is different than null, which implies you're at the start/origin
        // of the calculated paths/distances
        expect(path[3]).to.equal(undefined)

        // Can travel from 0 to 2 here, which is the last reachable node from 0
        expect(() => graph.walkPathToEnd(path)).to.not.throw()

        // Can travel from 0 to 2 here aswell
        expect(() => graph.walkPathToTarget(path,2)).to.not.throw()
        // Cannot reach 3 from starting point of 0
        expect(() => graph.walkPathToTarget(path,3)).to.throw("Cannot reach node")

        // If we regenaret distances and paths from 5 as starting point
        // We will only be able to reach its neighbour 6
        ;({distances, path} = graph.generateDistancesAndPath(5))
        expect(distances[4]).to.equal(1)
        expect(distances[3]).to.equal(Number.MAX_VALUE)
        // 4 sees 5
        expect(path[4]).to.equal(5)
        // 5 is the starting point, therefore null
        expect(path[5]).to.equal(null)

        // We cannot reach node 0 from starting point of 5
        expect(() => graph.walkPathToTarget(path,0)).to.throw("Cannot reach node")
    })

    it('dice node graph', () => {
        const graph = new Graph(DiceNodeGraph);

        // Where 1 is the starting node that all distances are calculated from
        // 1 is optional and will default to graph.offset, which is 1 in this case
        let {distances, path} = graph.generateDistancesAndPath()

        expect(path.length).to.equal(distances.length)
        expect(path.length).to.equal(DiceNodeGraph.length)

        // How many 90 degrees turns do you have to rotate
        // a dice to go from 1 to 6 ( where index 0 is node 1 and 5 is 6)
        // distances = [0, 1, 1, 1, 1, 2]
        // Here distances[6] is node 6 which is the the furthest point
        // from the starting point of 1
        expect(distances[5]).to.equal(2)


        // Here the starting node is null since you can never
        // travel to the starting point, and undefined is the starting offset
        // path = [undefined, null, 1, 1, 1, 1, 2]
        expect(() => graph.walkPathToTarget(path, 5)).to.not.throw()
/*
        // Distance from 1 to 2 on the die is 1
        expect(graph.dfsPath(0, 1).length).to.equal(1)
        // Distance from 1 to 6 on the die is 2,
        // which is the maximum distance to travel
        // on a die, the opposites sides always adds
        // up to 7
        expect(graph.dfsPath(0, 5).length).to.equal(2)
        // likewise with 6 to 1
        expect(graph.dfsPath(5, 0).length).to.equal(2)
        // and 5 to 2
        expect(graph.dfsPath(4, 1).length).to.equal(2)
        // while 5 is adjacent to 3
        expect(graph.dfsPath(4, 2).length).to.equal(1)

        */
        //console.log(graph.nodesWithinReach(1))
        //expect(graph.nodesWithinReach(1)).to.deep.equal([])
    })

    it("directed node graph can be one-way", ()=> {
        const graph = new Graph(oneWayNodeGraph)

        let {distances, path} = graph.generateDistancesAndPath(0)
        // 0 -> 1 -> 2
        // It takes 1 step to reach 1, and 2 steps to reach 2
        expect(distances).to.deep.equal([0, 1, 2])
        // 0 can reach 1 which can then reach 2
        expect(path).to.deep.equal([null, 0, 1])

        // 2 cannot reach 1 or 0, since the edges are directional ( one-way )
        ;({distances, path} = graph.generateDistancesAndPath(2))

        // Expect distances to be [MAX, MAX, 0]
        expect(distances).to.deep.equal([Number.MAX_VALUE, Number.MAX_VALUE, 0])
        // Expect path to be [undefined, undefined, null]
        expect(path).to.deep.equal([undefined, undefined, null])
    })

    it("directed node graph can also loop", ()=> {
        const graph = new Graph(DirectedEdgesWithLoopingNodeGraph)

        let {distances, path} = graph.generateDistancesAndPath(2)

        // The distance from 2 to 3 is 1
        expect(distances[3]).to.equal(1)
        ;({distances, path} = graph.generateDistancesAndPath(5));
        /**
         * The distance from 5 to 3 is 4,
         * since you have to loop around to reach it from 2 by looping
         * over to (5 -> 0), 0 -> 1 -> 2 -> 3
         * Counting steps taken, so 5 is not included in distance.
         */
        expect(distances[3]).to.equal(4)
        expect(distances[4]).to.equal(5)

        ;({distances, path} = graph.generateDistancesAndPath(2));
        expect(distances[3]).to.equal(1)
        expect(distances[4]).to.equal(2)
        expect(distances[5]).to.equal(2)
    })

    it("represent Talisman board as a graph", ()=> {
        const graph = new Graph(TalismanGraphConf)


        let {distances, path} = graph.generateDistancesAndPath(0)

        // From 0, moving half of the available region would be 12 steps
        // either clockwise or anti-clockwise
        expect(distances[12]).to.equal(12)

        // Moving counter-clockwise on the board to 13 would be 11 steps
        expect(distances[13]).to.equal(11)

        // Moving clockwise on the board to 11 would be 11 step
        expect(distances[11]).to.equal(11)

        expect(graph.nodesWithinReach(0)).to.deep.equal([])
        // 0 is at corner between 1 and 23
        expect(graph.nodesWithinReach(1)).to.deep.equal([1, 23])
        // if you continue further away you can reach 2, and 22
        expect(graph.nodesWithinReach(2)).to.deep.equal([1, 2, 22, 23])


        // A typical use case might be:
        // Player is at node 0, they rolled 6 on the move die
        // Which nodes are within reach of 0?
        ;({distances, path} = graph.generateDistancesAndPath(/* Calculate from starting node: */ 0))
        expect(graph.nodesWithinReach(6).length).to.equal(12)
        // For brevity, let's assume they roled a two instead:
        expect(graph.nodesWithinReach(2)).to.deep.equal([1, 2, 22, 23])
        // Let's move to node 2
        ;({distances, path} = graph.generateDistancesAndPath(/* Calculate from target node: */ 2))

        let nodesTraversed = []
        // Walk from 0 to node 2
        graph.walkPath(/* start: */ 0, path, (node)=> nodesTraversed.push(node));
        // Where null indicates end of path, and only the numbers indicate movement
        expect(nodesTraversed).to.deep.equal([1, 2, null])

        nodesTraversed = []
        // We can start at any number within path, here we go from 1 to 2
        graph.walkPath(1, path, (node)=> nodesTraversed.push(node));
        // Here we only need to step once before we reach target of node 2
        expect(nodesTraversed).to.deep.equal([2, null])


        //console.log(path)

        //;({distances, path} = graph.generateDistancesAndPath(48))
        //console.log(distances)
        //console.log(path)
        //walkPath(0, path)
    })
})