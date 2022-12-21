const pathname = (location.pathname).toString().split("/");
const scanResult = document.getElementById('scanned_result');
const singleResult = document.getElementById('single_result');
const multiResult = document.getElementById('multi_result');
const scanButton = document.getElementById('getScanButton')
const singleButton = document.getElementById('getSingleButton')
const multiButton = document.getElementById('getMultiButton')

if ( getParameterByName('redirect') === "Y" ) {
    const target = pathname[2];
    if ( target === 'single' ) singleButton.click();
    else multiButton.click();
}

if ( pathname.length === 3 ) {
    const target = pathname[2];

    switch (target) {
        case 'scan' :
            if ( scanResult.classList.contains('hide') ) {
                scanResult.classList.remove("hide");
                scanButton.classList.remove("white");
            }
            singleResult.classList.add("hide");
            singleButton.classList.add("white");
            multiResult.classList.add("hide");
            multiButton.classList.add("white");
            break;
        case 'single' :
            if ( singleResult.classList.contains('hide') ) {
                singleResult.classList.remove("hide");
                singleButton.classList.remove("white");
            }
            scanResult.classList.add("hide");
            scanButton.classList.add("white");
            multiResult.classList.add("hide");
            multiButton.classList.add("white");
            break;
        case 'multi' :
            if ( multiResult.classList.contains('hide') ) {
                multiResult.classList.remove("hide");
                multiButton.classList.remove("white");
            }
            scanResult.classList.add("hide");
            scanButton.classList.add("white");
            singleResult.classList.add("hide");
            singleButton.classList.add("white");
            break;
    }
} else {
    scanButton.click();
}

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    let regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}