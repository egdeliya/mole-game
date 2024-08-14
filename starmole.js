let moles = [];
let molesElements = document.getElementsByClassName("mole");

let score = 0;

function generateMoles() {
    for (let i = 0; i < molesElements.length; i++) {
        let mole = {
            html: molesElements[i],
            state: "hungry", // "fed", "hungry", "leaving", "sad", "gone"
            royal: false, // true, false
            timeToUpdate: Date.now(),
            nextState: function () {
                switch (this.state) {
                    case "gone":
                        return "hungry";
                    case "hungry":
                        return "sad"; // or "fed"
                    case "sad":
                    case "fed":
                        return "leaving";
                    case "leaving":
                        return "gone";
                }
            },
        };

        moles.push(mole);
    }

    return moles;
}

function toggleMoles() {
    moles.forEach(mole => {
        let toggleMoleDisplayAt = Date.now();

        function toggleMoleDisplay() {
            if (Date.now() > toggleMoleDisplayAt) {
                if (mole.html.classList.contains("hide")) {
                    mole.html.classList.remove("hide");
                    mole.state = "hungry";
                } else {
                    mole.html.classList.add("hide");
                    mole.state = "gone";
                }
                toggleMoleDisplayAt = Date.now() + Math.random() * 2000;
            }
            requestAnimationFrame(toggleMoleDisplay);
        }

        requestAnimationFrame(toggleMoleDisplay);
    })
}

function showWinScreen() {
    let winScreen = document.getElementById("win-screen");
    let background = document.querySelector(".background");

    background.classList.add("hide");
    winScreen.classList.remove("hide");
}

let wormProgress = document.querySelector(".worm");

function showWormMeter(score) {
    let visiblePart = score * 10;

    wormProgress.style.clipPath = `polygon(0% 0%,
        ${visiblePart}% 0%,
        ${visiblePart}% 100%,
        0% 100%)`;
}

function init() {
    generateMoles();
    toggleMoles();

    moles.forEach(mole => {
        mole.html.addEventListener('click', function () {
            if (mole.state !== "hungry") {
                return;
            }

            mole.state = "fed";
            score++;

            showWormMeter(score);

            if (score >= 10) {
                showWinScreen();
            }
        })
    });
}

init();
