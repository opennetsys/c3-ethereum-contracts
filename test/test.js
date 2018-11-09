const Checkpoint = artifacts.require('Checkpoint')
const BN = require('bn.js')
const moment = require('moment')
const { soliditySha3: sha3 } = require('web3-utils')
const MerkleTree = require('merkletreejs')
const crypto = require('crypto')
const { keccak256, bufferToHex } = require('ethereumjs-util')
const Reverter = require('./utils/reverter')

const big = (n) => new BN(n.toString(10))
const tenPow18 = big(10).pow(big(18))
const oneEth = big(1).mul(tenPow18).toString(10)

contract('Contracts', (accounts) => {
  const reverter = new Reverter(web3)
  const owner = accounts[0]
  let contract

  before('setup', async () => {
    contract = await Checkpoint.new(owner)

    await reverter.snapshot()
  })

  context('Checkpoint', () => {
    describe('checkpoint', () => {
      it('should checkpoint', async () => {
        //const root = sha3({type: 'bytes32', value: '0x'+Buffer.from('hello').toString('hex')})
        const roothex = '0xcad2340f8b4a84be0d25577551963a1e1dba5e5baebf49639ad65634c19e14f9'
        const root = new BN(roothex.slice(2), 16).toString(10)
        const result = await contract.checkpoint(root, {
          from: owner,
        })

        assert.equal(result.receipt.status, '0x01')
      })

      it('should read checkpoint', async () => {
        //const root = sha3({type: 'bytes32', value: '0x'+Buffer.from('hello').toString('hex')})
        const root = '0xcad2340f8b4a84be0d25577551963a1e1dba5e5baebf49639ad65634c19e14f9'
        const result = await contract.checkpoints.call(0)
        assert.equal('0x'+result.toString(16), root)
      })

      it('should return true for valid merkle proof', async () => {
        const leaves = ['a', 'b', 'c', 'd'].map(x => keccak256(x))
        const tree = new MerkleTree(leaves, keccak256)
        const root = bufferToHex(tree.getRoot())
        const leaf = bufferToHex(tree.getLeaves()[0])
        const proof = tree.getProof(leaves[0]).map(x => bufferToHex(x.data))

        const verified = await contract.verify.call(proof, root, leaf)
        assert.equal(verified, true)
      })

      it('should return false for invalid merkle proof', async () => {
        const leaves = ['a', 'b', 'c', 'd'].map(x => keccak256(x))
        const tree = new MerkleTree(leaves, keccak256)
        const root = bufferToHex(tree.getRoot())
        const leaf = bufferToHex(tree.getLeaves()[0])

        const badLeaves = ['a', 'b', 'c', 'x'].map(x => keccak256(x))
        const badTree = new MerkleTree(badLeaves, keccak256)
        const badProof = badTree.getProof(badLeaves[0]).map(x => bufferToHex(x.data))

        const verified = await contract.verify.call(badProof, root, leaf)
        assert.equal(verified, false)
      })

      it('should return false for a merkle proof of invalid length', async () => {
        const leaves = ['a', 'b', 'c'].map(x => keccak256(x))
        const tree = new MerkleTree(leaves, keccak256)
        const root = bufferToHex(tree.getRoot())
        const leaf = bufferToHex(tree.getLeaves()[0])
        const proof = tree.getProof(leaves[0]).map(x => bufferToHex(x.data))

        const verified = await contract.verify.call(proof, root, leaf)
        assert.equal(verified, false)
      })

      after(async () => {
        await reverter.revert()
      })
    })
  })
})
