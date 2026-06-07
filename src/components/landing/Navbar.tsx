"use client";
import Link from "next/link";
import { Zap } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function Navbar() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-border/40 glass">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="size-7 rounded-md bg-primary/20 border border-primary/40 flex items-center justify-center">
            <Zap size={14} className="text-primary" />
          </div>
          <span className="font-bold text-sm tracking-tight">
            Local<span className="gradient-text">AI</span>
          </span>
        </Link>

        {/* Nav links */}
        <div className="hidden sm:flex items-center gap-6">
          <a href="#how-it-works" className="text-sm text-muted hover:text-white transition-colors">
            Как работает
          </a>
          <a href="#features" className="text-sm text-muted hover:text-white transition-colors">
            Возможности
          </a>
          <a href="#examples" className="text-sm text-muted hover:text-white transition-colors">
            Примеры
          </a>
        </div>

        {/* CTA */}
        <Link href="/search">
          <Button size="sm" className="text-xs">
            <Zap size={12} />
            Попробовать
          </Button>
        </Link>
      </nav>
    </header>
  );
}
