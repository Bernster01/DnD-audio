import { Sound } from "./sound.js";
const soundTemplateHtml = ``;
let dragSrcEl = null;
let dragSrcAudioVolume = null;
//DataTransfer not working 
let dataTransfer = null;

function starterFunction() {
    //Add event listeners
    let sounds = document.querySelectorAll(".sound")
    sounds.forEach(sound => {
        addEventListenerToSoundElement(sound);
    });
    //File drop
    let fileDropZone = document.querySelector(".file-drop-zone");
    ["dragenter", "dragover", "dragleave", "drop"].forEach(eventName => {
        fileDropZone.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
        }, false);
    });
    fileDropZone.addEventListener("drop", (e) => {
        let dt = e.dataTransfer;
        let files = dt.files;
        handleFiles(files);
    });
    //No drag
    fixNoDrag()
    //Load and Save
    document.getElementById("load-button").addEventListener("click", loadSounds);
    document.getElementById("save-button").addEventListener("click", saveSounds);
}
function handleDragStart(event) {
    setTimeout(() => {



        event.preventDefault();
        console.log(event.target.innerHTML);
        dragSrcEl = event.target;
        dragSrcAudioVolume = event.target.querySelector("audio").volume;
        event.target.style.opacity = 0.5;
        dataTransfer = event.target.innerHTML;

    }, 0);
}
function handleDragEnd(event) {
    if (dragSrcEl != null && event.target.tagName == "DIV") {
        event.target.style.opacity = 1;
        dragSrcEl = null;
    }
}
function handleDragEnter(event) {
    if (dragSrcEl != null && event.target.tagName == "DIV") {
        event.target.classList.add("drop-target");
        if (event.target != dragSrcEl) {
            event.target.classList.add("drop-target-animate");
        }
    }
}
function handleDragLeave(event) {
    if (dragSrcEl != null && event.target.tagName == "DIV") {
        event.target.classList.remove("drop-target");
        event.target.classList.remove("drop-target-animate");
    }
}
function handleDragOver(event) {
    if (dragSrcEl != null && event.target.tagName == "DIV") {
        event.preventDefault();
        return false;
    }
}
function handleDrop(event) {
    if (dragSrcEl != null && event.target.tagName == "DIV") {
        event.stopPropagation();
        event.preventDefault();
        event.target.classList.remove("drop-target");
        if (dragSrcEl != event.target) {
            dragSrcEl.innerHTML = event.target.innerHTML;
            event.target.innerHTML = dataTransfer;
            event.target.querySelector("audio").volume = dragSrcAudioVolume;
        }
        document.querySelectorAll(".drop-target-animate").forEach(element => {
            element.classList.remove("drop-target-animate");
        });
        fixNoDrag();
    }
}

async function audioToBase64(audioFile) {
    return new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.onerror = reject;
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(audioFile);
    });
}
async function handleFiles(files) {
    //Check if file is audio or json
    if (!files[0].type.startsWith("audio") && files[0].type != "application/json") {

        alert("File is not audio");
        files = null;
        return;
    }
    if (files[0].type == "application/json") {
        //Load the json file and add the sounds to the soundContainer
        const reader = new FileReader();
        reader.onload = function () {
            const data = JSON.parse(reader.result);
            load(data);
        }
        reader.readAsText(files[0]);
        return;
    }

    //Turn file into base64
    let audio = await audioToBase64(files[0]);
    //Create sound object
    const sound = new Sound(files[0].name, files[0].name, {data:audio});
    //Create html element
    createSoundHtmlElement(sound);

}
function createSoundHtmlElement(sound) {
    console.log("2 ", sound);
    const soundTemplateHtml = ` <h2 class="no-drag" contenteditable="true">Music - Chase</h2>
    <p class="no-drag" contenteditable="true"></p>
    <audio class="no-drag" controls>
        <source src="" type="audio/mpeg">
    </audio>
    <div class="delete-sound" onclick="deleteElement(this.parentNode)">
        <i class="fa-solid fa-trash"></i>
    </div>`;
    let soundElement = document.createElement("div");
    soundElement.classList.add("sound");
    soundElement.setAttribute("draggable", "true");
    soundElement.innerHTML = soundTemplateHtml;
    soundElement.querySelector("h2").innerHTML = sound.getName();
    soundElement.querySelector("p").innerHTML = sound.getDescription();
    let audio =soundElement.querySelector("audio");
    audio.src = sound.getSoundData();
    audio.volume = sound.getSoundVolume();
    document.getElementById("sound-container").appendChild(soundElement);
    addEventListenerToSoundElement(soundElement);
}
function addEventListenerToSoundElement(element) {
    element.addEventListener("dragstart", handleDragStart);
    element.addEventListener("dragend", handleDragEnd);
    element.addEventListener("dragenter", handleDragEnter);
    element.addEventListener("dragleave", handleDragLeave);
    element.addEventListener("dragover", handleDragOver);
    element.addEventListener("drop", handleDrop);
    fixNoDrag()
    
}
function fixNoDrag(){
    document.querySelectorAll(".no-drag").forEach(element => {
        element.addEventListener("dragstart", (event) => {
            event.preventDefault();
            event.stopPropagation();
        });
        element.setAttribute("draggable", "true");
    });
}
function loadSounds() {
    //Load the json file and add the sounds to the soundContainer
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".json";
    fileInput.onchange = function () {
        const file = fileInput.files[0];
        const reader = new FileReader();
        reader.onload = function () {
            const data = JSON.parse(reader.result);
            load(data);
        }
        reader.readAsText(file);
    }
    fileInput.click();

}
function load(data){
    //Clear the sound container
    document.getElementById("sound-container").innerHTML = "";
    document.getElementById("soundboard-name").innerText = data.name;
    for (let i = 0; i < data.data.length; i++) {
        const soundData = data.data[i];
        //Create sound object
        const sound = new Sound(soundData.name, soundData.desc || "", {data:soundData.src,volume:soundData.volume}, );
        //Create html element
        createSoundHtmlElement(sound);
    }
}
function saveSounds() {
    //Download the soundContainer as a json file
    const soundContainer = document.getElementById("sound-container");
    const sounds = soundContainer.children;
    const soundData = [];
    for (let i = 0; i < sounds.length; i++) {
        const sound = sounds[i];
        const soundName = sound.querySelector("h2").innerText;
        const soundSrc = sound.querySelector("audio").src;
        const soundVolume = sound.querySelector("audio").volume;
        soundData.push({
            name: soundName,
            src: soundSrc,
            volume: soundVolume
        });
    }
    const name = document.getElementById("soundboard-name").innerText;
    console.log(name);
    const data = JSON.stringify({name:name,data:soundData});
    const blob = new Blob([data], { type: 'application/json' });
    console.log(blob);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = "Soundboard_"+name + ".json";
    link.textContent = 'Download JSON';

    document.body.appendChild(link);

    // Programmatically trigger the click event on the link
    link.click();

    // Clean up the object URL after the download link is clicked
    URL.revokeObjectURL(url);

    // Remove the element from the DOM
    link.remove();

}

document.addEventListener("DOMContentLoaded", starterFunction);