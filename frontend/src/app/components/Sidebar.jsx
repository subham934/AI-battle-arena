import React from 'react';

const Sidebar = ({ history, activeHistoryId, onNewBattle, onSelectHistory }) => {
  return (
    <aside className="w-[240px] min-w-[240px] bg-zinc-900 border-r border-zinc-800/80 flex flex-col h-full select-none">
      {/* Header / Logo */}
      <div className="p-6 border-b border-zinc-800/40 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-5 h-5 rounded bg-emerald-500 flex items-center justify-center text-[10px] text-white font-bold shadow-sm shadow-emerald-500/20">
            A
          </div>
          <span className="font-semibold text-zinc-100 text-[14px] tracking-wide">Arena</span>
        </div>
        <span className="text-[10px] font-mono font-medium text-zinc-500 border border-zinc-800 rounded px-1.5 py-0.5 uppercase tracking-wider scale-95 origin-right">
          v1.0
        </span>
      </div>

      {/* Main Actions & List */}
      <div className="flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-6">
        <button
          onClick={onNewBattle}
          className="w-full py-2 px-4 border border-zinc-800 hover:border-zinc-700 rounded-md text-[13px] font-medium text-zinc-300 hover:bg-zinc-800/60 hover:text-white transition-all cursor-pointer flex items-center justify-center gap-2"
          id="btn-new-battle"
        >
          <span>+</span> New session
        </button>

        <div className="flex flex-col gap-2">
          <span className="text-[10px] font-mono font-semibold uppercase tracking-widest text-zinc-500 px-2">
            History
          </span>
          <div className="flex flex-col gap-1">
            {history.map((item) => (
              <button
                key={item.id}
                onClick={() => onSelectHistory(item.id)}
                className={`w-full text-left px-3 py-2 rounded-md transition-colors text-[13px] flex flex-col gap-0.5 cursor-pointer ${
                  activeHistoryId === item.id
                    ? 'bg-zinc-800 text-zinc-100 font-medium'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/30'
                }`}
                id={`history-item-${item.id}`}
              >
                <span className="truncate">{item.title}</span>
                <span className="text-[10px] text-zinc-500 font-normal">{item.time}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Profile */}
      <div className="p-5 border-t border-zinc-800/40 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700/60 flex items-center justify-center text-[13px] font-semibold text-zinc-300">
          U
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-[13px] font-medium text-zinc-200 truncate leading-none">Developer</span>
          <span className="text-[10px] text-zinc-500 truncate mt-1">Free Tier</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
