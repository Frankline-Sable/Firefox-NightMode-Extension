(function () {
    if (window.hasRun) {
        return;
    }
    window.hasRun = true;
    var nighModeToggled = false;
    var sliderValue=70;

    function toggleNightMode() {
        if (nighModeToggled) {
            disableNighMode();
        } else {
            initNighMode();
        }
        nighModeToggled = !nighModeToggled;
    }

    function initNighMode() {

        let tag = document.createElement("div");
        tag.className = "overlay-nm";
        tag.id = "overlay-nm";
        document.body.appendChild(tag);
    }

    function disableNighMode() {
        let existingNm = document.querySelectorAll(".overlay-nm");
        for (let tag of existingNm) {
            tag.remove();
        }
    }

    browser.runtime.onMessage.addListener((message) => {
        if (message.command === "nm_on") {
            toggleNightMode();
        }
        else if (message.command === "SliderChange") {
            sliderValue=message.value;

        }
        else {
            notifyBackgroundPage();
        }
    });

    function handleResponse(message) {
        console.log(`Message from the background script: ${message.response}`)

    }

    function handleError(error) {
        console.log(`Error: ${error}`)

    }

    function notifyBackgroundPage() {
        var sending = browser.runtime.sendMessage({
            btn: nighModeToggled,
            sd:sliderValue
        });

        sending.then(handleResponse, handleError);

    }

    //window.addEventListener("click",notifyBackgroundPage);


})();