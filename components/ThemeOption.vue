<template>
  <div class="flex gap-4">
    <div class="dropdown dropdown-top">
      <label tabindex="0" class="btn btn-sm">Choose Theme</label>
      <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-32">
        <li v-for="theme of themes" :key="theme" @click="changeTheme($event, theme)"
          class="cursor-pointer hover:bg-base-200 px-2 rounded"
        >{{ theme }}</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
const colorMode = useColorMode();
const themes = ["light", "dark", "cupcake", "cyberpunk", "valentine", "aqua", "wireframe", "dracula", "night", "coffee"];

function changeTheme(event, theme) {
  colorMode.preference = theme
}
</script>
