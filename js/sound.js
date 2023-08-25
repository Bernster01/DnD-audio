export class Sound {
    #name;
    #description;
    #soundData;
    constructor(name, description, soundData) {
        this.#name = name;
        this.#description = description;
        this.#soundData = {data:soundData,volume:0.5};
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
