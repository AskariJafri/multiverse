import { useState } from 'react';
import { Play, StopCircle, UploadCloud, Edit, Monitor, Mic, Camera, FileText, Image, Music, Video, Users, Share2, Settings } from 'lucide-react';

export const MediaSharing = ({ isBroadcasting = false }) => {
  const [overview, setOverview] = useState(
    'Welcome to the Living Room! This is your room overview. You can describe the purpose of this room, link docs, or leave notes for participants.'
  );
  const [isEditing, setIsEditing] = useState(false);
  const [shareType, setShareType] = useState('screen'); // 'screen', 'camera', 'audio', 'file'
  const [showShareOptions, setShowShareOptions] = useState(false);

  const handleSave = () => setIsEditing(false);

  const shareOptions = [
    { key: 'screen', label: 'Share Screen', icon: Monitor, color: 'cyan' },
    { key: 'camera', label: 'Share Camera', icon: Camera, color: 'purple' },
    { key: 'audio', label: 'Share Audio', icon: Mic, color: 'green' },
    { key: 'file', label: 'Share File', icon: FileText, color: 'blue' },
  ];

  const recentFiles = [
    { name: 'Presentation.pptx', type: 'presentation', size: '2.4 MB', icon: FileText },
    { name: 'Demo_Video.mp4', type: 'video', size: '15.2 MB', icon: Video },
    { name: 'Background_Music.mp3', type: 'audio', size: '4.1 MB', icon: Music },
    { name: 'Screenshot.png', type: 'image', size: '890 KB', icon: Image },
  ];

  const getColorClasses = (color) => {
    const colorMap = {
      cyan: 'border-cyan-500/50 bg-cyan-500/10 text-cyan-400',
      purple: 'border-purple-500/50 bg-purple-500/10 text-purple-400',
      green: 'border-green-500/50 bg-green-500/10 text-green-400',
      blue: 'border-blue-500/50 bg-blue-500/10 text-blue-400',
    };
    return colorMap[color] || colorMap.cyan;
  };

  return (
    <div className="flex flex-col space-y-6 h-full bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${isBroadcasting ? 'bg-red-500/20 text-red-400' : 'bg-cyan-500/20 text-cyan-400'}`}>
            {isBroadcasting ? <StopCircle className="w-6 h-6" /> : <Share2 className="w-6 h-6" />}
          </div>
          <div>
            <h3 className="text-xl font-semibold text-cyan-400">
              {isBroadcasting ? 'Live Broadcasting' : 'Media Sharing'}
            </h3>
            <p className="text-sm text-gray-400">
              {isBroadcasting ? 'You are currently sharing content' : 'Share your screen, files, or media'}
            </p>
          </div>
        </div>
        
        {isBroadcasting && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/20 rounded-full border border-red-500/30">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-red-400 text-sm font-medium">LIVE</span>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-grow bg-gray-900/50 border border-gray-700/30 rounded-xl overflow-hidden">
        {isBroadcasting ? (
          // Broadcasting View
          <div className="h-full flex flex-col">
            <div className="flex-grow bg-black rounded-t-xl flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10"></div>
              <div className="relative z-10 text-center space-y-4">
                <div className="w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto">
                  <Play className="w-8 h-8 text-cyan-500 animate-pulse" />
                </div>
                <div>
                  <h4 className="text-lg font-medium text-white mb-2">Broadcasting {shareType}</h4>
                  <p className="text-gray-400 text-sm">Your content is being shared with participants</p>
                </div>
              </div>
              
              {/* Broadcast controls overlay */}
              <div className="absolute top-4 right-4 flex gap-2">
                <button className="p-2 bg-gray-900/80 rounded-lg text-gray-300 hover:text-cyan-400 transition-colors">
                  <Settings className="w-4 h-4" />
                </button>
                <button 
                  className="px-4 py-2 bg-red-600/80 hover:bg-red-600 rounded-lg text-white font-medium transition-all duration-200 flex items-center gap-2"
                  onClick={() => {/* Handle stop sharing */}}
                >
                  <StopCircle className="w-4 h-4" />
                  Stop Sharing
                </button>
              </div>
            </div>
            
            {/* Broadcast stats */}
            <div className="p-4 bg-gray-800/50 border-t border-gray-700/30 rounded-b-xl">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Users className="w-4 h-4" />
                    <span>3 watching</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <Monitor className="w-4 h-4" />
                    <span>1080p quality</span>
                  </div>
                </div>
                <div className="text-green-400 font-medium">
                  Connected
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Share Selection View
          <div className="p-6 h-full flex flex-col">
            {/* Share options */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {shareOptions.map(({ key, label, icon: Icon, color }) => {
                const isSelected = shareType === key;
                return (
                  <button
                    key={key}
                    onClick={() => {
                      setShareType(key);
                      setShowShareOptions(true);
                    }}
                    className={`p-4 border rounded-xl transition-all duration-200 group ${
                      isSelected 
                        ? getColorClasses(color)
                        : 'border-gray-700/50 hover:border-gray-600 hover:bg-gray-800/30'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div className={`p-3 rounded-lg ${
                        isSelected 
                          ? `bg-${color}-500/20` 
                          : 'bg-gray-700/50 group-hover:bg-gray-600/50'
                      }`}>
                        <Icon className={`w-6 h-6 ${
                          isSelected 
                            ? `text-${color}-400` 
                            : 'text-gray-400 group-hover:text-gray-300'
                        }`} />
                      </div>
                      <span className={`font-medium ${
                        isSelected 
                          ? `text-${color}-400` 
                          : 'text-gray-300 group-hover:text-white'
                      }`}>
                        {label}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Upload area */}
            <div className="border-2 border-dashed border-gray-700/50 rounded-xl p-8 text-center mb-6 hover:border-gray-600/50 transition-colors">
              <div className="flex flex-col items-center gap-4">
                <div className="p-4 bg-gray-700/30 rounded-full">
                  <UploadCloud className="w-8 h-8 text-gray-400" />
                </div>
                <div>
                  <p className="text-gray-300 font-medium mb-1">Drop files here or click to browse</p>
                  <p className="text-gray-500 text-sm">Support for images, videos, audio, and documents</p>
                </div>
                <button className="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-medium transition-colors">
                  Choose Files
                </button>
              </div>
            </div>

            {/* Recent files */}
            <div className="flex-grow">
              <h4 className="text-gray-300 font-medium mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Recent Files
              </h4>
              <div className="space-y-2">
                {recentFiles.map((file, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-3 p-3 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors cursor-pointer border border-gray-700/30 hover:border-gray-600/50"
                  >
                    <div className="p-2 bg-gray-700/50 rounded-lg">
                      <file.icon className="w-4 h-4 text-gray-400" />
                    </div>
                    <div className="flex-grow">
                      <p className="text-gray-300 font-medium text-sm">{file.name}</p>
                      <p className="text-gray-500 text-xs">{file.size}</p>
                    </div>
                    <button className="p-2 text-gray-400 hover:text-cyan-400 transition-colors">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 mt-6 pt-4 border-t border-gray-700/30">
              <button 
                className="flex-1 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                onClick={() => {/* Handle start sharing */}}
              >
                <Play className="w-4 h-4" />
                Start Sharing
              </button>
              <button className="px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700/50 transition-colors">
                Settings
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Room Overview Section */}
      <div className="bg-gray-900/30 border border-gray-700/30 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-gray-300 font-medium flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Room Overview
          </h4>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="p-1.5 text-gray-400 hover:text-cyan-400 transition-colors"
          >
            <Edit className="w-4 h-4" />
          </button>
        </div>
        
        {isEditing ? (
          <div className="space-y-3">
            <textarea
              value={overview}
              onChange={(e) => setOverview(e.target.value)}
              className="w-full p-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-gray-300 resize-none focus:outline-none focus:border-cyan-500/50"
              rows={3}
              placeholder="Describe your room's purpose..."
            />
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-700 text-white text-sm rounded-lg transition-colors"
              >
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-3 py-1.5 border border-gray-600 text-gray-300 text-sm rounded-lg hover:bg-gray-700/50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <p className="text-gray-400 text-sm leading-relaxed">{overview}</p>
        )}
      </div>
    </div>
  );
};

// Demo component to show both states
export default function MediaSharingDemo() {
  const [isBroadcasting, setIsBroadcasting] = useState(false);

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-white">Media Sharing Component</h1>
          <p className="text-gray-400">Toggle between sharing and broadcasting states</p>
          <button
            onClick={() => setIsBroadcasting(!isBroadcasting)}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-medium transition-colors"
          >
            {isBroadcasting ? 'Stop Broadcasting' : 'Start Broadcasting'}
          </button>
        </div>
        
        <div className="h-[600px]">
          <MediaSharing isBroadcasting={isBroadcasting} />
        </div>
      </div>
    </div>
  );
}