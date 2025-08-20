import { User } from "lucide-react";
export const UserAvatar = ({ 
  name, 
  avatar, 
  size = 'md', 
  status = 'online',
  className = '' 
}) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10', 
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };
  
  const statusColors = {
    online: 'bg-emerald-400 shadow-emerald-400/50',
    away: 'bg-yellow-400 shadow-yellow-400/50',
    busy: 'bg-red-400 shadow-red-400/50',
    offline: 'bg-gray-600'
  };
  
  return (
    <div className={`relative ${className}`}>
      <div className={`${sizes[size]} rounded-full bg-gray-800 border-2 border-gray-700 flex items-center justify-center overflow-hidden`}>
        {avatar ? (
          <img src={avatar} alt={name} className="w-full h-full object-cover" />
        ) : (
          <User className="w-1/2 h-1/2 text-gray-500" />
        )}
      </div>
      <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 ${statusColors[status]} rounded-full border-2 border-gray-900 ${status !== 'offline' ? 'shadow-sm' : ''}`}></div>
    </div>
  );
};