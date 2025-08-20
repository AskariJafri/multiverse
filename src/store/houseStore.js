import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { nanoid } from 'nanoid';
import { act } from 'react';

export const useHouseStore = create(
  devtools(
    persist(
      (set, get) => ({
        // --- State ---
        houses: [
          {
            id: 'house1',
            name: "My House",
            owners: ['user1'], // Current user's house
            thumbnail: null,
            rooms: [
              { 
                id: 1, 
                name: 'Living Room', 
                description: 'Chill and talk here', 
                maxOccupants: 10, 
                status: 'open', 
                activity: 'Chatting', 
                isPrivate: false, 
                thumbnail: null,
                users: [
                  { id: 1, name: 'Alice', avatar: null },
                  { id: 3, name: 'Charlie', avatar: null }
                ]
              },
              { 
                id: 2, 
                name: 'Gaming Room', 
                description: 'Play and stream games', 
                maxOccupants: 10, 
                status: 'open', 
                activity: 'Gaming', 
                isPrivate: false, 
                thumbnail: null,
                users: [
                  { id: 2, name: 'Bob', avatar: 'https://example.com/bob.jpg' }
                ]
              },
              { 
                id: 3, 
                name: 'Study Room', 
                description: 'Focus & learn together', 
                maxOccupants: 10, 
                status: 'locked', 
                activity: 'Studying', 
                isPrivate: true, 
                thumbnail: null,
                users: []
              },
            ]
          },
          {
            id: 'abc123',
            name: "Alice's House",
            owners: ['alice_user_id'],
            thumbnail: null,
            rooms: [
              { 
                id: 'alice_room1', 
                name: 'Main Hall', 
                description: 'Welcome area', 
                maxOccupants: 20, 
                status: 'open', 
                activity: 'Socializing', 
                isPrivate: false, 
                thumbnail: null,
                users: [
                  { id: 'alice_user_id', name: 'Alice', avatar: null,activity:"In Main Hall" },
                  { id: 4, name: 'David', avatar: null, activity:"In Living Room" }
                ]
              }
            ]
          },
          {
            id: 'def456',
            name: "Bob's Place",
            owners: ['bob_user_id'],
            thumbnail: null,
            rooms: [
              { 
                id: 'bob_room1', 
                name: 'Workshop', 
                description: 'Creative space', 
                maxOccupants: 8, 
                status: 'open', 
                activity: 'Building', 
                isPrivate: false, 
                thumbnail: null,
                users: [
                  { id: 'bob_user_id', name: 'Bob', avatar: 'https://example.com/bob.jpg' }
                ]
              }
            ]
          }
        ],
        
        neighbours: [
          { id: 'abc123', name: "Alice's House", owner: 'Alice', thumbnail: null, houseId: 'abc123' },
          { id: 'def456', name: "Bob's Place", owner: 'Bob', thumbnail: null, houseId: 'def456' },
          { id: 'ghi789', name: "Carol's Home", owner: 'Carol', thumbnail: null, houseId: 'ghi789' },
        ],
        
        activeUsers: [
          { id: 1, name: 'Alice', status: 'online', activity: 'In Living Room', currentHouseId: 'house1', currentRoomId: 1 },
          { id: 2, name: 'Bob', status: 'busy', activity: 'In Gaming Room', currentHouseId: 'house1', currentRoomId: 2 },
          { id: 3, name: 'Charlie', status: 'online', activity: 'In Living Room', currentHouseId: 'house1', currentRoomId: 1 },
          { id: 'alice_user_id', name: 'Alice', status: 'online', activity: 'In Main Hall', currentHouseId: 'abc123', currentRoomId: 'alice_room1' },
        ],

        currentHouseId: 'house1', // Which house the current user is viewing/in
        currentRoomId: 1, // Which room the current user is in

        // --- House Actions ---
        addHouse: (houseData) => {
          const newHouse = {
            id: nanoid(),
            name: houseData.name || 'Untitled House',
            owners: houseData.owners || [],
            thumbnail: houseData.thumbnail || null,
            rooms: houseData.rooms || [],
          };
          set((state) => ({
            houses: [...state.houses, newHouse],
          }));
        },

        removeHouse: (houseId) =>
          set((state) => ({
            houses: state.houses.filter((h) => h.id !== houseId),
          })),

        updateHouse: (houseId, updates) =>
          set((state) => ({
            houses: state.houses.map((house) =>
              house.id === houseId ? { ...house, ...updates } : house
            ),
          })),

        addOwnerToHouse: (houseId, ownerId) =>
          set((state) => ({
            houses: state.houses.map((house) =>
              house.id === houseId
                ? {
                    ...house,
                    owners: house.owners.includes(ownerId)
                      ? house.owners
                      : [...house.owners, ownerId],
                  }
                : house
            ),
          })),

        removeOwnerFromHouse: (houseId, ownerId) =>
          set((state) => ({
            houses: state.houses.map((house) =>
              house.id === houseId
                ? {
                    ...house,
                    owners: house.owners.filter((id) => id !== ownerId),
                  }
                : house
            ),
          })),

        // --- Room Actions ---
        addRoomToHouse: (houseId, roomData) => {
          const newRoom = {
            id: nanoid(),
            name: roomData.name || 'Untitled Room',
            description: roomData.description || '',
            maxOccupants: roomData.maxOccupants || 10,
            status: roomData.status || 'open',
            activity: roomData.activity || 'Idle',
            isPrivate: roomData.isPrivate || false,
            thumbnail: roomData.thumbnail || null,
            users: [],
          };
          set((state) => ({
            houses: state.houses.map((house) =>
              house.id === houseId
                ? { ...house, rooms: [...house.rooms, newRoom] }
                : house
            ),
          }));
        },

        removeRoomFromHouse: (houseId, roomId) =>
          set((state) => ({
            houses: state.houses.map((house) =>
              house.id === houseId
                ? {
                    ...house,
                    rooms: house.rooms.filter((r) => r.id !== roomId),
                  }
                : house
            ),
          })),

        updateRoomInHouse: (houseId, roomId, updates) =>
          set((state) => ({
            houses: state.houses.map((house) =>
              house.id === houseId
                ? {
                    ...house,
                    rooms: house.rooms.map((room) =>
                      room.id === roomId ? { ...room, ...updates } : room
                    ),
                  }
                : house
            ),
          })),

        // --- User in Room Actions ---
        addUserToRoom: (houseId, roomId, user) =>
          set((state) => ({
            houses: state.houses.map((house) =>
              house.id === houseId
                ? {
                    ...house,
                    rooms: house.rooms.map((room) =>
                      room.id === roomId
                        ? {
                            ...room,
                            users: room.users.some((u) => u.id === user.id)
                              ? room.users
                              : [...room.users, user],
                          }
                        : room
                    ),
                  }
                : house
            ),
          })),

        removeUserFromRoom: (houseId, roomId, userId) =>
          set((state) => ({
            houses: state.houses.map((house) =>
              house.id === houseId
                ? {
                    ...house,
                    rooms: house.rooms.map((room) =>
                      room.id === roomId
                        ? {
                            ...room,
                            users: room.users.filter((u) => u.id !== userId),
                          }
                        : room
                    ),
                  }
                : house
            ),
          })),

        moveUserToRoom: (fromHouseId, fromRoomId, toHouseId, toRoomId, user) => {
          const { removeUserFromRoom, addUserToRoom } = get();
          if (fromHouseId && fromRoomId) {
            removeUserFromRoom(fromHouseId, fromRoomId, user.id);
          }
          addUserToRoom(toHouseId, toRoomId, user);
        },

        // --- Navigation Actions ---
        setCurrentHouse: (houseId) => set({ currentHouseId: houseId }),
        setCurrentRoom: (roomId) => set({ currentRoomId: roomId }),

        // --- Utility Getters ---
        getCurrentHouse: () => {
          const state = get();
          return state.houses.find((h) => h.id === state.currentHouseId);
        },

        getCurrentRoom: () => {
          const state = get();
          const house = state.getCurrentHouse();
          return house?.rooms.find((r) => r.id === state.currentRoomId);
        },

        getRoomUsers: (houseId, roomId) => {
          const state = get();
          const house = state.houses.find((h) => h.id === houseId);
          const room = house?.rooms.find((r) => r.id === roomId);
          return room?.users || [];
        },

        getUserCount: (houseId, roomId) => {
          const state = get();
          return state.getRoomUsers(houseId, roomId).length;
        },

        // --- Legacy Actions (for backward compatibility) ---
        addNeighbour: (neighbour) =>
          set((state) => ({
            neighbours: [...state.neighbours, neighbour],
          })),
        
        removeNeighbour: (id) =>
          set((state) => ({
            neighbours: state.neighbours.filter((n) => n.id !== id),
          })),
        
          // --- Room Actions ---
        updateCurrentRoomDescription: (description) =>
          set((state) => {
            const { currentHouseId, currentRoomId } = state;
            return {
              houses: state.houses.map((house) =>
                house.id === currentHouseId
                  ? {
                      ...house,
                      rooms: house.rooms.map((room) =>
                        room.id === currentRoomId
                          ? { ...room, description }
                          : room
                      ),
                    }
                  : house
              ),
            };
          }),

        setActiveUsers: (users) => set({ activeUsers: users }),
        
        updateUserStatus: (id, status) =>
          set((state) => ({
            activeUsers: state.activeUsers.map((u) =>
              u.id === id ? { ...u, status } : u
            ),
          })),
      }),
      {
        name: 'house-store',
      }
    )
  )
);