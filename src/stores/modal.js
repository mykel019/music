import { defineStore } from "pinia";
import { computed, ref } from "vue";

export default defineStore('modal', () => {
  const isOpen = ref(false)

  const hiddenClass = computed(() => { return isOpen.value === false ? 'hidden' : ''})

  return { isOpen, hiddenClass }
})