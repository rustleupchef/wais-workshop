const texts = ["Welcome to the WAIS computer science workshop.", "Join us in our many assortments of projects."];
let index = 0;
let currentText = "";

let toggle = true;
let pause = false;
let counter = 0;

let meetingDate = { date: null, daysUntil: null };

function writer() {
    if (pause) {
        counter += 1;
        if (counter == 6) {
            counter = 0;
            pause = false;
        }
        return;
    }

    const writer = document.querySelector(".writer");

    if (toggle) {
        currentText += texts[index][currentText.length];
    } else {
        currentText = currentText.substring(0, currentText.length - 1);
    }

    if (toggle && currentText.length === texts[index].length) {
        toggle = false;
        index = (index + 1) % texts.length;
        pause = true;
    } else if (!toggle && currentText.length === 0) {
        toggle = true;
        pause = true;
    }


    writer.innerHTML = currentText + "_";
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function writeText(element, text, delay) {
    element.innerHTML = "";
    for (let i = 0; i < text.length; i++) {
        await sleep(delay / (1 + (.1 * i)));
        element.innerHTML = text.substring(0, i + 1);
        if (i !== text.length - 1) {
            element.innerHTML += "_";
        }
    }
}


function getNextMeeting(refDate, today) {
    const msPerDay = 24 * 60 * 60 * 1000;
    const daysInBetween = 14;
    const daysSinceRef = Math.floor((today - refDate) / msPerDay);
    const daysUntilNext = daysInBetween - (daysSinceRef % daysInBetween);
    const nextMeeting = new Date(today.getTime() + (daysUntilNext * msPerDay));
    return nextMeeting;
}

async function pixelPopIn(canvas, ctx, options = {}) {
    const {
        pixelSize = 10,
        delay = 12,
        color = "#3771EE",
        overshoot = 1.6,
        duration = 220,
    } = options;

    const W = canvas.width, H = canvas.height;
    const cols = Math.ceil(W / pixelSize);
    const rows = Math.ceil(H / pixelSize);

    const diagonals = [];
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const d = c + r;
            if (!diagonals[d]) diagonals[d] = [];
            diagonals[d].push({ c, r });
        }
    }

    const active = [];
    let diagIdx = 0;
    let lastWave = 0;

    function easeOutBack(t) {
        const s = overshoot;
        return 1 + (s + 1) * Math.pow(t - 1, 3) + s * Math.pow(t - 1, 2);
    }

    return new Promise(resolve => {
        function tick(now) {
            if (diagIdx < diagonals.length && now - lastWave > delay) {
                diagonals[diagIdx].forEach(({ c, r }) => {
                    active.push({ c, r, color, start: now });
                });
                diagIdx++;
                lastWave = now;
            }

            ctx.clearRect(0, 0, W, H);

            active.forEach(p => {
                const t = Math.min((now - p.start) / duration, 1);
                const scale = t < 1 ? easeOutBack(t) : 1;
                const cx = p.c * pixelSize + pixelSize / 2;
                const cy = p.r * pixelSize + pixelSize / 2;
                const s = pixelSize * scale;

                ctx.fillStyle = p.color;
                ctx.fillRect(cx - s / 2, cy - s / 2, s, s);
            });

            if (diagIdx < diagonals.length || active.some(p => (now - p.start) < duration)) {
                requestAnimationFrame(tick);
            } else {
                canvas.style.zIndex = -1;
                resolve();
            }
        }

        requestAnimationFrame(tick);
    });
}

document.addEventListener("DOMContentLoaded", async function () {

    const url = `https://sheets.wais-cshs.workers.dev/Schedule`;
    fetch(url)
        .then(res => res.json())
        .then(cells => {
            const today = new Date(new Date().toDateString());
            const firstMeeting = new Date(cells.values[1][0]);
            const nextMeetingDate = getNextMeeting(firstMeeting, today);
            const daysUntilMeeting = Math.ceil((nextMeetingDate - today) / (1000 * 60 * 60 * 24));

            meetingDate.date = nextMeetingDate.toLocaleDateString();
            meetingDate.daysUntil = daysUntilMeeting;
        });

    const canvas = document.querySelector("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth / 2;
    canvas.height = window.innerHeight;
    await pixelPopIn(canvas, ctx);

    setInterval(writer, 100);
    const links = document.querySelectorAll("a");
    links.forEach(link => {
        link.style.display = "block";
        writeText(link, link.innerHTML, 100);
    });

    const textBox = document.querySelector(".text-box");
    textBox.innerHTML += "The next meeting is on " + meetingDate.date + ", which is in " + meetingDate.daysUntil + " day(s).";
    textBox.style.display = "block";
    writeText(textBox, textBox.innerHTML, 100);
});