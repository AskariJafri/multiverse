import { useState } from 'react';
import { Mic, MicOff, Camera, CameraOff, PhoneOff, Volume2, VolumeX } from "lucide-react";
import { useEffect } from 'react';
export const VoiceControls = ({ 
  isMicOn = true, 
  isCameraOn = false,
  isSpeakerOn = true,
  onToggleMic,
  onToggleCamera,
  onToggleSpeaker,
  onLeave 
}) => {
  const [micLevel, setMicLevel] = useState(0);

  // Simulate mic level animation when mic is on
  useEffect(() => {
    if (isMicOn) {
      const interval = setInterval(() => {
        setMicLevel(Math.random() * 100);
      }, 150);
      return () => clearInterval(interval);
    }
  }, [isMicOn]);

  const controlButtons = [
    {
      icon: isMicOn ? Mic : MicOff,
      isActive: isMicOn,
      onClick: onToggleMic,
      tooltip: isMicOn ? 'Mute mic' : 'Unmute mic',
      color: isMicOn ? 'emerald' : 'red'
    },
    {
      icon: isCameraOn ? Camera : CameraOff,
      isActive: isCameraOn,
      onClick: onToggleCamera,
      tooltip: isCameraOn ? 'Stop camera' : 'Start camera',
      color: isCameraOn ? 'emerald' : 'gray'
    },
    {
      icon: isSpeakerOn ? Volume2 : VolumeX,
      isActive: isSpeakerOn,
      onClick: onToggleSpeaker,
      tooltip: isSpeakerOn ? 'Mute speaker' : 'Unmute speaker',
      color: isSpeakerOn ? 'gray' : 'red'
    },
    {
      icon: PhoneOff,
      isActive: false,
      onClick: onLeave,
      tooltip: 'Leave room',
      color: 'red',
      isLeave: true
    }
  ];

  return (
    <div className="flex items-center gap-2">
      {/* Mic level indicator */}
      {isMicOn && (
        <div className="w-8 h-1 bg-gray-700/50 rounded-full overflow-hidden mr-1">
          <div 
            className="h-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all duration-150 rounded-full"
            style={{ width: `${micLevel}%` }}
          />
        </div>
      )}

      {controlButtons.map((btn, index) => {
        const Icon = btn.icon;
        const getButtonStyles = () => {
          if (btn.isLeave) {
            return 'bg-red-600/20 hover:bg-red-600/30 text-red-400 border-red-500/30 hover:border-red-400/50';
          }
          if (btn.isActive && btn.color === 'emerald') {
            return 'bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border-emerald-500/30 hover:border-emerald-400/50';
          }
          if (!btn.isActive && btn.color === 'red') {
            return 'bg-red-600/20 hover:bg-red-600/30 text-red-400 border-red-500/30 hover:border-red-400/50';
          }
          return 'bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 hover:text-white border-gray-600/50 hover:border-gray-500/50';
        };

        return (
          <div key={index} className="relative group">
            <button
              onClick={btn.onClick}
              className={`p-2 rounded-lg border transition-all duration-200 transform hover:scale-105 ${getButtonStyles()}`}
              title={btn.tooltip}
            >
              <Icon className="w-4 h-4" />
            </button>
            
            {/* Tooltip */}
            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-800 text-xs text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-gray-700/50">
              {btn.tooltip}
            </div>
          </div>
        );
      })}
    </div>
  );
};
