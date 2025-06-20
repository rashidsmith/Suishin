import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Home, 
  BookOpen, 
  CreditCard, 
  PlayCircle, 
  Download,
  Users,
  Menu,
  X,
  Settings,
  ChevronDown,
  TestTube,
  Database,
  Code2,
  BarChart3
} from "lucide-react";
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Personas', href: '/personas', icon: Users },
    { name: 'IBO Builder', href: '/ibos', icon: BookOpen },
    { name: 'Card Composer', href: '/cards', icon: CreditCard },
    { name: 'Session Builder', href: '/session-builder', icon: PlayCircle },
    { name: 'Export', href: '/export', icon: Download },
  ];

  const systemPages = [
    { name: 'Dashboard', href: '/dashboard', icon: BarChart3, description: 'Analytics and overview' },
    { name: 'Sessions', href: '/sessions', icon: PlayCircle, description: 'Session management' },
  ];

  const testingPages = [
    { name: 'Supabase Test', href: '/supabase-test', icon: Database, description: 'Database connection test' },
    { name: 'Types Test', href: '/types-test', icon: Code2, description: 'TypeScript interfaces test' },
    { name: 'IBO Test', href: '/ibo-test', icon: TestTube, description: 'IBO API testing' },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo and Desktop Navigation */}
            <div className="flex">
              {/* Logo */}
              <div className="flex-shrink-0 flex items-center">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">
                  Suishin
                </h1>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden sm:ml-8 sm:flex sm:space-x-1">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive(item.href)
                          ? 'bg-blue-100 text-blue-700 border-b-2 border-blue-500'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Additional Navigation Dropdown */}
            <div className="hidden sm:flex sm:items-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                    <Settings className="w-4 h-4" />
                    System
                    <ChevronDown className="w-3 h-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>System Pages</DropdownMenuLabel>
                  {systemPages.map((page) => {
                    const Icon = page.icon;
                    return (
                      <DropdownMenuItem key={page.name} asChild>
                        <Link to={page.href} className="flex items-center gap-2 w-full">
                          <Icon className="w-4 h-4" />
                          <div className="flex flex-col">
                            <span className="font-medium">{page.name}</span>
                            <span className="text-xs text-muted-foreground">{page.description}</span>
                          </div>
                        </Link>
                      </DropdownMenuItem>
                    );
                  })}
                  
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Testing & Debug</DropdownMenuLabel>
                  {testingPages.map((page) => {
                    const Icon = page.icon;
                    return (
                      <DropdownMenuItem key={page.name} asChild>
                        <Link to={page.href} className="flex items-center gap-2 w-full">
                          <Icon className="w-4 h-4" />
                          <div className="flex flex-col">
                            <span className="font-medium">{page.name}</span>
                            <span className="text-xs text-muted-foreground">{page.description}</span>
                          </div>
                        </Link>
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Mobile menu button */}
            <div className="sm:hidden flex items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="sm:hidden">
            <div className="pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`block px-4 py-2 text-base font-medium transition-colors ${
                      isActive(item.href)
                        ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-500'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="flex items-center">
                      <Icon className="w-5 h-5 mr-3" />
                      {item.name}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            Suishin - Build engaging learning experiences
          </p>
        </div>
      </footer>
    </div>
  );
}