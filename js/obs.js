let streamerAddress ;
let name;
let currBlockBase;
let currBlockOP;
let currBlockZora;
let playPalBase;
let playPalOP;
let playPalZora;
let txnHashes = new Array();
let resTip = new Array();

document.addEventListener("DOMContentLoaded", function() {
    const urlParams = new URLSearchParams(window.location.search);

    streamerAddress = urlParams.get('streamerAddress');
});

let abiPlayPal = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"recipientAddress","type":"address"},{"indexed":false,"internalType":"string","name":"message","type":"string"},{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":true,"internalType":"address","name":"tokenAddress","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"DonationSent","type":"event"},{"inputs":[{"internalType":"address","name":"_streamer","type":"address"},{"internalType":"string","name":"_message","type":"string"}],"name":"donate","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"_streamer","type":"address"},{"internalType":"uint256","name":"_assetId","type":"uint256"},{"internalType":"uint256","name":"_amount","type":"uint256"},{"internalType":"address","name":"_nftAddress","type":"address"},{"internalType":"string","name":"_message","type":"string"}],"name":"donateERC1155","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"_streamer","type":"address"},{"internalType":"uint256","name":"_assetId","type":"uint256"},{"internalType":"address","name":"_nftAddress","type":"address"},{"internalType":"string","name":"_message","type":"string"}],"name":"donateERC721","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"_streamer","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"},{"internalType":"address","name":"_tokenAddr","type":"address"},{"internalType":"string","name":"_message","type":"string"}],"name":"donateToken","outputs":[],"stateMutability":"payable","type":"function"}];
let playPalAddressBase = "0x5424cc1599d25fFD314c54DD59A65Cd6d4ac1d2C";
let playPalAddressOP = "0x0Ad5258c3b7049E76DBCf41Ed62a62fF80564f30";
let playPalAddressZora = "0x64c47b7920B107027DedB53e3c5b070cDD14eE4D";

const ERC1155Abi = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256[]","name":"ids","type":"uint256[]"},{"indexed":false,"internalType":"uint256[]","name":"values","type":"uint256[]"}],"name":"TransferBatch","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"id","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"TransferSingle","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"value","type":"string"},{"indexed":true,"internalType":"uint256","name":"id","type":"uint256"}],"name":"URI","type":"event"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"id","type":"uint256"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address[]","name":"accounts","type":"address[]"},{"internalType":"uint256[]","name":"ids","type":"uint256[]"}],"name":"balanceOfBatch","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"mint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256[]","name":"ids","type":"uint256[]"},{"internalType":"uint256[]","name":"amounts","type":"uint256[]"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"safeBatchTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"uri","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"}];

const web3Base = new Web3(new Web3.providers.HttpProvider("https://goerli.base.org"));
const web3OP = new Web3(new Web3.providers.HttpProvider("https://optimism-goerli.publicnode.com"));
const web3Zora = new Web3(new Web3.providers.HttpProvider("https://testnet.rpc.zora.energy"));


let coingeckoId = {
    "base": {
        "0x0000000000000000000000000000000000000000": ["ethereum", 18],
        "0xb23d80f5fefcddaa212212f028021b41ded428cf": ["echelon-prime", 18]
    },
    "optimism": {
        "0x0000000000000000000000000000000000000000": ["ethereum", 18]
    },
    "zora": {
        "0x0000000000000000000000000000000000000000": ["ethereum", 18]
    }
};


async function loadPlayPal(web3, contractAddr) {
    return await new web3.eth.Contract(abiPlayPal, contractAddr);
}


async function loadPlayPalContracts() {
    playPalBase = await loadPlayPal(web3Base, playPalAddressBase);
    playPalOP = await loadPlayPal(web3OP, playPalAddressOP);
    playPalZora = await loadPlayPal(web3Zora, playPalAddressZora);
}

async function setCurrBlock() {
    currBlockBase = await web3Base.eth.getBlockNumber();
    currBlockOP = await web3OP.eth.getBlockNumber();
    currBlockZora = await web3Zora.eth.getBlockNumber();
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
                fromAddress: from_,
                network: "base"
            }

            tempNewDonations.push(tempRet);
            txnHashes.push(eventsBase[i].transactionHash);
        }
    }

    eventsOP = await playPalOP.getPastEvents("DonationSent", {
        fromBlock: currBlockOP - 5,
        filter: {
            recipientAddress: streamerAddress,
        },
    });
    for (let i = 0; i < eventsOP.length; i++) {
        console.log(eventsOP[i])
        if (!txnHashes.includes(eventsOP[i].transactionHash)) {
            txn = await web3OP.eth.getTransaction(eventsOP[i].transactionHash);
            from_ = txn.from;
            let method = txn.input.slice(2, 10);
            let remove = txn.input.replace(method, "");
            let inputs = await getInputs(method, remove);
            console.log(inputs)
            let tempRet = {
                amount: eventsOP[i].returnValues.amount,
                tokenAddress: eventsOP[i].returnValues.tokenAddress,
                tokenId : inputs._assetId,
                message: eventsOP[i].returnValues.message,
                fromAddress: from_,
                network: "optimism"
            }

            tempNewDonations.push(tempRet);
            txnHashes.push(eventsOP[i].transactionHash);
        }
    }

    eventsZora = await playPalZora.getPastEvents("DonationSent", {
        fromBlock: currBlockZora - 5,
        filter: {
            recipientAddress: streamerAddress,
        },
    });
    for (let i = 0; i < eventsZora.length; i++) {
        console.log(eventsZora[i])
        if (!txnHashes.includes(eventsZora[i].transactionHash)) {
            txn = await web3Zora.eth.getTransaction(eventsZora[i].transactionHash);
            from_ = txn.from;
            let method = txn.input.slice(2, 10);
            let remove = txn.input.replace(method, "");
            let inputs = await getInputs(method, remove);
            console.log(inputs)
            let tempRet = {
                amount: eventsZora[i].returnValues.amount,
                tokenAddress: eventsZora[i].returnValues.tokenAddress,
                tokenId : inputs._assetId,
                message: eventsZora[i].returnValues.message,
                fromAddress: from_,
                network: "zora"
            }

            tempNewDonations.push(tempRet);
            txnHashes.push(eventsZora[i].transactionHash);
        }
    }

    await setCurrBlock();

    return tempNewDonations;
}

