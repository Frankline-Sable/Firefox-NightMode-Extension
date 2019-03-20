var nightModeOverlay;

function handleMessage(request, sender, sendResponse) {

    document.getElementById("toggle").checked = request.btn;
    setInputsDefaults(request.sd);

    sendResponse({response: "Defaults are set!"});

}

function setInputsDefaults(currentSliderVal) {
    document.getElementById("slider-NM").value = currentSliderVal;
    nightModeOverlay = `.overlay-nm {
                                        height: 100%;
                                        width: 100%;
                                        position: fixed; 
                                        z-index: 1; 
                                        left: 0;
                                        top: 0;
                                        background-color: rgb(0, 0, 0); 
                                        pointer-events: none;
                                        background-color: rgba(0, 0, 0, ${currentSliderVal / 100});});
                                        overflow-x: hidden;
                                        transition: 0.5s;
                              }`;
}

browser.runtime.onMessage.addListener(handleMessage);

function listenForClicks() {
    document.addEventListener("change", (e) => {


        function toggleNightMode(tabs) {
            browser.tabs.insertCSS({code: nightModeOverlay}).then(() => {
                browser.tabs.sendMessage(tabs[0].id, {
                    command: "nm_on",
                });
            });
        }

        function changeNmIntensity(tabs) {
            var val = document.getElementById("slider-NM").value;

            var sliderChange = `.overlay-nm {background-color: 
            rgba(0,0,0,${val / 100});}`;
            browser.tabs.insertCSS({code: sliderChange}).then(() => {
                browser.tabs.sendMessage(tabs[0].id, {
                    command: "SliderChange",
                    value: val
                });
            });
        }

        function reportError(error) {
            console.error('Could not toggle ' + error)
        }

        if (e.target.classList.contains("toggle")) {
            console.log("ok");

            browser.tabs.query({active: true, currentWindow: true})
                .then(toggleNightMode)
                .catch(reportError);
        }
        else if (e.target.classList.contains("deg")) {
            browser.tabs.query({active: true, currentWindow: true})
                .then(changeNmIntensity)
                .catch(reportError);
        }

    });


    function reqInit(tabs) {
        browser.tabs.sendMessage(tabs[0].id, {
            command: "requestInit",
        });
    }

    browser.tabs.query({active: true, currentWindow: true})
        .then(reqInit)
        .catch(reportExecuteScriptError);


}

function reportExecuteScriptError(error) {
    document.querySelector("#popup-content").classList.add("hidden");
    document.querySelector("#error-content").classList.remove("hidden");
    console.error("Failed to toggle NightMode, reason: " + error.message)
}

browser.tabs.executeScript({file: "/content_scripts/night_moder.js"})
    .then(listenForClicks)
    .catch(reportExecuteScriptError);