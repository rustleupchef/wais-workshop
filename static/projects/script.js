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

async function destroyText(element, delay) {
    const text = element.innerHTML;
    for (let i = 0; i < text.length; i++) {
        await sleep(delay / (1 + (.1 * i)));
        element.innerHTML = text.substring(0, text.length - i - 1);
        if (i !== text.length - 1) {
            element.innerHTML += "_";
        }
    }
}

const imagePath = "static/images/photo.jpg"
let labs = [];
let index = 0;

function formatImage(src) {
    const id = new URLSearchParams(src).get("https://drive.google.com/open?id");
    return `https://drive.google.com/thumbnail?id=${id}&sz=s800`;
}


async function render(row) {
    const writer = document.querySelector(".writer");
    const textBox = document.querySelector(".text-box");

    await destroyText(writer, 100);
    await destroyText(textBox, 100);

    writeText(writer, row[0], 100);
    
    writeText(textBox, row[1], 100);

    const img = document.querySelector('img');
    console.log(formatImage(row[2]));
    img.src = row.length > 2 ? formatImage(row[2]) : imagePath;
}

document.addEventListener("DOMContentLoaded", function() {
    
    const links = document.querySelectorAll("a");
    links.forEach(link => {
        link.style.display = "block";
        writeText(link, link.innerHTML, 100);
    });

    const textBox = document.querySelector('.text-box');
    textBox.style.display = "block";
    writeText(textBox, textBox.innerHTML, 100);

    const url = "https://sheets.wais-cshs.workers.dev/Labs";
    fetch(url)
        .then(res => res.json())
        .then(cells => {
            labs = cells.values.splice(1);
            labs = labs.map(lab => {
                return lab.splice(1);
            });
            index = 0;
            if (labs.length < 1) {
                labs = [["We have no labs yet", "We'll add them to the site when we create our labs. Please be as patient as possible."]]
            }
            render(labs[index]);
        });
    
    document.addEventListener("click", function() {
        index = (index + 1) % labs.length;
        render(labs[index]);
    });
});