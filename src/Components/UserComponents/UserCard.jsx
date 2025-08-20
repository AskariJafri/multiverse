import { Card } from '../../UI/Card';
import { MessageCircle, UserPlus, MoreHorizontal } from 'lucide-react';

export const UserCard = ({ user, onClick, className = "" }) => {
  // Status color mapping
  const getStatusColor = (status) => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'busy':
        return 'bg-yellow-500';
      case 'away':
        return 'bg-orange-500';
      case 'offline':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const handleClick = (e) => {
    if (onClick) {
      e.preventDefault();
      onClick(user);
    }
  };

  const handleActionClick = (e, action) => {
    e.stopPropagation(); // Prevent card click
    console.log(`${action} clicked for user:`, user.name);
    // Add your action handlers here
  };

  return (
    <Card 
      className={`p-4 border border-gray-700 bg-gray-800/50 backdrop-blur-sm hover:border-cyan-500/50 transition-all duration-300 ${className}`}
      onClick={handleClick}
    >
      {/* User Avatar and Status */}
      <div className="flex items-center gap-3 mb-3">
        <div className="relative">
          {user.avatar ? (
            <img 
              src={user.avatar} 
              alt={user.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-gray-600"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center text-white font-semibold text-lg border-2 border-gray-600">
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}
          
          {/* Status Indicator */}
          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-gray-800 ${getStatusColor(user.status)}`}></div>
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-semibold truncate">{user.name}</h3>
          <p className="text-gray-400 text-sm truncate">
            {getStatusText(user.status)}
          </p>
        </div>
      </div>

      {/* User Activity */}
      <div className="mb-3">
        <p className="text-gray-300 text-sm truncate" title={user.activity}>
          {user.activity || 'No activity'}
        </p>
      </div>

      {/* Last Active / Online Time */}
      {user.lastActive && (
        <div className="mb-3">
          <p className="text-gray-500 text-xs">
            Last active: {new Date(user.lastActive).toLocaleTimeString()}
          </p>
        </div>
      )}

      {/* Typing Indicator */}
      {user.status === 'online' && user.activity === 'Typing...' && (
        <div className="mb-3">
          <div className="flex items-center gap-2 text-cyan-400">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
            <span className="text-xs">typing...</span>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={(e) => handleActionClick(e, 'message')}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-cyan-600/20 text-cyan-400 rounded-lg hover:bg-cyan-600/30 transition-colors text-sm"
          title="Send Message"
        >
          <MessageCircle className="w-4 h-4" />
          <span className="hidden sm:inline">Message</span>
        </button>
        
        <button
          onClick={(e) => handleActionClick(e, 'friend')}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-600/20 text-gray-400 rounded-lg hover:bg-gray-600/30 transition-colors text-sm"
          title="Add Friend"
        >
          <UserPlus className="w-4 h-4" />
          <span className="hidden sm:inline">Add</span>
        </button>
        
        <button
          onClick={(e) => handleActionClick(e, 'more')}
          className="px-3 py-2 bg-gray-600/20 text-gray-400 rounded-lg hover:bg-gray-600/30 transition-colors"
          title="More Options"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>
    </Card>
  );
};