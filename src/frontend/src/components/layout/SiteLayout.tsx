import { Link, useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { BookOpen, GraduationCap, Menu, X } from 'lucide-react';
import { useState } from 'react';
import LoginButton from '../auth/LoginButton';
import ProfileSetupDialog from '../auth/ProfileSetupDialog';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../../hooks/useUserProfile';

interface SiteLayoutProps {
  children: React.ReactNode;
}

export default function SiteLayout({ children }: SiteLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const navigate = useNavigate();
  const isAuthenticated = !!identity;

  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/knowledge-base', label: 'Knowledge Base', icon: BookOpen },
    { to: '/courses', label: 'Courses', icon: GraduationCap },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center space-x-3">
              <img
                src="/assets/generated/aaa-lawyers-logo.dim_512x256.png"
                alt="AAA Lawyers"
                className="h-10 w-auto"
              />
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                  activeProps={{ className: 'text-foreground' }}
                >
                  {link.icon && <link.icon className="h-4 w-4" />}
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {isAuthenticated && userProfile && (
              <span className="hidden sm:inline text-sm text-muted-foreground">
                Welcome, {userProfile.name}
              </span>
            )}
            <LoginButton />
            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border/40 bg-background">
            <nav className="container py-4 flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 py-2"
                  activeProps={{ className: 'text-foreground' }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.icon && <link.icon className="h-4 w-4" />}
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-border/40 bg-muted/30 mt-auto">
        <div className="container py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <img
                src="/assets/generated/aaa-lawyers-logo.dim_512x256.png"
                alt="AAA Lawyers"
                className="h-10 w-auto mb-4"
              />
              <p className="text-sm text-muted-foreground">
                Professional training and knowledge resources for accident management systems in NSW, Australia.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/knowledge-base" className="text-sm text-muted-foreground hover:text-foreground">
                    Knowledge Base
                  </Link>
                </li>
                <li>
                  <Link to="/courses" className="text-sm text-muted-foreground hover:text-foreground">
                    Training Courses
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <p className="text-xs text-muted-foreground">
                This training portal provides educational content for professional development purposes. Content is
                specific to NSW, Australia regulations and practices.
              </p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border/40 text-center text-sm text-muted-foreground">
            <p>
              © {new Date().getFullYear()} AAA Lawyers. Built with love using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                  window.location.hostname
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>

      {showProfileSetup && <ProfileSetupDialog />}
    </div>
  );
}
