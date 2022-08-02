const BilleStore = artifacts.require("BilleStore");

module.exports = async function (deployer) {
  deployer.deploy(BilleStore);
}
