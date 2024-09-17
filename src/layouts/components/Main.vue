<template>
  <v-card>
    <v-layout>
      <v-app-bar color="primary" prominent>
        <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <v-toolbar-title class="align-start justify-start flex">{{ $route.name }}</v-toolbar-title>

        <v-spacer></v-spacer>

        <template v-if="$vuetify.display.mdAndUp">
          <v-btn icon="fas fa-magnifying-glass" variant="text"></v-btn>
          <!-- Hack margin right to allow the github component to lie on the last part -->
          <v-btn icon="fas fa-filter" variant="text"></v-btn>
        </template>
        <Theme />
        <Github class="xl:block" href="https://github.com/pratt13/glucose_app_frontend" />
      </v-app-bar>

      <v-navigation-drawer
        v-model="drawer"
        :location="$vuetify.display.mobile ? 'bottom' : undefined"
        temporary
      >
        <v-list density="compact" nav>
          <!-- <v-list v-model:opened="open"> -->
          <!-- Home -No Group -->
          <v-list-item
            :key="homePage.id"
            :prepend-icon="homePage.icon"
            :title="homePage.title"
            router
            :to="homePage.route"
          ></v-list-item>

          <v-list-group value="Glucose">
            <template #activator="{ props }">
              <v-list-item
                v-bind="props"
                prepend-icon="fas fa-stethoscope"
                title="Glucose"
              ></v-list-item>
            </template>

            <v-list-item
              v-for="page in glucosePages"
              :key="page.id"
              :prepend-icon="page.icon"
              :title="page.title"
              router
              :to="page.route"
            ></v-list-item>
          </v-list-group>

          <!-- Exercise -->

          <v-list-group value="Exercise">
            <template #activator="{ props }">
              <v-list-item
                v-bind="props"
                prepend-icon="fas fa-person-walking"
                title="Exercise"
              ></v-list-item>
            </template>

            <v-list-item
              v-for="page in exercisePages"
              :key="page.id"
              :prepend-icon="page.icon"
              :title="page.title"
              router
              :to="page.route"
            ></v-list-item>
          </v-list-group>
        </v-list>
      </v-navigation-drawer>

      <v-main class="main flex flex-col justify-start items-center min-h-screen">
        <slot name="default" />
      </v-main>
    </v-layout>
  </v-card>
</template>

<script>
import Github from './Github.vue'
import Theme from './Theme.vue'

export default {
  components: {
    Github,
    Theme,
  },
  data: () => ({
    drawer: false,
    group: null,
    homePage: {
      id: 1,
      title: 'Home',
      route: 'Home',
      icon: 'fas fa-house',
    },
    glucosePages: [
      {
        id: 3,
        title: 'Glucose',
        route: 'Glucose',
        icon: 'fas fa-stethoscope',
      },
      {
        id: 4,
        title: 'GlucoseTracker',
        route: 'GlucoseTracker',
        icon: 'fas fa-stethoscope',
      },
      {
        id: 5,
        title: 'MomentDashboard',
        route: 'MomentDashboard',
        icon: 'fas fa-gauge',
      },
      {
        id: 6,
        title: 'Daily Dashboard',
        route: 'DailyDashboard',
        icon: 'fas fa-gauge',
      },
    ],
    exercisePages: [
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
  methods: {
    links: function () {
      console.log(this.$route) // should work
    },
  },
}
</script>

<style scoped>
html.dark .main {
  @apply bg-black;
}
</style>
