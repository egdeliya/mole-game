let moles = [];
let molesElements = document.getElementsByClassName("mole");
let wormProgress = document.querySelector(".worm");

let score = 0;

function generateMoles() {
    for (let i = 0; i < molesElements.length; i++) {
        let mole = {
            html: molesElements[i],
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
                            case "gone":
                                let showRoyal = Math.random() > 0.9;

                                if (showRoyal) {
                                    local.royal = true;
                                    local.html.src = "./img/king-mole-hungry.png";
                                } else {
                                    local.html.src = "./img/mole-hungry.png";
                                }

                                local.html.classList.remove("gone");
                                local.html.classList.add("hungry-mole");

                                local.state = "hungry";
                                local.timeToUpdate = Date.now() + 2000;

                                break;
                            case "hungry":
                                if (local.royal) {
                                    local.html.src = "./img/king-mole-sad.png";
                                } else {
                                    local.html.src = "./img/mole-sad.png";
                                }

                                local.html.classList.remove("hungry-mole");

                                local.state = "sad";
                                local.timeToUpdate = Date.now() + Math.random() * 500;

                                break;
                            case "sad":
                            case "fed":
                                if (local.royal) {
                                    local.html.src = "./img/king-mole-leaving.png";
                                } else {
                                    local.html.src = "./img/mole-leaving.png";
                                }

                                local.state = "leaving";
                                local.timeToUpdate = Date.now() + Math.random() * 500;

                                break;
                            case "leaving":
                                local.html.classList.add("gone");

                                local.state = "gone";
                                local.timeToUpdate = Date.now() + (Math.random() * 18000 + 2000);

                                break;
                        }
                    }
                    requestAnimationFrame(nextState);
                }

                requestAnimationFrame(nextState);
            }
        };

        moles.push(mole);
    }

    return moles;
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
    generateMoles();

    moles.forEach(mole => {
        mole.start();

        mole.html.addEventListener('click', function () {
            mole.handleClick();
        })
    });
}

init();
