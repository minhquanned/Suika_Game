class SoundManager {
    constructor() {
        this.backgroundMusic = new Howl({
            src: ['../sounds/background_music.mp3'],
            loop: true,
            volume: 0.5
        });

        this.effectSounds = {
            drop: new Howl({
                src: ['../sounds/drop.wav'],
                volume: 0.7
            }),
            merge: new Howl({
                src: ['../sounds/merge.wav'],
                volume: 0.7
            }),
            lose: new Howl({
                src: ['../sounds/lose.wav'],
                volume: 0.7
            }),
            win: new Howl({
                src: ['../sounds/win.wav'],
                volume: 0.7
            })
        }

        this.isMuted = false;
    }

    playBackgroundMusic() {
        this.backgroundMusic.play();
    }

    pauseBackgroundMusic() {
        this.backgroundMusic.pause();
    }

    playEffectSound(sound) {
        if (this.effectSounds[sound]) {
            this.effectSounds[sound].play();
        }
    }

    stopSound(sound) {
        if (this.effectSounds[sound]) {
            this.effectSounds[sound].stop();
        }
    }

    stopAllSound() {
        this.backgroundMusic.stop();
        for (let sound in this.effectSounds) {
            this.effectSounds[sound].stop();
        }
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        Howler.mute(this.isMuted);
    }
}

export { SoundManager };