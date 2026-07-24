import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Terminal,
  CornerDownLeft,
  Trash2,
  Copy,
  Check,
  Play,
  Sparkles,
  Maximize2,
  Minimize2,
  Layers,
  Cpu,
  HardDrive,
  Globe,
  ShieldCheck,
  Server
} from 'lucide-react';

interface TerminalHistoryItem {
  id: string;
  command: string;
  output: string | React.ReactNode;
  isError?: boolean;
  time: string;
}

export function TerminalSimulator({ initialCommand }: { initialCommand?: string }) {
  const [history, setHistory] = useState<TerminalHistoryItem[]>([
    {
      id: 'init-1',
      command: 'uname -a',
      output: 'Linux sysadmin-lab 6.8.0-30-generic #30-Ubuntu SMP PREEMPT_DYNAMIC x86_64 GNU/Linux',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    },
    {
      id: 'init-2',
      command: 'whoami',
      output: 'sysadmin@acme-cloud-lab:~$ (Root Sudoers Granted)',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputVal, setInputVal] = useState(initialCommand || '');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [commandHistory, setCommandHistory] = useState<string[]>(['uname -a', 'whoami']);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialCommand) {
      setInputVal(initialCommand);
    }
  }, [initialCommand]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, isExecuting]);

  const handleCopy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const processCommand = (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    setIsExecuting(true);
    setCommandHistory((prev) => [...prev.filter((c) => c !== trimmed), trimmed]);
    setHistoryIndex(-1);

    setTimeout(() => {
      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      let output: string | React.ReactNode = '';
      let isError = false;

      const lower = trimmed.toLowerCase();

      if (lower === 'clear') {
        setHistory([]);
        setIsExecuting(false);
        return;
      } else if (lower === 'help') {
        output = (
          <div className="space-y-1.5 text-slate-300">
            <p className="text-emerald-400 font-semibold font-mono">
              ⚡ Available SysAdmin Lab Sandbox Commands:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 py-1 text-[11px] font-mono">
              <div className="p-1.5 rounded bg-white/5 border border-white/5">
                <span className="text-amber-300 font-bold">uname -a</span> : Kernel Architecture
              </div>
              <div className="p-1.5 rounded bg-white/5 border border-white/5">
                <span className="text-amber-300 font-bold">whoami</span> : Active User Identity
              </div>
              <div className="p-1.5 rounded bg-white/5 border border-white/5">
                <span className="text-amber-300 font-bold">ls -la</span> : Directory Permissions
              </div>
              <div className="p-1.5 rounded bg-white/5 border border-white/5">
                <span className="text-amber-300 font-bold">df -h</span> : Disk Storage Space
              </div>
              <div className="p-1.5 rounded bg-white/5 border border-white/5">
                <span className="text-amber-300 font-bold">free -m</span> : RAM & Swap Usage
              </div>
              <div className="p-1.5 rounded bg-white/5 border border-white/5">
                <span className="text-amber-300 font-bold">ip a</span> : Network Interfaces
              </div>
              <div className="p-1.5 rounded bg-white/5 border border-white/5">
                <span className="text-amber-300 font-bold">ss -tulnp</span> : Open Sockets/Ports
              </div>
              <div className="p-1.5 rounded bg-white/5 border border-white/5">
                <span className="text-amber-300 font-bold">systemctl status</span> : Service Daemon State
              </div>
              <div className="p-1.5 rounded bg-white/5 border border-white/5">
                <span className="text-amber-300 font-bold">journalctl -xe</span> : System Logs
              </div>
              <div className="p-1.5 rounded bg-white/5 border border-white/5">
                <span className="text-amber-300 font-bold">docker ps</span> : Running Containers
              </div>
            </div>
            <p className="text-slate-400 text-[11px] font-mono">
              Type <span className="text-emerald-400 font-bold">clear</span> to wipe terminal history buffer.
            </p>
          </div>
        );
      } else if (lower === 'uname -a') {
        output = 'Linux sysadmin-lab 6.8.0-30-generic #30-Ubuntu SMP PREEMPT_DYNAMIC x86_64 GNU/Linux';
      } else if (lower === 'whoami') {
        output = 'sysadmin (uid=1000 gid=1000 groups=1000(sysadmin),27(sudo),100(developers))';
      } else if (lower.startsWith('ls')) {
        output = `total 48
drwxr-xr-x 5 sysadmin developers 4096 Jul 23 02:20 .
drwxr-xr-x 3 root     root       4096 Jul 23 02:00 ..
-rw-r--r-- 1 sysadmin developers  220 Jul 23 02:05 .bashrc
drwxr-xr-x 2 sysadmin developers 4096 Jul 23 02:10 bin
drwxr-xr-x 2 sysadmin developers 4096 Jul 23 02:15 config
drwxr-xr-x 2 sysadmin developers 4096 Jul 23 02:20 logs
-rwxr-xr-x 1 sysadmin developers 1280 Jul 23 02:18 healthcheck.sh`;
      } else if (lower === 'df -h') {
        output = `Filesystem      Size  Used Avail Use% Mounted on
/dev/root        50G   14G   34G  30% /
tmpfs           3.9G     0  3.9G   0% /dev/shm
/dev/sda1       511M  6.1M  505M   2% /boot/efi
/dev/mapper/vg0 200G   45G  155G  23% /var/www/data`;
      } else if (lower === 'free -m') {
        output = `               total        used        free      shared  buff/cache   available
Mem:            7960        2140        3450         180        2370        5340
Swap:           2048           0        2048`;
      } else if (lower.startsWith('ip a') || lower.startsWith('ip address')) {
        output = `1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc fq_codel state UP
    link/ether 52:54:00:12:34:56 brd ff:ff:ff:ff:ff:ff
    inet 192.168.1.105/24 brd 192.168.1.255 scope global eth0
3: docker0: <NO-CARRIER,BROADCAST,MULTICAST,UP> mtu 1500 qdisc noqueue state DOWN
    inet 172.17.0.1/16 brd 172.17.255.255 scope global docker0`;
      } else if (lower.startsWith('ss')) {
        output = `Netid  State   Recv-Q  Send-Q     Local Address:Port      Peer Address:Port  Process
tcp    LISTEN  0       512            127.0.0.1:5000           0.0.0.0:*      users:(("node",pid=1420,fd=19))
tcp    LISTEN  0       4096             0.0.0.0:80             0.0.0.0:*      users:(("nginx",pid=812,fd=6))
tcp    LISTEN  0       128              0.0.0.0:22             0.0.0.0:*      users:(("sshd",pid=720,fd=3))
tcp    LISTEN  0       4096             0.0.0.0:443            0.0.0.0:*      users:(("nginx",pid=812,fd=7))`;
      } else if (lower.startsWith('docker')) {
        output = `CONTAINER ID   IMAGE          COMMAND                  CREATED        STATUS        PORTS                  NAMES
a1b2c3d4e5f6   nginx:latest   "/docker-entrypoint.…"   2 hours ago    Up 2 hours    0.0.0.0:80->80/tcp     web-proxy
f6e5d4c3b2a1   postgres:16    "docker-entrypoint.s…"   5 hours ago    Up 5 hours    127.0.0.1:5432->5432   db-primary`;
      } else if (lower.includes('systemctl')) {
        output = `● nginx.service - A high performance web server and a reverse proxy server
     Loaded: loaded (/lib/systemd/system/nginx.service; enabled; vendor preset: enabled)
     Active: active (running) since Thu 2026-07-23 02:01:10 UTC; 20min ago
       Docs: man:nginx(8)
    Process: 812 ExecStart=/usr/sbin/nginx -g daemon on; master_process on; (code=exited, status=0/SUCCESS)
   Main PID: 812 (nginx)
      Tasks: 3 (limit: 9480)
     Memory: 16.2M
        CPU: 120ms`;
      } else {
        output = `[SANDBOX EXECUTION] Executed "${trimmed}" with exit code 0. Result logged to stdout.`;
      }

      setHistory((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          command: trimmed,
          output,
          isError,
          time
        }
      ]);
      setInputVal('');
      setIsExecuting(false);
    }, 200);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    processCommand(inputVal);
  };

  const handleKeyDownInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      const nextIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : historyIndex;
      setHistoryIndex(nextIndex);
      const targetCmd = commandHistory[commandHistory.length - 1 - nextIndex];
      if (targetCmd) setInputVal(targetCmd);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex <= 0) {
        setHistoryIndex(-1);
        setInputVal('');
      } else {
        const nextIndex = historyIndex - 1;
        setHistoryIndex(nextIndex);
        const targetCmd = commandHistory[commandHistory.length - 1 - nextIndex];
        if (targetCmd) setInputVal(targetCmd);
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const available = ['uname -a', 'whoami', 'ls -la', 'df -h', 'free -m', 'ip a', 'ss -tulnp', 'systemctl status', 'journalctl -xe', 'docker ps', 'clear', 'help'];
      const match = available.find((cmd) => cmd.startsWith(inputVal.trim().toLowerCase()));
      if (match) setInputVal(match);
    }
  };

  const quickPresets = [
    { label: 'uname -a', icon: Cpu },
    { label: 'df -h', icon: HardDrive },
    { label: 'ip a', icon: Globe },
    { label: 'ss -tulnp', icon: Server },
    { label: 'systemctl status', icon: ShieldCheck },
    { label: 'docker ps', icon: Layers }
  ];

  return (
    <div
      className={`rounded-2xl overflow-hidden border border-slate-200 dark:border-white/[0.08] bg-[#0c0d0e] dark:bg-[#09090b] text-slate-100 font-mono shadow-[0_20px_50px_rgba(0,0,0,0.4)] flex flex-col transition-all duration-300 ${
        isExpanded ? 'h-[650px]' : 'h-[460px]'
      }`}
    >
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#131416] dark:bg-[#111113] border-b border-slate-800/80 shrink-0 select-none">
        <div className="flex items-center gap-3">
          {/* Warp-style Traffic Lights */}
          <div className="flex items-center gap-1.5 group">
            <button
              onClick={() => setHistory([])}
              className="w-3 h-3 rounded-full bg-[#FF5F56] hover:bg-[#FF5F56]/80 flex items-center justify-center text-[8px] text-black/60 font-bold transition-transform active:scale-90"
              title="Clear terminal buffer"
            >
              ×
            </button>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-3 h-3 rounded-full bg-[#FFBD2E] hover:bg-[#FFBD2E]/80 transition-transform active:scale-90"
              title="Toggle height"
            />
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-3 h-3 rounded-full bg-[#27C93F] hover:bg-[#27C93F]/80 transition-transform active:scale-90"
              title="Expand view"
            />
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-200 pl-2 border-l border-white/10">
            <Terminal className="w-4 h-4 text-[#22C55E]" />
            <span className="tracking-tight">sysadmin@acme-cloud-lab:~</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/20 text-[10px] font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-ping" />
            Sandbox Active
          </span>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            title={isExpanded ? 'Minimize height' : 'Expand height'}
          >
            {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={() => setHistory([])}
            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            title="Clear terminal output"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Preset Quick Chips */}
      <div className="px-4 py-2 bg-[#0e0f11] border-b border-slate-800/50 flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider shrink-0">Presets:</span>
        {quickPresets.map((preset, idx) => {
          const Icon = preset.icon;
          return (
            <button
              key={idx}
              onClick={() => processCommand(preset.label)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-slate-300 hover:text-white transition-all text-[11px] shrink-0 active:scale-95"
            >
              <Icon className="w-3 h-3 text-[#22C55E]" />
              <span>{preset.label}</span>
            </button>
          );
        })}
      </div>

      {/* Terminal Screen Output */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs leading-relaxed font-mono">
        <div className="text-slate-500 text-[11px] border-b border-slate-800/60 pb-2 flex items-center justify-between">
          <span>Linux Sandbox Shell v6.8 — Type <span className="text-[#22C55E] font-bold">help</span> for all commands.</span>
          <span className="hidden sm:inline text-slate-600">{history.length} commands logged</span>
        </div>

        {history.map((item) => (
          <div key={item.id} className="space-y-1 group relative">
            <div className="flex items-center gap-2 text-slate-400">
              <span className="text-[#22C55E] font-bold">sysadmin@lab:~$</span>
              <span className="text-slate-100 font-semibold">{item.command}</span>
              <span className="text-[10px] text-slate-600 ml-auto">{item.time}</span>
              <button
                onClick={() =>
                  handleCopy(
                    item.id,
                    typeof item.output === 'string' ? item.output : item.command
                  )
                }
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white/10 rounded text-slate-400 hover:text-white"
                title="Copy output"
              >
                {copiedId === item.id ? <Check className="w-3 h-3 text-[#22C55E]" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
            <div className={`pl-4 text-slate-300 whitespace-pre-wrap font-mono ${item.isError ? 'text-rose-400' : ''}`}>
              {item.output}
            </div>
          </div>
        ))}

        {isExecuting && (
          <div className="flex items-center gap-2 text-[#22C55E] text-xs font-mono py-1">
            <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-ping" />
            <span>Executing command...</span>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Terminal Input Footer */}
      <form onSubmit={handleSubmit} className="p-3 bg-[#131416] border-t border-slate-800 flex items-center gap-2 shrink-0">
        <span className="text-[#22C55E] font-bold text-sm select-none">$</span>
        <input
          ref={inputRef}
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDownInput}
          placeholder="Type command (e.g. uname -a, df -h, ip a, systemctl, help)..."
          className="flex-1 bg-transparent border-none text-slate-100 text-xs focus:outline-none placeholder-slate-500 font-mono"
        />
        <button
          type="submit"
          className="px-3 py-1.5 rounded-xl bg-[#22C55E] hover:bg-[#22C55E]/90 text-slate-950 font-sans font-bold text-xs transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
        >
          <span>Run</span>
          <CornerDownLeft className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
}
