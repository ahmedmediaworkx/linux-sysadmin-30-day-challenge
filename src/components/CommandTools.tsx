import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Calculator,
  Cpu,
  Clock,
  HardDrive,
  Globe,
  KeyRound,
  Box,
  Copy,
  Check,
  Download,
  Terminal,
  Sparkles
} from 'lucide-react';
import { CodeBlock } from './CodeBlock';
import { MotionCard } from './motion/MotionCard';

export function CommandTools() {
  const [activeTool, setActiveTool] = useState<'chmod' | 'cron' | 'systemd' | 'lvm' | 'nginx' | 'ssh' | 'docker'>('chmod');

  // Chmod State
  const [ownerRead, setOwnerRead] = useState(true);
  const [ownerWrite, setOwnerWrite] = useState(true);
  const [ownerExec, setOwnerExec] = useState(true);

  const [groupRead, setGroupRead] = useState(true);
  const [groupWrite, setGroupWrite] = useState(false);
  const [groupExec, setGroupExec] = useState(true);

  const [otherRead, setOtherRead] = useState(true);
  const [otherWrite, setOtherWrite] = useState(false);
  const [otherExec, setOtherExec] = useState(true);

  const calculateOctal = () => {
    const o = (ownerRead ? 4 : 0) + (ownerWrite ? 2 : 0) + (ownerExec ? 1 : 0);
    const g = (groupRead ? 4 : 0) + (groupWrite ? 2 : 0) + (groupExec ? 1 : 0);
    const w = (otherRead ? 4 : 0) + (otherWrite ? 2 : 0) + (otherExec ? 1 : 0);
    return `${o}${g}${w}`;
  };

  const calculateSymbolic = () => {
    const r1 = ownerRead ? 'r' : '-';
    const w1 = ownerWrite ? 'w' : '-';
    const x1 = ownerExec ? 'x' : '-';

    const r2 = groupRead ? 'r' : '-';
    const w2 = groupWrite ? 'w' : '-';
    const x2 = groupExec ? 'x' : '-';

    const r3 = otherRead ? 'r' : '-';
    const w3 = otherWrite ? 'w' : '-';
    const x3 = otherExec ? 'x' : '-';

    return `u=${r1}${w1}${x1},g=${r2}${w2}${x2},o=${r3}${w3}${x3}`;
  };

  // Cron State
  const [cronMin, setCronMin] = useState('30');
  const [cronHour, setCronHour] = useState('2');
  const [cronDom, setCronDom] = useState('*');
  const [cronMonth, setCronMonth] = useState('*');
  const [cronDow, setCronDow] = useState('*');

  // Systemd State
  const [svcName, setSvcName] = useState('my-service');
  const [svcDesc, setSvcDesc] = useState('Custom Production Application Daemon');
  const [svcExec, setSvcExec] = useState('/usr/bin/node /var/www/app/index.js');
  const [svcUser, setSvcUser] = useState('www-data');

  // LVM State
  const [vgName, setVgName] = useState('vg_data');
  const [lvName, setLvName] = useState('lv_db');
  const [lvSize, setLvSize] = useState('50G');

  // Nginx State
  const [domain, setDomain] = useState('app.example.com');
  const [proxyPort, setProxyPort] = useState('3000');
  const [enableSsl, setEnableSsl] = useState(true);

  // SSH Config State
  const [hostAlias, setHostAlias] = useState('prod-server');
  const [hostIp, setHostIp] = useState('192.168.1.100');
  const [sshUser, setSvcSshUser] = useState('sysadmin');
  const [sshPort, setSshPort] = useState('22');
  const [keyPath, setKeyPath] = useState('~/.ssh/id_ed25519');

  // Docker State
  const [containerName, setContainerName] = useState('web-app');
  const [dockerImage, setDockerImage] = useState('nginx:alpine');
  const [hostPort, setHostPort] = useState('8080');

  const tools = [
    { id: 'chmod', name: 'Chmod Calculator', icon: Calculator },
    { id: 'cron', name: 'Crontab Generator', icon: Clock },
    { id: 'systemd', name: 'Systemd Unit Builder', icon: Cpu },
    { id: 'lvm', name: 'LVM Provisioning', icon: HardDrive },
    { id: 'nginx', name: 'Nginx Reverse Proxy', icon: Globe },
    { id: 'ssh', name: 'SSH Config Builder', icon: KeyRound },
    { id: 'docker', name: 'Docker Spec Builder', icon: Box }
  ] as const;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-[#111113] border border-slate-200 dark:border-white/[0.08] rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-[#FAFAFA] flex items-center gap-2.5">
              <Calculator className="w-6 h-6 text-[#22C55E]" />
              <span>Production SysAdmin Utility Generators</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-[#A1A1AA] mt-1">
              Generate battle-tested Linux configuration files, permission bits, systemd units, and crontabs.
            </p>
          </div>
          <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/20">
            <Sparkles className="w-3.5 h-3.5" /> 7 Live Tools
          </span>
        </div>

        {/* Tool Selector Tabs */}
        <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-slate-100 dark:border-white/[0.08]">
          {tools.map((t) => {
            const Icon = t.icon;
            const isActive = activeTool === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTool(t.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all active:scale-95 ${
                  isActive
                    ? 'bg-[#22C55E] text-slate-950 font-bold shadow-md shadow-[#22C55E]/20'
                    : 'bg-slate-100 dark:bg-[#18181B] text-slate-700 dark:text-[#A1A1AA] hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-[#27272A]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Chmod Tool */}
      {activeTool === 'chmod' && (
        <MotionCard className="bg-white dark:bg-[#111113] border border-slate-200 dark:border-white/[0.08] rounded-3xl p-6 shadow-xl space-y-6">
          <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg flex items-center gap-2">
            <Calculator className="w-5 h-5 text-[#22C55E]" />
            <span>Linux Permission Bit Calculator</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-sans">
            {/* Owner */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 space-y-3">
              <span className="font-bold text-slate-900 dark:text-slate-100 block border-b border-slate-200 dark:border-white/10 pb-2">
                Owner Permissions (u)
              </span>
              <label className="flex items-center gap-2.5 cursor-pointer text-slate-700 dark:text-slate-300">
                <input type="checkbox" checked={ownerRead} onChange={(e) => setOwnerRead(e.target.checked)} className="rounded text-[#22C55E] accent-[#22C55E]" />
                <span>Read (4)</span>
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer text-slate-700 dark:text-slate-300">
                <input type="checkbox" checked={ownerWrite} onChange={(e) => setOwnerWrite(e.target.checked)} className="rounded text-[#22C55E] accent-[#22C55E]" />
                <span>Write (2)</span>
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer text-slate-700 dark:text-slate-300">
                <input type="checkbox" checked={ownerExec} onChange={(e) => setOwnerExec(e.target.checked)} className="rounded text-[#22C55E] accent-[#22C55E]" />
                <span>Execute (1)</span>
              </label>
            </div>

            {/* Group */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 space-y-3">
              <span className="font-bold text-slate-900 dark:text-slate-100 block border-b border-slate-200 dark:border-white/10 pb-2">
                Group Permissions (g)
              </span>
              <label className="flex items-center gap-2.5 cursor-pointer text-slate-700 dark:text-slate-300">
                <input type="checkbox" checked={groupRead} onChange={(e) => setGroupRead(e.target.checked)} className="rounded text-[#22C55E] accent-[#22C55E]" />
                <span>Read (4)</span>
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer text-slate-700 dark:text-slate-300">
                <input type="checkbox" checked={groupWrite} onChange={(e) => setGroupWrite(e.target.checked)} className="rounded text-[#22C55E] accent-[#22C55E]" />
                <span>Write (2)</span>
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer text-slate-700 dark:text-slate-300">
                <input type="checkbox" checked={groupExec} onChange={(e) => setGroupExec(e.target.checked)} className="rounded text-[#22C55E] accent-[#22C55E]" />
                <span>Execute (1)</span>
              </label>
            </div>

            {/* Others */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 space-y-3">
              <span className="font-bold text-slate-900 dark:text-slate-100 block border-b border-slate-200 dark:border-white/10 pb-2">
                Others Permissions (o)
              </span>
              <label className="flex items-center gap-2.5 cursor-pointer text-slate-700 dark:text-slate-300">
                <input type="checkbox" checked={otherRead} onChange={(e) => setOtherRead(e.target.checked)} className="rounded text-[#22C55E] accent-[#22C55E]" />
                <span>Read (4)</span>
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer text-slate-700 dark:text-slate-300">
                <input type="checkbox" checked={otherWrite} onChange={(e) => setOtherWrite(e.target.checked)} className="rounded text-[#22C55E] accent-[#22C55E]" />
                <span>Write (2)</span>
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer text-slate-700 dark:text-slate-300">
                <input type="checkbox" checked={otherExec} onChange={(e) => setOtherExec(e.target.checked)} className="rounded text-[#22C55E] accent-[#22C55E]" />
                <span>Execute (1)</span>
              </label>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 text-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono">
            <div>
              <span className="text-xs text-slate-400 block font-sans">Octal Mode:</span>
              <span className="text-3xl font-bold text-[#22C55E]">{calculateOctal()}</span>
            </div>
            <div>
              <span className="text-xs text-slate-400 block font-sans">Symbolic Notation:</span>
              <span className="text-sm font-bold text-amber-300">{calculateSymbolic()}</span>
            </div>
          </div>

          <CodeBlock
            code={`chmod ${calculateOctal()} /path/to/target_file\n# Symbolic notation equivalent:\nchmod ${calculateSymbolic()} /path/to/target_file`}
            title="Generated Chmod Command"
          />
        </MotionCard>
      )}

      {/* Crontab Tool */}
      {activeTool === 'cron' && (
        <MotionCard className="bg-white dark:bg-[#111113] border border-slate-200 dark:border-white/[0.08] rounded-3xl p-6 shadow-xl space-y-6">
          <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#22C55E]" />
            <span>Crontab Schedule Generator</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
            <div>
              <label className="block text-slate-500 dark:text-[#A1A1AA] mb-1 font-mono">Minute (0-59)</label>
              <input
                type="text"
                value={cronMin}
                onChange={(e) => setCronMin(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-mono text-center font-bold"
              />
            </div>
            <div>
              <label className="block text-slate-500 dark:text-[#A1A1AA] mb-1 font-mono">Hour (0-23)</label>
              <input
                type="text"
                value={cronHour}
                onChange={(e) => setCronHour(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-mono text-center font-bold"
              />
            </div>
            <div>
              <label className="block text-slate-500 dark:text-[#A1A1AA] mb-1 font-mono">Day of Month</label>
              <input
                type="text"
                value={cronDom}
                onChange={(e) => setCronDom(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-mono text-center font-bold"
              />
            </div>
            <div>
              <label className="block text-slate-500 dark:text-[#A1A1AA] mb-1 font-mono">Month (1-12)</label>
              <input
                type="text"
                value={cronMonth}
                onChange={(e) => setCronMonth(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-mono text-center font-bold"
              />
            </div>
            <div>
              <label className="block text-slate-500 dark:text-[#A1A1AA] mb-1 font-mono">Day of Week (0-6)</label>
              <input
                type="text"
                value={cronDow}
                onChange={(e) => setCronDow(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-mono text-center font-bold"
              />
            </div>
          </div>

          <CodeBlock
            code={`# Edit user crontab using 'crontab -e':\n${cronMin} ${cronHour} ${cronDom} ${cronMonth} ${cronDow} /usr/local/bin/backup.sh >> /var/log/cron.log 2>&1`}
            title="Generated Crontab Entry"
          />
        </MotionCard>
      )}

      {/* Systemd Tool */}
      {activeTool === 'systemd' && (
        <MotionCard className="bg-white dark:bg-[#111113] border border-slate-200 dark:border-white/[0.08] rounded-3xl p-6 shadow-xl space-y-6">
          <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg flex items-center gap-2">
            <Cpu className="w-5 h-5 text-[#22C55E]" />
            <span>Systemd Service Unit Builder</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-500 dark:text-[#A1A1AA] mb-1">Service Unit Name</label>
              <input
                type="text"
                value={svcName}
                onChange={(e) => setSvcName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-500 dark:text-[#A1A1AA] mb-1">Execution User</label>
              <input
                type="text"
                value={svcUser}
                onChange={(e) => setSvcUser(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950 font-mono"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-slate-500 dark:text-[#A1A1AA] mb-1">ExecStart Command</label>
              <input
                type="text"
                value={svcExec}
                onChange={(e) => setSvcExec(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950 font-mono"
              />
            </div>
          </div>

          <CodeBlock
            code={`# Save as /etc/systemd/system/${svcName}.service\n[Unit]\nDescription=${svcDesc}\nAfter=network.target\n\n[Service]\nType=simple\nUser=${svcUser}\nExecStart=${svcExec}\nRestart=always\nRestartSec=5s\n\n[Install]\nWantedBy=multi-user.target`}
            title={`/etc/systemd/system/${svcName}.service`}
          />
        </MotionCard>
      )}

      {/* LVM Tool */}
      {activeTool === 'lvm' && (
        <MotionCard className="bg-white dark:bg-[#111113] border border-slate-200 dark:border-white/[0.08] rounded-3xl p-6 shadow-xl space-y-6">
          <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg flex items-center gap-2">
            <HardDrive className="w-5 h-5 text-[#22C55E]" />
            <span>Logical Volume Manager (LVM) Setup Script</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-slate-500 dark:text-[#A1A1AA] mb-1">Volume Group Name</label>
              <input
                type="text"
                value={vgName}
                onChange={(e) => setVgName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-500 dark:text-[#A1A1AA] mb-1">Logical Volume Name</label>
              <input
                type="text"
                value={lvName}
                onChange={(e) => setLvName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-500 dark:text-[#A1A1AA] mb-1 font-mono">Volume Size</label>
              <input
                type="text"
                value={lvSize}
                onChange={(e) => setLvSize(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950 font-mono"
              />
            </div>
          </div>

          <CodeBlock
            code={`# Step 1: Initialize physical volume\npvcreate /dev/sdb\n\n# Step 2: Create Volume Group\nvgcreate ${vgName} /dev/sdb\n\n# Step 3: Create Logical Volume\nlvcreate -L ${lvSize} -n ${lvName} ${vgName}\n\n# Step 4: Format with ext4 filesystem\nmke2fs -t ext4 /dev/${vgName}/${lvName}`}
            title="LVM Provisioning Commands"
          />
        </MotionCard>
      )}

      {/* Nginx Tool */}
      {activeTool === 'nginx' && (
        <MotionCard className="bg-white dark:bg-[#111113] border border-slate-200 dark:border-white/[0.08] rounded-3xl p-6 shadow-xl space-y-6">
          <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg flex items-center gap-2">
            <Globe className="w-5 h-5 text-[#22C55E]" />
            <span>Nginx Reverse Proxy Config Spec</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-500 dark:text-[#A1A1AA] mb-1">Domain Name</label>
              <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-500 dark:text-[#A1A1AA] mb-1">Upstream App Port</label>
              <input
                type="text"
                value={proxyPort}
                onChange={(e) => setProxyPort(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950 font-mono"
              />
            </div>
          </div>

          <CodeBlock
            code={`# /etc/nginx/sites-available/${domain}\nserver {\n    listen 80;\n    server_name ${domain};\n\n    location / {\n        proxy_pass http://127.0.0.1:${proxyPort};\n        proxy_http_version 1.1;\n        proxy_set_header Upgrade $http_upgrade;\n        proxy_set_header Connection 'upgrade';\n        proxy_set_header Host $host;\n        proxy_cache_bypass $http_upgrade;\n    }\n}`}
            title={`/etc/nginx/sites-available/${domain}`}
          />
        </MotionCard>
      )}

      {/* SSH Config Tool */}
      {activeTool === 'ssh' && (
        <MotionCard className="bg-white dark:bg-[#111113] border border-slate-200 dark:border-white/[0.08] rounded-3xl p-6 shadow-xl space-y-6">
          <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-[#22C55E]" />
            <span>SSH Client Host Config Generator</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-slate-500 dark:text-[#A1A1AA] mb-1">Host Alias</label>
              <input
                type="text"
                value={hostAlias}
                onChange={(e) => setHostAlias(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-500 dark:text-[#A1A1AA] mb-1">IP / Hostname</label>
              <input
                type="text"
                value={hostIp}
                onChange={(e) => setHostIp(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-500 dark:text-[#A1A1AA] mb-1">SSH User</label>
              <input
                type="text"
                value={sshUser}
                onChange={(e) => setSvcSshUser(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950 font-mono"
              />
            </div>
          </div>

          <CodeBlock
            code={`# Append to ~/.ssh/config\nHost ${hostAlias}\n    HostName ${hostIp}\n    User ${sshUser}\n    Port ${sshPort}\n    IdentityFile ${keyPath}\n    ServerAliveInterval 60`}
            title="~/.ssh/config snippet"
          />
        </MotionCard>
      )}

      {/* Docker Tool */}
      {activeTool === 'docker' && (
        <MotionCard className="bg-white dark:bg-[#111113] border border-slate-200 dark:border-white/[0.08] rounded-3xl p-6 shadow-xl space-y-6">
          <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg flex items-center gap-2">
            <Box className="w-5 h-5 text-[#22C55E]" />
            <span>Docker Compose Specification Builder</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-slate-500 dark:text-[#A1A1AA] mb-1">Container Service</label>
              <input
                type="text"
                value={containerName}
                onChange={(e) => setContainerName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-500 dark:text-[#A1A1AA] mb-1">Docker Image</label>
              <input
                type="text"
                value={dockerImage}
                onChange={(e) => setDockerImage(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-500 dark:text-[#A1A1AA] mb-1">Exposed Port</label>
              <input
                type="text"
                value={hostPort}
                onChange={(e) => setHostPort(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950 font-mono"
              />
            </div>
          </div>

          <CodeBlock
            code={`version: '3.8'\nservices:\n  ${containerName}:\n    image: ${dockerImage}\n    container_name: ${containerName}\n    ports:\n      - "${hostPort}:80"\n    restart: unless-stopped`}
            title="docker-compose.yml"
          />
        </MotionCard>
      )}
    </div>
  );
}
