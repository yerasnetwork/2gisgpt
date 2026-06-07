import { HeroSearch } from "./HeroSearch";

export function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4 pt-14">
      {/* Ambient background */}
      <div className="absolute inset-0 bg-grid opacity-40 pointer-events-none" />
      <div className="absolute top-1/4 left-1/4  orb orb-blue  w-96 h-96 -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute top-1/3 right-1/4 orb orb-green w-80 h-80  translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-1/4 left-1/2 orb orb-warm  w-72 h-72 -translate-x-1/2" />
      <div className="absolute inset-0 bg-gradient-to-b from-bg/0 via-bg/30 to-bg pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-8 text-center max-w-4xl mx-auto">
        {/* Badge */}
        <div className="fade-up flex items-center gap-2 rounded-full glass border border-primary/30 px-4 py-1.5">
          <span className="relative flex size-2">
            <span className="pulse-ring absolute size-2 rounded-full bg-accent" />
            <span className="size-2 rounded-full bg-accent" />
          </span>
          <span className="text-xs text-muted">Powered by Claude AI + 2GIS API</span>
        </div>

        {/* Headline */}
        <h1 className="fade-up delay-100 text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1] text-balance">
          Найди лучшее место{" "}
          <br className="hidden sm:block" />
          <span className="gradient-text">одним запросом</span>
        </h1>

        {/* Sub */}
        <p className="fade-up delay-200 text-base sm:text-lg text-muted max-w-xl text-balance leading-relaxed">
          AI анализирует рейтинги, отзывы, цены и расстояния в{" "}
          <span className="text-white font-medium">Атырау, Астане и Алматы</span>{" "}
          — и выдаёт персональный топ за секунды.
        </p>

        {/* Search */}
        <div className="fade-up delay-300 w-full">
          <HeroSearch />
        </div>

        {/* Stats */}
        <div className="fade-up delay-400 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-center">
          {[
            { value: "50 000+", label: "заведений в базе" },
            { value: "3",       label: "города Казахстана" },
            { value: "<2 сек",  label: "время ответа AI" },
          ].map(({ value, label }) => (
            <div key={label} className="flex flex-col items-center">
              <span className="text-2xl font-bold gradient-text">{value}</span>
              <span className="text-xs text-muted mt-0.5">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-dim fade-up delay-500">
        <span className="text-xs">прокрути вниз</span>
        <div className="w-px h-8 bg-gradient-to-b from-dim/50 to-transparent" />
      </div>
    </section>
  );
}
