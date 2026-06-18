import React, { useEffect, useRef } from 'react';
import BattleCard from './BattleCard';

const WelcomeChips = ({ onChipClick }) => {
  const SUGGESTIONS = [
    'write a code for factorial function in JS',
    'Explain binary search in Python',
    'Center a div in Tailwind CSS',
    'Optimize a SQL JOIN query'
  ];

  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-6 max-w-lg mx-auto select-none">
      <div className="w-12 h-12 rounded-full border border-zinc-800 flex items-center justify-center text-lg bg-zinc-900 text-zinc-500 mb-6 shadow-sm">
        ⚔️
      </div>
      <h2 className="text-lg font-semibold text-zinc-100 tracking-wide mb-2">AI Chat Arena</h2>
      <p className="text-[13px] text-zinc-400 leading-relaxed mb-8">
        Submit a coding task to compare two different AI solutions. The judge will analyze both and rank them.
      </p>
      <div className="flex flex-wrap gap-2 justify-center">
        {SUGGESTIONS.map((chip) => (
          <button
            key={chip}
            onClick={() => onChipClick(chip)}
            className="px-3 py-1.5 rounded-full border border-zinc-800 hover:border-zinc-700 text-[12px] text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800/80 transition-all cursor-pointer"
          >
            {chip}
          </button>
        ))}
      </div>
    </div>
  );
};

const ChatArea = ({ messages, isLoading, onChipClick }) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto w-full bg-zinc-950" id="chat-area">
      <div className="max-w-225 mx-auto px-8 py-8 flex flex-col gap-10">
        {messages.length === 0 && !isLoading ? (
          <WelcomeChips onChipClick={onChipClick} />
        ) : (
          <>
            {messages.map((msg) => (
              <div key={msg.id} className="flex flex-col gap-6 w-full animate-[fadeIn_0.3s_ease-out]">
                {msg.type === 'user' && (
                  <div className="flex justify-end select-text">
                    <div className="max-w-[70%] bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-3 text-[13.5px] text-zinc-200 leading-relaxed">
                      {msg.text}
                    </div>
                  </div>
                )}
                {msg.type === 'battle' && (
                  <div className="w-full">
                    <BattleCard data={msg.data} />
                  </div>
                )}
                {msg.type === 'error' && (
                  <div className="flex items-center gap-3 p-4 border border-rose-950 bg-rose-950/20 rounded-lg text-rose-300 select-text">
                    <span className="text-sm">❌</span>
                    <span className="text-xs font-mono">{msg.text}</span>
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex flex-col gap-4 py-4 select-none">
                <div className="flex items-center gap-3 text-zinc-500">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-[bounce_1.2s_infinite_100ms]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-[bounce_1.2s_infinite_200ms]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-[bounce_1.2s_infinite_300ms]" />
                  </div>
                  <span className="text-xs font-mono tracking-wider">AIs are solving & judge is thinking...</span>
                </div>
              </div>
            )}
          </>
        )}
        <div ref={bottomRef} className="h-4" />
      </div>
    </div>
  );
};

export default ChatArea;
