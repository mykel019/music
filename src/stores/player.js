import { defineStore } from "pinia";
import { ref, computed } from "vue"
import { Howl } from "howler";
import helper from "@/includes/helper";

export default defineStore('player', () => {

  const current_song = ref({})
  const sound = ref({})
  
  const newSong = async (value) => {
    
    if(sound.value instanceof Howl){
      sound.value.unload()
    }
    current_song.value = value
    sound.value = new Howl({
      src: [current_song.value.url],
      html5: true
    });
    sound.value.play()
    sound.value.on('play', () => {
      requestAnimationFrame(progress)
    })
  }

  const seek = ref("00:00")
  const duration = ref("00:00")
  const playerProgress = ref("0%")

  const progress = () => {
    seek.value = helper.formatTime(sound.value.seek())
    duration.value = helper.formatTime(sound.value.duration())
    playerProgress.value = `${ (sound.value.seek() / sound.value.duration()) * 100 }%`

    if(sound.value.playing()){
      requestAnimationFrame(progress)
    }
  }

// toggle 
  const toggleAudio = () => {
    if(!sound.value.playing){
      return;
    }

    if(sound.value.playing()){
      sound.value.pause()
    }else{
      sound.value.play()
    }
  }

// playing
  const playing = computed(() => {
    if(sound.value.playing){
      return sound.value.playing();
    }
    return false;
  })

  // updateSeek 
  const updateSeek = (event) => {
    if(!sound.value.playing){
      return;
    }

    const { x, width } =  event.currentTarget.getBoundingClientRect()
    const clickX = event.clientX - x
    const percentage = clickX / width
    const seconds = sound.value.duration() * percentage
    sound.value.seek(seconds)
    sound.value.on("seek", () => {
      requestAnimationFrame(progress)
    })
  }


  const stopPlayer = () => {
    sound.value.stop()
  }

  return {
    newSong,
    current_song,
    toggleAudio,
    playing,
    seek,
    duration,
    playerProgress,
    updateSeek,
    stopPlayer
  }
})