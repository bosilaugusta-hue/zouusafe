import Image from "next/image";

type ChildCardProps = {
  firstName: string;
  avatar: string;
};

export default function ChildCard({ firstName, avatar }: ChildCardProps) {
  return (
    <article className="rounded-3xl bg-white/95 p-6 shadow-xl">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-2xl font-black">Mes enfants</h2>

        <button
          type="button"
          className="rounded-full border border-violet-300 px-4 py-2 text-sm font-black text-violet-600"
        >
          + Ajouter
        </button>
      </div>

      <section className="rounded-3xl border border-pink-100 bg-pink-50 p-5">
        <div className="flex items-center gap-5">
          <Image
            src={`/${avatar}`}
            alt={`Avatar 3D de ${firstName}`}
            width={115}
            height={115}
            className="rounded-full object-cover"
          />

          <div>
            <h3 className="text-2xl font-black">{firstName}</h3>
            <p className="text-slate-600">6 ans</p>

            <span className="mt-3 inline-flex rounded-full bg-green-100 px-3 py-1 text-sm font-black text-green-700">
              En ligne
            </span>
          </div>
        </div>

        <p className="mt-5 text-sm font-medium text-slate-600">
          Dernière activité : il y a 5 min
        </p>

        <button
          type="button"
          className="mt-5 w-full rounded-2xl bg-white py-3 font-black shadow-sm"
        >
          Voir le profil →
        </button>
      </section>
    </article>
  );
}