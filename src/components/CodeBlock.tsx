import React, { useState } from 'react';
import { Copy, Check, Terminal, Play } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
  showLineNumbers?: boolean;
  onRunInTerminal?: (code: string) => void;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = 'bash',
  title,
  showLineNumbers = true,
  onRunInTerminal
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const lines = code.trim().split('\n');

  return (
    <div className="my-3 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 font-mono text-xs shadow-lg">
      {/* Code Block Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-slate-900/90 border-b border-slate-800/80 text-slate-400">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="flex gap-1.5 mr-1">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
          </div>
          <Terminal className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span className="text-slate-300 font-medium truncate">
            {title || `${language}`}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {onRunInTerminal && (
            <button
              onClick={() => onRunInTerminal(code)}
              className="flex items-center gap-1 px-2 py-1 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 transition-colors text-[11px]"
              title="Test run in browser terminal"
            >
              <Play className="w-3 h-3 fill-emerald-400" />
              <span>Test Command</span>
            </button>
          )}

          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors text-[11px]"
            title="Copy command to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400 font-semibold">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code Body */}
      <div className="p-3 overflow-x-auto text-slate-200 leading-relaxed">
        <table className="w-full border-collapse">
          <tbody>
            {lines.map((line, idx) => {
              const isComment = line.trim().startsWith('#');
              return (
                <tr key={idx} className="hover:bg-slate-900/50">
                  {showLineNumbers && (
                    <td className="pr-3 text-slate-600 text-right select-none w-8 text-[11px] font-sans">
                      {idx + 1}
                    </td>
                  )}
                  <td className="whitespace-pre">
                    {isComment ? (
                      <span className="text-slate-500 italic">{line}</span>
                    ) : (
                      <span className="text-emerald-300">{line}</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
