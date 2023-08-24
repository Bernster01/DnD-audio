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
function starterFunction() {
    //Add event listeners
    let sounds = document.querySelectorAll(".sound")
    sounds.forEach(sound => {

        sound.addEventListener("dragstart", handleDragStart);

        sound.addEventListener("dragend", (event) => {
            if (dragSrcEl != null && event.target.tagName == "DIV") {
                event.target.style.opacity = 1;
                dragSrcEl = null;
            }
        });
        sound.addEventListener("dragenter", (event) => {
            if (dragSrcEl != null && event.target.tagName == "DIV") {
                event.target.classList.add("drop-target");
                if (event.target != dragSrcEl) {
                    event.target.classList.add("drop-target-animate");
                }
            }
        });
        sound.addEventListener("dragleave", (event) => {
            if (dragSrcEl != null && event.target.tagName == "DIV") {
                event.target.classList.remove("drop-target");
                event.target.classList.remove("drop-target-animate");
            }
        });
        sound.addEventListener("dragover", (event) => {
            if (dragSrcEl != null && event.target.tagName == "DIV") {
                event.preventDefault();
                return false;
            }
        });
        sound.addEventListener("drop", (event, element) => {
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

        });
    });
    //File drop
    let fileDropZone = document.querySelector(".file-drop-zone");
    ["dragenter", "dragover", "dragleave", "drop"].forEach(eventName => {
        fileDropZone.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
        }, false);
    });
}
document.addEventListener("DOMContentLoaded", starterFunction);