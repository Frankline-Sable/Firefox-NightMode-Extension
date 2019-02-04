(function () {
    if(window.hasRun){
        return;
    }
    window.hasRun=true;

    function changeMode(mode) {
        if(mode){

            document.body.style.backgroundColor="black";
            document.body.style.color="white";
        }else{
            document.body.style.border="5px solid green";
        }
    }

    browser.runtime.onMessage.addListener((message) => {
        if (message.command === "nm_on") {
            changeMode(true);
        }
        else if (message.command === "nm_off") {
            changeMode(false);
        }
    });

})();