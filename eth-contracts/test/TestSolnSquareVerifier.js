const Verifier = artifacts.require('Verifier');
const SolnSquareVerifier = artifacts.require('SolnSquareVerifier');
const truffleAssert = require('truffle-assertions');
const proof_json = require('../../zokrates/code/square/proof.json');

// - use the contents from proof.json generated from zokrates steps
const proofData = {
  proof: {
    A: [
      web3.utils.toBN(proof_json.proof.a[0]).toString(),
      web3.utils.toBN(proof_json.proof.a[1]).toString(),
    ],
    B: [
      [
        web3.utils.toBN(proof_json.proof.b[0][0]).toString(),
        web3.utils.toBN(proof_json.proof.b[0][1]).toString(),
      ],
      [
        web3.utils.toBN(proof_json.proof.b[1][0]).toString(),
        web3.utils.toBN(proof_json.proof.b[1][1]).toString(),
      ],
    ],
    C: [
      web3.utils.toBN(proof_json.proof.c[0]).toString(),
      web3.utils.toBN(proof_json.proof.c[1]).toString(),
    ],
  },
  input: proof_json.inputs,
};

contract('SolnSquareVerifier', (accounts) => {
  const name = 'Hemmy_Token';
  const symbol = 'HCT';

  describe('Test solution verified and mint a token', () => {
    before(async () => {
      const verifier = await Verifier.new({ from: accounts[0] });
      this.contract = await SolnSquareVerifier.new(
        verifier.address,
        name,
        symbol,
        { from: accounts[0] }
      );
    });

    // Test if a new solution can be added for contract - SolnSquareVerifier
    it('should add a solution and emit SolutionAdded', async () => {
      let transferTx = await this.contract.addToSolutions(
        proofData.proof.A,
        proofData.proof.B,
        proofData.proof.C,
        proofData.input,
        { from: accounts[0] }
      );
      truffleAssert.eventEmitted(transferTx, 'SolutionAdded');
    });

    //Test if an ERC721 token can be minted for contract - SolnSquareVerifier
    it('should mint a token and emit Transfer', async () => {
      let transferTx = await this.contract.mintNFT(9, 1, accounts[1], {
        from: accounts[0],
      });
      truffleAssert.eventEmitted(transferTx, 'Transfer', (ev) => {
        return ev.to == accounts[1] && ev.tokenId == 0;
      });
    });
  });
});
