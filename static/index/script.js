const texts = ["Welcome to the WAIS computer science workshop.", "Join us in our many assortments of projects."];
let index = 0;
let currentText = "";

let toggle = true;
let pause = false;
let counter = 0;


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

document.addEventListener("DOMContentLoaded", function() {
    setInterval(writer, 100);

    const url = `https://sheets.wais-cshs.workers.dev/Schedule`;
    fetch(url)
        .then(res => res.json())
        .then(cells => {
            const today = new Date(new Date().toDateString());
            const firstMeeting = new Date(cells.values[1][0]);
            const nextMeetingDate = getNextMeeting(firstMeeting, today);
            const daysUntilMeeting = Math.ceil((nextMeetingDate - today) / (1000 * 60 * 60 * 24));

            const textBox = document.querySelector(".text-box");
            textBox.innerHTML += `The next meeting will be ${nextMeetingDate.toLocaleDateString()} meaning ${daysUntilMeeting} day(s) till then`
            textBox.style.display = "block";
            writeText(textBox, textBox.innerHTML, 200);
        });

    const links = document.querySelectorAll("a");
    links.forEach(link => {
        link.style.display = "block";
        writeText(link, link.innerHTML, 100);
    });
});