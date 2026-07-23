import { BlogPost } from '../types';

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'post-1',
    title: 'Hardening SSH & PAM: A Production Defense-in-Depth Guide',
    slug: 'hardening-ssh-pam-production-guide',
    excerpt: 'Learn how to secure SSH endpoints using ED25519 keys, drop-in sshd_config rules, fail2ban rate limiting, and PAM MFA integration based on OpenSSH & Ubuntu standards.',
    readTimeMinutes: 8,
    publishedAt: '2026-06-15',
    category: 'Security',
    author: {
      name: 'Ahmed (ahmedmediaworkx) Wael',
      role: 'Cloud Engineer & Community Lead',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'
    },
    tags: ['SSH', 'PAM', 'Security', 'Linux', 'Hardening'],
    docReferences: [
      { title: 'OpenSSH Manual Pages', url: 'https://www.openssh.com/manual.html', category: 'Security' },
      { title: 'Linux Manual Pages (Man7)', url: 'https://man7.org/', category: 'Core' },
      { title: 'Ubuntu Official Documentation', url: 'https://documentation.ubuntu.com/', category: 'Distro' },
      { title: 'Red Hat Security Hardening Guide', url: 'https://docs.redhat.com/', category: 'Distro' }
    ],
    content: `
### Introduction

Securing remote access is the primary line of defense for modern Linux infrastructure. Grounded in the official [OpenSSH Specifications](https://www.openssh.com/manual.html) and [Man7 Linux Manuals](https://man7.org/), this tutorial covers enterprise hardening workflows for OpenSSH 9.x+ and Linux Pluggable Authentication Modules (PAM).

---

### Step 1: Enforce Modern Cryptography (ED25519 Keys)

Avoid legacy RSA 2048-bit keys. ED25519 offers stronger security with faster signature verification and compact key footprints:

\`\`\`bash
# Generate high-entropy ED25519 keypair
ssh-keygen -t ed25519 -C "admin@infrastructure.io" -f ~/.ssh/id_ed25519
\`\`\`

Set strict file permissions on your local SSH directory per POSIX specifications:

\`\`\`bash
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
\`\`\`

---

### Step 2: Configure Modular SSH Server Hardening

In modern distros (Ubuntu Server, Debian 12+, RHEL 9+), never modify \`/etc/ssh/sshd_config\` directly. Use drop-in files in \`/etc/ssh/sshd_config.d/\`:

\`\`\`bash
sudo cat << 'EOF' > /etc/ssh/sshd_config.d/99-hardened.conf
# Disable root login over SSH
PermitRootLogin no

# Enforce public key authentication only
PasswordAuthentication no
PubkeyAuthentication yes
AuthenticationMethods publickey

# Limit auth attempts and set idle session timeout
MaxAuthTries 3
ClientAliveInterval 300
ClientAliveCountMax 2

# Restrict ciphers according to OpenSSH recommendations
KexAlgorithms curve25519-sha256,curve25519-sha256@libssh.org,diffie-hellman-group16-sha512
Ciphers chacha20-poly1305@openssh.com,aes256-gcm@openssh.com
EOF
\`\`\`

Always validate syntax before reloading:

\`\`\`bash
sudo sshd -t
sudo systemctl reload sshd
\`\`\`

---

### Step 3: Automated Fail2ban Rate Limiting

Deploy \`fail2ban\` to dynamically inject iptables/nftables firewall rules for IPs attempting unauthorized access:

\`\`\`bash
sudo apt-get install -y fail2ban
sudo cat << 'EOF' > /etc/fail2ban/jail.d/sshd.local
[sshd]
enabled = true
port = ssh
filter = sshd
logpath = /var/log/auth.log
maxretry = 3
findtime = 600
bantime = 3600
EOF

sudo systemctl restart fail2ban
sudo fail2ban-client status sshd
\`\`\`

---

### Summary & Canonical References

1. Keep an active terminal session open when reloading \`sshd\` config changes.
2. Review official specs on [OpenSSH Manuals](https://www.openssh.com/manual.html) and [Red Hat Documentation](https://docs.redhat.com/).
`
  },
  {
    id: 'post-2',
    title: 'Mastering Systemd Timers over Cron for Reliable Background Jobs',
    slug: 'mastering-systemd-timers-over-cron',
    excerpt: 'Why modern SysAdmins are replacing legacy crontabs with systemd timers for explicit logging, resource cgroups control, and boot delays based on Systemd.io specifications.',
    readTimeMinutes: 10,
    publishedAt: '2026-06-28',
    category: 'Automation',
    author: {
      name: 'Ahmed (ahmedmediaworkx) Wael',
      role: 'Cloud Engineer & Community Lead',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'
    },
    tags: ['Systemd', 'Timers', 'Automation', 'Cron', 'DevOps'],
    docReferences: [
      { title: 'Systemd Official Documentation', url: 'https://systemd.io/', category: 'Systemd' },
      { title: 'Arch Linux Wiki - Systemd Timers', url: 'https://wiki.archlinux.org/', category: 'Wiki' },
      { title: 'Debian Documentation Library', url: 'https://www.debian.org/doc/', category: 'Distro' }
    ],
    content: `
### Why Switch from Cron to Systemd Timers?

While \`crontab\` served Linux admins for decades, [Systemd.io](https://systemd.io/) defines native timer units that eliminate classic crontab limitations:
- Unified stdout/stderr collection via \`journald\`
- Precise cgroup resource constraints (MemoryMax, CPUQuota)
- Triggering manual test runs without altering schedules
- Native support for \`Persistent=true\` (recovers missed jobs after reboot)

---

### Step 1: Create the Execution Service Unit

Define the background job as a standard systemd service in \`/etc/systemd/system/db-backup.service\`:

\`\`\`ini
[Unit]
Description=Nightly Database Backup Job
After=network.target

[Service]
Type=oneshot
User=postgres
ExecStart=/usr/local/bin/backup-db.sh
MemoryMax=1G
CPUQuota=50%
\`\`\`

---

### Step 2: Define the Systemd Timer Unit

Next, create the corresponding timer unit in \`/etc/systemd/system/db-backup.timer\`:

\`\`\`ini
[Unit]
Description=Timer for Nightly Database Backup Job

[Timer]
# Run every night at 2:30 AM
OnCalendar=*-*-* 02:30:00

# Catch up if system was offline during scheduled time
Persistent=true

# Add randomized delay to prevent thundering herd
RandomizedDelaySec=300

[Install]
WantedBy=timers.target
\`\`\`

---

### Step 3: Enable and Inspect Timers

Enable and start the timer unit:

\`\`\`bash
sudo systemctl daemon-reload
sudo systemctl enable --now db-backup.timer
\`\`\`

List all active timers across the system:

\`\`\`bash
systemctl list-timers --all
\`\`\`

Inspect execution logs using \`journalctl\`:

\`\`\`bash
journalctl -u db-backup.service -n 50 --no-pager
\`\`\`

---

### Canonical References

Explore detailed unit syntax on [Systemd.io](https://systemd.io/) and the [Arch Linux Wiki](https://wiki.archlinux.org/).
`
  },
  {
    id: 'post-3',
    title: 'eBPF Tracing for Low-Overhead Performance & Kernel Debugging',
    slug: 'ebpf-tracing-kernel-performance-debugging',
    excerpt: 'An engineer’s guide to using eBPF, bpftrace, and BCC tools to trace syscalls, disk IO latency, and network bottlenecks as documented in Kernel.org.',
    readTimeMinutes: 12,
    publishedAt: '2026-07-08',
    category: 'Kernel',
    author: {
      name: 'Ahmed (ahmedmediaworkx) Wael',
      role: 'Cloud Engineer & Community Lead',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'
    },
    tags: ['eBPF', 'Kernel', 'Tracing', 'Performance', 'BPFtrace'],
    docReferences: [
      { title: 'Linux Kernel Documentation', url: 'https://docs.kernel.org/', category: 'Kernel' },
      { title: 'Kernel.org Document Archive', url: 'https://www.kernel.org/doc/', category: 'Kernel' },
      { title: 'Man7 Linux Manual Pages', url: 'https://man7.org/', category: 'Core' }
    ],
    content: `
### What is eBPF?

Extended Berkeley Packet Filter (eBPF) allows running sandboxed C-like programs directly inside the Linux kernel without modifying kernel source code or loading risk-heavy kernel modules. Detailed design specs can be found in the official [Linux Kernel Documentation](https://docs.kernel.org/).

---

### Live Tracing System Calls with bpftrace

Install \`bpftrace\` and BCC tools on your distribution:

\`\`\`bash
sudo apt-get install -y bpftrace bpfcc-tools
\`\`\`

#### Example 1: Trace all new process executions system-wide

\`\`\`bash
sudo bpftrace -e 'tracepoint:syscalls:sys_enter_execve { printf("%-8d %-16s %s\\n", pid, comm, str(args->filename)); }'
\`\`\`

#### Example 2: Measure Block Device Disk Latency Histogram

\`\`\`bash
sudo biolatency-bpfcc 1 10
\`\`\`

Output shows a logarithmic latency distribution histogram in microseconds:

\`\`\`text
     usecs               : count    distribution
         0 -> 1          : 0        |                                        |
         2 -> 3          : 0        |                                        |
         4 -> 7          : 12       |**                                      |
         8 -> 15         : 184      |****************************************|
        16 -> 31         : 42       |*********                               |
        32 -> 63         : 3        |                                        |
\`\`\`

---

### Key Takeaways

1. eBPF delivers **microsecond-level telemetry** with virtually zero CPU overhead.
2. Refer to [docs.kernel.org](https://docs.kernel.org/) for complete BPF subsystem tracing flags.
`
  },
  {
    id: 'post-4',
    title: 'GNU Bash Shell Scripting & POSIX Compliance Standards',
    slug: 'gnu-bash-scripting-posix-standards',
    excerpt: 'Write bulletproof bash scripts using strict error mode, parameter expansion, array manipulation, and POSIX guidelines from the GNU Manual.',
    readTimeMinutes: 9,
    publishedAt: '2026-07-14',
    category: 'Automation',
    author: {
      name: 'Ahmed (ahmedmediaworkx) Wael',
      role: 'Cloud Engineer & Community Lead',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'
    },
    tags: ['Bash', 'GNU', 'POSIX', 'Shell', 'Scripting'],
    docReferences: [
      { title: 'GNU Bash Reference Manual', url: 'https://www.gnu.org/software/bash/manual/', category: 'GNU' },
      { title: 'GNU Software Manuals', url: 'https://www.gnu.org/software/', category: 'GNU' },
      { title: 'POSIX IEEE Std 1003.1', url: 'https://pubs.opengroup.org/onlinepubs/9699919799/', category: 'Standards' }
    ],
    content: `
### The Defensive Bash Boilerplate

To write production-grade shell scripts that fail early and cleanly, adhere to guidelines from the [GNU Bash Manual](https://www.gnu.org/software/bash/manual/) and the [POSIX 1003.1 Specification](https://pubs.opengroup.org/onlinepubs/9699919799/):

\`\`\`bash
#!/usr/bin/env bash
set -euo pipefail
IFS=$'\n\t'

# Strict Error Handling Boilerplate
trap 'echo "Error occurred at line $LINENO. Exiting..." >&2' ERR
\`\`\`

---

### Modern Parameter Expansions

Avoid external tools like \`cut\` or \`sed\` for simple string manipulation. Use native bash parameter expansions:

\`\`\`bash
FILE_PATH="/var/log/nginx/access.log.gz"

# Extract filename with extension
FILENAME="\${FILE_PATH##*/}" # access.log.gz

# Extract directory path
DIRNAME="\${FILE_PATH%/*}"   # /var/log/nginx

# Strip trailing extension
BASENAME="\${FILENAME%.*}"   # access.log
\`\`\`

---

### Clean Array Processing

Iterate safely over file lists without splitting on spaces:

\`\`\`bash
declare -a CONFIG_FILES=()

while IFS= read -r -d '' file; do
    CONFIG_FILES+=("$file")
done < <(find /etc/nginx/conf.d -type f -name "*.conf" -print0)

for conf in "\${CONFIG_FILES[@]}"; do
    echo "Validating $conf..."
    nginx -t -c "$conf"
done
\`\`\`

---

### Documentation References

Read the full manual at [GNU Bash Manual](https://www.gnu.org/software/bash/manual/) and [The Open Group POSIX Standards](https://pubs.opengroup.org/onlinepubs/9699919799/).
`
  },
  {
    id: 'post-5',
    title: 'Enterprise LVM Storage Architecture & Dynamic Volume Resizing',
    slug: 'enterprise-lvm-storage-architecture-resizing',
    excerpt: 'Step-by-step guide to expanding Logical Volume Management (LVM) pools online on Red Hat, Ubuntu, and Debian systems without downtime.',
    readTimeMinutes: 11,
    publishedAt: '2026-07-20',
    category: 'Storage',
    author: {
      name: 'Ahmed (ahmedmediaworkx) Wael',
      role: 'Cloud Engineer & Community Lead',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'
    },
    tags: ['LVM', 'Storage', 'RedHat', 'Ubuntu', 'SysAdmin'],
    docReferences: [
      { title: 'Red Hat Enterprise Linux Docs', url: 'https://docs.redhat.com/', category: 'Distro' },
      { title: 'Ubuntu Official Documentation', url: 'https://documentation.ubuntu.com/', category: 'Distro' },
      { title: 'Arch Linux Wiki - LVM', url: 'https://wiki.archlinux.org/', category: 'Wiki' },
      { title: 'SUSE Documentation', url: 'https://documentation.suse.com/', category: 'Distro' }
    ],
    content: `
### Understanding LVM Hierarchy

Logical Volume Management decouples physical disk drives from user filesystems. As documented in [Red Hat Enterprise Storage Guides](https://docs.redhat.com/):

1. **Physical Volumes (PV)**: Raw block devices (\`/dev/sdb\`, \`/dev/nvme0n1\`).
2. **Volume Groups (VG)**: Combined storage pool composed of one or more PVs.
3. **Logical Volumes (LV)**: Virtual partitions created inside a VG.

---

### Online Volume Extension Workflow

When your database volume (\`/var/lib/mysql\`) reaches 95% capacity, extend the filesystem online without service interruption:

\`\`\`bash
# 1. Inspect existing Volume Group space
sudo vgs

# 2. Extend the Logical Volume by 20 Gigabytes
sudo lvextend -L +20G /dev/vg_data/lv_mysql

# 3. Resize the underlying Ext4 or XFS filesystem online
# For Ext4:
sudo resize2fs /dev/vg_data/lv_mysql

# For XFS (requires mount point argument):
sudo xfs_growfs /var/lib/mysql
\`\`\`

---

### Documentation References

For vendor-specific details, check [docs.redhat.com](https://docs.redhat.com/), [documentation.ubuntu.com](https://documentation.ubuntu.com/), and [wiki.archlinux.org](https://wiki.archlinux.org/).
`
  }
];
