<script setup lang="ts">
import { ref } from 'vue'

const file = ref<File | null>(null)
const previewUrl = ref('')
const username = ref('')
const avatar = ref('')
const size = ref(50)

const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    file.value = input.files[0]
    previewUrl.value = URL.createObjectURL(file.value)
  }
}

const handleSubmit = async () => {
  if (!file.value) return alert("Aucun fichier sélectionné")

  const formData = new FormData()
  formData.append('media', file.value)
  formData.append('username', username.value)
  formData.append('avatar', avatar.value)
  formData.append('size', size.value.toString())

  try {
    await fetch('http://localhost:3001/send', {
      method: 'POST',
      body: formData
    })
    alert("✅ Mème envoyé au stream")
    file.value = null
    previewUrl.value = ''
  } catch (e) {
    alert("❌ Erreur lors de l'envoi")
  }
}
</script>

<template>
    <div class="w-full h-full p-6 bg-soft text-main flex justify-center items-center  fade-in">

      <div class="flex flex-col lg:flex-row gap-6 w-full max-w-[90rem] h-[90vh]">
        <!-- Form -->
        <div class="bg-panel text-main p-6 rounded-xl flex-1 border border-accent shadow-md flex flex-col justify-between">
          <div>
            <h2 class="text-2xl font-bold mb-4 text-accent">📤 Envoyer un mème</h2>
            <form class="space-y-4" @submit.prevent="handleSubmit">
              <input type="file" @change="handleFileChange" class="w-full p-2 bg-soft text-main rounded" />
              <input v-model="username" placeholder="Ton prénom" class="w-full p-2 bg-soft text-main rounded" />
              <input v-model="avatar" placeholder="Lien avatar (optionnel)" class="w-full p-2 bg-soft text-main rounded" />
  
              <label class="text-sm block">Taille d'affichage : {{ size }}%</label>
              <input type="range" min="10" max="100" v-model="size" class="w-full accent-[--color-primary]" />
            </form>
          </div>
  
          <button @click="handleSubmit" class="mt-6 w-full p-3 btn-primary font-bold rounded transition">
            🚀 Envoyer au stream
          </button>
        </div>
  
        <!-- Preview -->
        <div class="bg-panel text-main p-6 rounded-xl flex-1 border border-accent shadow-md flex flex-col">
          <h2 class="text-2xl font-bold mb-4 text-accent">👀 Aperçu</h2>
          <div class="bg-soft rounded p-4 flex-1 overflow-hidden flex items-center justify-center">
            <template v-if="previewUrl">
              <video
                v-if="file?.type.startsWith('video')"
                :src="previewUrl"
                controls
                class="rounded max-h-full max-w-full object-contain"
              />
              <img
                v-else
                :src="previewUrl"
                class="rounded max-h-full max-w-full object-contain"
              />
            </template>
            <template v-else>
              <p class="italic text-sm text-accent">Aucun mème sélectionné</p>
            </template>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  
