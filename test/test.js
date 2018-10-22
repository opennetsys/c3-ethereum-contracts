const Checkpoint = artifacts.require('Checkpoint')
const BN = require('bn.js')
const moment = require('moment')
const {soliditySha3: sha3} = require('web3-utils')
const util = require('ethereumjs-util')
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
        const root = sha3({type: 'bytes32', value: '0x'+Buffer.from('hello').toString('hex')})
        const result = await contract.checkpoint(root, {
          from: owner,
        })

        assert.equal(result.receipt.status, '0x01')
      })
      it('should read checkpoint', async () => {
        const root = sha3({type: 'bytes32', value: '0x'+Buffer.from('hello').toString('hex')})
        const result = await contract.checkpoints.call(0)
        assert.equal(result, root)
      })
      after(async () => {
        await reverter.revert()
      })
    })
  })
})
