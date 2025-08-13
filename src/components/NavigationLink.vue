<template>
  <router-link
    v-bind="props"
    class="flex flex-col items-center gap-1 transition-transform"
    activeClass="scale-120"
  >
    <div class="bg-white/10 rounded-md p-1 lg:p-4 w-fit">
      <slot name="icon" />
    </div>
    <slot name="label" />
  </router-link>
</template>
<script setup lang="ts">
import type { RouterLinkProps } from 'vue-router'

type Props = RouterLinkProps & {
  to: RouterLinkProps['to']
}
const props = defineProps<Props>()
</script>
