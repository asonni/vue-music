<template>
  <main>
    <!-- Music Header -->
    <section class="w-full mb-8 py-14 text-center text-white relative">
      <div
        class="absolute inset-0 w-full h-full box-border bg-contain music-bg"
        style="background-image: url(/assets/img/song-header.png)"
      ></div>
      <div class="container mx-auto flex items-center">
        <!-- Play/Pause Button -->
        <button
          id="play-btn"
          type="button"
          class="z-50 h-24 w-24 text-3xl bg-white text-black rounded-full focus:outline-none"
          @click.prevent="onNewSong(song)"
        >
          <i class="fas fa-play" />
        </button>
        <div class="z-50 text-left ml-8">
          <!-- Song Info -->
          <div class="text-3xl font-bold">{{ song.modifiedName }}</div>
          <div>{{ song.genre }}</div>
          <div class="song-price">{{ $n(100, 'currency', 'ja') }}</div>
        </div>
      </div>
    </section>
    <!-- Form -->
    <section id="comments" class="container mx-auto mt-6">
      <div
        class="bg-white rounded border border-gray-200 relative flex flex-col"
      >
        <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
          <!-- Comment Count -->
          <span class="card-title">
            {{
              $tc('song.comment-count', song.commentCount, {
                count: song.commentCount
              })
            }}
          </span>
          <i class="fa fa-comments float-right text-green-400 text-2xl" />
        </div>
        <div class="p-6">
          <div
            v-if="commentShowAlert"
            class="text-white text-center font-bold p-4 mb-4"
            :class="commentAlertVariant"
          >
            {{ commentAlertMessage }}
          </div>
          <vee-form
            v-if="userLoggedIn"
            :validation-schema="schema"
            @submit="onAddComment"
          >
            <vee-field
              as="textarea"
              name="comment"
              class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded mb-4"
              placeholder="Your comment here..."
            />
            <ErrorMessage class="text-red-600" name="comment" />
            <button
              type="submit"
              class="py-1.5 px-3 rounded text-white bg-green-600 block"
              :disabled="commentInSubmission"
            >
              Submit
            </button>
          </vee-form>
          <!-- Sort Comments -->
          <select
            v-model="sort"
            class="block mt-4 py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
          >
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>
      </div>
    </section>
    <!-- Comments -->
    <ul class="container mx-auto">
      <li
        v-for="comment in sortedComments"
        :key="comment.docID"
        class="p-6 bg-gray-50 border border-gray-200"
      >
        <!-- Comment Author -->
        <div class="mb-5">
          <div class="font-bold">{{ comment.name }}</div>
          <time>{{ comment.datePosted }}</time>
        </div>
        <p>
          {{ comment.content }}
        </p>
      </li>
    </ul>
  </main>
</template>

<script>
import { mapState, mapActions } from 'pinia';
import useUserStore from '@/stores/user';
import usePlayerStore from '@/stores/player';
import { auth, songsCollection, commentsCollection } from '@/includes/firebase';

export default {
  name: 'Song',
  async beforeRouteEnter(to, from, next) {
    const docSnapshot = await songsCollection.doc(to.params.songId).get();

    next(vm => {
      if (!docSnapshot.exists) {
        vm.$router.push({ name: 'home' });
        return;
      }

      const { sort } = vm.$route.query;

      vm.sort = sort === 'latest' || sort === 'oldest' ? sort : 'latest';

      vm.song = docSnapshot.data();
      vm.onGetComments();
    });
  },
  props: {
    songId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      song: {},
      schema: {
        comment: 'required|min:3'
      },
      commentInSubmission: false,
      commentShowAlert: false,
      commentAlertVariant: 'bg-blue-500',
      commentAlertMessage: 'Please wait! Your comment is being submitted',
      comments: [],
      sort: 'latest'
    };
  },
  computed: {
    ...mapState(useUserStore, ['userLoggedIn']),
    ...mapState(usePlayerStore, [
      'seek',
      'playing',
      'duration',
      'currentSong',
      'playerProgress'
    ]),
    sortedComments() {
      return [...this.comments].sort((a, b) => {
        if (this.sort === 'latest') {
          return new Date(b.datePosted) - new Date(a.datePosted);
        }

        return new Date(a.datePosted) - new Date(b.datePosted);
      });
    }
  },
  watch: {
    sort(newVal) {
      if (newVal === this.$route.query.sort) {
        return;
      }
      this.$router.push({
        query: {
          sort: newVal
        }
      });
    }
  },
  methods: {
    ...mapActions(usePlayerStore, ['onNewSong', 'onToggleAudio']),
    async onAddComment(values, { resetForm }) {
      this.commentInSubmission = true;
      this.commentShowAlert = true;
      this.commentAlertVariant = 'bg-blue-500';
      this.commentAlertMessage = 'Please wait! Your comment is being submitted';

      const comment = {
        content: values.comment,
        datePosted: new Date().toString(),
        sid: this.songId,
        name: auth.currentUser.displayName,
        uid: auth.currentUser.uid
      };

      await commentsCollection.add(comment);

      this.song.commentCount += 1;

      await songsCollection.doc(this.songId).update({
        commentCount: this.song.commentCount
      });

      this.onGetComments();

      this.commentInSubmission = false;
      this.commentAlertVariant = 'bg-green-500';
      this.commentAlertMessage = 'Comment added!';

      setTimeout(() => {
        this.commentShowAlert = false;
      }, 2000);

      resetForm();
    },
    async onGetComments() {
      const snapshots = await commentsCollection
        .where('sid', '==', this.songId)
        .get();

      this.comments = [];

      snapshots.forEach(doc => {
        this.comments.push({
          docID: doc.id,
          ...doc.data()
        });
      });
    }
  }
};
</script>
