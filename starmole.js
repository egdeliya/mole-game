let mole = {

}

let moles = document.getElementsByClassName("mole");

function init() {
    for (let i = 0; i < moles.length; i++) {
        let mole = moles[i];
        let toggleMoleDisplayAt = Date.now();

        function toggleMoleDisplay() {
            if (Date.now() > toggleMoleDisplayAt) {
                if (mole.classList.contains("hide-img")) {
                    mole.classList.remove("hide-img");
                } else {
                    mole.classList.add("hide-img");
                }
                toggleMoleDisplayAt = Date.now() + Math.random() * 2000;
            }
            requestAnimationFrame(toggleMoleDisplay);
        }
        requestAnimationFrame(toggleMoleDisplay);
    }
}

init();
