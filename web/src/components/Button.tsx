import type { ReactNode } from "react";
import { Link } from "react-router-dom";

type ButtonTone = "gold" | "ghost" | "dark";

type ButtonProps = {
  children: ReactNode;
  href?: string;
  to?: string;
  tone?: ButtonTone;
  className?: string;
  download?: boolean;
  onClick?: () => void;
};

const toneClasses: Record<ButtonTone, string> = {
  gold:
    "border-casino-gold bg-casino-gold text-casino-black shadow-glow hover:bg-casino-amber",
  ghost:
    "border-white/15 bg-white/[0.04] text-casino-ivory hover:border-casino-gold/50 hover:bg-casino-gold/10",
  dark:
    "border-casino-gold/30 bg-casino-black/60 text-casino-ivory hover:border-casino-gold/60 hover:bg-casino-gold/10",
};

const baseClasses =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-full border px-5 text-sm font-black tracking-wide transition duration-200 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-casino-gold/40";

export function Button({
  children,
  href,
  to,
  tone = "gold",
  className = "",
  download,
  onClick,
}: ButtonProps) {
  const classes = `${baseClasses} ${toneClasses[tone]} ${className}`;

  if (to) {
    return (
      <Link className={classes} to={to} onClick={onClick}>
        {children}
      </Link>
    );
  }

  return (
    <a className={classes} href={href} download={download} onClick={onClick}>
      {children}
    </a>
  );
}
