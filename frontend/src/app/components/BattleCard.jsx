import React from 'react';
import MarkdownRenderer from './MarkdownRenderer';

const SolutionColumn = ({ model, content, score, borderClass }) => {
  return (
    <div className={`p-6 bg-zinc-900 border border-zinc-800 rounded-lg flex flex-col gap-4 ${borderClass}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">🤖</span>
          <span className="text-[13px] font-medium text-zinc-200 tracking-wide">{model}</span>
        </div>
        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded border border-zinc-800 bg-zinc-950 text-zinc-400">
          Score: {score}/10
        </span>
      </div>
      <div className="flex-1">
        <MarkdownRenderer content={content} />
      </div>
    </div>
  );
};

const BattleCard = ({ data }) => {
  const { problem, solution_1, solution_2, judge } = data;

  const score1 = judge?.solution_1_score ?? 10;
  const score2 = judge?.solution_2_score ?? 8;
  const reason1 = judge?.solution_1_reasoning ?? '';
  const reason2 = judge?.solution_2_reasoning ?? '';

  const modelAWins = score1 >= score2;

  return (
    <div className="flex flex-col gap-6 max-w-full w-full select-text" id="battle-card">
      {/* Problem Header */}
      <div className="flex items-center gap-3 px-1">
        <span className="text-base text-zinc-500">⚔️</span>
        <span className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-500">
          Battle Result
        </span>
      </div>

      {/* Solutions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        <SolutionColumn
          model="AI Model A"
          content={solution_1}
          score={score1}
          borderClass={modelAWins ? 'border-emerald-500/30 bg-emerald-950/5' : ''}
        />
        <SolutionColumn
          model="AI Model B"
          content={solution_2}
          score={score2}
          borderClass={!modelAWins ? 'border-emerald-500/30 bg-emerald-950/5' : ''}
        />
      </div>

      {/* Judge Verdict Box */}
      <div className="p-6 rounded-lg border border-amber-900/30 bg-amber-950/10 flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-amber-900/20 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">⚖️</span>
            <span className="text-[13px] font-semibold text-amber-400 tracking-wide">Judge Verdict</span>
          </div>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full border border-amber-900/40 bg-amber-950/30 text-amber-300">
            {modelAWins ? 'AI Model A' : 'AI Model B'} Wins
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reason1 && (
            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] font-semibold text-zinc-500 tracking-wide">
                MODEL A FEEDBACK
              </span>
              <p className="text-[13px] text-zinc-300 leading-relaxed font-sans">{reason1}</p>
            </div>
          )}
          {reason2 && (
            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] font-semibold text-zinc-500 tracking-wide">
                MODEL B FEEDBACK
              </span>
              <p className="text-[13px] text-zinc-300 leading-relaxed font-sans">{reason2}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BattleCard;
