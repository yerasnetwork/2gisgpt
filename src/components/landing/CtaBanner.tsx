import Link from "next/link";
import { Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function CtaBanner() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="relative overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 via-bg-card to-accent/10 p-10 text-center">
          {/* Glow */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-1/2 left-1/2 -translate-x-1/2 orb orb-blue w-64 h-64 opacity-60" />
          </div>

          <div className="relative z-10 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/30 px-4 py-1.5">
              <Zap size={13} className="text-primary" />
              <span className="text-xs font-semibold text-primary">Бесплатно на старте</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight">
              Готов попробовать?
              <br />
              <span className="gradient-text">Спроси прямо сейчас</span>
            </h2>

            <p className="text-muted text-sm max-w-md mx-auto">
              Без регистрации. Без кредитной карты. Просто напиши, что хочешь найти — и AI сделает остальное.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/search">
                <Button size="lg" className="w-full sm:w-auto">
                  Открыть поиск
                  <ArrowRight size={16} />
                </Button>
              </Link>
              <a
                href="https://2gis.kz"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                  Узнать о 2GIS API
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
