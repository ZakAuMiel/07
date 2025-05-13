<script setup lang="ts">
import { ref } from 'vue'

const file = ref<File | null>(null)
const previewUrl = ref('')
const username = ref('')
const avatar = ref('')
const size = ref(50)
const fullVideo = ref(true)
const duration = ref(5)
const caption = ref('')

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
  formData.append('fullVideo', fullVideo.value.toString())
  formData.append('duration', duration.value.toString())
  formData.append('caption', caption.value)

  try {
    await fetch('http://localhost:3001/send', {
      method: 'POST',
      body: formData
    })
    alert("✅ Mème envoyé au stream")
    file.value = null
    previewUrl.value = ''
    caption.value = ''
  } catch (e) {
    alert("❌ Erreur lors de l'envoi")
  }
}
</script>

<template>
  <div class="h-full w-full p-6 bg-soft text-main flex justify-center items-center fade-in">
    <div class="flex flex-col lg:flex-row gap-6 w-full max-w-[90rem] h-[90vh]">

      <!-- Form Panel -->
      <div class="bg-panel text-main p-6 rounded-xl flex-1 border border-accent shadow-md flex flex-col justify-between">
        <div>
          <h2 class="text-2xl font-bold mb-4 text-accent">📤 Envoyer un mème</h2>
          <form class="space-y-4" @submit.prevent="handleSubmit">
            <div>
              <label for="media" class="block text-sm font-medium text-accent">Fichier à envoyer</label>
              <input id="media" type="file" @change="handleFileChange" class="w-full p-2 bg-soft text-main rounded" />
            </div>

            <div>
              <label for="username" class="block text-sm font-medium text-accent">Ton prénom</label>
              <input id="username" v-model="username" placeholder="Ex: Zak" class="w-full p-2 bg-soft text-main rounded" />
            </div>

            <div>
              <label for="avatar" class="block text-sm font-medium text-accent">Lien vers ton avatar (optionnel)</label>
              <input id="avatar" v-model="avatar" placeholder="https://..." class="w-full p-2 bg-soft text-main rounded" />
            </div>

            <div>
              <label for="size" class="block text-sm font-medium text-accent">Taille d'affichage sur le stream (%)</label>
              <input id="size" type="number" min="10" max="100" v-model="size" class="w-full p-2 bg-soft text-main rounded" />
            </div>

            <div class="flex items-center gap-2">
              <input type="checkbox" id="fullVideo" v-model="fullVideo" class="accent-[--color-primary]" />
              <label for="fullVideo" class="text-sm text-accent">Afficher toute la vidéo</label>
            </div>

            <div v-if="!fullVideo">
              <label for="duration" class="block text-sm font-medium text-accent">Durée maximale (en secondes)</label>
              <input id="duration" type="number" min="1" max="60" v-model="duration" class="w-full p-2 bg-soft text-main rounded" />
            </div>

            <div>
              <label for="caption" class="block text-sm font-medium text-accent">Texte à afficher sous la vidéo</label>
              <input id="caption" v-model="caption" placeholder="Ex: Je passe à la télé !" class="w-full p-2 bg-soft text-main rounded" />
            </div>

            <button type="submit" class="w-full p-3 btn-primary font-bold rounded transition">
              🚀 Envoyer au stream
            </button>
          </form>
        </div>
      </div>

      <!-- Preview Panel -->
      <div class="bg-panel text-main p-6 rounded-xl flex-1 border border-accent shadow-md flex flex-col">
        <h2 class="text-2xl font-bold mb-4 text-accent">👀 Aperçu</h2>
        <div class="bg-soft rounded p-4 flex-1 overflow-hidden flex flex-col items-center justify-center">
          <template v-if="previewUrl">
            <video
              v-if="file?.type.startsWith('video')"
              :src="previewUrl"
              controls
              class="rounded max-h-full max-w-full object-contain mb-2"
            />
            <img
              v-else
              :src="previewUrl"
              class="rounded max-h-full max-w-full object-contain mb-2"
            />
            <p v-if="caption" class="text-accent text-center italic">{{ caption }}</p>
          </template>
          <template v-else>
            <p class="italic text-sm text-accent">Aucun mème sélectionné</p>
          </template>
        </div>
      </div>

    </div>
  </div>
</template>
