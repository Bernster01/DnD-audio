export class Sound {
    #name;
    #description;
    #soundData;
    constructor(name, description, soundData) {
        this.#name = name;
        this.#description = description;
        this.#soundData = soundData;
    }
    play() {
        const audio = this.base64toAudio(this.soundData);
        audio.play();
    }
    base64toAudio(base64) {
        let audio = new Audio();
        audio.src = base64;
        return audio;
    }
    audioToBase64(audio) {
        return new Promise((resolve, reject) => {
            let reader = new FileReader();
            reader.readAsDataURL(audio);
            reader.onload = function () {
                resolve(reader.result);
            };
            reader.onerror = function (error) {
                reject(error);
            };
        });
    }


}
