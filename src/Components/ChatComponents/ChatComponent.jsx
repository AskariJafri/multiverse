import { ChatInput } from "./ChatInput"
import { ChatMessage } from "./ChatMessage"
import { MessageSquare} from 'lucide-react';

export const ChatComponent = ({messages, handleSend, chatEndRef, roomInfo}) => {
  return (
    <div className="flex flex-col bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 sm:p-6 h-full shadow-xl max-w-full">
        {messages.length === 0 ? (
            <div className="flex-grow flex items-center justify-center px-4">
                <div className="text-center space-y-3 max-w-sm">
                    <MessageSquare className="w-12 h-12 sm:w-16 sm:h-16 text-gray-600 mx-auto" />
                    <p className="text-gray-400 text-base sm:text-lg">No messages yet in {roomInfo?.name || 'this room'}</p>
                    <p className="text-gray-500 text-sm">
                        {roomInfo?.description ? 
                            `${roomInfo.description} - Start the conversation!` : 
                            'Start the conversation!'
                        }
                    </p>
                    {roomInfo?.id && (
                        <p className="text-gray-600 text-xs">Room: {roomInfo.id}</p>
                    )}
                </div>
            </div>
        ) : (
            <div className="flex-grow overflow-y-auto overflow-x-hidden pr-1 sm:pr-2 space-y-3 sm:space-y-4 scrollbar-thin scrollbar-thumb-cyan-600/50 scrollbar-track-transparent min-w-0">
                {/* Room info header for non-empty chats */}
                {roomInfo?.name && (
                    <div className="text-center py-2 border-b border-gray-700/30 mb-4">
                        <div className="text-sm text-gray-400">
                            Chat in <span className="text-cyan-400 font-medium">{roomInfo.name}</span>
                        </div>
                        {roomInfo.description && (
                            <div className="text-xs text-gray-500 mt-1">{roomInfo.description}</div>
                        )}
                    </div>
                )}
                
                {messages.map((msg) => (
                    <div key={msg.id} className="min-w-0 w-full">
                        <ChatMessage message={msg} isOwn={msg.isOwn} />
                    </div>
                ))}
                <div ref={chatEndRef} />
            </div>
        )}
        <div className="mt-4 sm:mt-6 border-t border-gray-700/50 pt-3 sm:pt-4 min-w-0">
            <ChatInput 
                onSend={handleSend} 
                placeholder={`Message in ${roomInfo?.name || 'this room'}...`}
            />
        </div>
    </div>
  )
}