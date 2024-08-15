let molesNodes = document.getElementsByClassName("mole");
let wormProgress = document.querySelector(".worm");

let score = 0;

function initMoles() {
    let moles = [];

    for (let i = 0; i < molesNodes.length; i++) {
        let mole = initMole(molesNodes[i]);
        moles.push(mole);
    }

    return moles;
}

function initMole(moleNode) {
    return {
        node: moleNode,
        state: "hungry", // "fed", "hungry", "leaving", "sad", "gone"
        royal: false, // true, false
        timeToUpdate: Date.now(),

        handleClick: function () {
            if (this.state !== "hungry") {
                return;
            }

            this.node.classList.remove("hungry-mole");

            this.state = "fed";

            if (this.royal) {
                score += 2;
                this.node.src = "./img/king-mole-fed.png"
            } else {
                score++;
                this.node.src = "./img/mole-fed.png"
            }

            this.timeToUpdate = Date.now() + Math.random() * 500;

            showWormMeter(score);

            if (score >= 10) {
                showWinScreen();
            }
        },

        startGameLoop: function () {
            let mole = this;

            function nextState() {
                const now = Date.now();

                if (now > mole.timeToUpdate) {
                    switch (mole.state) {
                        case "gone":
                            mole.goToHungry(now);
                            break;
                        case "hungry": // "hungry" -> "fed" in case if user clicks in time
                            mole.goToSad(now);
                            break;
                        case "sad":
                        case "fed":
                            mole.goToLeaving(now);
                            break;
                        case "leaving": // "leaving" -> "gone"
                            mole.goToGone(now);
                            break;
                    }
                }
                requestAnimationFrame(nextState);
            }

            nextState();
        },

        goToHungry: function(now) {
            let showRoyal = Math.random() > 0.9; // show royal mole one time out of ten

            if (showRoyal) {
                this.royal = true;
                this.node.src = "./img/king-mole-hungry.png";
            } else {
                this.node.src = "./img/mole-hungry.png";
            }

            this.node.classList.remove("gone");
            this.node.classList.add("hungry-mole");

            this.state = "hungry";
            this.timeToUpdate = now + 2000;
        },

        goToSad: function (now) {
            if (this.royal) {
                this.node.src = "./img/king-mole-sad.png";
            } else {
                this.node.src = "./img/mole-sad.png";
            }

            this.node.classList.remove("hungry-mole");

            this.state = "sad";
            this.timeToUpdate = now + Math.random() * 500;
        },

        goToLeaving: function (now) {
            if (this.royal) {
                this.node.src = "./img/king-mole-leaving.png";
            } else {
                this.node.src = "./img/mole-leaving.png";
            }

            this.state = "leaving";
            this.timeToUpdate = now + Math.random() * 500;
        },

        goToGone: function (now) {
            this.node.classList.add("gone");

            this.state = "gone";
            // mole is gone from 2 seconds to 20 seconds
            this.timeToUpdate = now + (Math.random() * 18000 + 2000);
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
    let moles = initMoles();

    moles.forEach(mole => {
        mole.startGameLoop();

        mole.node.addEventListener('click', function () {
            mole.handleClick();
        })
    });
}

init();
