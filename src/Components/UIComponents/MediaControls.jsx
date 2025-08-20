import { Card } from "../../UI/Card";
import { Button } from "../../UI/Button";
import { Play, Pause, Volume2, VolumeX, Share } from "lucide-react";
export const MediaControls = ({ 
  isPlaying = false, 
  isMuted = false, 
  volume = 50,
  onPlayPause,
  onMute,
  onVolumeChange 
}) => (
  <Card className="p-4 bg-gradient-to-r from-gray-900 to-gray-800 border-gray-700">
    <div className="flex items-center space-x-4">
      <Button 
        variant="ghost" 
        size="sm"
        icon={isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        onClick={onPlayPause}
        className="hover:text-cyan-400"
      />
      <Button 
        variant="ghost" 
        size="sm"
        icon={isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        onClick={onMute}
        className="hover:text-cyan-400"
      />
      <div className="flex-1 relative">
        <input 
          type="range" 
          min="0" 
          max="100" 
          value={volume}
          onChange={(e) => onVolumeChange(e.target.value)}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
          style={{
            background: `linear-gradient(to right, #22d3ee 0%, #22d3ee ${volume}%, #374151 ${volume}%, #374151 100%)`
          }}
        />
      </div>
      <Button variant="ghost" size="sm" icon={<Share className="w-4 h-4" />} className="hover:text-cyan-400" />
    </div>
  </Card>
);
