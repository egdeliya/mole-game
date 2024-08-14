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
                if (mole.html.classList.contains("hide-img")) {
                    mole.html.classList.remove("hide-img");
                    mole.state = "hungry";
                } else {
                    mole.html.classList.add("hide-img");
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

    background.classList.add("hide-img");
    winScreen.classList.remove("hide-img");
}


function showWormMeter(score) {

}

function init() {
    showWormMeter(score);
    generateMoles();
    toggleMoles();

    moles.forEach(mole => {
        mole.html.addEventListener('click', function () {
            if (mole.state !== "hungry") {
                return;
            }

            score++;
            showWormMeter(score);

            mole.state = "fed";

            if (score >= 10) {
                showWinScreen();
            }
        })
    });
}

init();
