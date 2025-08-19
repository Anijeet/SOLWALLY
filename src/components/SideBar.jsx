import { Home, Coins } from 'lucide-react';
import { Link } from 'react-router-dom';

const menuItems = [
  {
    name: 'Dashboard',
    href: '/',
    icon: <Home size={18} />,
  },
  {
    name: 'Token',
    href: '/token',
    icon: <Coins size={18} />,
  },
];

export function Sidebar({ currentPath }) {
  return (
    <div className="w-64 h-full bg-slate-800 border-r border-gray-700">
      <div className="h-full">
        <div className="p-6">
          <h2 className="text-xl font-bold text-white">SolWally</h2>
        </div>
        
        <div className="space-y-1">
          {menuItems.map((item, index) => {
            const isActive = currentPath === item.href;
            
            return (
              <Link
                key={item.name + '-' + index}
                to={item.href}
                className={`group relative flex items-center w-full px-6 py-3 font-medium transition-colors duration-200 hover:bg-slate-700 ${
                  isActive ? 'bg-slate-700 text-white' : 'text-gray-300 hover:text-white'
                }`}
              >
                <span
                  className={`me-3 inline-flex size-5 items-center justify-center [&>svg]:size-[18px] ${
                    isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'
                  }`}
                >
                  {item.icon}
                </span>
                <span className="text-sm">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}