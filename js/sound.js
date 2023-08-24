export class Sound {
    #name;
    #description;
    #soundData;
    constructor(name, description, soundData) {
        this.#name = name;
        this.#description = description;
        this.#soundData = soundData;
    }
    getName() {
        return this.#name;
    }
    getDescription() {
        return this.#description;
    }
    getSoundData() {
        return this.#soundData;
    }



}
