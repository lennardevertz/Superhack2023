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
let assetId;
let selctedNFT;
let assetAddress;

document.addEventListener("DOMContentLoaded", function() {

    const urlParams = new URLSearchParams(window.location.search);
    networkParams = urlParams.get('network');
    tokenParams = urlParams.get('token');
    streamerAddress = urlParams.get('streamerAddress');
    if (networkParams && networkParams.length > 0) {
        networkParamsArray = networkParams.split(",")
        selectedNetwork = networkParamsArray[0];
    } else {
        networkParams = "";
    }
    if (tokenParams && tokenParams.length > 0) {
        tokenParamsArray = tokenParams.split(",")
        selectedToken = tokenParamsArray[0];
    } else {
        tokenParams = "";
    }


    const networkSelect = document.getElementById("network");
    const tokenSelect = document.getElementById("token");
    const nftSelect = document.getElementById("nftDropdown");
    const nftDropdownContainer = document.getElementById("nftDropdownContainer");
    const connectWalletButton = document.getElementById("connectWalletButton");
    const sendButton = document.getElementById("sendButton");

    if (networkParams.length > 0) {
        networkSelect.innerHTML = '';
        networkParamsArray.forEach(network_ => {
            const option = document.createElement("option");
            option.value = network_;
            option.text = network_;
            networkSelect.appendChild(option);
        });
    }

    if (tokenParams.length > 0) {
        tokenSelect.innerHTML = '';
        tokenParamsArray.forEach(token_ => {
            const option = document.createElement("option");
            option.value = token_;
            option.text = token_;
            tokenSelect.appendChild(option);
        });
    }


    networkSelect.addEventListener("change", function(event) {
        selectedNetwork = event.target.value;
        console.log("Selected network:", selectedNetwork);
    });

    tokenSelect.addEventListener("change", async function(event) {
        selectedToken = event.target.value;
        console.log("Selected token:", selectedToken);

        if (selectedToken.toLowerCase() === "nft") {
            // await connectWallet();
            connectedAccount ="0x"
            try {
                const nftData = await fetchNFTsForAddress(connectedAccount);
                populateNFTDropdown(nftData);
    
                nftDropdownContainer.style.display = "block";
            } catch (error) {
                console.error("Error fetching NFTs:", error);
            }
        } else {
            nftDropdownContainer.style.display = "none";
        }

    });

    const nftDropdownToggle = document.getElementById("nftDropdownToggle");
    const customNftDropdown = document.getElementById("customNftDropdown");

    // Event listener for the dropdown toggle button
    nftDropdownToggle.addEventListener("click", function() {
        customNftDropdown.classList.toggle("hidden");
    });

    // Function to show the custom dropdown
    function showCustomDropdown() {
        // customNftDropdown.classList.remove("hidden");
        nftDropdownToggle.classList.remove("hidden");
    }

    // Function to hide the custom dropdown
    function hideCustomDropdown() {
        customNftDropdown.classList.add("hidden");
        nftDropdownToggle.classList.add("hidden");
    }


    async function fetchNFTsForAddress(address) {
        // const response = await fetch(`YOUR_NFT_API_ENDPOINT/${address}`);
        const response = [{assetAddress: "0x76be3b62873462d2142405439777e971754e8e77", id: 10519, name: "Erasure", imageUrl: "https://i.seadn.io/gcs/files/b1491c1ba6e90f36c4029c59e00a4f97.png?auto=format&dpr=1&w=1000"}, {assetAddress: "0xnftaddress", id: 1, name: "Test NFT Name", imageUrl: "https://lh3.googleusercontent.com/RRappOVtmotZGADmfAUgPaD4_Qlg5yboAffg1dg_BfherhsudhOQouR4cbtXk4muWK4ymLvEfOXYvVxds9nR7DaWjs_2pYOupSiM=w600"}];
        // const data = await response.json();
        return response;
    }    

    function populateNFTDropdown(nftData) {
        const customNftDropdown = document.getElementById("customNftDropdown");
        customNftDropdown.innerHTML = ""; // Clear existing options
    
        nftData.forEach(nft => {
            const optionDiv = document.createElement("div");
            optionDiv.classList.add(
                "flex", "items-center", "py-2", "px-4", "cursor-pointer", "hover:bg-gray-100"
            );
    
            optionDiv.setAttribute("data-address", nft.assetAddress);
    
            const img = document.createElement("img");
            img.src = nft.imageUrl;
            img.alt = nft.name;
            img.classList.add("w-6", "h-6", "mr-2");
    
            const textDiv = document.createElement("div");
            textDiv.textContent = nft.name;
            textDiv.classList.add("ml-2");
    
            optionDiv.appendChild(img);
            optionDiv.appendChild(textDiv);
    
            customNftDropdown.appendChild(optionDiv);
    
            optionDiv.addEventListener("click", function() {
                selectedToken = "nft";
                assetAddress = optionDiv.getAttribute("data-address");
                assetId = nft.id;
                console.log(assetId, assetAddress)
                customNftDropdown.classList.add("hidden");
                nftDropdownToggle.innerHTML = nft.name;
            });
        });
        if (nftData.length > 0) {
            showCustomDropdown();
        } else {
            hideCustomDropdown();
        }
    }

    let walletConnected = false;

    connectWalletButton.addEventListener("click", function(event) {
        if (walletConnected) {
            disconnectWallet();
            walletConnected = false;
        } else {
            connectWallet();
            walletConnected = true;
        }
    });

    sendButton.addEventListener("click", async function(event){
        if (!walletConnected) await connectWallet();
        sendDonation();
    })

    const abiPlayPal = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"recipientAddress","type":"address"},{"indexed":false,"internalType":"string","name":"message","type":"string"},{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":true,"internalType":"address","name":"tokenAddress","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"DonationSent","type":"event"},{"inputs":[{"internalType":"address","name":"_streamer","type":"address"},{"internalType":"string","name":"_message","type":"string"}],"name":"donate","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"_streamer","type":"address"},{"internalType":"uint256","name":"_assetId","type":"uint256"},{"internalType":"uint256","name":"_amount","type":"uint256"},{"internalType":"address","name":"_nftAddress","type":"address"},{"internalType":"string","name":"_message","type":"string"}],"name":"donateERC1155","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"_streamer","type":"address"},{"internalType":"uint256","name":"_assetId","type":"uint256"},{"internalType":"address","name":"_nftAddress","type":"address"},{"internalType":"string","name":"_message","type":"string"}],"name":"donateERC721","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"_streamer","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"},{"internalType":"address","name":"_tokenAddr","type":"address"},{"internalType":"string","name":"_message","type":"string"}],"name":"donateToken","outputs":[],"stateMutability":"payable","type":"function"}];
    const playPalAddressBase = "0x5424cc1599d25fFD314c54DD59A65Cd6d4ac1d2C";

    const ERC20Abi = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}];
    const ERC1155Abi = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256[]","name":"ids","type":"uint256[]"},{"indexed":false,"internalType":"uint256[]","name":"values","type":"uint256[]"}],"name":"TransferBatch","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"id","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"TransferSingle","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"value","type":"string"},{"indexed":true,"internalType":"uint256","name":"id","type":"uint256"}],"name":"URI","type":"event"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"id","type":"uint256"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address[]","name":"accounts","type":"address[]"},{"internalType":"uint256[]","name":"ids","type":"uint256[]"}],"name":"balanceOfBatch","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"mint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256[]","name":"ids","type":"uint256[]"},{"internalType":"uint256[]","name":"amounts","type":"uint256[]"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"safeBatchTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"uri","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"}];

    const web3Base = new Web3(new Web3.providers.HttpProvider("https://goerli.base.org"));

    let coingeckoId = {
        "0x0000000000000000000000000000000000000000": ["ethereum", 18],
        "0xb23d80f5fefcddaa212212f028021b41ded428cf": ["echelon-prime", 18],
    };

    let tokenAddresses = {
        ETH: "0x0000000000000000000000000000000000000000",
        PRIME: "0xb23d80f5fefcddaa212212f028021b41ded428cf"
    }

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
        connectWalletButton.textContent = "Disconnect " + connectedAccount.substring(0, 6).concat("...").concat(connectedAccount.substr(-4));
        return
    }

    async function disconnectWallet() {
        provider = null;
        web3 = null;
        connectedAccount = ""
        connectWalletButton.textContent = "Connect Wallet";

    }

    async function sendDonation() {
        let message = document.getElementById("message").value;
        let amount = document.getElementById('amount').value == '' ? '1': document.getElementById("amount").value;
        let tokenAddress = selectedToken.toLowerCase() == "nft" ? assetAddress : tokenAddresses[selectedToken];
        console.log(message, amount, tokenAddress, assetId)
        let amountInteger;
        let amountNormal;

        if (typeof(assetId) !== 'undefined') {
            amountInteger = '1'
            amountNormal = '1'
        } else {
            let calculated = await calculateAmount(tokenAddress, amount);
            amountInteger = calculated.integer;
            amountNormal = calculated.normal
        }
        

        console.log("Calculate amount result")
        console.log(amountInteger.toString(), amountNormal.toString())
        await callDonationFunction(amountInteger.toString(), message, tokenAddress, assetId);
    }

    async function calculateAmount(_assetAddr, _amount) {
        let BN = web3Base.utils.BN;
        let priceSt;

        let decimals = coingeckoId[_assetAddr][1];
        let response = await (await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coingeckoId[_assetAddr][0]}&vs_currencies=USD`)).json();
        priceSt = Object.values(Object.values(response)[0])[0].toString();
        console.log(priceSt, decimals)

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

    async function callDonationFunction(amount, message, assetAddr, assetId=0) {
        console.log(amount, message, assetAddr, assetId=0)

        let BN = web3Base.utils.BN;

        // Switch wallet to desired network
        await switchNetwork(web3, selectedNetwork, provider);
    
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
                console.log("Sending native token")
                gas = await contractInstance.methods.donate(streamerAddress, message).estimateGas({from: connectedAccount, value: amount.toString()});
                result = await contractInstance.methods.donate(streamerAddress, message).send({ from: connectedAccount, value: amount.toString(), gas: gas, gasPrice: gasPrice });
            break;
            default:
                if (assetId==0 || typeof(assetId) == 'undefined'){
                    console.log("Sending erc20")
                    const tokenContract = new web3.eth.Contract(ERC20Abi, assetAddr);
                    const allowance = await tokenContract.methods.allowance(connectedAccount, playPalAddressBase).call()
                    const allowanceBN = new BN(allowance)
                    const amountBN = new BN(amount)
                    if (allowanceBN.lte(amountBN)) {
                        let approval = await tokenContract.methods
                            .approve(playPalAddressBase, BigNumber.from(amount).toString())
                            .send({
                                from: connectedAccount,
                                gasPrice: gasPrice
                            })
                    }
                    gas = await contractInstance.methods.donateToken(streamerAddress, amount.toString(), assetAddr, message).estimateGas({from: connectedAccount, value: 0});
                    result = await contractInstance.methods.donateToken(streamerAddress, amount.toString(), assetAddr, message).send({ from: connectedAccount, value: 0, gas: gas, gasPrice: gasPrice });
                } else {
                    console.log("Sending erc1155")
                    const nftContract = new web3.eth.Contract(ERC1155Abi, assetAddr);
                    const isApproved = await nftContract.methods.isApprovedForAll(connectedAccount, playPalAddressBase).call()

                    if (!isApproved) {
                        let approval = await nftContract.methods
                            .setApprovalForAll(playPalAddressBase, true)
                            .send ({
                                from: connectedAccount
                            })
                    }
                    gas = await contractInstance.methods.donateERC1155(streamerAddress, assetId, amount.toString(), assetAddr, message).estimateGas({from: connectedAccount, value: 0});
                    result = await contractInstance.methods.donateERC1155(streamerAddress, assetId, amount.toString(), assetAddr, message).send({ from: connectedAccount, value: 0, gas: gas, gasPrice: gasPrice });
                }
            throw new Error("Invalid network name");
        }

        console.log(result)

        return result;
    }
});