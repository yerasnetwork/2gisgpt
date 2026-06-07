import { Zap, MapPin, Star, Clock, Brain, TrendingUp } from "lucide-react";

const FEATURES = [
  {
    icon: Brain,
    color: "text-primary",
    bg: "bg-primary/10 border-primary/20",
    title: "Понимает человеческий язык",
    desc: "Пиши как другу — «что-нибудь вкусное и недорогое рядом». AI разберёт запрос и найдёт точные совпадения.",
  },
  {
    icon: TrendingUp,
    color: "text-accent",
    bg: "bg-accent/10 border-accent/20",
    title: "Анализирует рейтинги и отзывы",
    desc: "Сортирует по комбинации рейтинга, количества отзывов, цены и дистанции — не просто звёздочки.",
  },
  {
    icon: MapPin,
    color: "text-accent-warm",
    bg: "bg-accent-warm/10 border-accent-warm/20",
    title: "Данные 2GIS в реальном времени",
    desc: "Актуальная база: адреса, часы работы, номера телефонов, фото — напрямую из 2GIS API.",
  },
  {
    icon: Clock,
    color: "text-warning",
    bg: "bg-warning/10 border-warning/20",
    title: "Учитывает «открыто сейчас»",
    desc: "Фильтрует закрытые заведения если попросишь. Или предупреждает, когда откроется.",
  },
  {
    icon: Star,
    color: "text-rating",
    bg: "bg-rating/10 border-rating/20",
    title: "Персональный AI-рейтинг",
    desc: "Каждый результат получает AI-score с объяснением: почему именно это место лучший выбор для тебя.",
  },
  {
    icon: Zap,
    color: "text-success",
    bg: "bg-success/10 border-success/20",
    title: "Ответ за 1–2 секунды",
    desc: "Параллельные запросы к Claude и 2GIS — итоговый результат появляется быстрее, чем успеешь моргнуть.",
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 px-4 relative">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 space-y-3">
          <p className="text-xs font-semibold tracking-widest text-primary uppercase">Возможности</p>
          <h2 className="text-3xl sm:text-4xl font-bold">
            Не просто поиск —{" "}
            <span className="gradient-text">умный помощник</span>
          </h2>
          <p className="text-muted max-w-lg mx-auto text-sm sm:text-base">
            LocalAI объединяет Claude AI и данные 2GIS, чтобы давать рекомендации, а не просто список.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map(({ icon: Icon, color, bg, title, desc }) => (
            <div
              key={title}
              className="group p-6 rounded-xl glass border border-border card-hover"
            >
              <div className={`size-10 rounded-lg border ${bg} flex items-center justify-center mb-4 transition-transform duration-200 group-hover:scale-110`}>
                <Icon size={18} className={color} />
              </div>
              <h3 className="font-semibold text-sm mb-2">{title}</h3>
              <p className="text-xs text-muted leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
