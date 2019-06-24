<template>
  <div></div>
</template>

<script>
import { openConsole } from '@/api/setting'
export default {
  created () {
    openConsole()
  }
}
</script>

