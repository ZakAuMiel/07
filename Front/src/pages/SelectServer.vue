<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Guild {
  id: string
  name: string
  icon: string | null
}

const guilds = ref<Guild[]>([])
const loading = ref(true)

const fetchGuilds = async () => {
  try {
    const res = await fetch('/api/auth/discord/guilds', {
      credentials: 'include' // utilise bien les cookies de session
    })
    const data = await res.json()
    guilds.value = data.guilds || []
  } catch (err) {
    console.error('❌ Erreur fetch guilds', err)
  } finally {
    loading.value = false
  }
}

const handleSelect = async (guild: Guild) => {
  try {
    const res = await fetch(`/api/auth/verify-role?guildId=${guild.id}`, {
      credentials: 'include'
    })
    const data = await res.json()

    if (data.role === 'ami' || data.role === 'streamer') {
      localStorage.setItem('role', data.role)
      localStorage.setItem('guildId', guild.id)
      window.location.href = '/upload'
    } else {
      alert('❌ Tu n’as pas les permissions nécessaires sur ce serveur.')
    }
  } catch (err) {
    alert("Erreur lors de la vérification du rôle.")
    console.error(err)
  }
}

onMounted(fetchGuilds)
</script>

<template>
  <div class="min-h-screen bg-soft text-main p-6 flex flex-col items-center">
    <h1 class="text-3xl font-bold text-accent mb-4">🧭 Choisis un serveur</h1>

    <div v-if="loading" class="text-accent">Chargement des serveurs...</div>

    <div v-else-if="guilds.length === 0" class="text-accent">
      Aucun serveur trouvé. Le bot doit être présent sur au moins un serveur où tu es membre.
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-5xl">
      <div
        v-for="guild in guilds"
        :key="guild.id"
        @click="handleSelect(guild)"
        class="cursor-pointer p-4 bg-panel rounded border border-accent hover:bg-accent hover:text-white transition"
      >
        <div class="flex items-center gap-4">
          <img
            v-if="guild.icon"
            :src="`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`"
            alt="icon"
            class="w-12 h-12 rounded"
          />
          <div v-else class="w-12 h-12 bg-gray-700 rounded flex items-center justify-center font-bold">
            {{ guild.name[0] }}
          </div>
          <div class="font-semibold truncate">{{ guild.name }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
