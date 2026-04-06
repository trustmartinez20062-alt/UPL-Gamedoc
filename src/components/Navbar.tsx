import { useState, useCallback, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { NavLink } from "./NavLink";

const links = [
  { label: "Inicio", href: "/#inicio" },
  { label: "Tienda", href: "/#tienda" },
  { label: "Consolas", href: "/consolas" },
  { label: "Pases", href: "/game-pass" },
  { label: "Juegos", href: "/juegos-digitales" },
  { label: "Nosotros", href: "/#nosotros" },
  { label: "Contacto", href: "/#contacto" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("inicio");
  const navigate = useNavigate();
  const location = useLocation();

  // @ScrollSpy logic — detect which section is in viewport
  useEffect(() => {
    if (location.pathname !== "/") return;

    const sectionIds = ["inicio", "servicios", "tienda", "nosotros", "contacto"];
    
    const observerOptions = {
        root: null,
        rootMargin: '-85px 0px -40% 0px', // Compensate for fixed navbar (approx 64-80px)
        threshold: 0
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [location.pathname]);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      // Only handle hash links that point to sections
      if (!href.includes("#")) return; 

      e.preventDefault();
      const hash = href.split("#")[1]; // e.g. "nosotros"

      if (location.pathname === "/") {
        // Use navigate to update the hash so react-router-dom detects it and re-renders
        navigate(href, { replace: true });
        
        const el = document.getElementById(hash);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      } else {
        navigate(href);
        // Timeout to wait for navigation and then scroll
        setTimeout(() => {
          const el = document.getElementById(hash);
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }, 350);
      }

      setOpen(false);
    },
    [location.pathname, navigate]
  );

  const activeStyles = "text-primary text-glow after:w-full after:opacity-100";
  const baseLinkStyles = "relative text-sm font-medium text-muted-foreground transition-all hover:text-primary py-2 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-primary after:shadow-[0_0_10px_rgba(34,211,238,0.8)] after:transition-all after:duration-300 after:opacity-0";

  const isAnchorActive = (href: string) => {
    if (location.pathname !== "/") return false;
    const hash = href.split("#")[1];
    
    // Prioritize scrollSpy state if on home page
    if (activeSection) return activeSection === hash;
    
    if (hash === "inicio") return location.hash === "" || location.hash === "#inicio";
    return location.hash === `#${hash}`;
  };

  return (
    <nav className="fixed top-0 z-40 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <NavLink
          to="/"
          onClick={(e) => handleClick(e, "/#inicio")}
          className="font-heading text-xl font-bold tracking-wider text-primary text-glow"
          isActive={() => isAnchorActive("/#inicio")}
          activeClassName="text-primary text-glow"
        >
          GAME DOCTOR
        </NavLink>

        {/* Desktop */}
        <ul className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <li key={l.label}>
              {l.href.includes("#") ? (
                <a
                  href={l.href}
                  onClick={(e) => handleClick(e, l.href)}
                  className={cn(baseLinkStyles, isAnchorActive(l.href) && activeStyles)}
                >
                  {l.label}
                </a>
              ) : (
                <NavLink
                  to={l.href}
                  className={baseLinkStyles}
                  activeClassName={activeStyles}
                >
                  {l.label}
                </NavLink>
              )}
            </li>
          ))}
        </ul>

        {/* Mobile toggle */}
        <button onClick={() => setOpen(!open)} className="text-foreground md:hidden" aria-label="Menu">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden border-t border-border bg-background/95 backdrop-blur-xl md:hidden"
          >
            <ul className="container flex flex-col gap-4 py-6">
              {links.map((l) => (
                <li key={l.label}>
                  {l.href.includes("#") ? (
                    <a
                      href={l.href}
                      onClick={(e) => handleClick(e, l.href)}
                      className={cn(
                        "block text-lg font-medium transition-colors",
                        isAnchorActive(l.href) ? "text-primary" : "text-foreground"
                      )}
                    >
                      {l.label}
                    </a>
                  ) : (
                    <NavLink
                      to={l.href}
                      className="block text-lg font-medium text-foreground transition-colors"
                      activeClassName="text-primary text-glow"
                      onClick={() => setOpen(false)}
                    >
                      {l.label}
                    </NavLink>
                  )}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
