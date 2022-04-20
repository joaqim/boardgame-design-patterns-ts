import { expect } from "chai";
import { GraphMetaData } from "../src/graph";
import StaticGraph from "../src/graph/static-graph";

// Prefer to use createGraph for helpful typescript hints, see other graphs
const flatNodeGraph: GraphMetaData<9> = {
    nodes: [0,1,2,3,4,5,6,7,8],
    edges: [[0,1], [1,2], [2,3], [3,4], [4,5], [5,6], [6,7], [7,8]]
}

describe('graph', ()=> {

    it('flat node graph', () => {
        const graph = new StaticGraph(flatNodeGraph)
        let {distances, path} = graph.generateDistancesAndPath(0)

        // The longest path possible is 9
        expect(path.length).to.equal(9)
        // path = [null, 0, 1 ... 7] of length 9

        // Since the graph is 1 dimensional, all distances between the nodes
        // are the same as their id which corresponds to their index in array
        expect(distances.length).deep.equal(flatNodeGraph.nodes.length)
        expect(() => graph.walkPathToEnd(path)).to.not.throw()

        expect(() => graph.walkPathToTarget(path,8)).to.not.throw()


    })
})