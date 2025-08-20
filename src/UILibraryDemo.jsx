import { useState } from "react";
import { 
  Home, Users, Video, Gamepad2, Settings, Plus, X, 
  Mic, MicOff, Camera, CameraOff, Share, Lock, 
  Unlock, Volume2, VolumeX, Play, Pause, SkipForward,
  MessageCircle, Phone, PhoneOff, Search, Bell,
  User, LogOut, Crown, Star, Heart, ThumbsUp
} from "lucide-react";
import {Button} from "./UI/Button";
import { Input } from "./UI/Input";
import { Card } from "./UI/Card";
import { CardHeader } from "./UI/CardHeader";
import { CardContent } from "./UI/CardContent";
import { RoomCard } from "./Components/RoomComponents/RoomCard";
import { UserAvatar } from "./Components/UserComponents/UserAvatar";
import { UserCard } from "./Components/UserComponents/UserCard";
import { MediaControls } from "./Components/UIComponents/MediaControls";
import { VoiceControls } from "./Components/UIComponents/VoiceControls";
import { NavigationBar } from "./Components/UIComponents/NavigationBar";
import { ChatMessage } from "./Components/ChatComponents/ChatMessage";
import { ChatInput } from "./Components/ChatComponents/ChatInput";
// Dark Neon Design System
const theme = {
  colors: {
    primary: {
      50: '#f0f9ff',
      100: '#e0f2fe', 
      400: '#38bdf8',
      500: '#0ea5e9',
      600: '#0284c7',
      700: '#0369a1',
      900: '#0c4a6e'
    },
    secondary: {
      50: '#fdf4ff',
      100: '#fae8ff',
      400: '#c084fc',
      500: '#a855f7',
      600: '#9333ea',
      700: '#7c3aed'
    },
    tertiary: {
      50: '#ecfdf5',
      100: '#d1fae5',
      400: '#4ade80',
      500: '#10b981',
      600: '#059669',
      700: '#047857'
    },
    accent: {
      pink: '#f472b6',
      cyan: '#22d3ee',
      orange: '#fb923c'
    }
  }
};


