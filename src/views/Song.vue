<template>
  <div>{{ songId }}</div>
</template>

<script>
export default {
  name: 'Song',
  props: {
    songId: {
      type: String,
      required: true
    }
  }
};
</script>
