const KnightToken = artifacts.require("./KnightToken");

module.exports = (deployer) => deployer
    .then(() => deployToken(deployer));

function deployToken(deployer) {
    return deployer.deploy(KnightToken);
}