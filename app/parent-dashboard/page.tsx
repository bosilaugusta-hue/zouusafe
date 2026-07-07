export default function ParentDashboardPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#dbeafe] via-[#f3e8ff] to-[#fef3c7] px-6 py-8">
      <section className="mx-auto max-w-7xl">
        <header className="mb-8 flex items-center justify-between rounded-3xl border border-white/60 bg-white/70 p-5 shadow-lg backdrop-blur-xl">
          <div>
            <p className="text-sm text-gray-500">Espace parent</p>
            <h1 className="text-3xl font-bold text-gray-800">
              Bonjour, Maman 👋
            </h1>
          </div>

          <button
            type="button"
            className="rounded-full bg-gradient-to-r from-blue-400 to-purple-500 px-5 py-2 text-white shadow-md transition hover:scale-105"
          >
            Ajouter un enfant
          </button>
        </header>

        <section className="mb-8 grid gap-5 md:grid-cols-4">
          <div className="rounded-3xl bg-white/70 p-5 shadow-md backdrop-blur-xl">
            <p className="text-sm text-gray-500">Enfants suivis</p>
            <strong className="text-3xl text-gray-800">2</strong>
          </div>

          <div className="rounded-3xl bg-white/70 p-5 shadow-md backdrop-blur-xl">
            <p className="text-sm text-gray-500">Recherches aujourd’hui</p>
            <strong className="text-3xl text-gray-800">12</strong>
          </div>

          <div className="rounded-3xl bg-white/70 p-5 shadow-md backdrop-blur-xl">
            <p className="text-sm text-gray-500">Sites bloqués</p>
            <strong className="text-3xl text-gray-800">4</strong>
          </div>

          <div className="rounded-3xl bg-white/70 p-5 shadow-md backdrop-blur-xl">
            <p className="text-sm text-gray-500">Temps d’écran</p>
            <strong className="text-3xl text-gray-800">1h20</strong>
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-3xl border border-white/60 bg-white/70 p-6 shadow-lg backdrop-blur-xl">
            <h2 className="mb-5 text-xl font-bold text-gray-800">
              Mes enfants
            </h2>

            <div className="space-y-4">
              <article className="flex items-center justify-between rounded-2xl bg-blue-50 p-4">
                <div>
                  <h3 className="font-semibold text-gray-800">Lina</h3>
                  <p className="text-sm text-gray-500">6 ans · Profil actif</p>
                </div>

                <button
                  type="button"
                  className="rounded-full bg-white px-4 py-2 text-sm shadow"
                >
                  Voir
                </button>
              </article>

              <article className="flex items-center justify-between rounded-2xl bg-purple-50 p-4">
                <div>
                  <h3 className="font-semibold text-gray-800">Noah</h3>
                  <p className="text-sm text-gray-500">8 ans · Profil actif</p>
                </div>

                <button
                  type="button"
                  className="rounded-full bg-white px-4 py-2 text-sm shadow"
                >
                  Voir
                </button>
              </article>
            </div>
          </div>

          <div className="rounded-3xl border border-white/60 bg-white/70 p-6 shadow-lg backdrop-blur-xl">
            <h2 className="mb-5 text-xl font-bold text-gray-800">
              Historique récent
            </h2>

            <div className="space-y-4">
              <article className="rounded-2xl bg-white p-4 shadow-sm">
                <p className="font-medium text-gray-800">Recherche : dinosaures</p>
                <p className="text-sm text-gray-500">Lina · Aujourd’hui à 10:15</p>
              </article>

              <article className="rounded-2xl bg-white p-4 shadow-sm">
                <p className="font-medium text-gray-800">Recherche : animaux marins</p>
                <p className="text-sm text-gray-500">Noah · Aujourd’hui à 09:40</p>
              </article>

              <article className="rounded-2xl bg-red-50 p-4 shadow-sm">
                <p className="font-medium text-red-700">Contenu bloqué</p>
                <p className="text-sm text-gray-500">
                  Site non adapté · Aujourd’hui à 09:10
                </p>
              </article>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}