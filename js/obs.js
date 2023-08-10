let streamerAddress = "0xbbbc3d409368b8A96DcC427D67B045e120d39E2A";
let name;
let currBlockBase;
let playPalBase;
let txnHashes = new Array();
let resTip = new Array();

let abiPlayPal = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"recipientAddress","type":"address"},{"indexed":false,"internalType":"string","name":"message","type":"string"},{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":true,"internalType":"address","name":"tokenAddress","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"DonationSent","type":"event"},{"inputs":[{"internalType":"address","name":"_streamer","type":"address"},{"internalType":"string","name":"_message","type":"string"}],"name":"donate","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"_streamer","type":"address"},{"internalType":"uint256","name":"_assetId","type":"uint256"},{"internalType":"uint256","name":"_amount","type":"uint256"},{"internalType":"address","name":"_nftAddress","type":"address"},{"internalType":"string","name":"_message","type":"string"}],"name":"donateERC1155","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"_streamer","type":"address"},{"internalType":"uint256","name":"_assetId","type":"uint256"},{"internalType":"address","name":"_nftAddress","type":"address"},{"internalType":"string","name":"_message","type":"string"}],"name":"donateERC721","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"_streamer","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"},{"internalType":"address","name":"_tokenAddr","type":"address"},{"internalType":"string","name":"_message","type":"string"}],"name":"donateToken","outputs":[],"stateMutability":"payable","type":"function"}];
let playPalAddressBase = "0x5424cc1599d25fFD314c54DD59A65Cd6d4ac1d2C";


const web3Base = new Web3(new Web3.providers.HttpProvider("https://goerli.base.org"));


let coingeckoId = {
    "0x0000000000000000000000000000000000000000": ["ethereum", 18],
    "0xb23d80f5fefcddaa212212f028021b41ded428cf": ["echelon-prime", 18],
};


async function loadPlayPal(web3, contractAddr) {
    return await new web3.eth.Contract(abiPlayPal, contractAddr);
}


async function loadPlayPalContracts() {
    playPalBase = await loadPlayPal(web3Base, playPalAddressBase);
}

async function setCurrBlock() {
    currBlockBase = await web3Base.eth.getBlockNumber();
    // currBlockBase = 8235798 ;
}

// ignore erc721 for now
async function getInputs(_method, _remove) {
    if (_method == "429c14d7") {
        return await web3Base.eth.abi.decodeParameters(
            [
                {
                    type: "address",
                    name: "_streamer",
                },
                {
                    type: "string",
                    name: "_message",
                },
            ],
            _remove
        );
    } else if (_method == "37adfb6c") {
        return await web3Base.eth.abi.decodeParameters(
            [
                {
                    type: "address",
                    name: "_streamer",
                },
                {
                    type: "uint256",
                    name: "_amount",
                },
                {
                    type: "address",
                    name: "_tokenAddr",
                },
                {
                    type: "string",
                    name: "_message",
                },
            ],
            _remove
        );
    } else if (_method == "2c875abc") {
        return await web3Base.eth.abi.decodeParameters(
            [
                {
                    type: "address",
                    name: "_streamer",
                },
                {
                    type: "uint256",
                    name: "_assetId",
                },
                {
                    type: "uint256",
                    name: "_amount",
                },
                {
                    type: "address",
                    name: "_nftAddress",
                },
                {
                    type: "string",
                    name: "_message",
                },
            ],
            _remove
        );
    }
}

function roundUp(num, precision) {
    precision = Math.pow(10, precision);
    return Math.ceil(num * precision) / precision;
}

async function fetchDonations() {
    console.log("Searching on base testnet from block: ", currBlockBase);
    
    let tempNewDonations = new Array();

    eventsBase = await playPalBase.getPastEvents("DonationSent", {
        fromBlock: currBlockBase - 5,
        filter: {
            recipientAddress: streamerAddress,
        },
    });
    for (let i = 0; i < eventsBase.length; i++) {
        console.log(eventsBase[i])
        if (!txnHashes.includes(eventsBase[i].transactionHash)) {
            txn = await web3Base.eth.getTransaction(eventsBase[i].transactionHash);
            from_ = txn.from;
            let method = txn.input.slice(2, 10);
            let remove = txn.input.replace(method, "");
            let inputs = await getInputs(method, remove);
            console.log(inputs)
            let tempRet = {
                amount: eventsBase[i].returnValues.amount,
                tokenAddress: eventsBase[i].returnValues.tokenAddress,
                tokenId : inputs._assetId,
                message: eventsBase[i].returnValues.message,
                fromAddress: from_
            }

            tempNewDonations.push(tempRet);
            txnHashes.push(eventsBase[i].transactionHash);
        }
    }

    await setCurrBlock();

    return tempNewDonations;
}

async function getVal(tippingAmount, tokenPrice, decimals) {
    return roundUp((tippingAmount / Math.pow(10, decimals)) * tokenPrice, 2);
}

async function calculateDollar(_assetAddr, _amount) {
    let priceSt;
    let response = await (await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coingeckoId[_assetAddr][0]}&vs_currencies=USD`)).json();
    priceSt = Object.values(Object.values(response)[0])[0];

    let decimals = coingeckoId[_assetAddr][1];
    let val = this.getVal(_amount, priceSt, decimals);
    return val;
}

interval = setInterval(async function () {
    ret = await fetchDonations();
    console.log(ret);
    retString = "";
    let tipDivOuter = document.createElement("div");
    let resultingTips = [];
    for (let i = 0; i < ret.length; i++) {
    
        fromAccount = ret[i].fromAddress;
         //add some prettify for addr
        if (typeof(ret[i].tokenId) == "undefined") {
            basicInfo = fromAccount.substring(0, 6).concat("...").concat(fromAccount.substr(-4)) + " tipped you " + "$" + (await calculateDollar(ret[i].tokenAddress, ret[i].amount));
        }
        
        message = ret[i].message;

        resultingTips.push([basicInfo, message]);

        resTip.push([basicInfo, message]);
    }

}, 5000);

displayAlerts = setInterval(async function () {
    console.log("checking messages");
    console.log(resTip)
    if (resTip.length > 0) {
        if (document.getElementById('fader').style.opacity == 0) {
            document.getElementById("baseInfo").innerHTML = resTip[0][0];
            document.getElementById("message").innerHTML = resTip[0][1];
            console.log("visible")
            document.getElementById('fader').style.opacity = 1;
            //document.getElementById("donationAlert").style.display = "block";
            console.log(document.getElementById("donationAlert").style.display);
            resTip.shift();
            console.log("timeout start")
            await setTimeout(function () {document.getElementById('fader').style.opacity = 0;}, 5000);
            console.log("timeout end")
        }
    }
}, 2000);

async function init() {
    // add param handling here
    await loadPlayPalContracts();
    await setCurrBlock();
    txnHashes = new Array();
}

init();
