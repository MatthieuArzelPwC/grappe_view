<template>
  <BubbleGraph :bubbleGraphProps="content" />
  <!-- This line force weweb to load data -->
  <p class="invisible">First element name : {{ content.data[0].label }}</p>
</template>

<script>
import BubbleGraph from "./components/BubbleGraph.vue";

export default {
  name: "App",
  components: {
    BubbleGraph,
  },
  props: {
    content: { type: "Object", required: true },
  },
};
</script>

<style lang="scss" scoped>
.my-element {
  p {
    font-size: 18px;
  }
}
.invisible {
  display: none;
}
</style>
