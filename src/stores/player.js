import { defineStore } from 'pinia';
import { Howl } from 'howler';
import helper from '@/includes/helper';

export default defineStore('player', {
  state: () => ({
    currentSong: {},
    sound: {},
    seek: '00:00',
    duration: '00:00',
    playerProgress: '0%'
  }),
  actions: {
    async onNewSong(song) {
      if (this.sound instanceof Howl) {
        this.sound.unload();
      }

      this.currentSong = song;

      this.sound = new Howl({
        src: [song.url],
        html5: true
      });

      this.sound.play();

      this.sound.on('play', () => {
        requestAnimationFrame(this.onProgress);
      });
    },
    async onToggleAudio() {
      if (!this.sound.playing) {
        return;
      }

      if (this.sound.playing()) {
        this.sound.pause();
      } else {
        this.sound.play();
      }
    },
    onProgress() {
      this.seek = helper.onFormatTime(this.sound.seek());
      this.duration = helper.onFormatTime(this.sound.duration());

      this.playerProgress = `${
        (this.sound.seek() / this.sound.duration()) * 100
      }%`;

      if (this.sound.playing()) {
        requestAnimationFrame(this.onProgress);
      }
    },
    onUpdateSeek(event) {
      if (!this.sound.playing) {
        return;
      }

      const { x, width } = event.currentTarget.getBoundingClientRect();
      // Document = 2000, Timeline = 1000, clientX = 1000, Distance = 500
      const clickX = event.clientX - x;
      const percentage = clickX / width;
      const seconds = this.sound.duration() * percentage;

      this.sound.seek(seconds);
      this.sound.once('seek', this.onProgress);
    }
  },
  getters: {
    playing: state => {
      if (state.sound.playing) {
        return state.sound.playing();
      }

      return false;
    }
  }
});
