import React from 'react';

const ArenaHeader = ({ isLoading }) => {
  return (
    <header className="min-h-16 border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md flex items-center justify-between px-8 select-none">
      <div className="flex items-center gap-3">
        <span className="text-[14px] font-semibold text-zinc-100 tracking-wide font-sans">Arena Chat</span>
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-emerald-950 bg-emerald-950/30">
          <span className={`w-1.5 h-1.5 rounded-full bg-emerald-500 ${isLoading ? 'animate-pulse' : ''}`} />
          <span className="text-[10px] font-medium text-emerald-400 uppercase tracking-wide">
            {isLoading ? 'Processing' : 'Ready'}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          className="w-8 h-8 rounded-md flex items-center justify-center text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 border border-transparent hover:border-zinc-800 transition-all cursor-pointer"
          title="Settings"
          id="settings-btn"
        >
          ⚙️
        </button>
      </div>
    </header>
  );
};

export default ArenaHeader;
