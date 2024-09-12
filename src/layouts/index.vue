<script lang="tsx">
import { Teleport, defineComponent } from 'vue'
import { RouterView } from 'vue-router'

import Main from './components/Main.vue'
import Github from './components/Github.vue'

export default defineComponent({
  name: 'Default',
  setup() {
    return () => (
      <>
        <Main>
          <RouterView />
        </Main>

        <Teleport to="#global-components">
          <Github class="xl:block" href="https://github.com/pratt13/glucose_app_frontend" />
        </Teleport>
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
