import { Card } from '../../UI/Card';
import { Button } from '../../UI/Button';
import { Users, Lock, Globe, Activity, Image as ImageIcon } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useHouseStore } from '../../store/houseStore';
export const RoomCard = ({ room, users = [], className = "" }) => {
  const { houseId } = useParams();
  const navigate = useNavigate();

  const userCount = room.users?.length || room.people || 0;
  const maxOccupants = room.maxOccupants || 10;
  const occupancyPercentage = (userCount / maxOccupants) * 100;
  const {setCurrentHouse, setCurrentRoom} = useHouseStore();

  const getStatusColor = (status) => {
    switch (status) {
      case 'open':
        return 'text-green-400 bg-green-400/10 border border-green-400/30';
      case 'busy':
        return 'text-yellow-400 bg-yellow-400/10 border border-yellow-400/30';
      case 'locked':
        return 'text-red-400 bg-red-400/10 border border-red-400/30';
      default:
        return 'text-gray-400 bg-gray-400/10 border border-gray-400/30';
    }
  };

  

  const handleJoin = () => {
    // this is a default houseid as we do not have multiple houses yet
    // later we will get this from the current house context or props
    const houseId = "house1"
    console.log("Join button clicked for room:", room);
    const roomId = room.id;
    const path = `/house/${houseId}/room/${roomId}`;
    // console.log("Navigating to:", path);
    setCurrentHouse(houseId);
    setCurrentRoom(roomId);
    navigate(path);
  };

  return (
    <Card
      className={`group relative overflow-hidden p-5 border border-gray-700 bg-gray-800/40 backdrop-blur-md 
        hover:border-cyan-400/50 hover:shadow-lg hover:shadow-cyan-500/10 
        transition-all duration-300 rounded-xl ${className}`}
      
    >
      {/* Glow overlay */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-cyan-500 transition duration-500 blur-2xl pointer-events-none"></div>

      {/* Thumbnail */}
      <div className="relative mb-4 rounded-lg overflow-hidden shadow-md shadow-black/30">
        {room.thumbnail ? (
          <img
            src={room.thumbnail}
            alt={`${room.name} preview`}
            className="w-full h-28 object-cover transform group-hover:scale-105 transition duration-500"
          />
        ) : (
          <div className="w-full h-28 flex flex-col items-center justify-center bg-gray-700/50 text-gray-400">
            <ImageIcon className="w-6 h-6 mb-1 text-cyan-400" />
            <span className="text-xs">No image available</span>
          </div>
        )}

        {/* Privacy Icon */}
        {room.isPrivate ? (
          <div className="absolute top-2 right-2 bg-red-500/80 p-1 rounded-full">
            <Lock className="w-4 h-4 text-white" />
          </div>
        ) : (
          <div className="absolute top-2 right-2 bg-green-500/80 p-1 rounded-full">
            <Globe className="w-4 h-4 text-white" />
          </div>
        )}
      </div>

      {/* Title & Description */}
      <div className="mb-3">
        <h3 className="text-lg font-semibold text-white truncate">{room.name}</h3>
        {room.description && (
          <p className="text-gray-400 text-sm line-clamp-2 mt-1">{room.description}</p>
        )}
      </div>

      {/* Status & Activity */}
      <div className="flex items-center justify-between mb-4">
        <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(room.status)}`}>
          {room.status}
        </span>
        {room.activity && (
          <div className="flex items-center gap-1 text-gray-400 text-xs">
            <Activity className="w-3 h-3" />
            {room.activity}
          </div>
        )}
      </div>

      {/* Users & Occupancy */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-cyan-400" />
            <span className="text-white font-medium">{userCount}/{maxOccupants}</span>
          </div>
          <span className="text-xs text-gray-400">
            {occupancyPercentage}% full
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
          <div
            className={`h-2 transition-all duration-300 ${
              occupancyPercentage > 80
                ? 'bg-red-500'
                : occupancyPercentage > 50
                ? 'bg-yellow-500'
                : 'bg-green-500'
            }`}
            style={{ width: `${Math.min(occupancyPercentage, 100)}%` }}
          />
        </div>
      </div>

      {/* User Avatars */}
      {room.users && room.users.length > 0 && (
        <div className="flex items-center gap-2 mb-4">
          <div className="flex -space-x-2">
            {room.users.slice(0, 3).map((user) => (
              <div
                key={user.id}
                className="w-7 h-7 rounded-full border-2 border-gray-800 bg-cyan-600 overflow-hidden"
                title={user.name}
              >
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="flex items-center justify-center w-full h-full text-white text-xs font-medium">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
            ))}
            {room.users.length > 3 && (
              <div className="w-7 h-7 rounded-full bg-gray-600 border-2 border-gray-800 flex items-center justify-center text-xs font-medium text-white">
                +{room.users.length - 3}
              </div>
            )}
          </div>
          <span className="text-gray-400 text-sm">
            {room.users.length === 1 ? '1 user' : `${room.users.length} users`}
          </span>
        </div>
      )}

      {/* Join Button */}
      <Button
        variant="outline"
        size="sm"
        className="w-full border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/20 hover:border-cyan-400 transition"
        onClick={handleJoin}
        disabled={room.status === 'locked' || userCount >= maxOccupants}
      >
        {room.status === 'locked'
          ? 'Locked'
          : userCount >= maxOccupants
          ? 'Full'
          : 'Join Room'}
      </Button>
    </Card>
  );
};
