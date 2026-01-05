import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, X, Waves } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isAuthPage = location.pathname.includes("/login") || location.pathname.includes("/signup");

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="mx-4 mt-4">
        <div className="glass-card px-6 py-3 flex items-center justify-between max-w-7xl mx-auto">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center group-hover:shadow-glow transition-shadow duration-300">
              <Waves className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg text-foreground">SonicAttend</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />
            {!isAuthPage && (
              <>
                <Button variant="ghost" asChild>
                  <Link to="/login?role=student">Student Login</Link>
                </Button>
                <Button variant="gradient" asChild>
                  <Link to="/login?role=faculty">Faculty Login</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card mt-2 p-4 md:hidden max-w-7xl mx-auto"
          >
            <div className="flex flex-col gap-2">
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link to="/login?role=student" onClick={() => setIsOpen(false)}>
                  Student Login
                </Link>
              </Button>
              <Button variant="gradient" className="w-full" asChild>
                <Link to="/login?role=faculty" onClick={() => setIsOpen(false)}>
                  Faculty Login
                </Link>
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}
