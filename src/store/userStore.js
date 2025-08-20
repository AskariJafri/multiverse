import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';

export const useUserStore = create(
  subscribeWithSelector(
    devtools(
      (set, get) => ({
        // State
        users: new Map(),
        currentUserId: null,
        onlineUsers: new Set(),
        typingUsers: new Set(),
        userActivities: new Map(),
        lastSeen: new Map(),

        // Selectors (memoized)
        getUser: (userId) => get().users.get(userId),
        
        getAllUsers: () => Array.from(get().users.values()),
        
        getOnlineUsers: () => {
          const { users, onlineUsers } = get();
          return Array.from(onlineUsers).map(id => users.get(id)).filter(Boolean);
        },
        
        getUsersByStatus: (status) => {
          return get().getAllUsers().filter(user => user.status === status);
        },
        
        getTypingUsers: () => {
          const { users, typingUsers } = get();
          return Array.from(typingUsers).map(id => users.get(id)).filter(Boolean);
        },
        
        getUsersCount: () => get().users.size,
        
        getOnlineCount: () => get().onlineUsers.size,

        // Actions
        actions: {
          // User CRUD Operations
          addUser: (user) =>
            set((state) => {
              const userId = user.id || Date.now().toString();
              const newUser = {
                id: userId,
                name: user.name,
                avatar: user.avatar || null,
                status: user.status || 'offline',
                activity: user.activity || 'Idle',
                joinedAt: new Date().toISOString(),
                lastActive: new Date().toISOString(),
                ...user,
              };
              
              const newUsers = new Map(state.users);
              const newLastSeen = new Map(state.lastSeen);
              const newOnlineUsers = new Set(state.onlineUsers);
              
              newUsers.set(userId, newUser);
              newLastSeen.set(userId, new Date().toISOString());
              
              if (newUser.status === 'online') {
                newOnlineUsers.add(userId);
              }
              
              return {
                users: newUsers,
                lastSeen: newLastSeen,
                onlineUsers: newOnlineUsers,
              };
            }),

          updateUser: (userId, updates) =>
            set((state) => {
              const user = state.users.get(userId);
              if (user) {
                const updatedUser = {
                  ...user,
                  ...updates,
                  lastActive: new Date().toISOString(),
                };
                
                const newUsers = new Map(state.users);
                const newOnlineUsers = new Set(state.onlineUsers);
                
                newUsers.set(userId, updatedUser);
                
                // Update online status
                if (updates.status === 'online') {
                  newOnlineUsers.add(userId);
                } else if (updates.status && updates.status !== 'online') {
                  newOnlineUsers.delete(userId);
                }
                
                return {
                  users: newUsers,
                  onlineUsers: newOnlineUsers,
                };
              }
              return {};
            }),

          removeUser: (userId) =>
            set((state) => {
              const newUsers = new Map(state.users);
              const newOnlineUsers = new Set(state.onlineUsers);
              const newTypingUsers = new Set(state.typingUsers);
              const newUserActivities = new Map(state.userActivities);
              const newLastSeen = new Map(state.lastSeen);
              
              newUsers.delete(userId);
              newOnlineUsers.delete(userId);
              newTypingUsers.delete(userId);
              newUserActivities.delete(userId);
              newLastSeen.delete(userId);
              
              return {
                users: newUsers,
                onlineUsers: newOnlineUsers,
                typingUsers: newTypingUsers,
                userActivities: newUserActivities,
                lastSeen: newLastSeen,
              };
            }),

          bulkUpdateUsers: (usersData) =>
            set((state) => {
              const newUsers = new Map(state.users);
              
              usersData.forEach((userData) => {
                const userId = userData.id;
                if (newUsers.has(userId)) {
                  const user = newUsers.get(userId);
                  newUsers.set(userId, {
                    ...user,
                    ...userData,
                    lastActive: new Date().toISOString(),
                  });
                }
              });
              
              return { users: newUsers };
            }),

          // Status Management
          setUserStatus: (userId, status) =>
            set((state) => {
              const user = state.users.get(userId);
              if (user) {
                const newUsers = new Map(state.users);
                const newOnlineUsers = new Set(state.onlineUsers);
                
                newUsers.set(userId, {
                  ...user,
                  status,
                  lastActive: new Date().toISOString(),
                });
                
                if (status === 'online') {
                  newOnlineUsers.add(userId);
                } else {
                  newOnlineUsers.delete(userId);
                }
                
                return {
                  users: newUsers,
                  onlineUsers: newOnlineUsers,
                };
              }
              return {};
            }),

          setUserActivity: (userId, activity) =>
            set((state) => {
              const newUserActivities = new Map(state.userActivities);
              newUserActivities.set(userId, {
                activity,
                timestamp: new Date().toISOString(),
              });
              
              const user = state.users.get(userId);
              if (user) {
                const newUsers = new Map(state.users);
                newUsers.set(userId, {
                  ...user,
                  activity,
                  lastActive: new Date().toISOString(),
                });
                
                return {
                  userActivities: newUserActivities,
                  users: newUsers,
                };
              }
              
              return { userActivities: newUserActivities };
            }),

          // Typing Indicators
          setUserTyping: (userId, isTyping = true) =>
            set((state) => {
              const newTypingUsers = new Set(state.typingUsers);
              
              if (isTyping) {
                newTypingUsers.add(userId);
              } else {
                newTypingUsers.delete(userId);
              }
              
              // Update activity
              const activity = isTyping ? 'Typing...' : 'Online';
              const user = state.users.get(userId);
              if (user) {
                const newUsers = new Map(state.users);
                newUsers.set(userId, {
                  ...user,
                  activity,
                  lastActive: new Date().toISOString(),
                });
                
                return {
                  typingUsers: newTypingUsers,
                  users: newUsers,
                };
              }
              
              return { typingUsers: newTypingUsers };
            }),

          // Bulk Operations
          setMultipleUsersOnline: (userIds) =>
            set((state) => {
              const newOnlineUsers = new Set(state.onlineUsers);
              const newUsers = new Map(state.users);
              
              userIds.forEach((userId) => {
                newOnlineUsers.add(userId);
                const user = newUsers.get(userId);
                if (user) {
                  newUsers.set(userId, {
                    ...user,
                    status: 'online',
                    lastActive: new Date().toISOString(),
                  });
                }
              });
              
              return {
                onlineUsers: newOnlineUsers,
                users: newUsers,
              };
            }),

          setMultipleUsersOffline: (userIds) =>
            set((state) => {
              const newOnlineUsers = new Set(state.onlineUsers);
              const newTypingUsers = new Set(state.typingUsers);
              const newUsers = new Map(state.users);
              const newLastSeen = new Map(state.lastSeen);
              
              userIds.forEach((userId) => {
                newOnlineUsers.delete(userId);
                newTypingUsers.delete(userId);
                const user = newUsers.get(userId);
                if (user) {
                  newUsers.set(userId, {
                    ...user,
                    status: 'offline',
                    activity: 'Offline',
                  });
                }
                newLastSeen.set(userId, new Date().toISOString());
              });
              
              return {
                onlineUsers: newOnlineUsers,
                typingUsers: newTypingUsers,
                users: newUsers,
                lastSeen: newLastSeen,
              };
            }),

          // Current User
          setCurrentUser: (userId) =>
            set({ currentUserId: userId }),

          // Utility Actions
          clearAllUsers: () =>
            set({
              users: new Map(),
              onlineUsers: new Set(),
              typingUsers: new Set(),
              userActivities: new Map(),
              lastSeen: new Map(),
              currentUserId: null,
            }),

          // Initialize with sample data
          initializeSampleUsers: () =>
            set((state) => {
              const sampleUsers = [
                { id: '1', name: 'Alice', status: 'online', activity: 'Here', avatar: null },
                { id: '2', name: 'Bob', status: 'busy', activity: 'In a meeting', avatar: null },
                { id: '3', name: 'Carol', status: 'online', activity: 'Listening', avatar: null },
                { id: '4', name: 'Dave', status: 'away', activity: 'Away', avatar: null },
                { id: '5', name: 'Eve', status: 'online', activity: 'Active', avatar: null },
              ];

              const newUsers = new Map();
              const newLastSeen = new Map();
              const newOnlineUsers = new Set();

              sampleUsers.forEach((user) => {
                const userId = user.id;
                const newUser = {
                  ...user,
                  joinedAt: new Date().toISOString(),
                  lastActive: new Date().toISOString(),
                };
                
                newUsers.set(userId, newUser);
                newLastSeen.set(userId, new Date().toISOString());
                
                if (user.status === 'online') {
                  newOnlineUsers.add(userId);
                }
              });

              return {
                users: newUsers,
                lastSeen: newLastSeen,
                onlineUsers: newOnlineUsers,
                currentUserId: '1',
              };
            }),

          // Performance optimization: batch updates
          batchUserUpdates: (updates) =>
            set((state) => {
              const newOnlineUsers = new Set(state.onlineUsers);
              const newTypingUsers = new Set(state.typingUsers);
              const newUserActivities = new Map(state.userActivities);
              const newUsers = new Map(state.users);
              
              updates.forEach(({ userId, type, data }) => {
                switch (type) {
                  case 'status':
                    if (data === 'online') {
                      newOnlineUsers.add(userId);
                    } else {
                      newOnlineUsers.delete(userId);
                    }
                    break;
                  case 'typing':
                    if (data) {
                      newTypingUsers.add(userId);
                    } else {
                      newTypingUsers.delete(userId);
                    }
                    break;
                  case 'activity':
                    newUserActivities.set(userId, {
                      activity: data,
                      timestamp: new Date().toISOString(),
                    });
                    break;
                }
                
                const user = newUsers.get(userId);
                if (user) {
                  newUsers.set(userId, {
                    ...user,
                    ...(type === 'status' && { status: data }),
                    ...(type === 'activity' && { activity: data }),
                    lastActive: new Date().toISOString(),
                  });
                }
              });
              
              return {
                onlineUsers: newOnlineUsers,
                typingUsers: newTypingUsers,
                userActivities: newUserActivities,
                users: newUsers,
              };
            }),
        },
      }),
      {
        name: 'user-store',
      }
    )
  )
);

// Selectors for performance optimization
export const useUser = (userId) => useUserStore((state) => state.getUser?.(userId));
export const useAllUsers = () => useUserStore((state) => state.getAllUsers?.() || []);
export const useOnlineUsers = () => useUserStore((state) => state.getOnlineUsers?.() || []);
export const useTypingUsers = () => useUserStore((state) => state.getTypingUsers?.() || []);
export const useUsersCount = () => useUserStore((state) => state.getUsersCount?.() || 0);
export const useOnlineCount = () => useUserStore((state) => state.getOnlineCount?.() || 0);
export const useCurrentUser = () => useUserStore((state) => 
  state.currentUserId ? state.getUser?.(state.currentUserId) : null
);