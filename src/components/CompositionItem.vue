<template>
  <div class="border border-gray-200 p-3 mb-4 rounded">
    <div v-show="!showForm">
      <h4 class="inline-block text-2xl font-bold">{{ song.modifiedName }}</h4>
      <button
        class="ml-1 py-1 px-2 text-sm rounded text-white bg-red-600 float-right"
        @click.prevent="onDeleteSong"
      >
        <i class="fa fa-times" />
      </button>
      <button
        class="ml-1 py-1 px-2 text-sm rounded text-white bg-blue-600 float-right"
        @click.prevent="showForm = !showForm"
      >
        <i class="fa fa-pencil-alt" />
      </button>
    </div>
    <div v-show="showForm">
      <div
        v-if="showAlert"
        class="text-white text-center font-bold p-4 mb-4"
        :class="alertVariant"
      >
        {{ alertMessage }}
      </div>
      <vee-form
        :validation-schema="schema"
        :initial-values="song"
        @submit="onEdit"
      >
        <div class="mb-3">
          <label class="inline-block mb-2">Song Title</label>
          <vee-field
            type="text"
            name="modifiedName"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            placeholder="Enter Song Title"
            @input="onUpdateUnsavedFlag(true)"
          />
          <ErrorMessage class="text-red-600" name="modifiedName" />
        </div>
        <div class="mb-3">
          <label class="inline-block mb-2">Genre</label>
          <vee-field
            type="text"
            name="genre"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            placeholder="Enter Genre"
            @input="onUpdateUnsavedFlag(true)"
          />
          <ErrorMessage class="text-red-600" name="genre" />
        </div>
        <button
          :disabled="inSubmission"
          type="submit"
          class="py-1.5 px-3 rounded text-white bg-green-600"
        >
          Submit
        </button>
        <button
          :disabled="inSubmission"
          type="button"
          class="py-1.5 px-3 mx-2 rounded text-white bg-gray-600"
          @click.prevent="showForm = false"
        >
          Go Back
        </button>
      </vee-form>
    </div>
  </div>
</template>

<script>
import { songsCollection, storage } from '@/includes/firebase';

export default {
  name: 'CompositionItem',
  props: {
    song: {
      type: Object,
      required: true
    },
    onUpdateSong: {
      type: Function,
      required: true
    },
    index: {
      type: Number,
      required: true
    },
    onRemoveSong: {
      type: Function,
      required: true
    },
    onUpdateUnsavedFlag: {
      type: Function
    }
  },
  data() {
    return {
      showForm: false,
      schema: {
        modifiedName: 'required',
        genre: 'alphaSpaces'
      },
      inSubmission: false,
      showAlert: false,
      alertVariant: 'bg-blue-500',
      alertMessage: 'Please wait! Updating song info.'
    };
  },
  methods: {
    async onEdit(values) {
      this.inSubmission = true;
      this.showAlert = true;
      this.alertVariant = 'bg-blue-500';
      this.alertMessage = 'Please wait! Updating song info.';

      try {
        await songsCollection.doc(this.song.docID).update(values);
      } catch (error) {
        this.inSubmission = false;
        this.alertVariant = 'bg-red-500';
        this.alertMessage = 'Something went wrong! Try again later.';
        return;
      }

      this.onUpdateSong(this.index, values);
      this.onUpdateUnsavedFlag(false);

      this.inSubmission = false;
      this.alertVariant = 'bg-green-500';
      this.alertMessage = 'Success!';
    },
    async onDeleteSong() {
      const storageRef = storage.ref();
      const songRef = storageRef.child(`songs/${this.song.originalName}`);

      await songRef.delete();

      await songsCollection.doc(this.song.docId).delete();

      this.onRemoveSong(this.index);
    }
  }
};
</script>
