const Checkpoint = artifacts.require('./Checkpoint.sol')

module.exports = (deployer, network, accounts) => {
  deployer.then(async () => {
    const owner = accounts[0]
    await deployer.deploy(Checkpoint, owner)
  })
}
