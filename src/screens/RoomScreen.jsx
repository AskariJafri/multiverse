import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Users, MessageSquare, Monitor, Volume2, Mic, MicOff, Camera, CameraOff, PhoneOff, VolumeX } from 'lucide-react';
import {MediaSharing} from '../Components/UIComponents/MediaSharing';
import {RoomOverview} from '../Components/RoomComponents/RoomOverview';
import { UserCard } from '../Components/UserComponents/UserCard';
import { UserAvatar } from '../Components/UserComponents/UserAvatar';
import { ChatComponent } from '../Components/ChatComponents/ChatComponent';
import { useChatStore, useRoomMessages, useUnreadCount } from '../store/chatStore';
import { useUserStore, useAllUsers, useOnlineUsers, useOnlineCount } from '../store/userStore';
import { VoiceControls } from '../Components/UIComponents/VoiceControls';
import { useHouseStore } from '../store/houseStore';

export default function RoomScreen() {
  // Direct store access to avoid selector issues
  const chatStore = useChatStore();
  const userStore = useUserStore();
  const {getRoomUsers, getCurrentHouse, getCurrentRoom} = useHouseStore()
  
  const currentHouse = getCurrentHouse();
  const currentRoom = getCurrentRoom();
  const houseId = currentHouse?.id || "house1";
  const roomId = currentRoom?.id;
  
  console.log("getCurrentRoom", currentRoom);
  console.log("Current Room ID:", roomId);
  
  const users = getRoomUsers(houseId, roomId) || [];

  // Local component state
  const [overview, setOverview] = useState(currentRoom?.description);
  const [currentView, setCurrentView] = useState('chat'); // 'chat', 'overview', 'media', 'participants'
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  
  // Voice control states
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);

  const chatEndRef = useRef(null);
  const initRef = useRef(false);
  
  // Create a unique room identifier for the chat store
  const chatRoomId = `${houseId}-${roomId}`;
  
  // Get data from stores safely - pass the specific room ID
  const messages = chatStore.getRoomMessages?.(chatRoomId) || [];
  const unreadCount = chatStore.getUnreadCount?.(chatRoomId) || 0;
  const onlineCount = userStore.getOnlineCount?.() || 0;
  
  // Initialize sample data on mount and when room changes
  useEffect(() => {
    if (!initRef.current) {
      try {
        userStore.actions?.initializeSampleUsers?.();
        initRef.current = true;
      } catch (error) {
        console.error('Failed to initialize user store:', error);
        initRef.current = true;
      }
    }
  }, []); // Only run once on mount

  // Set current room in chat store when room changes
  useEffect(() => {
    if (chatRoomId && chatStore.actions?.setCurrentRoom) {
      chatStore.actions.setCurrentRoom(chatRoomId);
      console.log("Set chat room to:", chatRoomId);
    }
  }, [chatRoomId]);

  // Initialize sample messages for new rooms
  useEffect(() => {
    if (chatRoomId && messages.length === 0 && chatStore.actions?.initializeSampleMessages) {
      // Add some room-specific sample messages
      const sampleMessages = [
        {
          id: `${chatRoomId}-welcome`,
          text: `Welcome to ${currentRoom?.name || 'this room'}! 🎉`,
          user: { id: 'system', name: 'System', avatar: null },
          timestamp: new Date(Date.now() - 300000).toISOString(),
          type: 'system',
        },
        {
          id: `${chatRoomId}-activity`,
          text: `This room is great for ${currentRoom?.activity?.toLowerCase() || 'chatting'}!`,
          user: { id: 'system', name: 'System', avatar: null },
          timestamp: new Date(Date.now() - 240000).toISOString(),
          type: 'system',
        }
      ];
      
      // Add messages specifically for this room
      sampleMessages.forEach(msgData => {
        chatStore.actions.addMessage(msgData, chatRoomId);
      });
    }
  }, [chatRoomId, currentRoom, messages.length]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (msg) => {
    if (!msg.trim() || !chatStore.actions?.addMessage) return;
    const messageData = {
      text: msg,
      user: { id: 'current', name: 'You', avatar: null },
      isOwn: true,
    };
    // Send message to the current room
    chatStore.actions.addMessage(messageData, chatRoomId);
  };

  const viewButtons = [
    { key: 'chat', label: 'Chat', icon: MessageSquare, badge: currentView !== 'chat' ? unreadCount : 0 },
    { key: 'overview', label: 'Overview', icon: Monitor },
    { key: 'media', label: 'Media', icon: Volume2 },
    { key: 'participants', label: 'People', icon: Users, badge: users.length },
  ];

  const renderMainContent = () => {
    switch (currentView) {
      case 'chat':
        return (
          <ChatComponent 
            messages={messages} 
            handleSend={handleSend} 
            chatEndRef={chatEndRef}
            roomInfo={{
              name: currentRoom?.name,
              description: currentRoom?.description,
              id: chatRoomId
            }}
          />
        );
      
      case 'overview':
        return <RoomOverview overview={currentRoom?.description} setOverview={setOverview} currentRoom={currentRoom} />;
      
      case 'media':
        return <MediaSharing isBroadcasting={false} />;
      
      case 'participants':
        return (
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 h-full shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <Users className="w-6 h-6 text-cyan-400" />
              <h3 className="text-xl font-semibold text-cyan-400">Participants ({users.length})</h3>
            </div>
            <div className="space-y-4">
              {users.map((user) => (
                <UserCard key={user.id} user={user} showInvite={true}/>
              ))}
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  // Don't render if we don't have valid room data
  if (!currentRoom || !roomId) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-neutral-950 via-gray-950 to-neutral-950">
        <div className="text-center text-gray-400">
          <div className="text-lg mb-2">No room selected</div>
          <div className="text-sm">Please select a room to continue</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-neutral-950 via-gray-950 to-neutral-950 text-gray-100">
      {/* Left Sidebar */}
      <aside
        className={`flex flex-col justify-between transition-all duration-300 ease-in-out border-r border-gray-700/50 bg-gray-900/80 backdrop-blur-sm ${
          leftCollapsed ? 'w-16' : 'w-20'
        }`}
      >
        {/* Top: User Avatars */}
        <div className="p-3 pt-8 flex flex-col gap-3 overflow-y-auto">
          {users.slice(0, 6).map((user) => (
            <div
              key={user.id}
              className="relative group flex justify-center cursor-pointer"
              title={`${user.name} - ${user.activity || 'In room'}`}
            >
              <div className="transform hover:scale-110 transition-transform duration-200">
                <UserAvatar name={user.name} avatar={user.avatar} status={user.status || 'online'} />
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Center Area */}
      <div className="flex flex-col flex-grow h-full">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-gray-700/50 bg-gray-800/30 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50"></div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              {currentRoom?.name || 'Room Name'}
            </h2>
            <span className="px-3 py-1 bg-gray-700/50 rounded-full text-xs text-gray-300">
              {onlineCount} online
            </span>
            <span className="px-2 py-1 bg-blue-600/20 text-blue-400 rounded text-xs">
              {currentRoom?.activity || 'Active'}
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Voice Controls integrated into header */}
            <VoiceControls
              isMicOn={isMicOn}
              isCameraOn={isCameraOn}
              isSpeakerOn={isSpeakerOn}
              onToggleMic={() => setIsMicOn(!isMicOn)}
              onToggleCamera={() => setIsCameraOn(!isCameraOn)}
              onToggleSpeaker={() => setIsSpeakerOn(!isSpeakerOn)}
              onLeave={() => console.log('Leaving room')}
            />
            
            {/* View Buttons */}
            <div className="flex items-center gap-2 ml-4 pl-4 border-l border-gray-700/50">
              {viewButtons.map(({ key, label, icon: Icon, badge }) => (
                <button
                  key={key}
                  onClick={() => setCurrentView(key)}
                  className={`relative px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 text-sm font-medium ${
                    currentView === key
                      ? 'bg-cyan-600/20 text-cyan-400 shadow-lg shadow-cyan-500/20'
                      : 'hover:bg-gray-700/30 text-gray-300 hover:text-cyan-400'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{label}</span>
                  {badge > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                      {badge > 99 ? '99+' : badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex flex-grow overflow-hidden">
          <main className="flex flex-col flex-grow p-6 overflow-hidden">
            {renderMainContent()}
          </main>

          {/* Right Sidebar */}
          <aside
            className={`flex flex-col bg-gray-900/80 backdrop-blur-sm border-l border-gray-700/50 transition-all duration-300 ease-in-out ${
              sidebarCollapsed ? 'w-16' : 'w-80'
            }`}
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-700/50">
              {!sidebarCollapsed && (
                <h3 className="font-semibold text-gray-200">Room Info</h3>
              )}
              <button
                onClick={() => setSidebarCollapsed((v) => !v)}
                className="p-2 rounded-lg hover:bg-gray-700/50 transition-all duration-200 text-gray-400 hover:text-cyan-400"
                title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                {sidebarCollapsed ? (
                  <ChevronLeft className="w-5 h-5" />
                ) : (
                  <ChevronRight className="w-5 h-5" />
                )}
              </button>
            </div>

            {!sidebarCollapsed && (
              <div className="flex-grow overflow-auto p-4 space-y-4">
                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/30">
                  <h4 className="text-sm font-medium text-gray-300 mb-3">Room Stats</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Messages</span>
                      <span className="text-cyan-400 font-medium">{messages.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Participants</span>
                      <span className="text-cyan-400 font-medium">{users.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Active</span>
                      <span className="text-green-400 font-medium">{onlineCount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Room ID</span>
                      <span className="text-purple-400 font-medium text-xs">{roomId}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/30">
                  <h4 className="text-sm font-medium text-gray-300 mb-3">Audio Status</h4>
                  <div className="space-y-2 text-xs">
                    <div className={`flex items-center gap-2 ${isMicOn ? 'text-green-400' : 'text-red-400'}`}>
                      <div className={`w-2 h-2 rounded-full ${isMicOn ? 'bg-green-400' : 'bg-red-400'} ${isMicOn ? 'animate-pulse' : ''}`}></div>
                      <span>Microphone {isMicOn ? 'On' : 'Off'}</span>
                    </div>
                    <div className={`flex items-center gap-2 ${isCameraOn ? 'text-green-400' : 'text-gray-400'}`}>
                      <div className={`w-2 h-2 rounded-full ${isCameraOn ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                      <span>Camera {isCameraOn ? 'On' : 'Off'}</span>
                    </div>
                    <div className={`flex items-center gap-2 ${isSpeakerOn ? 'text-green-400' : 'text-red-400'}`}>
                      <div className={`w-2 h-2 rounded-full ${isSpeakerOn ? 'bg-green-400' : 'bg-red-400'}`}></div>
                      <span>Speaker {isSpeakerOn ? 'On' : 'Off'}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/30">
                  <h4 className="text-sm font-medium text-gray-300 mb-3">Recent Activity</h4>
                  <div className="space-y-2 text-xs text-gray-400">
                    {users.slice(0, 3).map((user, index) => (
                      <div key={user?.id}>• {user?.name} is {user?.activity?.toLowerCase() || 'in the room'}</div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}