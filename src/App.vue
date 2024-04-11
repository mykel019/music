<template>
  <div>
    <Header />

    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <div :key="route.name">
          <component :is="Component"></component>
        </div>
      </transition>
    </router-view>
    
    <Player />
    <Auth />

  </div>
</template>

<script setup>
import Header from '@/components/Header.vue'
import Player from '@/components/Player.vue'
import Auth from '@/components/Auth.vue'

import useUserStore  from '@/stores/user'
import { auth } from "./includes/firebase"
import { useRoute } from 'vue-router'

const route = useRoute();

const userStore = useUserStore();

if(auth.currentUser){
  userStore.userLoggedIn = true;
}

</script>

<style scoped>
.fade-enter-from{
  opacity: 0;
}

.fade-enter-active{
  transition: all 0.2s linear;
}
.fade-leave-to{
  transition: all 0.2s linear;
  opacity: 0;
}
</style>