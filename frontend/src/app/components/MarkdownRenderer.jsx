import React, { useState } from 'react';

// A simple tokenizer to highlight JavaScript code block content in dark mode
const highlightJS = (code) => {
  const keywords = ['function', 'const', 'let', 'var', 'return', 'if', 'else', 'for', 'while', 'throw', 'new', 'class', 'import', 'export', 'default', 'typeof', 'true', 'false', 'null', 'undefined'];
  const lines = code.split('\n');

  return lines.map((line, i) => {
    const parts = [];
    let remaining = line;
    let key = 0;

    while (remaining.length > 0) {
      if (remaining.startsWith('//')) {
        parts.push(<span key={key++} className="text-zinc-500 italic">{remaining}</span>);
        remaining = '';
        continue;
      }
      const strMatch = remaining.match(/^(["'`]).*?\1/);
      if (strMatch) {
        parts.push(<span key={key++} className="text-emerald-400">{strMatch[0]}</span>);
        remaining = remaining.slice(strMatch[0].length);
        continue;
      }
      const numMatch = remaining.match(/^\b(\d+)\b/);
      if (numMatch) {
        parts.push(<span key={key++} className="text-amber-400">{numMatch[0]}</span>);
        remaining = remaining.slice(numMatch[0].length);
        continue;
      }
      const kwMatch = remaining.match(/^([a-zA-Z_$][a-zA-Z0-9_$]*)/);
      if (kwMatch) {
        const word = kwMatch[0];
        if (keywords.includes(word)) {
          parts.push(<span key={key++} className="text-violet-400 font-semibold">{word}</span>);
        } else if (/^[A-Z]/.test(word) || remaining[word.length] === '(') {
          parts.push(<span key={key++} className="text-sky-400">{word}</span>);
        } else {
          parts.push(<span key={key++}>{word}</span>);
        }
        remaining = remaining.slice(word.length);
        continue;
      }
      parts.push(<span key={key++}>{remaining[0]}</span>);
      remaining = remaining.slice(1);
    }
    return <div key={i}>{parts.length ? parts : '\u00A0'}</div>;
  });
};

const MarkdownRenderer = ({ content }) => {
  if (!content) return null;

  // Split into blocks: code blocks vs text blocks
  const parts = [];
  const regex = /```(javascript|js|json|html|css)?\n([\s\S]*?)```/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(content)) !== null) {
    const textBefore = content.substring(lastIndex, match.index);
    if (textBefore.trim()) {
      parts.push({ type: 'text', val: textBefore });
    }
    parts.push({ type: 'code', lang: match[1] || 'javascript', val: match[2].trim() });
    lastIndex = regex.lastIndex;
  }

  const textAfter = content.substring(lastIndex);
  if (textAfter.trim()) {
    parts.push({ type: 'text', val: textAfter });
  }

  // Parse inline text (bold, inline code)
  const parseInline = (text) => {
    const tokens = [];
    const inlineRegex = /(\*\*([^*]+)\*\*|`([^`]+)`)/g;
    let index = 0;
    let m;

    while ((m = inlineRegex.exec(text)) !== null) {
      if (m.index > index) {
        tokens.push(text.substring(index, m.index));
      }
      if (m[2]) {
        // bold
        tokens.push(<strong key={m.index} className="font-bold text-zinc-100">{m[2]}</strong>);
      } else if (m[3]) {
        // inline code
        tokens.push(
          <code key={m.index} className="px-1.5 py-0.5 mx-0.5 bg-zinc-950 border border-zinc-800 rounded text-rose-400 font-mono text-xs">
            {m[3]}
          </code>
        );
      }
      index = inlineRegex.lastIndex;
    }

    if (index < text.length) {
      tokens.push(text.substring(index));
    }
    return tokens;
  };

  const renderTextBlock = (text, blockIdx) => {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed) return null;

      // Heading 3
      if (trimmed.startsWith('### ')) {
        return (
          <h3 key={`${blockIdx}-${idx}`} className="text-sm font-semibold text-zinc-200 mt-5 mb-2 font-sans tracking-wide">
            {parseInline(trimmed.slice(4))}
          </h3>
        );
      }
      // Heading 2
      if (trimmed.startsWith('## ')) {
        return (
          <h2 key={`${blockIdx}-${idx}`} className="text-base font-semibold text-zinc-200 mt-6 mb-3 font-sans tracking-wide">
            {parseInline(trimmed.slice(3))}
          </h2>
        );
      }
      // Unordered list
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        return (
          <ul key={`${blockIdx}-${idx}`} className="list-disc list-inside pl-2 my-1 text-zinc-400 text-[13.5px] leading-relaxed">
            <li className="marker:text-zinc-600">
              <span className="pl-1 text-zinc-300">{parseInline(trimmed.slice(2))}</span>
            </li>
          </ul>
        );
      }
      // Ordered list
      const numMatch = trimmed.match(/^(\d+)\.\s(.*)/);
      if (numMatch) {
        return (
          <ol key={`${blockIdx}-${idx}`} className="list-decimal list-inside pl-2 my-1 text-zinc-400 text-[13.5px] leading-relaxed" start={numMatch[1]}>
            <li className="marker:text-zinc-600">
              <span className="pl-1 text-zinc-300">{parseInline(numMatch[2])}</span>
            </li>
          </ol>
        );
      }

      // Default paragraph
      return (
        <p key={`${blockIdx}-${idx}`} className="my-2.5 text-zinc-300 text-[13.5px] leading-relaxed">
          {parseInline(line)}
        </p>
      );
    });
  };

  return (
    <div className="markdown-body select-text">
      {parts.map((p, idx) => {
        if (p.type === 'text') {
          return <div key={idx}>{renderTextBlock(p.val, idx)}</div>;
        } else {
          return <CodeBlock key={idx} code={p.val} lang={p.lang} />;
        }
      })}
    </div>
  );
};

const CodeBlock = ({ code, lang }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative my-4 rounded-lg border border-zinc-800 bg-zinc-950/70 overflow-hidden group">
      <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800/80 bg-zinc-950/40 select-none">
        <span className="text-[11px] font-mono font-medium text-zinc-500 uppercase tracking-wider">{lang}</span>
        <button
          onClick={handleCopy}
          className="text-[11px] font-mono font-medium text-zinc-500 hover:text-zinc-300 transition-colors px-2 py-0.5 rounded border border-transparent hover:border-zinc-800"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto font-mono text-[12.5px] text-zinc-300 leading-relaxed max-w-full">
        <code>{highlightJS(code)}</code>
      </pre>
    </div>
  );
};

export default MarkdownRenderer;
export { highlightJS };
