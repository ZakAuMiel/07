<template>
  <div class="h-screen w-full bg-soft text-main flex items-center justify-center">
    <div class="flex flex-col md:flex-row gap-12 p-8 w-full max-w-6xl">

      <!-- Logo & Description -->
      <div class="flex-1 flex flex-col justify-center items-start text-left animate-fade-in">
        <h1 class="text-6xl font-black text-primary tracking-wide">07</h1>
        <p class="mt-4 text-lg text-accent max-w-md">
          Bienvenue sur <strong>07</strong> – la plateforme où tes potes peuvent t'envoyer leurs mèmes en live.
          Authentifie-toi avec Discord et balance des clips, images ou gifs en temps réel sur le stream !
        </p>
      </div>

      <!-- Login Card -->
      <div class="flex-1 flex justify-center items-center">
        <div class="bg-panel border border-accent rounded-xl p-8 w-full max-w-md shadow-md">
          <h2 class="text-2xl font-bold text-accent mb-4">Connexion avec Discord</h2>
          <p class="text-sm text-accent mb-6">
            Seuls tes amis Discord ayant le lien peuvent s'authentifier et envoyer des contenus.
          </p>
          <a
            href="/api/auth/login"
            class="block w-full text-center bg-primary text-soft font-semibold py-3 rounded hover:bg-opacity-90 transition"
          >
            🔑 Se connecter via Discord
          </a>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fade-in 0.5s ease-out;
}
</style>
