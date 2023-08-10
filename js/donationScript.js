let streamerAddress;
let playPalBase;
let providerl
let connectedAccount;
let web3;
let selectedNetwork;
let selectedToken;
let networkParams;
let tokenParams;
let networkParamsArray;
let tokenParamsArray;

document.addEventListener("DOMContentLoaded", function() {

    const urlParams = new URLSearchParams(window.location.search);
    networkParams = urlParams.get('network');
    tokenParams = urlParams.get('token');
    if (networkParams && networkParams.length > 0) {
        networkParamsArray = networkParams.split(",")
    } else {
        networkParams = "";
    }
    if (tokenParams && tokenParams.length > 0) {
        tokenParamsArray = tokenParams.split(",")
    } else {
        tokenParams = "";
    }


    const networkSelect = document.getElementById("network");
    const tokenSelect = document.getElementById("token");
    const connectWalletButton = document.getElementById("connectWalletButton");

    if (networkParams.length > 0) {
        // Clear existing options and add options based on network parameter
        networkSelect.innerHTML = '';
        networkParamsArray.forEach(network => {
            const option = document.createElement("option");
            option.value = network;
            option.text = network;
            networkSelect.appendChild(option);
        });
    }

    if (tokenParams.length > 0) {
        // Clear existing options and add options based on token parameter
        tokenSelect.innerHTML = '';
        tokenParamsArray.forEach(token => {
            const option = document.createElement("option");
            option.value = token;
            option.text = token;
            tokenSelect.appendChild(option);
        });
    }


    networkSelect.addEventListener("change", function(event) {
        selectedNetwork = event.target.value;
        console.log("Selected network:", selectedNetwork);
    });

    tokenSelect.addEventListener("change", function(event) {
        selectedToken = event.target.value;
        console.log("Selected token:", selectedToken);
    });

    connectWalletButton.addEventListener("click", function(event) {
        console.log("Connecting wallet")
        connectWallet();
    });

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

    async function init() {
        // add param handling here
        await loadPlayPalContracts();
    }

    init();

    async function connectWallet() {

        provider = window.ethereum
        console.log(provider)
        await provider.enable()
        web3 = await new Web3(provider);
        let accounts = await web3.eth.getAccounts();
        connectedAccount = accounts[0]
        console.log(connectedAccount)

    }

    async function sendDonation() {
        let message = document.getElementById("message").value;
        let amount = document.getElementById('amount').value;
        let token = document.getElementById('token').value;
        let assetId = document.getElementById('assetId').value;

        let {
            integer: amountInteger,
            normal: amountNormal
        } = await calculateAmount(token, amount)

        console.log("Calculate amount result")
        console.log(amountInteger.toString(), amountNormal.toString())
        await callContractFunction(web3, network, amountInteger, message, provider, token, assetId);
    }

    async function calculateAmount(_assetAddr, _amount) {
        let priceSt;

        let decimals = coingeckoId[_assetAddr][1];
        let response = await (await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coingeckoId[_assetAddr][0]}&vs_currencies=USD`)).json();
        priceSt = Object.values(Object.values(response)[0])[0].toString();
        console.log(priceSt, decimals)

        let BN = web3Base.utils.BN;
        let ten = new BN(10);
        let base = ten.pow(new BN(decimals));
        let integer = await getAmount(_amount.toString(), priceSt, decimals);
        let normal = integer.div(base)
        return { integer, normal };
    }

    async function getAmount(amount, tokenPrice, decimals) {
        const BN = web3Base.utils.BN;
        const ten = new BN(10);
        let decimalsTemp = new BN(decimals)
        let baseTemp = ten.pow(new BN(decimalsTemp));

        let decimalCountPrice = tokenPrice.includes('.') ? tokenPrice.split('.')[1].length : 0;
        let multiplierPrice = Math.pow(10, decimalCountPrice) || 1;
        let tokenPriceToInt = new BN(tokenPrice.replace('.', ''));

        let decimalCountValue = amount.includes('.') ? amount.split('.')[1].length : 0;
        let multiplierValue = Math.pow(10, decimalCountValue) || 1;
        let tokenValueToInt = new BN(amount.replace('.', ''));


        console.log(decimalCountValue)
        let retVal = (new BN(multiplierPrice.toString())).mul(baseTemp).mul(tokenValueToInt).div(tokenPriceToInt).div(new BN(multiplierValue.toString()))

        return retVal;
    }

    async function switchNetwork(web3, networkName, provider) {
        // Get current network ID
        const currentNetworkId = await web3.eth.net.getId();
        console.log("Currently connected with id: ", currentNetworkId)
    
        // Get network ID for desired network
        let desiredNetworkId;
        switch (networkName.toLowerCase()) {
        case "base":
            desiredNetworkId = 84531;
            break;
        default:
            throw new Error("Invalid network name");
        }
    
        // Switch network if necessary
        if (currentNetworkId !== desiredNetworkId) {
    
        await provider.request({ method: "wallet_switchEthereumChain", params: [{ chainId: `0x${desiredNetworkId.toString(16)}` }] });
        }
    }

    async function callContractFunction(web3, network, amount, message, provider, assetAddr, assetId=0) {

        // Switch wallet to desired network
        await switchNetwork(web3, network, provider);
    
        // Get contract instance
        const contractInstance = await new web3.eth.Contract(abiPlayPal, playPalAddressBase);
    
        let gas;
        let gasPrice;
        let result;
        try {
            gasPrice = await web3.eth.getGasPrice();
        } catch (e) {
        console.log("Could not estimate gas price: ", e)
        }
    
        switch (assetAddr.toLowerCase()) {
            case "0x0000000000000000000000000000000000000000":
                gas = await contractInstance.methods.donate(streamer, message).estimateGas({from: connectedAccount, value: amount.toString()});
                result = await contractInstance.methods.donate(streamer, message).send({ from: connectedAccount, value: amount.toString(), gas: gas, gasPrice: gasPrice });
            break;
            default:
                if (assetId==0){
                    // add token approval
                    gas = await contractInstance.methods.donateToken(streamer, amount.toString(), assetAddr, message).estimateGas({from: connectedAccount, value: 0});
                    result = await contractInstance.methods.donateToken(streamer, amount.toString(), assetAddr, message).send({ from: connectedAccount, value: 0, gas: gas, gasPrice: gasPrice });
                } else {
                    // add token approval
                    gas = await contractInstance.methods.donateERC1155(streamer, assetId, amount.toString(), assetAddr, message).estimateGas({from: connectedAccount, value: 0});
                    result = await contractInstance.methods.donateERC1155(streamer, assetId, amount.toString(), assetAddr, message).send({ from: connectedAccount, value: 0, gas: gas, gasPrice: gasPrice });
                }
            throw new Error("Invalid network name");
        }

        return;
    }
});