import { useHouseStore } from '../store/houseStore';
import { shallow } from 'zustand/shallow';
import { useUserStore } from '../store/userStore';
import { useChatStore } from '../store/chatStore';
// State selectors
export const useNeighbours = () =>
  useHouseStore((state) => state.neighbours, shallow);

export const useRooms = () =>
  useHouseStore((state) => state.rooms, shallow);

export const useActiveUsers = () =>
  useHouseStore((state) => state.activeUsers, shallow);

export const useUsersInRoom = () =>
  useHouseStore((state) => state.usersInRoom, shallow);

// Action hooks
export const useHouseActions = () => {
  const addRoom = useHouseStore((state) => state.addRoom);
  const removeRoom = useHouseStore((state) => state.removeRoom);
  const updateRoom = useHouseStore((state) => state.updateRoom);
  const addNeighbour = useHouseStore((state) => state.addNeighbour);
  const setUsersInRoom = useHouseStore((state) => state.setUsersInRoom);
  const addUserToRoom = useHouseStore((state) => state.addUserToRoom);
  const removeUserFromRoom = useHouseStore((state) => state.removeUserFromRoom);
  const updateUserStatus = useHouseStore((state) => state.updateUserStatus);
  const setActiveUsers = useHouseStore((state) => state.setActiveUsers);

  return {
    addRoom,
    removeRoom,
    updateRoom,
    addNeighbour,
    setUsersInRoom,
    addUserToRoom,
    removeUserFromRoom,
    updateUserStatus,
    setActiveUsers,
  };
};


export const useUserActions = () => useUserStore((state) => state.actions);

export const useChatActions = () => useChatStore((state) => state.actions);
