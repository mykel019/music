<template>
      <!-- Main Content -->
      <section class="container mx-auto mt-6">
      <div class="md:grid md:grid-cols-3 md:gap-4">
        <div class="col-span-1">
        <Upload ref="upload" :addSong="addSong"></Upload>
        </div>
        <div class="col-span-2">
          <div
            class="bg-white rounded border border-gray-200 relative flex flex-col"
          >
            <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
              <span class="card-title">My Songs</span>
              <i
                class="fa fa-compact-disc float-right text-green-400 text-2xl"
              ></i>
            </div>
            <div class="p-6">
              <!-- Composition Items -->
              <CompositionItem 
                v-for="(song, i) in songs" 
                :key="song.docID" 
                :song="song"
                :updateSong="updateSong"
                :index="i"
                :removeSong="removeSong"
                :updateUnsavedFlag="updateUnsavedFlag"
                >
              </CompositionItem>
            </div>
          </div>
        </div>
      </div>
    </section>
</template>

<script setup>
import Upload from "@/components/Upload.vue"
import CompositionItem from "@/components/CompositionItem.vue";
import { reactive, ref } from "vue";
import { auth, songCollection } from "@/includes/firebase";
import { onBeforeRouteLeave } from "vue-router"

// this method is calling the method from child component using ref 
let upload = ref(null)
onBeforeRouteLeave((to, from , next) => {
  // upload.value.cancelUploads();
  if(!unsaveFlag.value){
    next();
  }else{
    const leave = confirm("You have unsaved changes. Are you sure you want to leave?")
    next(leave)
  }
})

const songs = reactive([])
const unsaveFlag = ref(false)

async function fetchSongs(){
  const snapshot = await songCollection.where('uid','==', auth.currentUser.uid).get();
  snapshot.forEach(addSong)
}

fetchSongs();

const updateSong = (i, values) => {
  songs[i].modified_name = values.modified_name
  songs[i].genre = values.genre
}

const removeSong = (i) => {
  songs.splice(i, 1)
}

const addSong = (document) => {
  console.log('document',document)
  const song = {
    docID: document.id,
      ...document.data(),
    }
    songs.push(song);
}

const updateUnsavedFlag = (value) => {
  unsaveFlag.value = value
}

</script>

<style lang="scss" scoped>

</style>