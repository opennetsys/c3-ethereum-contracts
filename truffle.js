/*
 * NB: since truffle-hdwallet-provider 0.0.5 you must wrap HDWallet providers in a
 * function when declaring them. Failure to do so will cause commands to hang. ex:
 * ```
 * mainnet: {
 *     provider: function() {
 *       return new HDWalletProvider(mnemonic, 'https://mainnet.infura.io/<infura-key>')
 *     },
 *     network_id: '1',
 *     gas: 4500000,
 *     gasPrice: 10000000000,
 *   },
 */
require('dotenv').config()
const WalletProvider = require('truffle-privatekey-provider')

const privKey = process.env.PRIVATE_KEY

if (!privKey) {
  throw Error('PRIVATE_KEY is required. Is it in .env?')
}

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    development: {
      host: 'localhost',
      port: 8545,
      network_id: '*', // Match any network id
    },
    rinkeby: {
      provider: new WalletProvider(privKey, 'https://rinkeby.infura.io'),
      network_id: '*',
      gas: 4712383,
      gasPrice: 20000000000
    },
  },
};
