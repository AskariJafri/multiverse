import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';

export const useChatStore = create(
  subscribeWithSelector(
    devtools(
      (set, get) => ({
        // State
        messages: new Map(),
        messagesByRoom: new Map(),
        usersByRoom: new Map(), // <-- NEW: Map<roomId, Set<userId>>
        currentRoomId: 'living-room',
        unreadCounts: new Map(),
        lastReadTimestamps: new Map(),
        messageQueue: [],
        isLoading: false,
        searchResults: [],
        pinnedMessages: new Set(),
        replyingTo: null,
        editingMessageId: null,

        // Selectors (memoized)
        getMessage: (messageId) => get().messages.get(messageId),
        
        getRoomMessages: (roomId = null) => {
          const state = get();
          const targetRoomId = roomId || state.currentRoomId;
          const messageIds = state.messagesByRoom?.get(targetRoomId) || [];
          return messageIds.map(id => state.messages?.get(id)).filter(Boolean);
        },
        
        getRecentMessages: (limit = 50) => {
          const messages = get().getRoomMessages();
          return messages.slice(-limit);
        },
        
        getUnreadCount: (roomId = null) => {
          const state = get();
          const targetRoomId = roomId || state.currentRoomId;
          return state.unreadCounts?.get(targetRoomId) || 0;
        },
        
        getPinnedMessages: (roomId = null) => {
          const state = get();
          const targetRoomId = roomId || state.currentRoomId;
          const messages = state.getRoomMessages?.(targetRoomId) || [];
          return messages.filter(msg => state.pinnedMessages?.has(msg.id));
        },
        
        getMessagesByUser: (userId, roomId = null) => {
          const state = get();
          const messages = state.getRoomMessages?.(roomId) || [];
          return messages.filter(msg => msg.user?.id === userId);
        },
        
        searchMessages: (query, roomId = null) => {
          const state = get();
          const messages = state.getRoomMessages?.(roomId) || [];
          return messages.filter(msg => 
            msg.text?.toLowerCase().includes(query.toLowerCase()) ||
            msg.user?.name?.toLowerCase().includes(query.toLowerCase())
          );
        },

        getUsersByRoom: (roomId = null) => {
          const state = get();
          const targetRoomId = roomId || state.currentRoomId;
          const usersSet = state.usersByRoom.get(targetRoomId);
          return usersSet ? Array.from(usersSet) : [];
        },

        // Actions
        actions: {
          // Message CRUD Operations
          addMessage: (messageData, roomId = null) =>
            set((state) => {
              const targetRoomId = roomId || state.currentRoomId;
              const messageId = messageData.id || `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
              
              const message = {
                id: messageId,
                text: messageData.text || '',
                user: messageData.user || { id: 'unknown', name: 'Unknown User', avatar: null },
                timestamp: messageData.timestamp || new Date().toISOString(),
                roomId: targetRoomId,
                type: messageData.type || 'text', // text, image, file, system
                isOwn: messageData.isOwn || false,
                isEdited: false,
                isDeleted: false,
                reactions: new Map(),
                replyTo: messageData.replyTo || null,
                mentions: messageData.mentions || [],
                attachments: messageData.attachments || [],
                metadata: messageData.metadata || {},
                ...messageData,
              };

              // Create new messages map
              const newMessages = new Map(state.messages);
              newMessages.set(messageId, message);
              
              // Create new messagesByRoom map
              const newMessagesByRoom = new Map(state.messagesByRoom);
              if (!newMessagesByRoom.has(targetRoomId)) {
                newMessagesByRoom.set(targetRoomId, []);
              }
              const roomMessages = [...(newMessagesByRoom.get(targetRoomId) || [])];
              roomMessages.push(messageId);
              newMessagesByRoom.set(targetRoomId, roomMessages);

              // Update usersByRoom map (NEW)
              const newUsersByRoom = new Map(state.usersByRoom);
              if (!newUsersByRoom.has(targetRoomId)) {
                newUsersByRoom.set(targetRoomId, new Set());
              }
              newUsersByRoom.get(targetRoomId).add(message.user.id);

              // Update unread count for other rooms
              const newUnreadCounts = new Map(state.unreadCounts);
              if (targetRoomId !== state.currentRoomId) {
                const currentUnread = newUnreadCounts.get(targetRoomId) || 0;
                newUnreadCounts.set(targetRoomId, currentUnread + 1);
              }

              return {
                messages: newMessages,
                messagesByRoom: newMessagesByRoom,
                usersByRoom: newUsersByRoom,   // <-- save new usersByRoom
                unreadCounts: newUnreadCounts,
              };
            }),

          updateMessage: (messageId, updates) =>
            set((state) => {
              const message = state.messages.get(messageId);
              if (message) {
                const updatedMessage = {
                  ...message,
                  ...updates,
                  isEdited: updates.text !== message.text ? true : message.isEdited,
                  editedAt: updates.text !== message.text ? new Date().toISOString() : message.editedAt,
                };
                const newMessages = new Map(state.messages);
                newMessages.set(messageId, updatedMessage);
                return { messages: newMessages };
              }
              return {};
            }),

          deleteMessage: (messageId, soft = true) =>
            set((state) => {
              const message = state.messages.get(messageId);
              if (message) {
                const newMessages = new Map(state.messages);
                const newPinnedMessages = new Set(state.pinnedMessages);
                
                if (soft) {
                  // Soft delete - keep message but mark as deleted
                  newMessages.set(messageId, {
                    ...message,
                    isDeleted: true,
                    deletedAt: new Date().toISOString(),
                    text: '[Message deleted]',
                  });
                } else {
                  // Hard delete - remove message completely
                  newMessages.delete(messageId);
                  const newMessagesByRoom = new Map(state.messagesByRoom);
                  const roomMessages = newMessagesByRoom.get(message.roomId) || [];
                  const filteredMessages = roomMessages.filter(id => id !== messageId);
                  newMessagesByRoom.set(message.roomId, filteredMessages);
                }
                
                // Remove from pinned if pinned
                newPinnedMessages.delete(messageId);
                
                return {
                  messages: newMessages,
                  pinnedMessages: newPinnedMessages,
                  ...(soft ? {} : { messagesByRoom: new Map(state.messagesByRoom) }),
                };
              }
              return {};
            }),

          // Bulk Operations
          bulkAddMessages: (messagesData, roomId = null) =>
            set((state) => {
              const targetRoomId = roomId || state.currentRoomId;
              const newMessages = new Map(state.messages);
              const newMessagesByRoom = new Map(state.messagesByRoom);
              const newUsersByRoom = new Map(state.usersByRoom);  // NEW
              
              if (!newMessagesByRoom.has(targetRoomId)) {
                newMessagesByRoom.set(targetRoomId, []);
              }
              if (!newUsersByRoom.has(targetRoomId)) {
                newUsersByRoom.set(targetRoomId, new Set());
              }
              
              const roomMessages = [...(newMessagesByRoom.get(targetRoomId) || [])];
              
              messagesData.forEach((messageData) => {
                const messageId = messageData.id || `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                const message = {
                  id: messageId,
                  text: messageData.text || '',
                  user: messageData.user || { id: 'unknown', name: 'Unknown User', avatar: null },
                  timestamp: messageData.timestamp || new Date().toISOString(),
                  roomId: targetRoomId,
                  type: messageData.type || 'text',
                  isOwn: messageData.isOwn || false,
                  isEdited: false,
                  isDeleted: false,
                  reactions: new Map(),
                  replyTo: messageData.replyTo || null,
                  mentions: messageData.mentions || [],
                  attachments: messageData.attachments || [],
                  metadata: messageData.metadata || {},
                  ...messageData,
                };

                newMessages.set(messageId, message);
                roomMessages.push(messageId);

                // Add user to usersByRoom
                newUsersByRoom.get(targetRoomId).add(message.user.id);
              });

              newMessagesByRoom.set(targetRoomId, roomMessages);

              return {
                messages: newMessages,
                messagesByRoom: newMessagesByRoom,
                usersByRoom: newUsersByRoom,  // <-- save new usersByRoom
              };
            }),

          clearRoomMessages: (roomId = null) =>
            set((state) => {
              const targetRoomId = roomId || state.currentRoomId;
              const messageIds = state.messagesByRoom.get(targetRoomId) || [];
              
              const newMessages = new Map(state.messages);
              const newPinnedMessages = new Set(state.pinnedMessages);
              const newMessagesByRoom = new Map(state.messagesByRoom);
              const newUnreadCounts = new Map(state.unreadCounts);
              const newUsersByRoom = new Map(state.usersByRoom);  // NEW
              
              messageIds.forEach(messageId => {
                newMessages.delete(messageId);
                newPinnedMessages.delete(messageId);
              });
              
              newMessagesByRoom.set(targetRoomId, []);
              newUnreadCounts.set(targetRoomId, 0);
              newUsersByRoom.set(targetRoomId, new Set());  // Clear users for room
              
              return {
                messages: newMessages,
                pinnedMessages: newPinnedMessages,
                messagesByRoom: newMessagesByRoom,
                unreadCounts: newUnreadCounts,
                usersByRoom: newUsersByRoom,   // <-- save cleared usersByRoom
              };
            }),

          // Room Management
          setCurrentRoom: (roomId) =>
            set((state) => {
              const newUnreadCounts = new Map(state.unreadCounts);
              const newLastReadTimestamps = new Map(state.lastReadTimestamps);
              
              newUnreadCounts.set(roomId, 0);
              newLastReadTimestamps.set(roomId, new Date().toISOString());
              
              return {
                currentRoomId: roomId,
                unreadCounts: newUnreadCounts,
                lastReadTimestamps: newLastReadTimestamps,
              };
            }),

          // Unread Management
          markAsRead: (roomId = null) =>
            set((state) => {
              const targetRoomId = roomId || state.currentRoomId;
              const newUnreadCounts = new Map(state.unreadCounts);
              const newLastReadTimestamps = new Map(state.lastReadTimestamps);
              
              newUnreadCounts.set(targetRoomId, 0);
              newLastReadTimestamps.set(targetRoomId, new Date().toISOString());
              
              return {
                unreadCounts: newUnreadCounts,
                lastReadTimestamps: newLastReadTimestamps,
              };
            }),

          incrementUnread: (roomId) =>
            set((state) => {
              const currentUnread = state.unreadCounts.get(roomId) || 0;
              const newUnreadCounts = new Map(state.unreadCounts);
              newUnreadCounts.set(roomId, currentUnread + 1);
              
              return { unreadCounts: newUnreadCounts };
            }),

          // Message Interactions
          addReaction: (messageId, emoji, userId) =>
            set((state) => {
              const message = state.messages.get(messageId);
              if (message) {
                const reactions = new Map(message.reactions);
                if (reactions.has(emoji)) {
                  const users = new Set(reactions.get(emoji));
                  users.add(userId);
                  reactions.set(emoji, users);
                } else {
                  reactions.set(emoji, new Set([userId]));
                }
                
                const newMessages = new Map(state.messages);
                newMessages.set(messageId, {
                  ...message,
                  reactions,
                });
                
                return { messages: newMessages };
              }
              return {};
            }),

          removeReaction: (messageId, emoji, userId) =>
            set((state) => {
              const message = state.messages.get(messageId);
              if (message) {
                const reactions = new Map(message.reactions);
                if (reactions.has(emoji)) {
                  const users = new Set(reactions.get(emoji));
                  users.delete(userId);
                  if (users.size === 0) {
                    reactions.delete(emoji);
                  } else {
                    reactions.set(emoji, users);
                  }
                }
                
                const newMessages = new Map(state.messages);
                newMessages.set(messageId, {
                  ...message,
                  reactions,
                });
                
                return { messages: newMessages };
              }
              return {};
            }),

          togglePinMessage: (messageId) =>
            set((state) => {
              const newPinnedMessages = new Set(state.pinnedMessages);
              if (newPinnedMessages.has(messageId)) {
                newPinnedMessages.delete(messageId);
              } else {
                newPinnedMessages.add(messageId);
              }
              return { pinnedMessages: newPinnedMessages };
            }),

          // Reply and Edit
          setReplyingTo: (messageId) =>
            set({ replyingTo: messageId }),

          clearReplyingTo: () =>
            set({ replyingTo: null }),

          setEditingMessage: (messageId) =>
            set({ editingMessageId: messageId }),

          clearEditingMessage: () =>
            set({ editingMessageId: null }),

          // Search
          performSearch: (query, roomId = null) =>
            set((state) => {
              const searchMessages = (query, roomId = null) => {
                const targetRoomId = roomId || state.currentRoomId;
                const messageIds = state.messagesByRoom?.get(targetRoomId) || [];
                const messages = messageIds.map(id => state.messages?.get(id)).filter(Boolean);
                return messages.filter(msg => 
                  msg.text?.toLowerCase().includes(query.toLowerCase()) ||
                  msg.user?.name?.toLowerCase().includes(query.toLowerCase())
                );
              };
              const results = searchMessages(query, roomId);
              return { searchResults: results };
            }),

          clearSearch: () =>
            set({ searchResults: [] }),

          // Loading states
          setLoading: (isLoading) =>
            set({ isLoading }),

          // Queue management for optimistic updates
          addToQueue: (message) =>
            set((state) => ({
              messageQueue: [...state.messageQueue, message],
            })),

          removeFromQueue: (messageId) =>
            set((state) => ({
              messageQueue: state.messageQueue.filter(msg => msg.id !== messageId),
            })),

          clearQueue: () =>
            set({ messageQueue: [] }),

          // Utility Actions
          clearAllMessages: () =>
            set({
              messages: new Map(),
              messagesByRoom: new Map(),
              usersByRoom: new Map(),
              unreadCounts: new Map(),
              lastReadTimestamps: new Map(),
              pinnedMessages: new Set(),
              messageQueue: [],
              searchResults: [],
              replyingTo: null,
              editingMessageId: null,
            }),

          // Initialize with sample data
          initializeSampleMessages: () =>
            set((state) => {
              const sampleMessages = [
                {
                  id: '1',
                  text: 'Welcome to the Living Room! 🎉',
                  user: { id: '1', name: 'Alice', avatar: null },
                  timestamp: new Date(Date.now() - 300000).toISOString(),
                  type: 'system',
                },
                {
                  id: '2',
                  text: 'Hey everyone! How is your day going?',
                  user: { id: '2', name: 'Bob', avatar: null },
                  timestamp: new Date(Date.now() - 240000).toISOString(),
                  isOwn: false,
                },
                {
                  id: '3',
                  text: 'Great! Just finished a big project. Ready to relax 😌',
                  user: { id: '3', name: 'Carol', avatar: null },
                  timestamp: new Date(Date.now() - 180000).toISOString(),
                  isOwn: false,
                },
                {
                  id: '4',
                  text: 'That sounds amazing Carol! What kind of project was it?',
                  user: { id: '1', name: 'Alice', avatar: null },
                  timestamp: new Date(Date.now() - 120000).toISOString(),
                  isOwn: true,
                },
                {
                  id: '5',
                  text: 'It was a web application using React and some cool animations!',
                  user: { id: '3', name: 'Carol', avatar: null },
                  timestamp: new Date(Date.now() - 60000).toISOString(),
                  isOwn: false,
                },
              ];

              const roomId = 'living-room';
              const newMessages = new Map();
              const newMessagesByRoom = new Map();
              const newUnreadCounts = new Map();
              const newLastReadTimestamps = new Map();
              const newUsersByRoom = new Map();
              
              newMessagesByRoom.set(roomId, []);
              newUsersByRoom.set(roomId, new Set());
              
              sampleMessages.forEach((msgData) => {
                const message = {
                  ...msgData,
                  roomId,
                  isEdited: false,
                  isDeleted: false,
                  reactions: new Map(),
                  replyTo: null,
                  mentions: [],
                  attachments: [],
                  metadata: {},
                };
                
                newMessages.set(message.id, message);
                newMessagesByRoom.get(roomId).push(message.id);
                newUsersByRoom.get(roomId).add(message.user.id);
              });
              
              newUnreadCounts.set(roomId, 0);
              newLastReadTimestamps.set(roomId, new Date().toISOString());
              
              return {
                messages: newMessages,
                messagesByRoom: newMessagesByRoom,
                usersByRoom: newUsersByRoom,
                unreadCounts: newUnreadCounts,
                lastReadTimestamps: newLastReadTimestamps,
              };
            }),
        },
      }),
      {
        name: 'chat-store',
      }
    )
  )
);

// Selectors for performance optimization
export const useMessage = (messageId) => useChatStore((state) => state.getMessage(messageId));
export const useRoomMessages = (roomId) => useChatStore((state) => state.getRoomMessages(roomId));
export const useRecentMessages = (limit) => useChatStore((state) => state.getRecentMessages(limit));
export const useUnreadCount = (roomId) => useChatStore((state) => state.getUnreadCount(roomId));
export const usePinnedMessages = (roomId) => useChatStore((state) => state.getPinnedMessages(roomId));
export const useMessagesByUser = (userId, roomId) => useChatStore((state) => state.getMessagesByUser(userId, roomId));
export const useSearchResults = () => useChatStore((state) => state.searchResults);
export const useUsersByRoom = (roomId) => useChatStore((state) => state.getUsersByRoom(roomId));
export const useCurrentRoomId = () => useChatStore((state) => state.currentRoomId);
export const useIsLoading = () => useChatStore((state) => state.isLoading);
export const useReplyingTo = () => useChatStore((state) => state.replyingTo);
export const useEditingMessageId = () => useChatStore((state) => state.editingMessageId);
