import { useState } from 'react';
import { Edit3, Save } from 'lucide-react';
import { useHouseStore } from '../../Store/HouseStore';
export const RoomOverview = ({ initialOverview = '' ,setOverview,currentRoom}) => {
  
  const [isEditing, setIsEditing] = useState(false);
  const {updateCurrentRoomDescription} = useHouseStore();
  // const [overviewText, setOverviewText] = useState(
  //   initialOverview 
  // );
  console.log("room in overview",currentRoom.description)
  const handleSave = () => {
    setIsEditing(false);
    // Optional: trigger onSave(overviewText) via props
  };
  console.log("overviewText", initialOverview)
  return (
    <div className="flex flex-col h-full space-y-4">
     

      <div className="flex-1 bg-gray-900 border border-gray-700 rounded-lg p-4 overflow-auto">
         <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-cyan-400 mb-4 ">Room Overview</h3>
        <button
          onClick={() => setIsEditing((prev) => !prev)}
          className="text-sm px-3 py-1 flex items-center gap-1 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded"
        >
          {isEditing ? <Save size={14} /> : <Edit3 size={14} />}
          {isEditing ? 'Save' : 'Edit'}
        </button>
      </div>
        {isEditing ? (
          <textarea
            className="w-full h-full bg-gray-800 border border-gray-600 rounded p-2 text-sm text-gray-200 resize-none focus:ring-2 focus:ring-purple-500 outline-none"
            value={currentRoom.description}
            onChange={(e) => updateCurrentRoomDescription(e.target.value)}
          />
        ) : (
          <p className="text-sm text-gray-300 whitespace-pre-line">{currentRoom.description}</p>
        )}
      </div>
    </div>
  );
};
