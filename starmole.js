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

                this.state = "fed";

                score++;
                if (this.royal) {
                    score++;
                }

                showWormMeter(score);

                if (score >= 10) {
                    showWinScreen();
                }
            },
            start: function () {
                this.timeToUpdate = Date.now();
                this.state = "hungry";
                let local = this;

                function nextState() {
                    if (Date.now() > local.timeToUpdate) {
                        if (local.state === "gone") { // if (this.state === "gone")
                            let showRoyal = Math.random() > 0.9;

                            if (showRoyal) {
                                local.html.src = "./img/king-mole-hungry.png";
                                local.royal = true;
                            } else {
                                local.html.src = "./img/mole-hungry.png";
                            }

                            local.html.classList.remove("gone");
                            local.state = "hungry";
                        } else { // if (this.state === "hungry")
                            local.html.classList.add("gone");
                            local.state = "gone";
                        }
                        local.timeToUpdate = Date.now() + Math.random() * 2000;
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
