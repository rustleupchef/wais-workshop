const text = "Welcome to the WAIS computer science workshop.";
let currentText = "";

let toggle = true;
let pause = false;
let counter = 0;


function write() {
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
        currentText += text[currentText.length];
    } else {
        currentText = currentText.substring(0, currentText.length - 1);
    }

    if (toggle && currentText.length === text.length) {
        toggle = false;
        pause = true;
    } else if (!toggle && currentText.length === 0) {
        toggle = true;
        pause = true;
    }


    writer.innerHTML = currentText + "_";
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
    setInterval(write, 100);
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
        });
});