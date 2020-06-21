const WRBTC = artifacts.require("WRBTC");

module.exports = function(deployer) {
  deployer.deploy(WRBTC);
};
