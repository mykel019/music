<template>
   <div class="border border-gray-200 p-3 mb-4 rounded">
    <div v-show="!showForm">
      <h4 class="inline-block text-2xl font-bold">{{  song.modified_name }}</h4>
      <button
        class="ml-1 py-1 px-2 text-sm rounded text-white bg-red-600 float-right"
        @click.prevent="deleteSong"
      >
        <i class="fa fa-times"></i>
      </button>
      <button
        class="ml-1 py-1 px-2 text-sm rounded text-white bg-blue-600 float-right"
        @click.prevent="showForm = !showForm"
      >
        <i class="fa fa-pencil-alt"></i>
      </button>
    </div>
    <div v-show="showForm">
      <div class="text-white text-center font-bold p-4 mb-4" v-if="show_alert"
        :class="alert_variant">
        {{ alert_message }}
      </div>
      <vee-form :validation-schema="schema" :inital-values="song"
        @submit="edit">
        <div class="mb-3">
          <label class="inline-block mb-2">Song Title</label>
          <vee-field
            type="text"
            name="modified_name"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            placeholder="Enter Song Title"
            @input="updateUnsavedFlag(true)"
          />
          <ErrorMessage class="text-red-600" name="modified_name"></ErrorMessage>
        </div>
        <div class="mb-3">
          <label class="inline-block mb-2">Genre</label>
          <vee-field
            type="text"
            name="genre"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            placeholder="Enter Genre"
            @input="updateUnsavedFlag(true)"
          />
          <ErrorMessage class="text-red-600" name="genre"></ErrorMessage>
        </div>
        <button
          type="submit"
          class="py-1.5 px-3 rounded text-white bg-green-600"
          :disabled="in_submission"
        >
          Submit
        </button>
        <button
          type="button"
          class="py-1.5 px-3 rounded text-white bg-gray-600"
          @click.prevent="showForm = false"
          :disabled="in_submission"
        >
          Go Back
        </button>
      </vee-form>
    </div>
  </div>
</template>

<script setup>
import { ErrorMessage } from "vee-validate";
import { ref, reactive } from "vue"
import { songCollection, storage } from "@/includes/firebase";

const props = defineProps({
  song: {
    type: Object,
    required: true
  },
  updateSong: {
    type: Function,
    required: true
  },
  index: {
    type: Number,
    required: true
  },
  removeSong: {
    type: Function,
    required: true
  },
  updateUnsavedFlag: {
    type: Function,
    reequired: true
  }
})

// const emits = defineEmits({

// })

const { song, updateSong, removeSong, index , updateUnsavedFlag} = props
const showForm = ref(false)

const schema = reactive({
  modified_name: 'required',
  genre: 'alpha_spaces'
})

const in_submission = ref(false)
const show_alert = ref(false)
const alert_variant = ref('bg-blue-500')
const alert_message = ref('Please wait! Updating song info.')

const edit = async (values) => {
  in_submission.value = true
  show_alert.value = true
  alert_variant.value = 'bg-blue-500'
  alert_message.value = 'Please wait! Updating song info.'

  try {
    await songCollection.doc(song.docID).update(values)
  } catch (error) {
    console.log(error) 
    alert_variant.value = 'bg-red-500';
    alert_message.value = 'Something went wrong! Try again later';
    return;
  }

  updateSong(index, values);
  updateUnsavedFlag(false)

  in_submission.value = false
  show_alert.value = true
  alert_variant.value = 'bg-green-500'
  alert_message.value = 'Success.'
}

const deleteSong = async () => {
  const storageRef = storage.ref();
  const songRef = storageRef.child(`songs/${song.original_name}`)

  await songRef.delete();
  await songCollection.doc(song.docID).delete()

  removeSong(index);
}

</script>
