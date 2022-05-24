async function init() {
    // Modern dapp browsers...
    if (window.ethereum) {
        web3Provider = window.ethereum;

        try {
            // Request account access
            await window.ethereum.request({ method: "eth_requestAccounts" });
        } catch (error) {
            // User denied account access...
            console.error("User denied account access")
        }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
        web3Provider = window.web3.currentProvider;
    }
    // If no injected web3 instance is detected, fall back to Ganache 
    else {
        web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
    web3 = new Web3(web3Provider);
    let GameToken = new web3.eth.Contract(tokenAbi, "0xFc73f603D0a7Bf21Aa6EF466c1cB1617ebdea904");
    let KnightToken = new web3.eth.Contract(knightTokenAbi, "0xECad914c8a43D23F2AC7A5462dE989Abe53faf10");
    let Marketplace = new web3.eth.Contract(marketplaceAbi, "0x373537a71Ae2B36B5c09a7912B56706A1afb239B");
    //console.log(GameToken);
    return [GameToken, KnightToken, Marketplace];
}


async function mintAfterGame(address, nrOfTokens, contracts) {
    [GameToken, KnightToken, Marketplace] = contracts;
    GameToken.methods.mint(address, nrOfTokens).send({ from: address })
        .on('receipt', receipt => {
            document.getElementById("game-info").innerHTML += "<br>Transaction Complete</br>";
        })
}

async function buyToken(id) {
    [GameToken, KnightToken, Marketplace] = contracts;

    web3.eth.getAccounts().then(accountArray => {
        let account = accountArray[0];
        let options = {
            from: account,
            value: 0
        };
        if (id == 0) {
            options.value = 10 ** 14;
        }
        else if (id == 1) {
            options.value = 1.5 * (10 ** 14);
        }
        else if (id == 2) {
            options.value = 2 * (10 ** 14);
        }
        else if (id == 3) {
            options.value = 3 * (10 ** 14);
        }
        Marketplace.methods.buyToken(id).send(options)
            .on('receipt', receipt => {
                document.getElementById("game-info").innerHTML += "<br>Transaction Complete</br>";
            })
    })
}

async function getUserItems(contracts) {
    [GameToken, KnightToken, Marketplace] = contracts;
    let tokenPromises;
    tokenPromises = []
    web3.eth.getAccounts().then(accountArray => {
        let account = accountArray[0];
        for (let i = 0; i < 4; i++) {
            tokenPromises.push(KnightToken.methods.balanceOf(account, i).call());
        }
        Promise.all(tokenPromises)
            .then((values) => {
                console.log(values);
                if (values[0] > 0) {
                    playerSpeed = playerSpeed * Math.pow(1.25, values[0]);
                    document.getElementById("game-info").innerHTML += `<br>Pumped boots: ${values[0]} (${playerSpeed})</br>`;
                }
                if (values[1] > 0) {
                    coinGenerationInterval = coinGenerationInterval * Math.pow(0.80, values[1]);
                    document.getElementById("game-info").innerHTML += `<br>Sky blessing helmet: ${values[1]} (${coinGenerationInterval})</br>`;
                }
                if (values[2] > 0) {
                    valuation = valuation + +values[2];
                    document.getElementById("game-info").innerHTML += `<br>Bull market suit: ${values[2]} (${valuation})</br>`;
                }
                if (values[3] > 0) {
                    gameSecond = gameSecond * Math.pow(1.2, values[3]);
                    document.getElementById("game-info").innerHTML += `<br>Freezing gloves: ${values[3]} (${gameSecond})</br>`;
                }
            })
    });
}

// async function mintAfterGame(address, nrOfTokens) {
//     await contract.methods.mint(address, nrOfTokens);
//     result = await contract.methods.balanceOf(address);
//     console.log(result);
//     await contract.events.Transfer()
//         .on('data', receipt => {
//             alert("Transaction Complete");
//         })
// }
