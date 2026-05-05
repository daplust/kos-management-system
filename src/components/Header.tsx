import { Menu, LogOut } from 'lucide-react';

interface HeaderProps {
  onMenuClick: () => void;
 onLogout: () => void;
}

export default function Header({ onMenuClick, onLogout }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-border px-4 lg:px-8 py-4 flex items-center justify-between lg:hidden">
      <button
        onClick={onMenuClick}
        className="p-2 hover:bg-muted rounded-lg transition-colors"
        aria-label="Toggle menu"
      >
        <Menu className="w-6 h-6" />
      </button>

      <div className="flex items-center gap-2">
        <h1 className="text-lg font-semibold text-primary">Wisma Videra</h1>
      </div>

      <button
        onClick={onLogout}
        className="p-2 hover:bg-muted rounded-lg transition-colors"
        aria-label="Logout"
      >
        <LogOut className="w-5 h-5 text-muted-foreground" />
      </button>
    </header>
  );
}