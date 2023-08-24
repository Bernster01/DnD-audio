import { Sound } from "./sound.js";
const soundTemplateHtml = ``;
let dragSrcEl = null;
//DataTransfer not working 
let dataTransfer = null;
function handleDragStart(event) {
    setTimeout(() => {
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
            event.target.style.opacity = 1;
            document.querySelectorAll(".drop-target-animate").forEach(element => {
                element.classList.remove("drop-target-animate");
            });
        });
        sound.addEventListener("dragenter", (event) => {
            event.target.classList.add("drop-target");
            if(event.target != dragSrcEl){
                event.target.classList.add("drop-target-animate");
            }
        });
        sound.addEventListener("dragleave", (event) => {
            event.target.classList.remove("drop-target");
            event.target.classList.remove("drop-target-animate");
        });
        sound.addEventListener("dragover", (event) => {
            event.preventDefault();
            return false;
        });
        sound.addEventListener("drop", (event, element) => {
            event.stopPropagation();
            event.preventDefault();
            event.target.classList.remove("drop-target");
            if (dragSrcEl != event.target) {
                dragSrcEl.innerHTML = event.target.innerHTML;
                event.target.innerHTML = dataTransfer;
            }

        });
    });
}
document.addEventListener("DOMContentLoaded", starterFunction);