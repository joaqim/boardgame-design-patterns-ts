import { expect } from "chai";
import { AdjacencyMatrix, createAdjacencyMatrix } from "../src/containers";

describe("adjacency matrix", () => {
  it("initial empty", () => {
    let m = createAdjacencyMatrix<4>({
      length: 4,
    });

    // Expect a 4x4 matrix of Zero's
    expect(m.length).to.equal(4);
    expect(m[0].length).to.equal(4);
    expect(m[0]).to.deep.equal([0,0,0,0]);
    expect(m[1]).to.deep.equal([0,0,0,0]);
    expect(m[2]).to.deep.equal([0,0,0,0]);
    expect(m[3]).to.deep.equal([0,0,0,0]);
  });

  it("values can be get/set through index", ()=> {
    const zero = createAdjacencyMatrix<4>({length: 4});
    const m = createAdjacencyMatrix<4>({length: 4});

    m[0][0] = 1
    expect(m[0]).to.deep.equal([1, 0, 0, 0])
    expect(m[1]).to.deep.equal(zero[1])
    expect(m[2]).to.deep.equal(zero[2])
    expect(m[3]).to.deep.equal(zero[3])

    m[0][0] = 0
    expect(m[0][0]).to.equal(0)
    expect(m).to.deep.equal(zero)

    m[2][1] = 1
    expect(m[2][1]).to.equal(1)
    expect(m).to.not.deep.equal(zero)

    m[2][1] = 0
    expect(m[2][1]).to.equal(0)
    expect(m).to.deep.equal(zero)

  })

  it("simple 4x4 matrix with adjacencies", ()=> {
    let m = createAdjacencyMatrix<4>({
      length: 4,
      /*
       *  0
       *  |
       *  1-2
       *  \ |
       *   3
       */
      edges: [
        [0, 1],
        [1, 2],[1, 3],
        [2, 3]
      ]
    })

    // 0'th index is not adjacent to itself
    expect(m[0][0]).to.equal(0);
    // 1'th index is adjacent to 0
    expect(m[1][0]).to.equal(1);

    expect(m).to.deep.equal([
      [0, 1, 0, 0],
      [1, 0, 1, 1],
      [0, 1, 0, 1],
      [0, 1, 1, 0],
    ])
  })
});
