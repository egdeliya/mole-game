let molesElements = document.getElementsByClassName("mole");
let wormProgress = document.querySelector(".worm");

let score = 0;

function generateMoles() {
    let moles = [];

    for (let i = 0; i < molesElements.length; i++) {
        let mole = initMole(molesElements[i]);
        moles.push(mole);
    }

    return moles;
}

function initMole(moleHTML) {
    return {
        html: moleHTML,
        state: "hungry", // "fed", "hungry", "leaving", "sad", "gone"
        royal: false, // true, false
        timeToUpdate: Date.now(),

        handleClick: function () {
            if (this.state !== "hungry") {
                return;
            }

            this.html.classList.remove("hungry-mole");

            this.state = "fed";

            if (this.royal) {
                score += 2;
                this.html.src = "./img/king-mole-fed.png"
            } else {
                score++;
                this.html.src = "./img/mole-fed.png"
            }

            this.timeToUpdate = Date.now() + Math.random() * 500;

            showWormMeter(score);

            if (score >= 10) {
                showWinScreen();
            }
        },

        start: function () {
            let local = this;

            function nextState() {
                if (Date.now() > local.timeToUpdate) {
                    switch (local.state) {
                        case "gone": // "gone" -> "hungry"
                            local.handleGone();
                            break;
                        case "hungry": // "hungry" -> "sad"; "hungry" -> "fed" in case if user clicks in time
                            local.handleHungry();
                            break;
                        case "sad": // "sad", "fed" -> "leaving"
                        case "fed":
                            local.handleFedSad();
                            break;
                        case "leaving": // "leaving" -> "gone"
                            local.handleLeaving();
                            break;
                    }
                }
                requestAnimationFrame(nextState);
            }

            requestAnimationFrame(nextState);
        },

        handleGone: function() {
            let showRoyal = Math.random() > 0.9; // show royal mole one time out of ten

            if (showRoyal) {
                this.royal = true;
                this.html.src = "./img/king-mole-hungry.png";
            } else {
                this.html.src = "./img/mole-hungry.png";
            }

            this.html.classList.remove("gone");
            this.html.classList.add("hungry-mole");

            this.state = "hungry";
            this.timeToUpdate = Date.now() + 2000;
        },

        handleHungry: function () {
            if (this.royal) {
                this.html.src = "./img/king-mole-sad.png";
            } else {
                this.html.src = "./img/mole-sad.png";
            }

            this.html.classList.remove("hungry-mole");

            this.state = "sad";
            this.timeToUpdate = Date.now() + Math.random() * 500;
        },

        handleFedSad: function () {
            if (this.royal) {
                this.html.src = "./img/king-mole-leaving.png";
            } else {
                this.html.src = "./img/mole-leaving.png";
            }

            this.state = "leaving";
            this.timeToUpdate = Date.now() + Math.random() * 500;
        },

        handleLeaving: function () {
            this.html.classList.add("gone");

            this.state = "gone";
            // mole is gone from 2 seconds to 20 seconds
            this.timeToUpdate = Date.now() + (Math.random() * 18000 + 2000);
        },
    };
}

function showWinScreen() {
    let winScreen = document.getElementById("win-screen");
    let background = document.querySelector(".background");

    background.classList.add("hide");
    winScreen.classList.remove("hide");
}

function showWormMeter(score) {
    let visiblePart = score * 10;

    wormProgress.style.clipPath = `polygon(0% 0%,
        ${visiblePart}% 0%,
        ${visiblePart}% 100%,
        0% 100%)`;
}

function init() {
    let moles = generateMoles();

    moles.forEach(mole => {
        mole.start();

        mole.html.addEventListener('click', function () {
            mole.handleClick();
        })
    });
}

init();
