<template>
  <auth />
  <app-header />
  <router-view v-slot="{ Component, route }">
    <transition name="fade" mode="out-in">
      <div :key="route.name">
        <component :is="Component"></component>
      </div>
    </transition>
  </router-view>
  <app-player />
</template>

<script>
import AppHeader from '@/components/Header.vue';
import Auth from '@/components/Auth.vue';
import { mapWritableState } from 'pinia';
import useUserStore from '@/stores/user';
import { auth } from './includes/firebase';
import AppPlayer from '@/components/Player.vue';

export default {
  name: 'App',
  components: {
    Auth,
    AppHeader,
    AppPlayer
  },
  computed: {
    ...mapWritableState(useUserStore, ['userLoggedIn'])
  },
  created() {
    if (auth.currentUser) {
      this.userLoggedIn = true;
    }
  }
};
</script>
<style>
.fade-enter-from {
  opacity: 0;
}

.fade-enter-active {
  transition: all 0.5s linear;
}

.fade-leave-to {
  transition: all 0.5s linear;
  opacity: 0;
}
</style>
