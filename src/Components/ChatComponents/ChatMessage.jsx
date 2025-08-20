import { UserAvatar } from "../UserComponents/UserAvatar";


export const ChatMessage = ({ message, isOwn = false }) => (
  <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
    {!isOwn && (
      <UserAvatar name={message.user.name} avatar={message.user.avatar} size="sm" className="mr-3" />
    )}
    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
      isOwn 
        ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-gray-900 shadow-lg shadow-cyan-500/25' 
        : 'bg-gray-800 text-gray-100 border border-gray-700'
    }`}>
      {!isOwn && (
        <p className="text-xs font-medium mb-1 text-gray-400">{message.user.name}</p>
      )}
      <p className="text-sm">{message.text}</p>
      <p className={`text-xs mt-1 ${isOwn ? 'text-gray-800' : 'text-gray-500'}`}>
        {message.timestamp}
      </p>
    </div>
    {isOwn && (
      <UserAvatar name={message.user.name} avatar={message.user.avatar} size="sm" className="ml-3" />
    )}
  </div>
);