async function getVal(tippingAmount, tokenPrice, decimals) {
    return roundUp((tippingAmount / Math.pow(10, decimals)) * tokenPrice, 2);
}

async function calculateDollar(_assetAddr, _amount, _network) {
    let priceSt;
    let response = await (await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coingeckoId[_network][_assetAddr][0]}&vs_currencies=USD`)).json();
    priceSt = Object.values(Object.values(response)[0])[0];

    let decimals = coingeckoId[_network][_assetAddr][1];
    let val = this.getVal(_amount, priceSt, decimals);
    return val;
}

async function getMetadataURI(nftAddress, tokenId, w3) {
    const nftContract = new w3.eth.Contract(ERC1155Abi, nftAddress);
    try {
        const metadataURI = await nftContract.methods.uri(tokenId).call();
        return metadataURI;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

async function fetchMetadata(metadataURI) {
    try {
        const response = await fetch(metadataURI);
        const metadata = await response.json();
        return metadata;
    } catch (error) {
        console.error('Error fetching metadata:', error);
        return null;
    }
}

interval = setInterval(async function () {
    ret = await fetchDonations();
    console.log(ret);
    retString = "";
    for (let i = 0; i < ret.length; i++) {
        let nftImgSrc;
    
        fromAccount = ret[i].fromAddress;
         //add some prettify for addr
        if (typeof(ret[i].tokenId) == "undefined") {
            basicInfo = fromAccount.substring(0, 6).concat("...").concat(fromAccount.substr(-4)) + " tipped you " + "$" + (await calculateDollar(ret[i].tokenAddress, ret[i].amount, ret[i].network));
        } else {
            const metadataURI = await getMetadataURI(ret[i].tokenAddress, ret[i].tokenId, web3Base);
            let nftName;
            let nftImg;

            if (metadataURI) {
                const metadata = await fetchMetadata(metadataURI);
                if (metadata) {
                    nftName = metadata.name;
                    nftImg = nft.image;
                } else {
                    console.log('Failed to fetch NFT metadata.');
                }
            } else {
                console.log('Failed to retrieve metadata URI.');
            }
            basicInfo = fromAccount.substring(0, 6).concat("...").concat(fromAccount.substr(-4)) + " sent " + nftName;
            nftImgSrc = nftImg;
        }
        
        message = ret[i].message;

        resTip.push([basicInfo, message, nftImgSrc]);
    }

}, 5000);

displayAlerts = setInterval(async function () {
    console.log("checking messages");
    console.log(resTip)
    if (resTip.length > 0) {
        if (document.getElementById('fader').style.opacity == 0) {
            document.getElementById("baseInfo").innerHTML = resTip[0][0];
            document.getElementById("message").innerHTML = resTip[0][1];
            if (typeof(resTip[0][2]) !== 'undefined') { 
                document.getElementById("nftImg").src = resTip[0][2];
                document.getElementById("nftImg").style.display = "";
            }
            console.log("visible")
            document.getElementById('fader').style.opacity = 1;
            console.log(document.getElementById("donationAlert").style.display);
            resTip.shift();
            console.log("timeout start")
            await setTimeout(function () {
                document.getElementById('fader').style.opacity = 0;
                document.getElementById("nftImg").style.display = "none";
            }, 5000);
            console.log("timeout end")
        }
    }
}, 2000);

async function init() {
    await loadPlayPalContracts();
    await setCurrBlock();
    txnHashes = new Array();
}

init();
