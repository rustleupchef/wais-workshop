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

setInterval(write, 100);