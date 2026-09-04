<template>
  <div>
    <h2 class="font-semibold text-foreground mb-1.5">Progres</h2>
    <div class="card">
      <div class="card__body p-4 gap-3 items-center text-center">
        <ProgressRing :nilai="task.progres" />

        <p class="text-xs text-muted-foreground leading-relaxed">
          <template v-if="terkunci">
            Dikunci karena task sedang {{ statusLabel[task.status].toLowerCase() }}.
          </template>
          <template v-else>
            Update terakhir {{ task.waktuUpdate }} WIB.
          </template>
        </p>

        <button
          type="button"
          class="button button--primary w-full"
          :disabled="terkunci"
          @click="$emit('open-sheet')"
        >
          Update progres
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import ProgressRing from "./ProgressRing.vue"

defineProps({
  task: { type: Object, required: true },
  terkunci: { type: Boolean, required: true },
  statusLabel: { type: Object, required: true },
})

defineEmits(["open-sheet"])
</script>
