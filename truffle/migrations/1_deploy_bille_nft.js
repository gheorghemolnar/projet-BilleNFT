const BilleNFT = artifacts.require("BilleNFT");

module.exports = function (deployer) {
  deployer.deploy(BilleNFT, _name= "Bille NFT", _symbol = "BNF", _initBaseURI = "ipfs://QmXSEXvuttAcAZghUKyDzp5iDp41EvqDi6Hx3Bthggq8Uh/")
}
