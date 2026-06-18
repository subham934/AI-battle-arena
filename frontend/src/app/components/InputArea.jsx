import React, { useRef, useEffect } from 'react';

const InputArea = ({ input, setInput, onSend, onKeyDown, isLoading }) => {
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [input]);

  const handleInput = (e) => {
    setInput(e.target.value);
  };

  return (
    <div className="w-full bg-zinc-950 select-none">
      <div className="max-w-[900px] mx-auto px-8 pb-8 pt-2">
        <div className="flex flex-col gap-2 border border-zinc-800 rounded-lg p-3 bg-zinc-900 focus-within:border-zinc-700 focus-within:shadow-sm transition-all">
          <textarea
            ref={textareaRef}
            id="chat-input"
            rows={1}
            value={input}
            onChange={handleInput}
            onKeyDown={onKeyDown}
            disabled={isLoading}
            placeholder="Ask a coding question to run a battle..."
            className="w-full text-[13.5px] text-zinc-200 placeholder-zinc-500 bg-transparent resize-none border-none outline-none leading-relaxed py-1 min-h-[24px]"
            style={{ maxHeight: '120px' }}
          />
          <div className="flex items-center justify-between pt-2 border-t border-zinc-800/40">
            <span className="text-[10px] font-mono text-zinc-500 tracking-wide">
              Press Enter to send · Shift+Enter for new line
            </span>
            <button
              id="battle-btn"
              onClick={onSend}
              disabled={isLoading || !input.trim()}
              className="px-4 py-1.5 rounded bg-zinc-100 hover:bg-zinc-200 text-zinc-950 text-[12px] font-medium tracking-wide transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1.5"
            >
              {isLoading ? 'Processing...' : 'Battle'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InputArea;
