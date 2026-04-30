import type { ReactNode } from "react";
import { Menu, ShoppingBag, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { assetPaths, routes } from "../data/site";
import { Button } from "../components/Button";

type SiteLayoutProps = {
  children: ReactNode;
};

type NavItem =
  | { label: string; href: string; to?: never }
  | { label: string; to: string; href?: never };

const navItems: NavItem[] = [
  { label: "Highlights", href: "/#highlights" },
  { label: "Demo", href: "/#demo" },
  { label: "Engineering", href: "/#engineering" },
  { label: "Recursos", to: routes.resources },
  { label: "Contacto", to: routes.contact },
];

export function SiteLayout({ children }: SiteLayoutProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 18);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <a className="skip-link" href="#main-content">
        Saltar al contenido
      </a>

      <header
        className={`fixed inset-x-0 top-0 z-50 transition duration-300 ${
          isScrolled
            ? "border-b border-white/10 bg-casino-black/84 shadow-2xl backdrop-blur-xl"
            : "bg-casino-black/35 backdrop-blur-md"
        }`}
      >
        <div className="mx-auto flex h-20 w-[min(1180px,calc(100%-28px))] items-center gap-5">
          <Link className="flex min-w-0 items-center gap-3" to={routes.home} aria-label="ELCO-DEALER inicio">
            <img
              className="h-11 w-11 rounded-xl object-contain"
              src={assetPaths.logo}
              alt=""
              aria-hidden="true"
            />
            <span className="min-w-0">
              <strong className="block truncate font-display text-lg text-casino-amber">
                ELCO-DEALER
              </strong>
              <small className="block truncate text-[10px] font-bold uppercase tracking-[0.18em] text-casino-muted">
                Casino-tech prototype
              </small>
            </span>
          </Link>

          <nav className="ml-auto hidden items-center gap-1 lg:flex" aria-label="Navegación principal">
            {navItems.map((item) =>
              item.to ? (
                <NavLink
                  key={item.label}
                  className={({ isActive }) =>
                    `rounded-full px-4 py-2 text-sm font-bold transition ${
                      isActive
                        ? "bg-casino-gold/12 text-casino-amber"
                        : "text-casino-muted hover:bg-white/[0.04] hover:text-casino-ivory"
                    }`
                  }
                  to={item.to}
                >
                  {item.label}
                </NavLink>
              ) : (
                <a
                  key={item.label}
                  className="rounded-full px-4 py-2 text-sm font-bold text-casino-muted transition hover:bg-white/[0.04] hover:text-casino-ivory"
                  href={item.href}
                >
                  {item.label}
                </a>
              ),
            )}
          </nav>

          <Button to={routes.purchase} className="ml-auto hidden lg:inline-flex">
            <ShoppingBag size={17} aria-hidden="true" />
            Comprar / Reservar
          </Button>

          <button
            className="ml-auto grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-casino-ivory lg:hidden"
            type="button"
            aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
            onClick={() => setIsOpen((value) => !value)}
          >
            {isOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>

        {isOpen ? (
          <div className="border-t border-white/10 bg-casino-black/95 px-4 py-5 backdrop-blur-xl lg:hidden">
            <nav className="mx-auto grid w-[min(1180px,100%)] gap-2" aria-label="Navegación móvil">
              {navItems.map((item) =>
                item.to ? (
                  <NavLink
                    key={item.label}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 font-bold text-casino-ivory"
                    to={item.to}
                  >
                    {item.label}
                  </NavLink>
                ) : (
                  <a
                    key={item.label}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 font-bold text-casino-ivory"
                    href={item.href}
                  >
                    {item.label}
                  </a>
                ),
              )}
              <Button to={routes.purchase} className="mt-2 w-full">
                <ShoppingBag size={17} aria-hidden="true" />
                Comprar / Reservar
              </Button>
            </nav>
          </div>
        ) : null}
      </header>

      <div id="main-content" className="pt-20">
        {children}
      </div>

      <footer className="mx-auto flex w-[min(1180px,calc(100%-28px))] flex-col gap-6 border-t border-white/10 py-10 text-sm text-casino-muted md:flex-row md:items-center md:justify-between">
        <Link className="flex items-center gap-3" to={routes.home}>
          <img className="h-9 w-9 rounded-lg object-contain" src={assetPaths.logo} alt="" />
          <span>
            <strong className="block font-display text-casino-amber">ELCO-DEALER</strong>
            <span>Reparto automático de cartas</span>
          </span>
        </Link>
        <div className="flex flex-wrap gap-4">
          <Link className="hover:text-casino-amber" to={routes.resources}>
            Recursos
          </Link>
          <Link className="hover:text-casino-amber" to={routes.contact}>
            Contacto
          </Link>
          <Link className="hover:text-casino-amber" to={routes.purchase}>
            Compra / reserva
          </Link>
        </div>
      </footer>
    </>
  );
}
