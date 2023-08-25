export class Sound {
    #name;
    #description;
    #soundData;
    constructor(name, description, soundData) {
        this.#name = name;
        this.#description = description;
        //Check if soundData contains volume
        if (soundData.volume == undefined) {
            soundData.volume = 0.5;
        }
        this.#soundData = {data:soundData.data,volume:soundData.volume};
    }
    getName() {
        return this.#name;
    }
    getDescription() {
        return this.#description;
    }
    getSoundData() {
        return this.#soundData.data;
    }
    getSoundVolume() {
        return this.#soundData.volume;
    }



}
