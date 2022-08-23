<template>
  <!-- Main Content -->
  <section class="container mx-auto mt-6">
    <div class="md:grid md:grid-cols-3 md:gap-4">
      <div class="col-span-1">
        <app-upload ref="upload" :on-add-song="onAddSong" />
      </div>
      <div class="col-span-2">
        <div
          class="bg-white rounded border border-gray-200 relative flex flex-col"
        >
          <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
            <span class="card-title">My Songs</span>
            <i class="fa fa-compact-disc float-right text-green-400 text-2xl" />
          </div>
          <div class="p-6">
            <!-- Composition Items -->
            <composition-item
              v-for="(song, index) in songs"
              :key="song.docID"
              :song="song"
              :on-update-song="onUpdateSong"
              :index="index"
              :on-remove-song="onRemoveSong"
              :on-update-unsaved-flag="onUpdateUnsavedFlag"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import AppUpload from '@/components/Upload.vue';
import CompositionItem from '@/components/CompositionItem.vue';
import { songsCollection, auth } from '@/includes/firebase';
// import useUserStore from '@/stores/user';

export default {
  name: 'Manage',
  components: {
    AppUpload,
    CompositionItem
  },
  beforeRouteLeave(to, from, next) {
    if (!this.unsavedFlag) {
      // this.$refs.upload.onCancelUpload();
      next();
    } else {
      const leave = confirm(
        'You have unsaved changes. Are you sure you want to leave?'
      );
      next(leave);
    }
  },
  data() {
    return {
      songs: [],
      unsavedFlag: false
    };
  },
  async created() {
    const snapshot = await songsCollection
      .where('uid', '==', auth.currentUser.uid)
      .get();

    snapshot.forEach(this.onAddSong);
  },
  methods: {
    onUpdateSong(i, { modifiedName, genre }) {
      this.songs[i].modifiedName = modifiedName;
      this.songs[i].genre = genre;
    },
    onRemoveSong(index) {
      this.songs.splice(index, 1);
    },
    onAddSong(document) {
      const song = {
        ...document.data(),
        docID: document.id
      };

      this.songs.push(song);
    },
    onUpdateUnsavedFlag(value) {
      this.unsavedFlag = value;
    }
  }
  // beforeRouteEnter(to, from, next) {
  //   const userStore = useUserStore();
  //   if (userStore.userLoggedIn) {
  //     next();
  //   } else {
  //     next({ name: 'home' });
  //   }
  // }
};
</script>
