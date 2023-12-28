"use strict";
let x, loadingDiv = document.getElementById("loadingDiv");
window.onload = function () {
    setTimeout(removeLoadingDiv, 300);
};
function removeLoadingDiv() {
    loadingDiv.style.opacity = '1';
    const fadeEffect = setInterval(function () {
        x = +loadingDiv.style.opacity;
        if (x > 0) {
            loadingDiv.style.opacity = `${x - 0.1}`;
        }
        else {
            clearInterval(fadeEffect);
            loadingDiv.remove();
        }
    }, 30);
}