export default function UILibraryDemo() {
  const [activeTab, setActiveTab] = useState('rooms');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(50);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(false);

  const sampleUsers = [
    { id: 1, name: 'Alice Johnson', status: 'online', activity: 'In Living Room' },
    { id: 2, name: 'Bob Smith', status: 'away', activity: 'Gaming' },
    { id: 3, name: 'Carol Davis', status: 'busy', activity: 'Watching Movies' }
  ];

  const sampleRooms = [
    { id: 1, name: 'Living Room', occupants: 5, activity: 'Chatting', isPrivate: false },
    { id: 2, name: 'Game Room', occupants: 3, activity: 'Playing Chess', isPrivate: false },
    { id: 3, name: 'Movie Theater', occupants: 8, activity: 'Watching Film', isPrivate: true },
    { id: 4, name: 'Study Hall', occupants: 2, activity: 'Working', isPrivate: false }
  ];

  const sampleMessages = [
    { id: 1, user: { name: 'Alice', avatar: null }, text: 'Hey everyone! How\'s it going?', timestamp: '2:30 PM', isOwn: false },
    { id: 2, user: { name: 'You', avatar: null }, text: 'Great! Just joined this room.', timestamp: '2:31 PM', isOwn: true },
    { id: 3, user: { name: 'Bob', avatar: null }, text: 'Welcome! We were just discussing the new features.', timestamp: '2:32 PM', isOwn: false }
  ];

  return (
    <div className="min-h-screen bg-black text-gray-100 p-6">
      {/* Add some CSS for custom slider styling */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          background: #22d3ee;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 0 10px rgba(34, 211, 238, 0.5);
        }
        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          background: #22d3ee;
          border-radius: 50%;
          cursor: pointer;
          border: none;
          box-shadow: 0 0 10px rgba(34, 211, 238, 0.5);
        }
      `}</style>
      
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            Virtual Space UI Library
          </h1>
          <p className="text-xl text-gray-400">Dark neon theme for your socket-based broadcasting app</p>
        </div>

        {/* Color Palette */}
        <Card glow>
          <CardHeader>
            <h2 className="text-2xl font-bold text-gray-100">Dark Neon Color Palette</h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <h3 className="font-semibold text-gray-300 mb-3">Primary (Cyan)</h3>
                <div className="flex space-x-2">
                  <div className="w-12 h-12 bg-cyan-500 rounded border border-cyan-400 shadow-lg shadow-cyan-500/50"></div>
                  <div className="w-12 h-12 bg-cyan-400 rounded border border-cyan-300 shadow-lg shadow-cyan-400/50"></div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-300 mb-3">Secondary (Purple)</h3>
                <div className="flex space-x-2">
                  <div className="w-12 h-12 bg-purple-500 rounded border border-purple-400 shadow-lg shadow-purple-500/50"></div>
                  <div className="w-12 h-12 bg-purple-400 rounded border border-purple-300 shadow-lg shadow-purple-400/50"></div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-300 mb-3">Tertiary (Emerald)</h3>
                <div className="flex space-x-2">
                  <div className="w-12 h-12 bg-emerald-500 rounded border border-emerald-400 shadow-lg shadow-emerald-500/50"></div>
                  <div className="w-12 h-12 bg-emerald-400 rounded border border-emerald-300 shadow-lg shadow-emerald-400/50"></div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-300 mb-3">Accent Colors</h3>
                <div className="flex space-x-2">
                  <div className="w-12 h-12 bg-pink-400 rounded border border-pink-300 shadow-lg shadow-pink-400/50"></div>
                  <div className="w-12 h-12 bg-orange-400 rounded border border-orange-300 shadow-lg shadow-orange-400/50"></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Typography */}
        <Card glow>
          <CardHeader>
            <h2 className="text-2xl font-bold text-gray-100">Typography</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Neon Heading 1</div>
            <div className="text-3xl font-semibold text-gray-200">Heading 2 - Semibold</div>
            <div className="text-2xl font-semibold text-gray-300">Heading 3 - Semibold</div>
            <div className="text-base text-gray-400">Body Text - Regular 16px</div>
            <div className="text-sm text-gray-500">Small Text - Regular 14px</div>
          </CardContent>
        </Card>

        {/* Buttons */}
        <Card glow>
          <CardHeader>
            <h2 className="text-2xl font-bold text-gray-100">Neon Buttons</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-3">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="tertiary">Tertiary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="danger">Danger</Button>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
                <Button size="xl">Extra Large</Button>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button icon={<Plus className="w-4 h-4" />}>With Icon</Button>
                <Button disabled>Disabled</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <Card glow>
          <CardHeader>
            <h2 className="text-2xl font-bold text-gray-100">Navigation</h2>
          </CardHeader>
          <CardContent>
            <NavigationBar activeTab={activeTab} onTabChange={setActiveTab} />
          </CardContent>
        </Card>

        {/* Form Inputs */}
        <Card glow>
          <CardHeader>
            <h2 className="text-2xl font-bold text-gray-100">Dark Form Inputs</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Room Name" placeholder="Enter room name" />
              <Input 
                label="Search" 
                placeholder="Search rooms..." 
                icon={<Search className="w-4 h-4" />} 
              />
              <Input 
                label="Password" 
                type="password" 
                placeholder="Enter password" 
              />
              <Input 
                label="With Error" 
                placeholder="Invalid input" 
                error="This field is required" 
              />
            </div>
          </CardContent>
        </Card>

        {/* Room Cards */}
        <Card glow>
          <CardHeader>
            <h2 className="text-2xl font-bold text-gray-100">Virtual Room Cards</h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {sampleRooms.map((room) => (
                <RoomCard 
                  key={room.id}
                  name={room.name}
                  occupants={room.occupants}
                  activity={room.activity}
                  isPrivate={room.isPrivate}
                  onClick={() => console.log(`Clicked ${room.name}`)}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* User Components */}
        <Card glow>
          <CardHeader>
            <h2 className="text-2xl font-bold text-gray-100">User Components</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-3 text-gray-300">Neon User Avatars</h3>
                <div className="flex items-center space-x-4">
                  <UserAvatar name="Alice" status="online" size="sm" />
                  <UserAvatar name="Bob" status="away" size="md" />
                  <UserAvatar name="Carol" status="busy" size="lg" />
                  <UserAvatar name="Dave" status="offline" size="xl" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-3 text-gray-300">User Cards</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {sampleUsers.map((user) => (
                    <UserCard 
                      key={user.id} 
                      user={user} 
                      showInvite 
                      onInvite={(user) => console.log(`Invited ${user.name}`)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Media Controls */}
        <Card glow>
          <CardHeader>
            <h2 className="text-2xl font-bold text-gray-100">Media Controls</h2>
          </CardHeader>
          <CardContent>
            <MediaControls 
              isPlaying={isPlaying}
              isMuted={isMuted}
              volume={volume}
              onPlayPause={() => setIsPlaying(!isPlaying)}
              onMute={() => setIsMuted(!isMuted)}
              onVolumeChange={setVolume}
            />
          </CardContent>
        </Card>

        {/* Voice Controls */}
        <Card glow>
          <CardHeader>
            <h2 className="text-2xl font-bold text-gray-100">Voice/Video Controls</h2>
          </CardHeader>
          <CardContent>
            <VoiceControls 
              isMicOn={isMicOn}
              isCameraOn={isCameraOn}
              onToggleMic={() => setIsMicOn(!isMicOn)}
              onToggleCamera={() => setIsCameraOn(!isCameraOn)}
              onLeave={() => console.log('Left room')}
            />
          </CardContent>
        </Card>

        {/* Chat Components */}
        <Card glow>
          <CardHeader>  
            <h2 className="text-2xl font-bold text-gray-100">Dark Chat System</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="bg-gray-800 rounded-lg p-4 max-h-64 overflow-y-auto border border-gray-700">
                {sampleMessages.map((message) => (
                  <ChatMessage key={message.id} message={message} isOwn={message.isOwn} />
                ))}{sampleMessages.map((message) => (
                  <ChatMessage key={message.id} message={message} isOwn={message.isOwn} />
                ))}
              </div>
              <ChatInput onSend={(message) => console.log('Sent:', message)} />
            </div>
          </CardContent>
        </Card>

        {/* Modal/Dialog Example */}
        <Card glow>
          <CardHeader>
            <h2 className="text-2xl font-bold text-gray-100">Modal & Dialogs</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button onClick={() => console.log('Open modal')}>Open Modal</Button>
              {/* Mock modal preview */}
              <div className="bg-gray-800 border border-cyan-500/30 rounded-lg p-6 shadow-2xl shadow-cyan-500/20">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-100">Create New Room</h3>
                  <Button variant="ghost" size="sm" icon={<X className="w-4 h-4" />} />
                </div>
                <div className="space-y-4">
                  <Input label="Room Name" placeholder="Enter room name" />
                  <Input label="Description" placeholder="What's this room for?" />
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded bg-gray-700 border-gray-600" />
                    <label className="text-sm text-gray-300">Make room private</label>
                  </div>
                  <div className="flex space-x-2 pt-2">
                    <Button variant="primary">Create Room</Button>
                    <Button variant="ghost">Cancel</Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notification/Toast Components */}
        <Card glow>
          <CardHeader>
            <h2 className="text-2xl font-bold text-gray-100">Notifications & Toasts</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {/* Success Toast */}
              <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-lg p-4 flex items-center space-x-3">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <div className="flex-1">
                  <p className="text-emerald-300 font-medium">Room created successfully!</p>
                  <p className="text-emerald-400/80 text-sm">You can now invite people to join.</p>
                </div>
                <Button variant="ghost" size="sm" icon={<X className="w-4 h-4" />} className="text-emerald-400" />
              </div>
              
              {/* Error Toast */}
              <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 flex items-center space-x-3">
                <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                <div className="flex-1">
                  <p className="text-red-300 font-medium">Connection failed</p>
                  <p className="text-red-400/80 text-sm">Please check your internet connection.</p>
                </div>
                <Button variant="ghost" size="sm" icon={<X className="w-4 h-4" />} className="text-red-400" />
              </div>

              {/* Info Toast */}
              <div className="bg-cyan-500/20 border border-cyan-500/30 rounded-lg p-4 flex items-center space-x-3">
                <Bell className="w-5 h-5 text-cyan-400" />
                <div className="flex-1">
                  <p className="text-cyan-300 font-medium">New user joined the building</p>
                  <p className="text-cyan-400/80 text-sm">Alice Johnson is now online.</p>
                </div>
                <Button variant="ghost" size="sm" icon={<X className="w-4 h-4" />} className="text-cyan-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Loading States */}
        <Card glow>
          <CardHeader>
            <h2 className="text-2xl font-bold text-gray-100">Loading States</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Spinner */}
              <div className="flex items-center space-x-4">
                <div className="w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-gray-300">Loading...</span>
              </div>
              
              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">Uploading media...</span>
                  <span className="text-cyan-400">73%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-gradient-to-r from-cyan-500 to-purple-500 h-2 rounded-full shadow-lg shadow-cyan-500/30" style={{width: '73%'}}></div>
                </div>
              </div>

              {/* Skeleton Loading */}
              <div className="space-y-3">
                <div className="animate-pulse">
                  <div className="flex space-x-3">
                    <div className="w-10 h-10 bg-gray-700 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-700 rounded w-1/4"></div>
                      <div className="h-3 bg-gray-700 rounded w-3/4"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Usage Instructions */}
        <Card glow>
          <CardHeader>
            <h2 className="text-2xl font-bold text-gray-100">Usage Instructions</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <h3 className="font-semibold text-cyan-400 mb-2">Installation & Setup</h3>
              <p className="text-gray-300 text-sm mb-2">This UI library is built with React and Tailwind CSS. Make sure you have both installed:</p>
              <code className="block bg-gray-900 p-3 rounded text-cyan-300 text-sm">
                npm install react lucide-react
              </code>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <h3 className="font-semibold text-cyan-400 mb-2">Key Features</h3>
              <ul className="space-y-1 text-gray-300 text-sm">
                <li>• Dark neon theme perfect for virtual spaces</li>
                <li>• Fully responsive components</li>
                <li>• Socket.io ready with real-time states</li>
                <li>• Customizable color system</li>
                <li>• Accessibility focused</li>
                <li>• Modern glassmorphism effects</li>
              </ul>
            </div>

            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <h3 className="font-semibold text-cyan-400 mb-2">Component Structure</h3>
              <p className="text-gray-300 text-sm">
                All components are designed for your virtual building/house concept with rooms, users, media sharing, and real-time interactions. 
                Each component includes hover effects, loading states, and neon glow effects for that futuristic feel.
              </p>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}