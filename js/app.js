import { Sound } from "./sound.js";
const soundTemplateHtml = ``;
let dragSrcEl = null;
//DataTransfer not working 
let dataTransfer = null;
function handleDragStart(event) {
    setTimeout(() => {
        //If target is a div

        event.preventDefault();
        console.log(event.target.innerHTML);
        dragSrcEl = event.target;
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
        }
        document.querySelectorAll(".drop-target-animate").forEach(element => {
            element.classList.remove("drop-target-animate");
        });
    }
}

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
    //Check if file is audio
    if (!files[0].type.startsWith("audio")) {
        alert("File is not audio");
        files = null;
        return;
    }
    //Turn file into base64
    let audio = await audioToBase64(files[0]);
    console.log(audio);
    //Create sound object
    const sound = new Sound(files[0].name, files[0].name, audio);
    console.log(sound);
    //Create html element
    createSoundHtmlElement(sound);

}
function createSoundHtmlElement(sound) {
    console.log("2 ",sound);
    const soundTemplateHtml = `
<h2 class="no-drag">Name</h2>
<p class="no-drag"></p>
<audio class="no-drag" controls>
    <source src="" type="audio/mpeg">
</audio>`;
    let soundElement = document.createElement("div");
    soundElement.classList.add("sound");
    soundElement.setAttribute("draggable", "true");
    soundElement.innerHTML = soundTemplateHtml;
    soundElement.querySelector("h2").innerHTML = sound.getName();
    soundElement.querySelector("p").innerHTML = sound.getDescription();
    soundElement.querySelector("audio").src = sound.getSoundData();
    addEventListenerToSoundElement(soundElement);
    document.getElementById("sound-container").appendChild(soundElement);
}
function addEventListenerToSoundElement(element){
    element.addEventListener("dragstart", handleDragStart);
    element.addEventListener("dragend", handleDragEnd);
    element.addEventListener("dragenter", handleDragEnter);
    element.addEventListener("dragleave", handleDragLeave);
    element.addEventListener("dragover", handleDragOver);
    element.addEventListener("drop", handleDrop);
}
document.addEventListener("DOMContentLoaded", starterFunction);