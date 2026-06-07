import { Zap } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border py-10 px-4">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="size-6 rounded-md bg-primary/20 border border-primary/40 flex items-center justify-center">
            <Zap size={12} className="text-primary" />
          </div>
          <span className="font-bold text-sm">
            Local<span className="gradient-text">AI</span>
          </span>
        </div>

        <p className="text-xs text-dim text-center">
          AI-поиск заведений в Казахстане · Данные{" "}
          <span className="text-muted">2GIS API</span> · AI{" "}
          <span className="text-muted">Claude by Anthropic</span>
        </p>

        <div className="flex gap-4 text-xs text-muted">
          <a href="#" className="hover:text-white transition-colors">Помощь</a>
          <a href="#" className="hover:text-white transition-colors">О проекте</a>
        </div>
      </div>
    </footer>
  );
}
