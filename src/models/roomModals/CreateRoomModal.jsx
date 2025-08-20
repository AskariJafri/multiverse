import { X } from "lucide-react";
import { Button } from "../../UI/Button";
import { Input } from "../../UI/Input";
import { Card } from "../../UI/Card";
import { CardHeader } from "../../UI/CardHeader";
import { CardContent } from "../../UI/CardContent";
import { useAppStore } from "../../store/appStore";
import { useState } from "react";
import { useHouseActions } from "../../hooks/stateHooks";
import { useHouseStore } from "../../store/houseStore"; 

export default function CreateRoomModal() {
  // Check if modal open from app store modals
  const isOpen = useAppStore((state) => state.modals.createRoom?.isOpen);
  const { addToast } = useAppStore((state) => state.actions);
  const closeModal = () => useAppStore.getState().actions.closeModal("createRoom");

  // Access the current houseId and the addRoomToHouse action
  const currentHouseId = useHouseStore((state) => state.currentHouseId);
  const addRoomToHouse = useHouseStore((state) => state.addRoomToHouse);

  const [roomName, setRoomName] = useState("");
  const [description, setDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [maxOccupants, setMaxOccupants] = useState(10);

  if (!isOpen) return null;

  const onCreateRoom = () => {
    if (!roomName.trim()) {
      alert("Room name is required!");
      return;
    }

    if (!currentHouseId) {
      alert("No house selected");
      return;
    }

    addRoomToHouse(currentHouseId, {
      name: roomName.trim(),
      description: description.trim(),
      maxOccupants: parseInt(maxOccupants, 10),
      isPrivate: isPrivate,
      // optionally add status or activity if you want defaults
    });

    addToast({ type: "success", message: `Room "${roomName}" created!` });

    setRoomName("");
    setDescription("");
    setIsPrivate(false);
    closeModal();
  };
  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center px-4">
      <Card glow className="max-w-md w-full">
        <CardHeader className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-100">Create New Room</h3>
          <Button variant="ghost" size="sm" icon={<X className="w-4 h-4" />} onClick={closeModal} />
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            label="Room Name"
            placeholder="Enter room name"
            value={roomName}
            onChange={e => setRoomName(e.target.value)}
          />
          <Input
            label="Description"
            placeholder="What's this room for?"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={isPrivate}
              onChange={e => setIsPrivate(e.target.checked)}
              className="rounded bg-gray-700 border-gray-600"
              id="privateCheckbox"
            />
            <label htmlFor="privateCheckbox" className="text-sm text-gray-300">
              Make room private
            </label>
          </div>
          <Input
            label="Max Occupants"
            placeholder="Max Occupants Per Room?"
            value={maxOccupants}
            onChange={e => setMaxOccupants(e.target.value)}
          />
          <div className="flex space-x-2 pt-2">
            <Button variant="primary" onClick={onCreateRoom}>
              Create Room
            </Button>
            <Button variant="ghost" onClick={closeModal}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
