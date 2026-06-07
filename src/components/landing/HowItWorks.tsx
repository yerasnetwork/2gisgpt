import { MessageSquare, Cpu, MapPin, CheckCircle } from "lucide-react";

const STEPS = [
  {
    step: "01",
    icon: MessageSquare,
    color: "text-primary",
    ring: "border-primary/30 bg-primary/10",
    title: "Пишешь запрос",
    desc: "На русском или казахском, как обычно пишешь другу. Без специального синтаксиса.",
    example: '"лучший донер рядом со мной до 1500 тенге"',
  },
  {
    step: "02",
    icon: Cpu,
    color: "text-accent",
    ring: "border-accent/30 bg-accent/10",
    title: "AI парсит намерение",
    desc: "Claude извлекает категорию, ценовой диапазон, требование к рейтингу, радиус и статус работы.",
    example: "категория: донер · цена: ≤₸₸ · sort: рейтинг + дистанция",
  },
  {
    step: "03",
    icon: MapPin,
    color: "text-accent-warm",
    ring: "border-accent-warm/30 bg-accent-warm/10",
    title: "2GIS отдаёт данные",
    desc: "Параллельный запрос к 2GIS API: реальные заведения с рейтингом, адресом, часами и фото.",
    example: "32 результата → фильтрация → топ 10",
  },
  {
    step: "04",
    icon: CheckCircle,
    color: "text-success",
    ring: "border-success/30 bg-success/10",
    title: "Получаешь топ",
    desc: "AI ранжирует по комплексному скору и объясняет каждый результат. Выбираешь лучшее.",
    example: "Дастархан — рейтинг 4.8, 380 м, открыт до 23:00",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-4 bg-bg-2 relative overflow-hidden">
      {/* Decorative line */}
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />

      <div className="relative max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 space-y-3">
          <p className="text-xs font-semibold tracking-widest text-accent uppercase">Как работает</p>
          <h2 className="text-3xl sm:text-4xl font-bold">
            От вопроса до ответа за{" "}
            <span className="gradient-text">4 шага</span>
          </h2>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {/* connector line (desktop) */}
          <div className="hidden lg:block absolute top-[52px] left-[calc(12.5%+24px)] right-[calc(12.5%+24px)] h-px bg-gradient-to-r from-primary/30 via-accent/30 to-success/30" />

          {STEPS.map(({ step, icon: Icon, color, ring, title, desc, example }) => (
            <div key={step} className="flex flex-col gap-4">
              {/* Icon circle */}
              <div className="flex items-center gap-4 lg:flex-col lg:items-start">
                <div className={`relative size-12 shrink-0 rounded-xl border ${ring} flex items-center justify-center`}>
                  <Icon size={20} className={color} />
                  <span className="absolute -top-2 -right-2 text-[10px] font-bold text-dim bg-bg border border-border rounded-full px-1.5 py-0.5 leading-none">
                    {step}
                  </span>
                </div>
                <h3 className="font-semibold text-sm lg:mt-3">{title}</h3>
              </div>

              <p className="text-xs text-muted leading-relaxed">{desc}</p>

              {/* Example pill */}
              <div className="rounded-lg bg-card/60 border border-border px-3 py-2">
                <p className="text-[11px] font-mono text-dim">{example}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
