<!-- Please remove this file from your project -->
<template>
  <div
    class="relative flex items-top justify-center min-h-screen sm:items-center sm:pt-0"
  >
    <div class="max-w-4xl mx-auto sm:px-6 lg:px-8">
      <div class="flex justify-center gap-4">
        <a
          class="flex justify-center pt-8 sm:pt-0 uppercase text-4xl"
          href="https://github.fajarbc.com"
          target="_blank"
        >
          github.fajarbc.com
        </a>
        <ThemeOption></ThemeOption>
      </div>
      <div class="mt-8 bg-base-200 overflow-hidden shadow sm:rounded-lg p-6">
        <h2 class="text-2xl leading-7 font-semibold">Hi there,</h2>
        <div class="mt-3">
          My name is
          <span
            class="underline decoration-wavy decoration-blue"
            title="@fajarbc"
            >Fajar</span
          >
          and I'm planning to build something here, just for fun. <br />FYI,
          this page is built with Nuxt 3 (Vue 3) as frontend framework, Tailwind
          as styling, Vite as the build tool and uses Github Action Workflows
          for the deployments.
          <div class="flex items-center gap-1">
            <icon-github></icon-github> Github Repository:
            <a
              href="https://github.com/fajarbc/fajarbc.github.io/"
              class="underline"
              target="_blank"
              title="fajarbc.github.io"
            >
              fajarbc.github.io
            </a>
          </div>
        </div>
        <div class="mt-4 pt-4 border-t border-dashed">
          For now you can try to open:
          <ul>
            <li class="py-2">
              <details>
                <summary>
                  <a
                    href="https://github.fajarbc.com/learn-vue-fundamentals/"
                    class="underline ml-4 md:ml-0"
                    target="_blank"
                    title="Learn Vue Fundamentals - Shopping List"
                  >
                    Learn Vue Fundamentals - Shopping List
                  </a>
                </summary>
                <div>
                  Created with Vue2 to learn the Vue fundamentals, especially on
                  two ways data binding.
                  <div class="flex items-center gap-1">
                    <icon-github></icon-github> Github Repository:
                    <a
                      href="https://github.com/fajarbc/learn-vue-fundamentals/"
                      class="underline"
                      target="_blank"
                      title="Learn Vue Fundamentals - Github Repository"
                    >
                      Learn Vue Fundamentals
                    </a>
                  </div>
                </div>
              </details>
            </li>
            <li class="py-2">
              <details open>
                <summary>
                  <a
                    href="https://github.fajarbc.com/learn-vue3-basic/"
                    class="underline ml-4 md:ml-0"
                    target="_blank"
                    title="Learn Vue3 Basic - Task Reminder"
                  >
                    Learn Vue3 Basic - Task Reminder
                  </a>
                </summary>
                <div>
                  Created with Vue3 to learn the Vue3 basic and consumes API
                  from backend endpoint that included in the project using
                  json-server, especially on two ways data binding & fetching
                  API.
                  <br />Because it has backend, the data is persistent. So
                  please be wise 👍😁👌, thanks. <br />I also add Github Action
                  (Workflows) to automatically deploy compiled static files to
                  Github Pages.
                  <div class="flex items-center gap-1">
                    <icon-github></icon-github> Github Repository:
                    <a
                      href="https://github.com/fajarbc/learn-vue3-basic/"
                      class="underline"
                      target="_blank"
                      title="Learn Vue3 Basic - Github Repository"
                    >
                      Learn Vue3 Basic
                    </a>
                  </div>
                </div>
              </details>
            </li>
          </ul>
        </div>
      </div>
      <div class="flex justify-center pt-4 space-x-2 pb-4 md:pb-2">
        <a href="https://github.com/fajarbc" target="_blank">
          <icon-github></icon-github>
        </a>
        <a href="https://linkedin.com/in/fajarbc" target="_blank">
          <svg
            class="w-6 h-6 button--github"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path
              d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
            />
          </svg>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import IconGithub from "./icons/IconGithub.vue";
import ThemeOption from "./ThemeOption.vue";
</script>
