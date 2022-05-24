const KnightToken = artifacts.require("./KnightToken");
const Marketplace = artifacts.require("./Marketplace");

module.exports = async function (deployer, network, accounts) {
    // for (let i = 0; i < 4; i++) {
    //     await createToken(deployer, i);
    // }
    await createToken1(deployer);
    await createToken2(deployer);
    await createToken3(deployer);
    await createToken4(deployer);
}
// alternative
// module.exports = (deployer, network, accounts) => deployer
//     .then(() => createToken1(deployer, accounts))
//     .then(() => createToken2(deployer))
//     .then(() => createToken3(deployer));

async function createToken1(deployer) {
    let gold = await KnightToken.deployed();
    //console.log(Marketplace.address);
    let balance = (await gold.balanceOf(Marketplace.address, 0));
    //console.log("I 1: ");
    //console.log(balance);
    let mint = await gold.mint(Marketplace.address, 0, 20, 0x00);
    //console.log(mint);
    balance = (await gold.balanceOf(Marketplace.address, 0));
    //console.log("I 2: ")
    //console.log(balance);
}

async function createToken2(deployer) {
    let silver = await KnightToken.deployed();
    let balance = (await silver.balanceOf(Marketplace.address, 1));
    await silver.mint(Marketplace.address, 1, 15, 0x00);
    balance = (await silver.balanceOf(Marketplace.address, 1))
}

async function createToken3(deployer) {
    console.log("third")
    copper = (await KnightToken.deployed());
    copper.mint(Marketplace.address, 2, 10, 0x00);
}

async function createToken4(deployer) {
    console.log("fourth")
    copper = (await KnightToken.deployed());
    copper.mint(Marketplace.address, 3, 5, 0x00);
}
