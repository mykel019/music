<template>
<main>
  <!-- Introduction -->
  <section class="mb-8 py-20 text-white text-center relative">
      <div
        class="absolute inset-0 w-full h-full bg-contain introduction-bg"
        style="background-image: url(assets/img/header.png)"
      ></div>
      <div class="container mx-auto">
        <div class="text-white main-header-content">
          <h1 class="font-bold text-5xl mb-5">Listen to Great Music!</h1>
          <p class="w-full md:w-8/12 mx-auto">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus et dolor mollis,
            congue augue non, venenatis elit. Nunc justo eros, suscipit ac aliquet imperdiet,
            venenatis et sapien. Duis sed magna pulvinar, fringilla lorem eget, ullamcorper urna.
          </p>
        </div>
      </div>

      <img
        class="relative block mx-auto mt-5 -mb-20 w-auto max-w-full"
        src="/assets/img/introduction-music.png"
      />
  </section>
  <!-- Main Content -->
  <section class="container mx-auto">
      <div class="bg-white rounded border border-gray-200 relative flex flex-col">
        <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200" 
          v-icon-secondary="{ icon: 'headphones-alt', right: true}">
          <span class="card-title">Songs</span>
          <!-- Icon -->
          <!-- <i class="fa fa-headphones-alt float-right text-green-400 text-xl"></i> -->
        </div>
        <!-- Playlist -->
        <ol id="playlist">
          <SongItem
            v-for="song in songs"
            :key="song.docID"
            :song="song"
            />
        </ol>
        <!-- .. end Playlist -->
      </div>
  </section>
</main>

</template>

<script setup>
import SongItem from '@/components/SongItem.vue'
import { songCollection } from '@/includes/firebase'
import { onBeforeUnmount, reactive, ref } from 'vue';
import IconSecondary from '@/directives/icon-secondary'

const VIconSecondary = IconSecondary

const songs = reactive([])
const maxPerPage = ref(3)
const pendingRequests = ref(false)

const getSongs = async () => {
  if(pendingRequests.value){
    return;
  }
  pendingRequests.value = true
  let snapshots;
  if(songs.length){
    const lastDoc = await songCollection
      .doc(songs[songs.length - 1].docID)
      .get();

    snapshots = await songCollection
    .orderBy('modified_name')
    .startAfter(lastDoc)
    .limit(maxPerPage.value)
    .get();
  }else{
    snapshots = await songCollection
    .orderBy('modified_name')
    .limit(maxPerPage.value)
    .get();
  }

  snapshots.forEach(document => {
    songs.push({
      docID: document.id,
      ...document.data()
    })
  })

  pendingRequests.value = false

}

getSongs();

const handleScroll = () => {
  const { scrollTop, offsetHeight  } = document.documentElement;
  const { innerHeight } = window;
  const bottomOfWindow = Math.round(scrollTop) + innerHeight === offsetHeight;
  // console.log('scrollTop',scrollTop)
  // console.log('innerHeight',innerHeight)
  // console.log('offsetHeight',offsetHeight)
  // console.log('bottomOfWindow',bottomOfWindow)
  if(bottomOfWindow){
    getSongs();
  }
}

window.addEventListener('scroll', handleScroll);

onBeforeUnmount(() => {
  window.document.removeEventListener("scroll", handleScroll());
})

</script>

<style lang="scss" scoped>

</style>