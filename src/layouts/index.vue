<script lang="tsx">
import { defineComponent } from 'vue'
import { RouterView } from 'vue-router'

import Main from './components/Main.vue'

export default defineComponent({
  name: 'Default',
  setup() {
    return () => (
      <>
        <Main>
          <RouterView />
        </Main>
      </>
    )
  },
})
</script>

<style scoped>
.button {
  @apply hover:bg-black;
}

.button.activated {
  @apply bg-black;
}

html.dark .button {
  @apply hover:bg-gray-700;
}

html.dark .button.activated {
  @apply bg-gray-700;
}
</style>
