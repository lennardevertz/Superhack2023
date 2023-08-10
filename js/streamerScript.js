document.addEventListener("DOMContentLoaded", function() {
    const generateUrlButton = document.getElementById("generateUrlButton");
    const generateSnippetButton = document.getElementById("generateSnippetButton");
    const walletAddressInput = document.getElementById("walletAddress");
    const donationNetworksCheckboxes = document.querySelectorAll('input[name="donationNetworks"]');
    const donationCoinsCheckboxes = document.querySelectorAll('input[name="donationCoins"]');
    const networkError = document.getElementById("networkError");
    const coinError = document.getElementById("coinError");
    const addressError = document.getElementById("addressError");
    
    generateUrlButton.addEventListener("click", function(event) {
        const selectedNetworks = Array.from(donationNetworksCheckboxes)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.value);
        
        const selectedCoins = Array.from(donationCoinsCheckboxes)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.value);
        
        if (walletAddressInput.value === "") {
            addressError.classList.remove("hidden");
            return;
        } else {
            addressError.classList.add("hidden");
        }
        
        if (selectedNetworks.length === 0) {
            networkError.classList.remove("hidden");
            return;
        } else {
            networkError.classList.add("hidden");
        }
        
        if (selectedCoins.length === 0) {
            coinError.classList.remove("hidden");
            return;
        } else {
            coinError.classList.add("hidden");
        }
        
        const obsUrl = `/obs.html?streamerAddress=${walletAddressInput.value}`;
        openPopup(obsUrl);
    });

    generateSnippetButton.addEventListener("click", function(event) {
        const selectedNetworks = Array.from(donationNetworksCheckboxes)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.value);
        
        const selectedCoins = Array.from(donationCoinsCheckboxes)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.value);
        
        if (walletAddressInput.value === "") {
            addressError.classList.remove("hidden");
            return;
        } else {
            addressError.classList.add("hidden");
        }
        
        if (selectedNetworks.length === 0) {
            networkError.classList.remove("hidden");
            return;
        } else {
            networkError.classList.add("hidden");
        }
        
        if (selectedCoins.length === 0) {
            coinError.classList.remove("hidden");
            return;
        } else {
            coinError.classList.add("hidden");
        }
        
        const donationUrl = `/donorPage.html?wallet=${walletAddressInput.value}&networks=${selectedNetworks.join(',')}&coins=${selectedCoins.join(',')}`;
        openPopup(donationUrl);
    });

    function openPopup(url) {
        const urlPopup = document.getElementById("urlPopup");
        const generatedUrlTextarea = document.getElementById("generatedUrl");
        const copyButton = document.getElementById("copyButton");
        const closeButton = document.getElementById("closeButton");

        generatedUrlTextarea.value = url;
        urlPopup.classList.remove("hidden");

        copyButton.addEventListener("click", function() {
            generatedUrlTextarea.select();
            document.execCommand("copy");
        });

        closeButton.addEventListener("click", function() {
            urlPopup.classList.add("hidden");
        });
    }

    walletAddressInput.addEventListener("input", function(event) {
        addressError.classList.add("hidden");
    });

    donationNetworksCheckboxes.forEach(function(checkbox) {
        checkbox.addEventListener("change", function(event) {
            networkError.classList.add("hidden");
        });
    });

    donationCoinsCheckboxes.forEach(function(checkbox) {
        checkbox.addEventListener("change", function(event) {
            coinError.classList.add("hidden");
        });
    });
});