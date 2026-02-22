import { Link, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const location = useLocation();

  const navItems = [
    { to: '/', label: 'All Recipes' },
    { to: '/add-recipes', label: 'Create New Recipe' },
    { to: '/search', label: 'Search Recipe' },
  ];

  return (
    <aside className="w-56 min-h-screen bg-slate-800 text-white p-4 flex flex-col gap-2">
      <h2 className="text-lg font-semibold mb-4 text-slate-200">Recipe Manager</h2>
      <nav className="flex flex-col gap-1">
        {navItems.map(({ to, label }) => (
          <Link
            key={to}
            to={to}
            className={`w-full text-left px-4 py-3 rounded-lg transition-colors font-medium ${
              location.pathname === to ? 'bg-slate-600' : 'hover:bg-slate-700'
            }`}
          >
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
