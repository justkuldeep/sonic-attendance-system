import { Navbar } from "@/components/Navbar";

interface MainLayoutProps {
  children: React.ReactNode;
  showNavbar?: boolean;
}

export function MainLayout({ children, showNavbar = true }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-hero">
      {showNavbar && <Navbar />}
      {children}
    </div>
  );
}
