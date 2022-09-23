<template>
  <div
    class="relative block lg:flex justify-center min-h-screen p-4 lg:p-8"
  >
    <div class="flex-none max-w-xl w-64 mx-auto mt-2 mb-4 lg:mb-2">
      <div class="flex justify-center p-4 space-x-2">
        <ProfileVue></ProfileVue>
      </div>
    </div>
    <div class="max-w-4xl grow mx-auto my-2">
      <HomeContent></HomeContent>
    </div>
  </div>
</template>

<script setup>
  import { projects } from "../projects.json";
import ProfileVue from "./Profile.vue";
import HomeContent from "./HomeContent.vue"
</script>
