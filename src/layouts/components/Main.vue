<template>
  <v-card>
    <v-layout>
      <v-app-bar color="primary" prominent>
        <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <v-toolbar-title>Glucose Dashboard</v-toolbar-title>

        <v-spacer></v-spacer>

        <template v-if="$vuetify.display.mdAndUp">
          <v-btn icon="mdi-magnify" variant="text"></v-btn>

          <v-btn icon="mdi-filter" variant="text"></v-btn>
        </template>

        <v-btn icon="mdi-dots-vertical" variant="text"></v-btn>
      </v-app-bar>

      <v-navigation-drawer
        v-model="drawer"
        :location="$vuetify.display.mobile ? 'bottom' : undefined"
        temporary
      >
        <v-list density="compact" nav>
          <v-list-item
            v-for="page in pages"
            :key="page.id"
            :prepend-icon="page.icon"
            :title="page.title"
            router
            :to="page.route"
          >
            <v-list-item-action></v-list-item-action>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>

      <v-main class="main flex flex-col justify-start items-center min-h-screen">
        <slot name="default" />
      </v-main>
    </v-layout>
  </v-card>
</template>

<script>
export default {
  data: () => ({
    drawer: false,
    group: null,
    pages: [
      {
        id: 1,
        title: 'Home',
        route: 'Home',
        icon: 'fas fa-house',
      },
      {
        id: 3,
        title: 'Glucose',
        route: 'Glucose',
        icon: 'fas fa-stethoscope',
      },
      {
        id: 5,
        title: 'Dashboard',
        route: 'Dashboard',
        icon: 'fas fa-gauge',
      },
      {
        id: 7,
        title: 'Exercise',
        route: 'Exercise',
        icon: 'fas fa-heart-pulse',
      },
      {
        id: 9,
        title: 'Strava',
        route: 'Strava',
        icon: 'fas fa-person-walking',
      },
    ],
  }),
  watch: {
    group() {
      this.drawer = false
    },
  },
}
</script>

<style scoped>
html.dark .main {
  @apply bg-black;
}
</style>
