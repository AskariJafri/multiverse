import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Added useNavigate
import { Button } from '../UI/Button';
import { Card } from '../UI/Card';
import { RoomCard } from '../Components/RoomComponents/RoomCard'
import { UserCard } from '../Components/UserComponents/UserCard';
import CreateRoomModal from '../models/roomModals/CreateRoomModal';
import ToastManager from '../UI/ToastManager';
import { useAppStore } from '../store/appStore';
import { useHouseStore } from '../store/houseStore';

export default function HomeScreen() {
  const navigate = useNavigate();
  const { houseId } = useParams();

  const setCurrentHouse = useHouseStore((state) => state.setCurrentHouse);
  const setCurrentRoom = useHouseStore((state) => state.setCurrentRoom);
  const currentHouse = useHouseStore((state) => state.getCurrentHouse());
  const activeUsers = useHouseStore((state) => state.activeUsers);
  const openModal = useAppStore((state) => state.actions.openModal);

  useEffect(() => {
    if (houseId) {
      setCurrentHouse(houseId);
    }
  }, [houseId, setCurrentHouse]);

  if (!currentHouse) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400 bg-gray-900">
        <p>House not found.</p>
      </div>
    );
  }


  const rooms = currentHouse.rooms || [];

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 text-white">
        <div className="px-4 md:px-12 lg:px-24 py-6 space-y-6">
          
          {/* House Overview Section */}
          <Card className="p-6 border border-gray-700 bg-gray-800">
            <h1 className="text-3xl font-bold text-cyan-400 mb-2">{currentHouse.name}</h1>
            <p className="text-gray-400">
              Invite friends, join rooms, or broadcast your space. Customize your rooms and enjoy real-time interactions.
            </p>
          </Card>

          {/* Rooms Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-cyan-300">Available Rooms</h2>
              <Button variant="default" size="sm" onClick={() => openModal('createRoom')}>
                + Create Room
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {rooms.map((room) => (
                <RoomCard 
                  key={room.id} 
                  room={room} 
                  users={room.users || []}
                />
              ))}
            </div>
          </div>

          {/* Active Users Section */}
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-cyan-300">Active Users</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {activeUsers.map((user) => (
                <UserCard key={user.id} user={user} />
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Modals and UI layers */}
      <CreateRoomModal />
      <ToastManager />
    </>
  );
}
