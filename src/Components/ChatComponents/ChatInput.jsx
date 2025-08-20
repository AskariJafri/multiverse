import { Button } from "../../UI/Button";
import { useState, useRef, useEffect } from "react";

export const ChatInput = ({ onSend, placeholder = "Type a message..." }) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef(null);
  
  const handleSend = () => {
    if (message.trim()) {
      onSend(message);
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const scrollHeight = textarea.scrollHeight;
      const maxHeight = 120; // Max height in pixels (about 5-6 lines)
      textarea.style.height = Math.min(scrollHeight, maxHeight) + 'px';
      textarea.style.overflowY = scrollHeight > maxHeight ? 'auto' : 'hidden';
    }
  }, [message]);
  
  return (
    <div className="flex gap-2 sm:gap-3 items-start min-w-0">
      <div className="flex-1 min-w-0">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={placeholder}
          className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-gray-100 placeholder-gray-500 resize-none overflow-hidden text-sm sm:text-base leading-relaxed min-h-[40px] sm:min-h-[48px] max-w-full break-words"
          onKeyPress={handleKeyPress}
          rows="1"
          style={{ 
            wordWrap: 'break-word',
            overflowWrap: 'break-word'
          }}
        />
      </div>
      <div className="flex-shrink-0">
        <Button 
          onClick={handleSend}
          disabled={!message.trim()}
          className="h-[40px] sm:h-[48px] px-4 sm:px-6 text-sm sm:text-base whitespace-nowrap"
        >
          Send
        </Button>
      </div>
    </div>
  );
};