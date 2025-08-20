// Components/UIComponents/NavigationBar.jsx
import { NavLink } from 'react-router-dom';
import { Home, Users, Video, Gamepad2, Settings } from 'lucide-react';

export const NavigationBar = () => {
  const myHouseId = 'my-house-0001'; // Pseudo ID

  const tabs = [
    { id: 'house', label: 'My House', icon: Home, to: `/house/${myHouseId}` },
    { id: 'neighbours', label: 'Neighbours', icon: Users, to: '/neighbours' },
    { id: 'media', label: 'Media', icon: Video, to: '/media' },
    { id: 'games', label: 'Games', icon: Gamepad2, to: '/games' },
    { id: 'settings', label: 'Settings', icon: Settings, to: '/settings' },
  ];

  return (
    <div className="flex space-x-2 p-2 bg-gray-800 border border-gray-700 ">
      {tabs.map(({ id, label, icon: Icon, to }) => (
        <NavLink
          key={id}
          to={to}
          className={({ isActive }) =>
            `flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition
            ${isActive ? 'bg-cyan-500/20 text-cyan-400' : 'text-gray-400 hover:bg-gray-700 hover:text-cyan-300'}`
          }
        >
          <Icon className="w-5 h-5" />
          <span>{label}</span>
        </NavLink>
      ))}
    </div>
  );
};
