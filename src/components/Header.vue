<template>
  <!-- Header -->
  <header id="header" class="bg-gray-700">
    <nav class="container mx-auto flex justify-start items-center py-5 px-4">
      <!-- App Name -->
      <router-link to="/" class="text-white font-bold uppercase text-2xl mr-4" exact-active-class="no-active">Music</router-link>

      <div class="flex flex-grow items-center">
        <!-- Primary Navigation -->
        <ul class="flex flex-row mt-1">
          <!-- Navigation Links -->
          <li>
            <router-link class="px-2 text-white" :to="{name: 'about'}">About</router-link>
          </li>
          <li v-if="!userStore.userLoggedIn">
            <a class="px-2 text-white" href="#" @click.prevent="toggleAuthModal">Login / Register</a>
          </li>
          <template v-else>
            <li>
              <router-link class="px-2 text-white" :to="{ name: 'manage' }">Manage</router-link>
            </li>
            <li>
              <a class="px-2 text-white" href="#" @click.prevent="signout">Logout</a>
            </li>
          </template>
        </ul>
      </div>
    </nav>
  </header>
</template>

<script setup>
import useModalStore from "@/stores/modal"
import useUserStore from "@/stores/user"

import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const modalStore = useModalStore();
const toggleAuthModal = () => {
  modalStore.isOpen = !modalStore.isOpen
}

const signout = () => {
  userStore.signout();
  if (route.meta.requiresAuth){
    router.push({name: "home"})
  }
}
</script>

<style lang="scss" scoped>


</style>