<template>
  <div
    class="bg-white rounded border border-gray-200 relative flex flex-col"
  >
    <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
      <span class="card-title">Upload</span>
      <i class="fas fa-upload float-right text-green-400 text-2xl"></i>
    </div>
    <div class="p-6">
      <!-- Upload Dropbox -->
      <div
        class="w-full px-10 py-20 rounded text-center cursor-pointer border border-dashed border-gray-400 text-gray-400 transition duration-500 hover:text-white hover:bg-green-400 hover:border-green-400 hover:border-solid"
        :class="{ 'bg-green-400 border-green-400 border-solid' : is_dragover }"
        @drag.prevent.stop=""
        @dragstart.prevent.stop=""
        @dragend.prevent.stop="is_dragover =false"
        @dragover.prevent.stop="is_dragover = true"
        @dragenter.prevent.stop="is_dragover = true"
        @dragleave.prevent.stop="is_dragover = false"
        @drop.prevent.stop="upload($event)"
      >
        <h5>Drop your files here</h5>
      </div>
      <input type="file" multiple @change="upload($event)">
      <hr class="my-6" />
      <!-- Progess Bars -->
      <div class="mb-4" v-for="upload in uploads" :key="upload.name">
        <!-- File Name -->
        <div class="font-bold text-sm" :class="upload.text_class">
          <i :class="upload.icon"></i> {{ upload.name }}
        </div>
        <div class="flex h-4 overflow-hidden bg-gray-200 rounded">
          <!-- Inner Progress Bar -->
          <div
            class="transition-all progress-bar"
            :class="upload.variant"
            :style="{ width: upload.current_progress + '%' }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { storage, auth, songCollection } from "@/includes/firebase";
import { onBeforeRouteLeave } from "vue-router";

const props = defineProps({
  addSong: {
    type: Function,
    required: true
  }
})

const { addSong } = props;

const is_dragover = ref(false)
const uploads = reactive([]);

const upload = ($event) => {
  is_dragover.value = false
  
  const files = $event.dataTransfer ?
    [...$event.dataTransfer.files] : 
    [...$event.target.files];

  files.forEach((file) => {
    if(file.type !== 'audio/mpeg'){
      return;
    }

    const storageRef = storage.ref(); //music-58dfb.appspot.com
    const songRef  = storageRef.child(`songs/${file.name}`); //music-58dfb.appspot.com/songs/example.mp3
    const task = songRef.put(file);

    const uploadIndex = uploads.push({
      task,
      current_progress: 0,
      name: file.name,
      variant: 'bg-blue-400',
      icon: 'fas fa-spinner fa-spin',
      text_class: ''
    }) - 1;

    task.on('state_changed', (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      uploads[uploadIndex].current_progress = progress;
    }, (error) => {
      uploads[uploadIndex].variant = 'bg-red-400';
      uploads[uploadIndex].icon = 'fas fa-times';
      uploads[uploadIndex].text_class = 'text-red-400';
      console.log(error)
    }, async () => {
      const song = {
        uid: auth.currentUser.uid,
        display_name: auth.currentUser.displayName,
        original_name: task.snapshot.ref.name,
        modified_name: task.snapshot.ref.name,
        genre: '',
        comment_count: 0,
      };

      song.url = await task.snapshot.ref.getDownloadURL();
      const songRef = await songCollection.add(song);
      const songSnapshot = await songRef.get();

      console.log('songRef', songRef)
      console.log('songSnapshot', songSnapshot)

      addSong(songSnapshot)

      uploads[uploadIndex].variant = 'bg-green-400';
      uploads[uploadIndex].icon = 'fas fa-check';
      uploads[uploadIndex].text_class = 'text-green-400';
    });
  })
}

function cancelUploads(){
  console.log('cacnel')
  uploads.forEach((upload) => {
    upload.task.cancel();
  })
}

onBeforeRouteLeave((to, from , next) => {
  // upload.value.cancelUploads();
  uploads.forEach((upload) => {
    upload.task.cancel();
  })
  next();
})

defineExpose({
  cancelUploads
})

</script>

<style scoped>

</style>