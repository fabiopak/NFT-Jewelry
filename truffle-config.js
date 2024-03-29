/**
 * Use this file to configure your truffle project. It's seeded with some
 * common settings for different networks and features like migrations,
 * compilation and testing. Uncomment the ones you need or modify
 * them to suit your project as necessary.
 *
 * More information about configuration can be found at:
 *
 * trufflesuite.com/docs/advanced/configuration
 *
 * To deploy via Infura you'll need a wallet provider (like @truffle/hdwallet-provider)
 * to sign your transactions before they're sent to a remote public node. Infura accounts
 * are available for free at: infura.io/register.
 *
 * You'll also need a mnemonic - the twelve word phrase the wallet uses to generate
 * public/private key pairs. If you're publishing your code to GitHub make sure you load this
 * phrase from a file you've .gitignored so it doesn't accidentally become public.
 *
 */

require('dotenv').config();
const HDWalletProvider = require('@truffle/hdwallet-provider');

// const fs = require('fs');
// const mnemonic = fs.readFileSync(".secret").toString().trim();

module.exports = {
  /**
   * Networks define how you connect to your ethereum client and let you set the
   * defaults web3 uses to send transactions. If you don't specify one truffle
   * will spin up a development blockchain for you on port 9545 when you
   * run `develop` or `test`. You can ask a truffle command to use a specific
   * network from the command line, e.g
   *
   * $ truffle test --network <network-name>
   */

  networks: {
    // Useful for testing. The `development` name is special - truffle uses it by default
    // if it's defined here and no other network is specified at the command line.
    // You should run a client (like ganache-cli, geth or parity) in a separate terminal
    // tab if you use this network and you must also set the `host`, `port` and `network_id`
    // options below to some value.
    //
    development: {
     host: "127.0.0.1",     // Localhost (default: none)
     port: 8545,            // Standard Ethereum port (default: none)
     network_id: "*",       // Any network (default: none)
    },
    // Another network with more advanced options...
    // advanced: {
    // port: 8777,             // Custom port
    // network_id: 1342,       // Custom network
    // gas: 8500000,           // Gas sent with each transaction (default: ~6700000)
    // gasPrice: 20000000000,  // 20 gwei (in wei) (default: 100 gwei)
    // from: <address>,        // Account to send txs from (default: accounts[0])
    // websocket: true        // Enable EventEmitter interface for web3 (default: false)
    // },
    // Useful for deploying to a public network.
    // NB: It's important to wrap the provider as a function.
    mumbai: {
      provider: () =>
        new HDWalletProvider(
          process.env.priv_key_mumbai,
          process.env.MUMBAI_PROVIDER,
        ),
      gas: 6000000,
      gasPrice: 50000000000,
      network_id: 80001,
      confirmations: 2,
      skipDryRun: true
    },
    polygon: {
      networkCheckTimeout: 10000,
      timeoutBlocks: 200,
      provider: () =>
        new HDWalletProvider(
          process.env.priv_key_polygon,
          process.env.POLYGON_PROVIDER,
        ),
      gas: 7000000,
      gasPrice: 250000000000,
      network_id: 137,
      confirmations: 2,
      skipDryRun: true
    },
    mainnet: {
      provider: () =>
        new HDWalletProvider(
          process.env.mnemonic,
          `https://avalanche--mainnet--rpc.datahub.figment.io/apikey/${process.env.FIGMENT_KEY}/ext/bc/C/rpc`
        ),
      network_id: 43114,
      gas: 8000000,
      gasPrice: 161000000000,
      timeoutBlocks: 200,
      confirmations: 2,
      skipDryRun: true
    },
    // avaxtest: {
    //   provider: function () {
    //     return new HDWalletProvider({ privateKeys: [process.env.mnemonic], providerOrUrl: process.env.PROVIDER, chainId: "0xa869" })
    //   },
    //   gas: 6000000,
    //   gasPrice: 225000000000,
    //   network_id: "*",
    //   confirmations: 2,
    //   skipDryRun: true
    // },
    // avaxmainnet: {
    //   provider: function () {
    //     return new HDWalletProvider({ privateKeys: [process.env.mnemonic], providerOrUrl: process.env.PROVIDER, chainId: "0xa86a" })
    //   },
    //   gas: 6000000,
    //   gasPrice: 50000000000,
    //   network_id: "*",
    //   confirmations: 2,
    //   skipDryRun: true
    // },
  },

  plugins: ['truffle-contract-size',
    'solidity-coverage',
    'truffle-plugin-verify',
  ],
  // Set default mocha options here, use special reporters etc.
  mocha: {
    reporter: 'eth-gas-reporter',
    reporterOptions: {
      currency: "USD",
      coinmarketcap: `${process.env.CMC_API_KEY}`
    },
    timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.13",    // Fetch exact version from solc-bin (default: truffle's version)
      // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
      settings: {          // See the solidity docs for advice about optimization and evmVersion
        optimizer: {
          enabled: true,
          runs: 200
        },
      //  evmVersion: "byzantium"
      }
    }
  },

  api_keys: {
    etherscan: `${process.env.ETHERSCAN_KEY}`,
    bscscan: `${process.env.BSCSCAN_KEY}`,
    snowtrace: `${process.env.SNOWTRACE_KEY}`,
    polygonscan: `${process.env.POLYGONSCAN_KEY}`,
    ftmscan: `${process.env.FTMSCAN_KEY}`,
    hecoinfo: `${process.env.HECOINFO_KEY}`,
    moonscan: `${process.env.MOONSCAN_KEY}`
  }

  // Truffle DB is currently disabled by default; to enable it, change enabled:
  // false to enabled: true. The default storage location can also be
  // overridden by specifying the adapter settings, as shown in the commented code below.
  //
  // NOTE: It is not possible to migrate your contracts to truffle DB and you should
  // make a backup of your artifacts to a safe location before enabling this feature.
  //
  // After you backed up your artifacts you can utilize db by running migrate as follows: 
  // $ truffle migrate --reset --compile-all
  //
  // db: {
    // enabled: false,
    // host: "127.0.0.1",
    // adapter: {
    //   name: "sqlite",
    //   settings: {
    //     directory: ".db"
    //   }
    // }
  // }
};
