let nightModeToggled = false;

function listenForClicks() {

    document.addEventListener("change", (e) => {
        function executeColorChange(tabs) {
            if (nightModeToggled) {
                browser.tabs.sendMessage(tabs[0].id, {
                    command: "nm_on"
                });
            }
            else {
                browser.tabs.sendMessage(tabs[0].id, {
                    command: "nm_off"
                });

            }
        }

        function reportError(error) {
            console.error('Could not toggle ' + error)
        }

        if (e.target.classList.contains("toggle")) {
            nightModeToggled = !nightModeToggled;
            browser.tabs.query({active: true, currentWindow: true})
                .then(executeColorChange)
                .catch(reportError);
        }
    });
}

function reportExecuteScriptError(error) {
    document.querySelector("#popup-content").classList.add("hidden");
    document.querySelector("#error-content").classList.remove("hidden");
    console.error("Failed to toggle NightMode, reason: " + error.message)
}

browser.tabs.executeScript({file: "/content_scripts/night_moder.js"})
    .then(listenForClicks)
    .catch(reportExecuteScriptError);