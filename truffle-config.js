module.exports = {

   networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*"
    }
  },

  // contracts_directory: './contracts/',
  // contracts_build_directory: './src/artifacts/', from vue.js

  compilers: {
    solc: {
      version: "0.8.11",    // Fetch exact version from solc-bin (default: truffle's version)
      optimizer: {
        enabled: true,
        runs: 200
      },
    }
  },
};
