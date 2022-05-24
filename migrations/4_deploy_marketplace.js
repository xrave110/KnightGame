const KnightToken = artifacts.require("./KnightToken");
const Marketplace = artifacts.require("./Marketplace");

module.exports = (deployer) => deployer
    .then(() => deployToken(deployer));

function deployToken(deployer) {
    return deployer.deploy(Marketplace, KnightToken.address);
}
