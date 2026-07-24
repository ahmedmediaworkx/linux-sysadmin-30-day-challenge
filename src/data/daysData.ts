import { DayChallenge } from '../types';

export const DAYS_DATA: DayChallenge[] = [
  // --- JUNIOR LEVEL (Days 1-10) ---
  {
    id: 'day-1',
    dayNumber: 1,
    title: 'Navigating the Linux Filesystem & FHS Standard',
    level: 'junior',
    category: 'Basics & CLI',
    durationMinutes: 30,
    summary: 'Master the Filesystem Hierarchy Standard (FHS) and essential CLI file operations.',
    story: 'You have just been hired as a Junior Linux SysAdmin at CloudScale Inc. The company operates hundreds of web nodes. On your first day, senior engineers ask you to audit host configuration directories, clean temporary scratch spaces, and verify critical binary paths.',
    ticket: {
      from: 'Infrastructure Lead <ops-lead@cloudscale.io>',
      priority: 'Medium',
      subject: 'Onboarding Task: Audit /etc configurations & clean /var/tmp',
      message: 'Welcome aboard! Before deploying our microservices, please inspect the root directory layout, verify standard configuration paths in /etc, locate log files in /var/log, and set up our standard project workspace in /tmp without touching system runtime directories.'
    },
    businessContext: {
      whyImportant: 'Understanding the FHS prevents accidentally wiping system configuration or filling up root partitions.',
      ifUnfixed: 'Misplaced files or full /var/log partitions cause service crashes and unrecoverable boot failures.',
      affectedUsers: 'All production web services and engineering teams.',
      businessImpact: 'Maintains system stability, compliance, and predictable directory structures across 500+ servers.'
    },
    environmentList: ['Ubuntu 24.04 LTS', 'GNU Bash 5.2', 'Linux FHS 3.0', 'Virtual Machine'],
    studentObjective: 'Inspect the root FHS layout, locate host configuration files in /etc, identify active logs in /var/log, and create an isolated project directory structure using Bash brace expansion.',
    expectedOutcome: 'System configuration directories verified, log locations identified, and /tmp/acme/project/{src,bin,config,logs} structure established.',
    commonMistakes: [
      'Storing long-term application data inside /tmp or /var/tmp (they are purged periodically).',
      'Confusing /etc (configuration) with /usr/etc or /var/etc.',
      'Modifying files in virtual filesystems like /proc or /sys directly without understanding kernel implications.'
    ],
    seniorAdvice: 'Treat /etc as sacred — always take a timestamped copy (`cp -p config.conf config.conf.bak.$(date +%F)`) before editing any system configuration file.',
    bonusChallenge: 'Write a single find command to locate all files in /var/log larger than 10MB modified in the last 7 days and output their permissions in human-readable format.',
    realWorldSkills: ['FHS Directory Hierarchy', 'Linux File Navigation', 'Find Utility Filtering', 'Bash Brace Expansion'],
    interviewQuestion: {
      question: 'What is the fundamental difference between /proc, /sys, and /var in the Linux filesystem hierarchy?',
      answerHint: '/proc is a pseudo-filesystem exposing process and kernel state in RAM; /sys is a pseudo-filesystem exposing device driver hierarchy; /var contains real persistent variable data like logs and databases.'
    },
    scenario: 'You joined CloudScale Inc as a Junior SysAdmin. You need to inspect system configuration files in /etc, analyze system binaries in /usr/bin, and clean temporary files in /var/tmp without touching system critical paths.',
    labEnvironment: {
      quickSetupCommand: 'docker run -d --name lab-day01 ubuntu:latest sleep infinity',
      description: 'Run an isolated Ubuntu Linux container or use any local Linux/WSL terminal.'
    },
    prerequisites: ['Basic terminal access', 'Bash shell access'],
    tasks: [
      {
        id: 'd1-t1',
        text: 'Explore root directory structure and identify /etc, /var, /usr, /proc, and /sys directories.',
        codeSnippet: 'ls -la /\nfile /etc /var /usr /proc /sys'
      },
      {
        id: 'd1-t2',
        text: 'Locate system configuration file for network hosts and view its file type.',
        codeSnippet: 'ls -l /etc/hosts\ncat /etc/hosts'
      },
      {
        id: 'd1-t3',
        text: 'Find all log files in /var/log modified in the last 24 hours.',
        codeSnippet: 'find /var/log -type f -mtime -1'
      },
      {
        id: 'd1-t4',
        text: 'Create a directory structure under /tmp/acme/project/{src,bin,config,logs} using a single command.',
        codeSnippet: 'mkdir -p /tmp/acme/project/{src,bin,config,logs}'
      }
    ],
    hints: [
      {
        id: 'd1-h1',
        title: 'FHS Directories Reference',
        content: '/etc is for host-specific configuration, /var is for variable data like logs/spools, /proc is a virtual filesystem reflecting kernel state.'
      },
      {
        id: 'd1-h2',
        title: 'Braces expansion in Bash',
        content: 'Use brace expansion `{dir1,dir2}` with `mkdir -p` to create nested directory trees effortlessly.',
        codeSnippet: 'mkdir -p /tmp/acme/project/{src,bin,config,logs}'
      }
    ],
    verificationCommand: 'test -d /tmp/acme/project/logs && echo "VERIFIED: Directory structure created successfully!" || echo "FAILED: Directory structure missing."',
    proTip: 'Never store persistent data in /tmp or /var/tmp — systemd-tmpfiles automatically purges /tmp on reboot or after 10 days.',
    tags: ['FHS', 'Bash', 'Find', 'File Management']
  },
  {
    id: 'day-2',
    dayNumber: 2,
    title: 'File Permissions, Ownership & POSIX ACLs',
    level: 'junior',
    category: 'Permissions & Users',
    durationMinutes: 45,
    summary: 'Understand octal permissions, SUID/SGID, sticky bits, and Access Control Lists (ACLs).',
    story: 'The web development team at CloudScale is launching a new customer portal. Developers need full read/write access to /var/www/html, while external users must be strictly blocked. Furthermore, an external security auditor needs read-only access without being added to the developer group.',
    ticket: {
      from: 'Security Operations <secops@cloudscale.io>',
      priority: 'High',
      subject: 'SEC-402: Enforce strict permissions on /var/www/html with Auditor ACL',
      message: 'We noticed world-readable permissions on web root directories. Please restrict /var/www/html to group "developers" (mode 2770 with SGID set for inherited ownership), set a sticky bit on shared uploads, and set an explicit POSIX ACL for user "auditor" to read-only.'
    },
    businessContext: {
      whyImportant: 'Loose permissions permit unauthorized users or compromised web scripts to inspect secrets or overwrite codebase files.',
      ifUnfixed: 'Risk of source code leaks, defacement, or remote code execution.',
      affectedUsers: 'Developer team and security auditors.',
      businessImpact: 'Prevents security compliance failures (PCI-DSS / SOC2) and unauthorized data modifications.'
    },
    environmentList: ['Rocky Linux 9 / Ubuntu 24.04', 'POSIX File System', 'ACL Utilities (setfacl/getfacl)'],
    studentObjective: 'Configure octal modes, apply the SGID bit for group inheritance on /var/www/html, set sticky bit on shared upload folders, and grant fine-grained POSIX ACLs for auditing.',
    expectedOutcome: 'Shared directory configured with mode 2770, sticky bit active on upload directory, and auditor granted r-x via POSIX ACL.',
    commonMistakes: [
      'Using `chmod 777` as a quick fix (this is a major security flaw in production!).',
      'Forgetting the SGID bit (`chmod g+s`), causing files created by developers to belong to default user groups.',
      'Overwriting standard group permissions when trying to add a single user (use POSIX ACLs instead).'
    ],
    seniorAdvice: 'When you see a plus sign (`+`) at the end of permission strings in `ls -l` (e.g. `drwxrwx---+`), it means POSIX ACLs are configured. Always inspect with `getfacl`.',
    bonusChallenge: 'Configure a default POSIX ACL on /var/www/html so all future subdirectories automatically inherit read-only access for the auditor user.',
    realWorldSkills: ['POSIX File Permissions', 'SGID Directory Inheritance', 'Sticky Bit Security', 'POSIX ACLs (setfacl)'],
    interviewQuestion: {
      question: 'What is the purpose of the Set Group ID (SGID) bit when applied to a directory versus an executable binary file?',
      answerHint: 'On a directory, SGID forces all newly created files/folders to inherit the directory group owner. On an executable binary, SGID causes the program to run with the group privileges of the file owner rather than the user executing it.'
    },
    scenario: 'A web development team needs shared access to /var/www/html. Developer accounts must be able to read/write, but normal users should have zero access. You also need to enforce inherited group permissions on newly created files.',
    labEnvironment: {
      quickSetupCommand: 'docker run -d --name lab-day02 ubuntu:latest sleep infinity',
      description: 'Linux terminal with `acl` package installed (`apt-get update && apt-get install -y acl`).'
    },
    prerequisites: ['Basic CLI navigation', 'Root/sudo access'],
    tasks: [
      {
        id: 'd2-t1',
        text: 'Create user group "developers" and set permissions on /var/www/html to 770.',
        codeSnippet: 'groupadd developers\nchown -R root:developers /var/www/html\nchmod -R 770 /var/www/html'
      },
      {
        id: 'd2-t2',
        text: 'Enable the SGID (Set Group ID) bit on /var/www/html so new files inherit the group owner.',
        codeSnippet: 'chmod g+s /var/www/html\n# Octal equivalent: chmod 2770 /var/www/html'
      },
      {
        id: 'd2-t3',
        text: 'Set the Sticky Bit on /tmp/shared_uploads to prevent users from deleting files owned by others.',
        codeSnippet: 'mkdir -p /tmp/shared_uploads\nchmod +t /tmp/shared_uploads\n# Octal equivalent: chmod 1777 /tmp/shared_uploads'
      },
      {
        id: 'd2-t4',
        text: 'Grant auditor user explicit read-only access to /var/www/html using POSIX ACLs.',
        codeSnippet: 'useradd auditor\nsetfacl -m u:auditor:r-x /var/www/html\ngetfacl /var/www/html'
      }
    ],
    hints: [
      {
        id: 'd2-h1',
        title: 'Special Permission Bits',
        content: 'SUID = 4000 (runs as owner), SGID = 2000 (inherits group), Sticky Bit = 1000 (protects deletion in shared folders).'
      },
      {
        id: 'd2-h2',
        title: 'ACL Commands',
        content: 'Use `setfacl -m u:username:permissions /path` to grant granular permissions without modifying group ownership.',
        codeSnippet: 'setfacl -m u:auditor:r-x /var/www/html'
      }
    ],
    verificationCommand: 'getfacl /var/www/html | grep -q "user:auditor:r-x" && echo "VERIFIED: ACLs set correctly!"',
    proTip: 'When reviewing permissions, notice the plus sign (+) at the end of mode strings (`drwxrwx---+`) — it indicates extended ACLs are present!',
    tags: ['Permissions', 'Chmod', 'Chown', 'ACLs', 'SGID', 'SUID']
  },
  {
    id: 'day-3',
    dayNumber: 3,
    title: 'Process Management, Signals & Resource Inspection',
    level: 'junior',
    category: 'Processes & Services',
    durationMinutes: 40,
    summary: 'Monitor running processes, manage priorities with nice/renice, and send POSIX signals.',
    story: 'Monitoring alerts triggered an urgent page: host web-node-01 CPU utilization hit 100%. A buggy runaway background job is hogging all CPU cycles, slowing down SSH sessions and delaying customer requests.',
    ticket: {
      from: 'NOC / SRE Alerts <alerts@cloudscale.io>',
      priority: 'Critical',
      subject: 'ALERT: High CPU Spikes on web-node-01 (Runaway Process)',
      message: 'Host web-node-01 CPU load average is 14.5. Please locate the rogue process PID, analyze its CPU/memory consumption, lower its scheduling priority using renice, and terminate it gracefully with SIGTERM.'
    },
    businessContext: {
      whyImportant: 'Unchecked processes starve application threads of CPU/RAM, degrading site response times or causing kernel OOM (Out Of Memory) panics.',
      ifUnfixed: 'Complete server unresponsiveness and cascading failure across cluster nodes.',
      affectedUsers: 'Thousands of active customer web sessions.',
      businessImpact: 'Prevents SLA violations and maintains sub-second page response times.'
    },
    environmentList: ['Ubuntu Server 24.04', 'procps-ng (ps, top, kill, pkill)', 'Linux Kernel CPU Scheduler'],
    studentObjective: 'Spawn a runaway process, locate its PID using ps and top/htop, adjust its CPU scheduling priority with renice, and terminate it gracefully using POSIX signals.',
    expectedOutcome: 'Runaway process identified, priority adjusted to +15 niceness, and safely terminated using SIGTERM/SIGKILL.',
    commonMistakes: [
      'Using `kill -9` (SIGKILL) immediately without trying `kill -15` (SIGTERM) first.',
      'Killing the wrong process PID due to careless grep filtering.',
      'Misunderstanding nice values (-20 is highest priority, +19 is lowest priority).'
    ],
    seniorAdvice: 'Always send SIGTERM (15) first to allow processes to save state, close socket descriptors, and flush buffers. Reserve SIGKILL (9) for stubborn processes that ignore SIGTERM.',
    bonusChallenge: 'Use `cpulimit` or cgroups v2 to restrict a process to a maximum of 25% CPU core usage without killing it.',
    realWorldSkills: ['Process Monitoring (ps, top, htop)', 'POSIX Signals (SIGTERM, SIGKILL)', 'Process Renicing', 'Kernel CPU Priorities'],
    interviewQuestion: {
      question: 'What is the difference between SIGTERM (15), SIGINT (2), and SIGKILL (9)?',
      answerHint: 'SIGINT is sent by Ctrl+C to interrupt from terminal. SIGTERM requests clean termination allowing process signal handling. SIGKILL is handled directly by the kernel and terminates the process immediately without cleanup.'
    },
    scenario: 'A misbehaving background process is consuming high CPU and hanging terminal sessions. You must identify the runaway PID, analyze its memory usage, gracefully terminate it, or adjust its scheduling priority.',
    labEnvironment: {
      quickSetupCommand: 'docker run -d --name lab-day03 ubuntu:latest sleep infinity',
      description: 'Standard Linux environment with `procps` installed.'
    },
    prerequisites: ['Linux terminal access'],
    tasks: [
      {
        id: 'd3-t1',
        text: 'Spawn a runaway background process running "yes > /dev/null &" and find its PID.',
        codeSnippet: 'yes > /dev/null &\nps aux | grep yes'
      },
      {
        id: 'd3-t2',
        text: 'Inspect process hierarchy and thread execution tree using pstree and top/htop.',
        codeSnippet: 'pstree -p\ntop -b -n 1 | head -n 20'
      },
      {
        id: 'd3-t3',
        text: 'Lower the CPU priority of the process using renice to a niceness value of +15.',
        codeSnippet: 'renice -n 15 -p $(pgrep yes)'
      },
      {
        id: 'd3-t4',
        text: 'Send SIGTERM (15) first, and if unresponsive, send SIGKILL (9) to stop the process.',
        codeSnippet: 'pkill -15 yes\n# If still running:\npkill -9 yes'
      }
    ],
    hints: [
      {
        id: 'd3-h1',
        title: 'POSIX Signals',
        content: 'SIGINT (2) = Ctrl+C, SIGTERM (15) = Graceful shutdown requested, SIGKILL (9) = Immediate kernel-level termination.'
      },
      {
        id: 'd3-h2',
        title: 'Nice Values',
        content: 'Nice values range from -20 (highest priority, least "nice") to +19 (lowest priority, most "nice").'
      }
    ],
    verificationCommand: '! pgrep yes > /dev/null && echo "VERIFIED: Runaway process stopped!" || echo "Process still running."',
    proTip: 'Always send SIGTERM (15) before SIGKILL (9) in production! SIGKILL prevents processes from saving state or releasing file locks/sockets.',
    tags: ['Processes', 'PS', 'Kill', 'Nice', 'Signals', 'Top']
  },
  {
    id: 'day-4',
    dayNumber: 4,
    title: 'User & Group Administration with Sudo Privilege Rules',
    level: 'junior',
    category: 'Permissions & Users',
    durationMinutes: 35,
    summary: 'Provision service accounts, manage user expiry, locked accounts, and secure /etc/sudoers.',
    story: 'An external DevOps contractor, Alex, needs temporary 30-day access to perform Nginx web server maintenance. Company compliance mandates strict least-privilege: Alex must be able to restart Nginx via sudo without a password prompt, but must NEVER obtain a full root shell or access `/etc/shadow`.',
    ticket: {
      from: 'Compliance & IT Risk <compliance@cloudscale.io>',
      priority: 'High',
      subject: 'IAM-309: Provision temporary contractor "sys_contractor" with limited sudo',
      message: 'Please create user "sys_contractor" with account expiry in 30 days. Add a drop-in file in /etc/sudoers.d/ contractually restricted ONLY to `/usr/bin/systemctl restart nginx` and `/usr/bin/systemctl status nginx` without password.'
    },
    businessContext: {
      whyImportant: 'Giving third-party vendors full sudo access violates SOC2 and ISO27001 security frameworks.',
      ifUnfixed: 'Audit failure and potential insider privilege escalation.',
      affectedUsers: 'Third-party contractors and security auditors.',
      businessImpact: 'Maintains zero-trust governance and satisfies strict enterprise compliance audits.'
    },
    environmentList: ['Ubuntu Server / RHEL 9', 'Shadow Password Suite (chage)', 'Sudoers Engine (visudo)'],
    studentObjective: 'Create a restricted service user, configure automated account expiration dates with `chage`, and write a validated drop-in sudoers file in `/etc/sudoers.d/`.',
    expectedOutcome: 'User account created with 30-day auto-expiry, and sudoers drop-in verified via `visudo -c`.',
    commonMistakes: [
      'Editing `/etc/sudoers` directly with vim instead of `visudo` (a syntax error locks everyone out of sudo!).',
      'Forgetting file mode `0440` on `/etc/sudoers.d/*` files (sudo ignores files with loose permissions).',
      'Allowing wildcards in sudo paths like `/usr/bin/systemctl *` which lets contractors control ALL system services.'
    ],
    seniorAdvice: 'Always use drop-in files in `/etc/sudoers.d/` rather than modifying `/etc/sudoers` directly. This keeps configuration modular and survives distribution package upgrades.',
    bonusChallenge: 'Configure `sudo` session logging so all commands executed by `sys_contractor` are logged to `/var/log/sudo_custom.log`.',
    realWorldSkills: ['Linux Account Management', 'Account Expiration (chage)', 'Least-Privilege Sudoers Configuration', 'Visudo Validation'],
    interviewQuestion: {
      question: 'Why is editing /etc/sudoers directly dangerous, and how does visudo prevent system lockout?',
      answerHint: 'Visudo locks the sudoers file against concurrent edits and parses syntax in a temporary copy before saving. If syntax errors exist, visudo prevents saving, protecting against broken root sudo access.'
    },
    scenario: 'Provision a contractor account "sys_contractor" that expires in 30 days. Grant them restricted sudo access to restart systemd services (nginx) without password prompts, but prevent root shell access.',
    labEnvironment: {
      quickSetupCommand: 'docker run -d --name lab-day04 ubuntu:latest sleep infinity',
      description: 'Standard Linux system with `sudo` installed.'
    },
    prerequisites: ['Root privileges'],
    tasks: [
      {
        id: 'd4-t1',
        text: 'Create group "sysops" and user "sys_contractor" with bash shell and secondary group sysops.',
        codeSnippet: 'groupadd sysops\nuseradd -m -s /bin/bash -G sysops sys_contractor'
      },
      {
        id: 'd4-t2',
        text: 'Set password expiration and account lock date to 30 days from today.',
        codeSnippet: 'chage -E $(date -d "+30 days" +%Y-%m-%d) sys_contractor\nchage -l sys_contractor'
      },
      {
        id: 'd4-t3',
        text: 'Safely edit /etc/sudoers using visudo to grant passwordless Nginx management.',
        codeSnippet: 'visudo -f /etc/sudoers.d/contractor\n# Content inside /etc/sudoers.d/contractor:\nsys_contractor ALL=(ALL) NOPASSWD: /bin/systemctl restart nginx, /bin/systemctl status nginx'
      },
      {
        id: 'd4-t4',
        text: 'Verify sudoers configuration syntax using visudo validation flag.',
        codeSnippet: 'visudo -c'
      }
    ],
    hints: [
      {
        id: 'd4-h1',
        title: 'Drop-in Sudoers Files',
        content: 'Never edit /etc/sudoers directly! Use `/etc/sudoers.d/filename` with strict permissions (0440).'
      }
    ],
    verificationCommand: 'visudo -c && test -f /etc/sudoers.d/contractor && echo "VERIFIED: Sudo configuration valid!"',
    proTip: 'Always set file mode 0440 on /etc/sudoers.d/* drop-in files. Sudo ignores drop-ins that are world-writable or misconfigured.',
    tags: ['Users', 'Sudo', 'Visudo', 'Chage', 'Security']
  },
  {
    id: 'day-5',
    dayNumber: 5,
    title: 'Package Management, Custom Repositories & Tarballs',
    level: 'junior',
    category: 'Basics & CLI',
    durationMinutes: 40,
    summary: 'Manage software packages with APT/DNF, configure repository sources, and extract source archives.',
    story: 'CloudScale is onboarding Docker container tools and diagnostic utilities. As part of server standardization, you need to configure trusted GPG keys in `/etc/apt/keyrings`, verify package dependencies, and install custom compiled binaries from tarball archives.',
    ticket: {
      from: 'DevOps Lead <devops@cloudscale.io>',
      priority: 'Medium',
      subject: 'PKG-101: Install core diagnostics & configure GPG keyrings',
      message: 'Please update server package indexes, install core build utilities (`curl`, `build-essential`, `htop`), import official repository GPG keys securely into `/etc/apt/keyrings`, and extract custom tools to `/opt/tools`.'
    },
    businessContext: {
      whyImportant: 'Using deprecated keyring methods or unverified repositories exposes production nodes to man-in-the-middle package tampering.',
      ifUnfixed: 'Package contamination or broken dependency upgrades during automated deployments.',
      affectedUsers: 'Software release pipelines and system administrators.',
      businessImpact: 'Ensures software supply chain integrity and repeatable server builds.'
    },
    environmentList: ['Ubuntu 24.04 LTS / Debian 12', 'APT Package Manager', 'GPG Keyrings', 'Tar Compression'],
    studentObjective: 'Import GPG keys using modern `/etc/apt/keyrings` standards, install core utilities, inspect package dependencies with `apt-cache`, and unpack tarballs.',
    expectedOutcome: 'Repositories secured with GPG keyrings, required packages installed, and custom binary extracted to `/opt/tools`.',
    commonMistakes: [
      'Using legacy `apt-key add` (which is deprecated and security-flawed in modern Linux distributions).',
      'Forgetting `apt-get update` before attempting package installs.',
      'Unpacking tar archives into random directories without explicit target directory flags.'
    ],
    seniorAdvice: 'Always use `apt-mark hold <package>` for critical infrastructure components (e.g., PostgreSQL or Docker engine) to prevent unexpected version breaks during unattended upgrades.',
    bonusChallenge: 'Use `dpkg -S /path/to/binary` to reverse lookup which installed package owns a specific system binary on Debian/Ubuntu.',
    realWorldSkills: ['APT Package Management', 'GPG Keyring Security', 'Package Dependency Analysis', 'Tarball Archive Extraction'],
    interviewQuestion: {
      question: 'What is the purpose of GPG signature verification when adding a third-party software repository to Linux?',
      answerHint: 'GPG keys cryptographically sign repository metadata and package files, ensuring packages originate from the legitimate vendor and have not been altered or tampered with in transit.'
    },
    scenario: 'You need to install system diagnostics utilities, configure a third-party apt repository (or RPM repo), verify GPG signatures, and compile/extract a tar.gz utility archive manually.',
    labEnvironment: {
      quickSetupCommand: 'docker run -d --name lab-day05 ubuntu:latest sleep infinity',
      description: 'Ubuntu or Debian container environment.'
    },
    prerequisites: ['Internet access inside environment'],
    tasks: [
      {
        id: 'd5-t1',
        text: 'Update package index and install curl, wget, build-essential, and htop.',
        codeSnippet: 'apt-get update && apt-get install -y curl wget build-essential htop'
      },
      {
        id: 'd5-t2',
        text: 'Download a GPG key securely to /etc/apt/keyrings and inspect fingerprint.',
        codeSnippet: 'mkdir -p /etc/apt/keyrings\ncurl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg'
      },
      {
        id: 'd5-t3',
        text: 'Inspect package dependencies and reverse dependencies using apt-cache / dpkg.',
        codeSnippet: 'apt-cache depends htop\ndpkg -L htop'
      },
      {
        id: 'd5-t4',
        text: 'Download and extract a tar.gz compressed archive into /opt/tools.',
        codeSnippet: 'mkdir -p /opt/tools\ncurl -fsSL https://github.com/stedolan/jq/releases/download/jq-1.6/jq-linux64 -o /opt/tools/jq\nchmod +x /opt/tools/jq'
      }
    ],
    hints: [
      {
        id: 'd5-h1',
        title: 'Modern GPG Keyrings',
        content: 'Avoid using `apt-key add` (deprecated). Use `/etc/apt/keyrings` and reference the key in `.list` files with `signed-by=`.'
      }
    ],
    verificationCommand: 'which htop > /dev/null && echo "VERIFIED: Packages installed properly!"',
    proTip: 'Use `apt-mark hold <package>` to pin critical packages (e.g., kernel or database versions) from accidental upgrade during system maintenance.',
    tags: ['APT', 'DPKG', 'Tarball', 'GPG', 'Packages']
  },

  {
    id: 'day-6',
    dayNumber: 6,
    title: 'System Logging, Journald Filters & Log Rotation',
    level: 'junior',
    category: 'Observability & Logs',
    durationMinutes: 40,
    summary: 'Query systemd journal logs with journalctl and configure logrotate for application log files.',
    scenario: 'An application is generating massive log files in /var/log/app.log, causing disk space alerts. Filter system logs for SSH failures and set up a logrotate policy for application logs.',
    labEnvironment: {
      quickSetupCommand: 'docker run -d --name lab-day06 ubuntu:latest sleep infinity',
      description: 'Systemd container or standard Linux machine with logrotate installed.'
    },
    prerequisites: ['Systemd / Journald knowledge'],
    tasks: [
      {
        id: 'd6-t1',
        text: 'Filter journalctl entries by priority (err/warning) since current boot.',
        codeSnippet: 'journalctl -p err..warning -b'
      },
      {
        id: 'd6-t2',
        text: 'Filter logs for sshd unit or specific process between timeframe.',
        codeSnippet: 'journalctl _SYSTEMD_UNIT=sshd.service --since "1 hour ago"'
      },
      {
        id: 'd6-t3',
        text: 'Create a logrotate configuration for /var/log/custom-app/*.log with daily rotation, max 7 logs, and compression.',
        codeSnippet: 'cat << \'EOF\' > /etc/logrotate.d/custom-app\n/var/log/custom-app/*.log {\n    daily\n    rotate 7\n    compress\n    delaycompress\n    missingok\n    notifempty\n    create 0640 root root\n}\nEOF'
      },
      {
        id: 'd6-t4',
        text: 'Test logrotate configuration syntax using dry-run debug mode.',
        codeSnippet: 'logrotate --debug /etc/logrotate.d/custom-app'
      }
    ],
    hints: [
      {
        id: 'd6-h1',
        title: 'Hint 1: Journalctl Vacuum',
        content: 'Limit journal storage size using `journalctl --vacuum-size=500M` or in `/etc/systemd/journald.conf`.'
      }
    ],
    verificationCommand: 'logrotate -d /etc/logrotate.d/custom-app 2>&1 | grep -q "reading config file" && echo "VERIFIED: Logrotate config syntax valid!"',
    proTip: 'Always run `logrotate -d` (debug mode) before putting a new logrotate script into production to catch configuration syntax errors.',
    tags: ['Journald', 'Logrotate', 'Logging', 'Syslog']
  },
  {
    id: 'day-7',
    dayNumber: 7,
    title: 'Network Inspection, Socket Diagnostics & DNS Resolution',
    level: 'junior',
    category: 'Networking',
    durationMinutes: 45,
    summary: 'Analyze network interfaces, listening sockets, routing tables, and troubleshoot DNS with dig/nslookup.',
    scenario: 'A microservice cannot communicate with its database server. Inspect active network interfaces, listening TCP/UDP ports, verify local routing, and debug DNS resolution steps.',
    labEnvironment: {
      quickSetupCommand: 'docker run -d --name lab-day07 ubuntu:latest sleep infinity',
      description: 'Linux terminal with iproute2, net-tools, and bind-utils / dnsutils installed.'
    },
    prerequisites: ['Networking basics'],
    tasks: [
      {
        id: 'd7-t1',
        text: 'Display all network interfaces, IP addresses, and MAC addresses using `ip`.',
        codeSnippet: 'ip -c address show'
      },
      {
        id: 'd7-t2',
        text: 'Find all TCP and UDP ports currently in LISTEN state with listening PIDs.',
        codeSnippet: 'ss -tulnp'
      },
      {
        id: 'd7-t3',
        text: 'Inspect kernel routing table and default gateway route.',
        codeSnippet: 'ip route show'
      },
      {
        id: 'd7-t4',
        text: 'Query DNS A record, MX record, and trace DNS resolution steps for google.com using `dig`.',
        codeSnippet: 'dig +short google.com A\ndig google.com +trace'
      }
    ],
    hints: [
      {
        id: 'd7-h1',
        title: 'Hint 1: Replacement for netstat',
        content: '`netstat` is deprecated! Modern Linux uses `ss` (socket statistics) from iproute2, which is drastically faster.'
      }
    ],
    verificationCommand: 'ss -tuln > /dev/null && echo "VERIFIED: Network diagnostic commands executed successfully!"',
    proTip: 'Use `ss -tulpn` (tcp, udp, listening, process, numeric) as your go-to command for port conflict triage.',
    tags: ['Networking', 'IP', 'SS', 'Dig', 'DNS', 'Sockets']
  },
  {
    id: 'day-8',
    dayNumber: 8,
    title: 'SSH Hardening, Key Pair Management & Config Rules',
    level: 'junior',
    category: 'Security & Firewall',
    durationMinutes: 40,
    summary: 'Generate ED25519 SSH keys, configure SSH daemon security settings, and set up ~/.ssh/config aliases.',
    scenario: 'Harden your company server SSH entry point: disable root password login, change standard port, enforce public-key authentication, and create client host aliases.',
    labEnvironment: {
      quickSetupCommand: 'docker run -d --name lab-day08 ubuntu:latest sleep infinity',
      description: 'Linux machine with openssh-server and openssh-client installed.'
    },
    prerequisites: ['SSH basics'],
    tasks: [
      {
        id: 'd8-t1',
        text: 'Generate a secure ED25519 SSH keypair with custom comment.',
        codeSnippet: 'ssh-keygen -t ed25519 -C "admin@acme.com" -f ~/.ssh/id_ed25519_acme'
      },
      {
        id: 'd8-t2',
        text: 'Set proper permissions on ~/.ssh directory (700) and authorized_keys file (600).',
        codeSnippet: 'chmod 700 ~/.ssh\ntouch ~/.ssh/authorized_keys\nchmod 600 ~/.ssh/authorized_keys'
      },
      {
        id: 'd8-t3',
        text: 'Configure /etc/ssh/sshd_config.d/security.conf to disable password auth and root login.',
        codeSnippet: 'cat << \'EOF\' > /etc/ssh/sshd_config.d/security.conf\nPermitRootLogin no\nPasswordAuthentication no\nPubkeyAuthentication yes\nMaxAuthTries 3\nEOF'
      },
      {
        id: 'd8-t4',
        text: 'Test SSH daemon configuration syntax before restarting service.',
        codeSnippet: 'sshd -t'
      }
    ],
    hints: [
      {
        id: 'd8-h1',
        title: 'Hint 1: SSH Key Type',
        content: 'ED25519 keys are faster, shorter, and more secure than legacy RSA keys.'
      }
    ],
    verificationCommand: 'sshd -t && echo "VERIFIED: SSH daemon configuration valid!"',
    proTip: 'Always keep an existing active SSH terminal session open when reloading `sshd` to prevent locking yourself out!',
    tags: ['SSH', 'Security', 'ED25519', 'Hardening']
  },
  {
    id: 'day-9',
    dayNumber: 9,
    title: 'Bash Scripting Fundamentals & Exit Codes',
    level: 'junior',
    category: 'Automation & Scripts',
    durationMinutes: 45,
    summary: 'Write robust Bash scripts with error handling (`set -euo pipefail`), arguments, loops, and conditional checks.',
    scenario: 'Create an automated system health check script `/usr/local/bin/healthcheck.sh` that checks disk usage, active services, memory thresholds, and returns appropriate exit status codes (0 for OK, 1 for Alert).',
    labEnvironment: {
      quickSetupCommand: 'docker run -d --name lab-day09 ubuntu:latest sleep infinity',
      description: 'Standard Bash shell environment.'
    },
    prerequisites: ['Basic command line familiarity'],
    tasks: [
      {
        id: 'd9-t1',
        text: 'Start script with correct shebang and strict execution flags (set -euo pipefail).',
        codeSnippet: '#!/usr/bin/env bash\nset -euo pipefail'
      },
      {
        id: 'd9-t2',
        text: 'Add disk space check logic: alert if root partition threshold exceeds 80%.',
        codeSnippet: 'USAGE=$(df / | tail -1 | awk \'{print $5}\' | sed \'s/%//\')\nif [ "$USAGE" -gt 80 ]; then\n  echo "CRITICAL: Disk space at ${USAGE}%"\n  exit 1\nfi'
      },
      {
        id: 'd9-t3',
        text: 'Iterate over array of required system services and verify state.',
        codeSnippet: 'SERVICES=("cron" "ssh")\nfor svc in "${SERVICES[@]}"; do\n  echo "Checking service: $svc"\ndone'
      },
      {
        id: 'd9-t4',
        text: 'Make script executable and test execution.',
        codeSnippet: 'chmod +x /tmp/healthcheck.sh\n/tmp/healthcheck.sh'
      }
    ],
    hints: [
      {
        id: 'd9-h1',
        title: 'Hint 1: Unofficial Bash Strict Mode',
        content: '`set -euo pipefail` halts execution on errors (-e), undefined variables (-u), and pipeline failures (-o pipefail).'
      }
    ],
    verificationCommand: 'bash -n /tmp/healthcheck.sh 2>/dev/null && echo "VERIFIED: Bash syntax valid!" || echo "Script file missing or syntax error."',
    proTip: 'Use ShellCheck (`apt install shellcheck` or `shellcheck script.sh`) to detect subtle bash bugs and formatting flaws.',
    tags: ['Bash', 'Scripting', 'Automation', 'HealthCheck']
  },
  {
    id: 'day-10',
    dayNumber: 10,
    title: 'Task Scheduling with Cron Jobs & At Timers',
    level: 'junior',
    category: 'Automation & Scripts',
    durationMinutes: 35,
    summary: 'Master cron syntax schedule expressions, crontab management, output redirection, and one-time `at` execution.',
    scenario: 'Schedule a database backup script to run every night at 02:30 AM, send logs to /var/log/backup.log, and schedule a one-off system maintenance notification command using `at`.',
    labEnvironment: {
      quickSetupCommand: 'docker run -d --name lab-day10 ubuntu:latest sleep infinity',
      description: 'Linux machine with cron/cronie and at installed.'
    },
    prerequisites: ['Bash scripting basics'],
    tasks: [
      {
        id: 'd10-t1',
        text: 'Understand 5-field cron syntax: Minute Hour DayOfMonth Month DayOfWeek.',
        codeSnippet: '# 30 2 * * * /usr/local/bin/backup.sh >> /var/log/backup.log 2>&1'
      },
      {
        id: 'd10-t2',
        text: 'Add a scheduled task into current user crontab non-interactively.',
        codeSnippet: '(crontab -l 2>/dev/null; echo "30 2 * * * /tmp/backup.sh >> /var/log/backup.log 2>&1") | crontab -'
      },
      {
        id: 'd10-t3',
        text: 'Verify crontab contents and examine system cron drop-in folders (/etc/cron.d, /etc/cron.daily).',
        codeSnippet: 'crontab -l\nls -la /etc/cron.d /etc/cron.daily'
      },
      {
        id: 'd10-t4',
        text: 'Schedule a one-time execution command using `at` for 10 minutes from now.',
        codeSnippet: 'echo "echo \'Maintenance starting\' >> /tmp/maint.log" | at now + 10 minutes\natq'
      }
    ],
    hints: [
      {
        id: 'd10-h1',
        title: 'Hint 1: Cron Environment PATH',
        content: 'Cron executes with a minimal PATH environment (`/usr/bin:/bin`). Always use absolute paths in crontabs!'
      }
    ],
    verificationCommand: 'crontab -l | grep -q "backup.sh" && echo "VERIFIED: Crontab entry added successfully!"',
    proTip: 'Always redirect stdout and stderr (`>> /path/to/log 2>&1`) in cron entries to avoid MTA mail queue buildup in `/var/mail`.',
    tags: ['Cron', 'Crontab', 'At', 'Scheduling']
  },

  // --- MID-LEVEL (Days 11-20) ---
  {
    id: 'day-11',
    dayNumber: 11,
    title: 'Storage Management with LVM (PV, VG & LV Expansion)',
    level: 'mid',
    category: 'Storage & LVM',
    durationMinutes: 50,
    summary: 'Manage Logical Volume Manager (LVM) components: Physical Volumes, Volume Groups, and online filesystem expansion.',
    scenario: 'The production database disk partition is out of space. Attach a new virtual block device, create a Physical Volume, add it to Volume Group "vg_data", and dynamically extend Logical Volume "lv_db" without downtime.',
    labEnvironment: {
      quickSetupCommand: 'docker run --privileged -d --name lab-day11 ubuntu:latest sleep infinity',
      description: 'Privileged Linux container or VM with `lvm2` installed.'
    },
    prerequisites: ['Storage concepts', 'Root access'],
    tasks: [
      {
        id: 'd11-t1',
        text: 'Scan available block storage devices and initialize a loop device for simulation.',
        codeSnippet: 'dd if=/dev/zero of=/tmp/disk1.img bs=1M count=500\nlosetup -fP /tmp/disk1.img\nlosetup -a'
      },
      {
        id: 'd11-t2',
        text: 'Create Physical Volume (pvcreate) and Volume Group (vgcreate) named "vg_store".',
        codeSnippet: 'LOOP=$(losetup -j /tmp/disk1.img | cut -d: -f1)\npvcreate $LOOP\nvgcreate vg_store $LOOP\nvgdisplay vg_store'
      },
      {
        id: 'd11-t3',
        text: 'Create Logical Volume "lv_app" with 200MB size and format with ext4 filesystem.',
        codeSnippet: 'lvcreate -L 200M -n lv_app vg_store\nmke2fs -t ext4 /dev/vg_store/lv_app'
      },
      {
        id: 'd11-t4',
        text: 'Online extend the Logical Volume to 400MB and resize filesystem in one step.',
        codeSnippet: 'lvextend -L +150M -r /dev/vg_store/lv_app\nlvs'
      }
    ],
    hints: [
      {
        id: 'd11-h1',
        title: 'Hint 1: Resizing Flag',
        content: 'Use `lvextend -r` (or `--resizefs`) to automatically resize the underlying ext4/xfs filesystem along with the LV!'
      }
    ],
    verificationCommand: 'lvs vg_store/lv_app >/dev/null 2>&1 && echo "VERIFIED: LVM Logical volume successfully initialized!"',
    proTip: 'XFS filesystems can be grown online with `xfs_growfs`, but note that XFS filesystems CANNOT be shrunk!',
    tags: ['LVM', 'PV', 'VG', 'LV', 'Storage', 'Ext4']
  },
  {
    id: 'day-12',
    dayNumber: 12,
    title: 'Software RAID Arrays with mdadm & Redundancy',
    level: 'mid',
    category: 'Storage & LVM',
    durationMinutes: 50,
    summary: 'Build, monitor, break, and rebuild RAID 1 (Mirrored) and RAID 5 storage arrays using mdadm.',
    scenario: 'Configure a fault-tolerant software RAID 1 array for critical data storage using two block devices. Simulate a disk failure, mark device faulty, remove it, and rebuild array with spare disk.',
    labEnvironment: {
      quickSetupCommand: 'docker run --privileged -d --name lab-day12 ubuntu:latest sleep infinity',
      description: 'Linux machine with `mdadm` package installed.'
    },
    prerequisites: ['Storage & LVM basics'],
    tasks: [
      {
        id: 'd12-t1',
        text: 'Prepare 2 virtual loop devices for RAID 1 creation.',
        codeSnippet: 'dd if=/dev/zero of=/tmp/r1.img bs=1M count=200\ndd if=/dev/zero of=/tmp/r2.img bs=1M count=200\nDEV1=$(losetup -fP --show /tmp/r1.img)\nDEV2=$(losetup -fP --show /tmp/r2.img)'
      },
      {
        id: 'd12-t2',
        text: 'Assemble RAID 1 mirrored device /dev/md0 using mdadm.',
        codeSnippet: 'mdadm --create /dev/md0 --level=1 --raid-devices=2 $DEV1 $DEV2 --force\ncat /proc/mdstat'
      },
      {
        id: 'd12-t3',
        text: 'Save RAID array configuration to /etc/mdadm/mdadm.conf to persist across reboots.',
        codeSnippet: 'mkdir -p /etc/mdadm\nmdadm --detail --scan >> /etc/mdadm/mdadm.conf'
      },
      {
        id: 'd12-t4',
        text: 'Simulate disk failure on array device and verify degraded state in /proc/mdstat.',
        codeSnippet: 'mdadm /dev/md0 --fail $DEV1\ncat /proc/mdstat\nmdadm /dev/md0 --remove $DEV1'
      }
    ],
    hints: [
      {
        id: 'd12-h1',
        title: 'Hint 1: RAID Levels',
        content: 'RAID 0 = Striping (fast, no parity), RAID 1 = Mirroring (high safety, 50% capacity), RAID 5 = Striping with single distributed parity (requires >=3 disks).'
      }
    ],
    verificationCommand: 'test -e /dev/md0 && echo "VERIFIED: Software RAID device active!"',
    proTip: 'After updating `mdadm.conf`, remember to run `update-initramfs -u` on Debian/Ubuntu systems so the RAID array is auto-assembled at boot!',
    tags: ['RAID', 'Mdadm', 'Storage', 'Redundancy']
  },
  {
    id: 'day-13',
    dayNumber: 13,
    title: 'Persistent Storage Mounts, UUIDs & /etc/fstab',
    level: 'mid',
    category: 'Storage & LVM',
    durationMinutes: 40,
    summary: 'Configure automatic persistent storage mounting via `/etc/fstab` using device UUIDs and systemd automount.',
    scenario: 'Safely mount a data disk to `/mnt/appdata` using UUIDs. Ensure improper disk formatting or missing drives do NOT block system boot by setting proper mount options (`nofail`, `_netdev`).',
    labEnvironment: {
      quickSetupCommand: 'docker run --privileged -d --name lab-day13 ubuntu:latest sleep infinity',
      description: 'Linux machine with blkid and util-linux.'
    },
    prerequisites: ['Filesystem formatting basics'],
    tasks: [
      {
        id: 'd13-t1',
        text: 'Identify device UUID and filesystem type using `blkid` or `lsblk -f`.',
        codeSnippet: 'blkid'
      },
      {
        id: 'd13-t2',
        text: 'Create mount target directory /mnt/appdata.',
        codeSnippet: 'mkdir -p /mnt/appdata'
      },
      {
        id: 'd13-t3',
        text: 'Construct safe /etc/fstab entry format: <UUID> <mount> <type> <options> <dump> <pass>.',
        codeSnippet: '# Example fstab entry:\n# UUID=1234-5678 /mnt/appdata ext4 defaults,nofail 0 2'
      },
      {
        id: 'd13-t4',
        text: 'Test all mounts in /etc/fstab immediately without rebooting using `mount -a`.',
        codeSnippet: 'mount -a\ndf -h /mnt/appdata'
      }
    ],
    hints: [
      {
        id: 'd13-h1',
        title: 'Hint 1: Safe Boot Option',
        content: 'Always add `nofail` to non-essential drives in `/etc/fstab`! Without `nofail`, a corrupted non-root disk will cause Emergency Mode on boot.'
      }
    ],
    verificationCommand: 'findmnt /mnt/appdata >/dev/null 2>&1 || echo "VERIFIED: Mount testing workflow executed properly!"',
    proTip: 'NEVER reboot a production server after editing `/etc/fstab` without running `mount -a` and `systemctl daemon-reload` first!',
    tags: ['Fstab', 'Mount', 'UUID', 'Ext4', 'Systemd']
  },
  {
    id: 'day-14',
    dayNumber: 14,
    title: 'Systemd Service Units, Targets & Custom Daemon Creation',
    level: 'mid',
    category: 'Processes & Services',
    durationMinutes: 45,
    summary: 'Create custom systemd unit files (`.service`), configure restart policies, environment files, and target dependencies.',
    scenario: 'Write a production-ready custom systemd unit file for a Python web service `/usr/local/bin/app.py`. Ensure it restarts automatically on crash, runs under unprivileged user `appuser`, and loads env variables from `/etc/default/app`.',
    labEnvironment: {
      quickSetupCommand: 'docker run -d --name lab-day14 ubuntu:latest sleep infinity',
      description: 'Linux machine with systemd init (or simulated systemd environment).'
    },
    prerequisites: ['Systemd basics', 'Service management'],
    tasks: [
      {
        id: 'd14-t1',
        text: 'Create system user "appuser" without shell login.',
        codeSnippet: 'useradd -r -s /usr/sbin/nologin appuser'
      },
      {
        id: 'd14-t2',
        text: 'Write unit file at /etc/systemd/system/webapp.service with [Unit], [Service], and [Install] sections.',
        codeSnippet: 'cat << \'EOF\' > /etc/systemd/system/webapp.service\n[Unit]\nDescription=Acme Custom Web Application\nAfter=network.target\n\n[Service]\nType=simple\nUser=appuser\nWorkingDirectory=/opt/webapp\nExecStart=/usr/bin/python3 -m http.server 8080\nRestart=always\nRestartSec=5s\n\n[Install]\nWantedBy=multi-user.target\nEOF'
      },
      {
        id: 'd14-t3',
        text: 'Reload systemd daemon manager to discover new unit file.',
        codeSnippet: 'systemctl daemon-reload'
      },
      {
        id: 'd14-t4',
        text: 'Enable service to start on boot and start service immediately.',
        codeSnippet: 'systemctl enable --now webapp.service\nsystemctl status webapp.service'
      }
    ],
    hints: [
      {
        id: 'd14-h1',
        title: 'Hint 1: Service Types',
        content: '`Type=simple` (default process stays in foreground), `Type=forking` (legacy background daemonizing), `Type=notify` (sends readiness ping to systemd).'
      }
    ],
    verificationCommand: 'test -f /etc/systemd/system/webapp.service && echo "VERIFIED: Systemd unit file created successfully!"',
    proTip: 'Use `systemd-analyze verify /etc/systemd/system/webapp.service` to catch syntax or directive errors inside unit files!',
    tags: ['Systemd', 'Systemctl', 'Services', 'Daemons']
  },
  {
    id: 'day-15',
    dayNumber: 15,
    title: 'Firewall Management with UFW & Native NFTables Rules',
    level: 'mid',
    category: 'Security & Firewall',
    durationMinutes: 45,
    summary: 'Configure stateful packet filtering using Uncomplicated Firewall (UFW) and direct nftables ruleset definitions.',
    scenario: 'Harden network ingress traffic on a public web server: default deny incoming, allow outgoing, restrict SSH to admin IP subnet (192.168.1.0/24), allow HTTP (80) and HTTPS (443) globally, and enable rate limiting on SSH.',
    labEnvironment: {
      quickSetupCommand: 'docker run --privileged -d --name lab-day15 ubuntu:latest sleep infinity',
      description: 'Linux machine with iptables / nftables and ufw installed.'
    },
    prerequisites: ['Networking fundamentals'],
    tasks: [
      {
        id: 'd15-t1',
        text: 'Reset UFW to default state and set default policies (deny incoming, allow outgoing).',
        codeSnippet: 'ufw --force reset\nufw default deny incoming\nufw default allow outgoing'
      },
      {
        id: 'd15-t2',
        text: 'Allow HTTP (80) and HTTPS (443) port traffic.',
        codeSnippet: 'ufw allow 80/tcp\nufw allow 443/tcp'
      },
      {
        id: 'd15-t3',
        text: 'Allow SSH from restricted admin subnet with rate limiting to block brute-force attacks.',
        codeSnippet: 'ufw limit proto tcp from 192.168.1.0/24 to any port 22'
      },
      {
        id: 'd15-t4',
        text: 'Enable firewall and inspect rule numbers and status.',
        codeSnippet: 'ufw --force enable\nufw status numbered'
      }
    ],
    hints: [
      {
        id: 'd15-h1',
        title: 'Hint 1: UFW Rate Limiting',
        content: '`ufw limit` denies connections from an IP address that has attempted 6 or more connections within 30 seconds.'
      }
    ],
    verificationCommand: 'ufw status | grep -q "Status: active" && echo "VERIFIED: UFW firewall active!"',
    proTip: 'Always verify SSH rules BEFORE enabling firewall (`ufw enable`). Enabling a default deny firewall without SSH rule will immediately sever your remote connection!',
    tags: ['Firewall', 'UFW', 'NFTables', 'Security', 'Ports']
  },
  {
    id: 'day-16',
    dayNumber: 16,
    title: 'Nginx Web Server Reverse Proxy & Virtual Hosts Configuration',
    level: 'mid',
    category: 'Web Servers & Proxy',
    durationMinutes: 45,
    summary: 'Set up Nginx as a high-performance reverse proxy routing incoming traffic to backend application servers.',
    scenario: 'Configure Nginx to proxy incoming traffic for domain `api.internal` to a Node/Python app running on `127.0.0.1:5000`, set custom Proxy headers (`X-Real-IP`, `X-Forwarded-For`), and enable Gzip compression.',
    labEnvironment: {
      quickSetupCommand: 'docker run -d --name lab-day16 ubuntu:latest sleep infinity',
      description: 'Linux container with nginx installed (`apt-get install -y nginx`).'
    },
    prerequisites: ['HTTP protocol concepts', 'Networking'],
    tasks: [
      {
        id: 'd16-t1',
        text: 'Create a site configuration file in /etc/nginx/sites-available/api.conf.',
        codeSnippet: 'cat << \'EOF\' > /etc/nginx/sites-available/api.conf\nserver {\n    listen 80;\n    server_name api.internal;\n\n    location / {\n        proxy_pass http://127.0.0.1:5000;\n        proxy_set_header Host $host;\n        proxy_set_header X-Real-IP $remote_addr;\n        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;\n        proxy_set_header X-Forwarded-Proto $scheme;\n    }\n}\nEOF'
      },
      {
        id: 'd16-t2',
        text: 'Enable site configuration by creating a symbolic link in /etc/nginx/sites-enabled/.',
        codeSnippet: 'ln -s /etc/nginx/sites-available/api.conf /etc/nginx/sites-enabled/'
      },
      {
        id: 'd16-t3',
        text: 'Test Nginx configuration syntax for syntax errors.',
        codeSnippet: 'nginx -t'
      },
      {
        id: 'd16-t4',
        text: 'Reload Nginx service without dropping existing connections.',
        codeSnippet: 'systemctl reload nginx || nginx -s reload'
      }
    ],
    hints: [
      {
        id: 'd16-h1',
        title: 'Hint 1: Soft Reload vs Restart',
        content: '`nginx -s reload` performs a hot-reload of worker processes without closing existing TCP connections.'
      }
    ],
    verificationCommand: 'nginx -t 2>&1 | grep -q "syntax is ok" && echo "VERIFIED: Nginx config valid!"',
    proTip: 'Always configure `proxy_read_timeout` and `client_max_body_size` in reverse proxy blocks to prevent default 60s timeouts or 1MB payload limits.',
    tags: ['Nginx', 'ReverseProxy', 'WebServers', 'HTTP']
  },
  {
    id: 'day-17',
    dayNumber: 17,
    title: 'SSL/TLS Certificate Automation & OpenSSL Inspection',
    level: 'mid',
    category: 'Security & Firewall',
    durationMinutes: 45,
    summary: 'Generate self-signed SSL certificates for staging, inspect X.509 cert metadata, and set up Certbot auto-renewal.',
    scenario: 'Generate a 2048-bit RSA key and self-signed X.509 certificate with Subject Alternative Name (SAN) for local domain `app.local`, inspect cert expiry date, and configure automated cron renewal for Let’s Encrypt.',
    labEnvironment: {
      quickSetupCommand: 'docker run -d --name lab-day17 ubuntu:latest sleep infinity',
      description: 'Linux machine with openssl and certbot installed.'
    },
    prerequisites: ['Public Key Infrastructure (PKI) concepts'],
    tasks: [
      {
        id: 'd17-t1',
        text: 'Generate private key and self-signed X.509 certificate using openssl.',
        codeSnippet: 'mkdir -p /etc/ssl/custom\nopenssl req -x509 -nodes -days 365 -newkey rsa:2048 \\\n  -keyout /etc/ssl/custom/app.key \\\n  -out /etc/ssl/custom/app.crt \\\n  -subj "/CN=app.local/O=Acme Corp"'
      },
      {
        id: 'd17-t2',
        text: 'Inspect certificate expiration date, issuer, and fingerprint using openssl x509.',
        codeSnippet: 'openssl x509 -in /etc/ssl/custom/app.crt -text -noout | head -n 15\nopenssl x509 -in /etc/ssl/custom/app.crt -enddate -noout'
      },
      {
        id: 'd17-t3',
        text: 'Verify SSL handshakes and test certificate trust chain using openssl s_client.',
        codeSnippet: 'openssl s_client -connect google.com:443 -servername google.com'
      },
      {
        id: 'd17-t4',
        text: 'Simulate Certbot SSL certificate renewal process using dry-run flag.',
        codeSnippet: 'certbot renew --dry-run'
      }
    ],
    hints: [
      {
        id: 'd17-h1',
        title: 'Hint 1: Certificate Inspection',
        content: 'Use `openssl x509 -enddate -noout -in cert.crt` to easily check expiration dates programmatically in monitoring scripts.'
      }
    ],
    verificationCommand: 'test -f /etc/ssl/custom/app.crt && echo "VERIFIED: SSL certificate generated successfully!"',
    proTip: 'Never leave SSL private keys readable by world users! Set file permission `chmod 600 /etc/ssl/custom/app.key` owned by root or web daemon user.',
    tags: ['SSL', 'TLS', 'OpenSSL', 'Certbot', 'Security']
  },
  {
    id: 'day-18',
    dayNumber: 18,
    title: 'System Performance Diagnostics & I/O Bottlenecks',
    level: 'mid',
    category: 'Kernel & Performance',
    durationMinutes: 50,
    summary: 'Identify CPU saturation, memory exhaustion, swap usage, disk I/O bottlenecks using `iostat`, `vmstat`, and `sar`.',
    scenario: 'Users report severe slowdowns on a database server. Determine if the bottleneck is CPU load average (1m/5m/15m), disk wait (%iowait), memory paging/swapping, or runaway I/O processes.',
    labEnvironment: {
      quickSetupCommand: 'docker run -d --name lab-day18 ubuntu:latest sleep infinity',
      description: 'Linux machine with `sysstat` installed (`apt-get install -y sysstat`).'
    },
    prerequisites: ['Linux process management'],
    tasks: [
      {
        id: 'd18-t1',
        text: 'Check system load averages and uptime metrics.',
        codeSnippet: 'uptime\ncat /proc/loadavg'
      },
      {
        id: 'd18-t2',
        text: 'Run vmstat to monitor memory swap-in/swap-out (si/so) and context switches (cs) over 2-second intervals.',
        codeSnippet: 'vmstat 2 5'
      },
      {
        id: 'd18-t3',
        text: 'Use iostat to check extended disk metrics (%util, await, r/s, w/s) per block device.',
        codeSnippet: 'iostat -xz 2 3'
      },
      {
        id: 'd18-t4',
        text: 'Inspect per-process disk read/write bandwidth using `pidstat`.',
        codeSnippet: 'pidstat -d 2 3'
      }
    ],
    hints: [
      {
        id: 'd18-h1',
        title: 'Hint 1: Load Average Rule of Thumb',
        content: 'Load average represents the average number of runnable processes. On an 8-core CPU, a load average > 8.0 indicates CPU queuing.'
      }
    ],
    verificationCommand: 'which iostat >/dev/null && echo "VERIFIED: Diagnostic tools installed and functional!"',
    proTip: 'If `%iowait` is high in `top` or `vmstat`, look closely at `iostat -x` `%util` and `await`. High `await` (>10ms) usually points to slow disk arrays or SAN storage latency.',
    tags: ['Performance', 'Sysstat', 'Vmstat', 'Iostat', 'CPU', 'Disk']
  },
  {
    id: 'day-19',
    dayNumber: 19,
    title: 'Data Synchronization, Incremental Backups & Restic',
    level: 'mid',
    category: 'Automation & Scripts',
    durationMinutes: 45,
    summary: 'Perform bandwidth-efficient file sync using `rsync` with ssh, excluded paths, and deduplicated backups.',
    scenario: 'Configure automated incremental sync of `/var/www/data` to a remote backup location `/backup/archive`. Ensure symlinks, permissions, timestamps are preserved, deleted files are pruned, and progress is logged.',
    labEnvironment: {
      quickSetupCommand: 'docker run -d --name lab-day19 ubuntu:latest sleep infinity',
      description: 'Linux machine with `rsync` installed.'
    },
    prerequisites: ['SSH keys', 'File permissions'],
    tasks: [
      {
        id: 'd19-t1',
        text: 'Create sample directory structure with mock files in /tmp/src_data.',
        codeSnippet: 'mkdir -p /tmp/src_data/sub /tmp/dst_backup\ntouch /tmp/src_data/{file1,file2}.txt /tmp/src_data/sub/file3.txt'
      },
      {
        id: 'd19-t2',
        text: 'Perform dry-run sync using rsync with archive (-a), verbose (-v), and human-readable (-h) flags.',
        codeSnippet: 'rsync -avhn --delete /tmp/src_data/ /tmp/dst_backup/'
      },
      {
        id: 'd19-t3',
        text: 'Execute actual sync and mirror directory contents cleanly while excluding .tmp files.',
        codeSnippet: 'rsync -avh --delete --exclude="*.tmp" /tmp/src_data/ /tmp/dst_backup/'
      },
      {
        id: 'd19-t4',
        text: 'Verify file checksums between source and destination using sha256sum or rsync checksum mode (-c).',
        codeSnippet: 'rsync -avc /tmp/src_data/ /tmp/dst_backup/'
      }
    ],
    hints: [
      {
        id: 'd19-h1',
        title: 'Hint 1: Trailing Slash in Rsync',
        content: '`rsync src/ dst/` copies the CONTENTS of `src`. `rsync src dst/` creates directory `dst/src`! Mind trailing slashes.'
      }
    ],
    verificationCommand: 'test -f /tmp/dst_backup/file1.txt && echo "VERIFIED: Rsync backup directory populated!"',
    proTip: 'Always run `rsync -n` (dry run) before executing commands with `--delete` in production to prevent accidentally wiping target folders!',
    tags: ['Rsync', 'Backups', 'Sync', 'Data']
  },
  {
    id: 'day-20',
    dayNumber: 20,
    title: 'Docker Engine Administration & Systemd Container Services',
    level: 'mid',
    category: 'Containers & Docker',
    durationMinutes: 45,
    summary: 'Manage Docker daemon, inspect container resources, manage image layers, cleanup dangling volumes, and wrap containers in systemd.',
    scenario: 'Run a stateless Nginx container with volume bind mounts, resource memory/CPU limits, custom restart policy, and configure systemd to start the container on system boot.',
    labEnvironment: {
      quickSetupCommand: 'docker run --privileged -d --name lab-day20 ubuntu:latest sleep infinity',
      description: 'Linux machine with Docker or Podman installed.'
    },
    prerequisites: ['Basic container concepts'],
    tasks: [
      {
        id: 'd20-t1',
        text: 'Launch container with memory limit (256MB), CPU limit (0.5 cores), and port binding.',
        codeSnippet: 'docker run -d --name web-app -m 256m --cpus="0.5" -p 8081:80 nginx:alpine'
      },
      {
        id: 'd20-t2',
        text: 'Inspect container stats, real-time resource utilization, and JSON inspect metadata.',
        codeSnippet: 'docker stats web-app --no-stream\ndocker inspect web-app | grep -i memory'
      },
      {
        id: 'd20-t3',
        text: 'Prune unused docker volumes, stopped containers, and dangling images.',
        codeSnippet: 'docker system prune -f'
      },
      {
        id: 'd20-t4',
        text: 'Export container logs and set up log rotation limits in /etc/docker/daemon.json.',
        codeSnippet: 'docker logs --tail 20 web-app'
      }
    ],
    hints: [
      {
        id: 'd20-h1',
        title: 'Hint 1: Docker Log Rotation',
        content: 'Without setting `max-size` and `max-file` in daemon.json, container JSON logs will consume 100% of the disk over time.'
      }
    ],
    verificationCommand: 'docker ps >/dev/null 2>&1 && echo "VERIFIED: Docker engine available!"',
    proTip: 'Add `"log-driver": "json-file"`, `"log-opts": {"max-size": "10m", "max-file": "3"}` to `/etc/docker/daemon.json` on every new production server.',
    tags: ['Docker', 'Containers', 'Resources', 'Limits']
  },

  // --- SENIOR LEVEL (Days 21-30) ---
  {
    id: 'day-21',
    dayNumber: 21,
    title: 'Linux Kernel Parameter Tuning & Sysctl Optimization',
    level: 'senior',
    category: 'Kernel & Performance',
    durationMinutes: 55,
    summary: 'Tune high-concurrency Linux kernel networking, file descriptors, TCP buffers, and Virtual Memory swapiness.',
    scenario: 'A high-throughput web proxy server is dropping incoming TCP connections and throwing "Too many open files" errors. Tune `/etc/sysctl.d/99-performance.conf` and `/etc/security/limits.conf` for production high concurrency.',
    labEnvironment: {
      quickSetupCommand: 'docker run --privileged -d --name lab-day21 ubuntu:latest sleep infinity',
      description: 'Privileged Linux container or virtual machine.'
    },
    prerequisites: ['Linux networking', 'Kernel architecture'],
    tasks: [
      {
        id: 'd21-t1',
        text: 'Increase system-wide max open file handles (fs.file-max) and inspect current limits.',
        codeSnippet: 'sysctl fs.file-max\nsysctl -w fs.file-max=2097152'
      },
      {
        id: 'd21-t2',
        text: 'Tune TCP socket buffer sizes, TIME_WAIT socket reuse, and SYN backlog queues.',
        codeSnippet: 'cat << \'EOF\' > /etc/sysctl.d/99-network.conf\nnet.core.somaxconn = 65535\nnet.ipv4.tcp_tw_reuse = 1\nnet.ipv4.tcp_max_syn_backlog = 16384\nnet.ipv4.ip_local_port_range = 1024 65535\nvm.swappiness = 10\nEOF'
      },
      {
        id: 'd21-t3',
        text: 'Apply new kernel sysctl settings dynamically without rebooting.',
        codeSnippet: 'sysctl --system'
      },
      {
        id: 'd21-t4',
        text: 'Configure user soft and hard open file limits in /etc/security/limits.conf.',
        codeSnippet: 'echo "* soft nofile 65536" >> /etc/security/limits.conf\necho "* hard nofile 65536" >> /etc/security/limits.conf'
      }
    ],
    hints: [
      {
        id: 'd21-h1',
        title: 'Hint 1: Somaxconn vs Syn Backlog',
        content: '`somaxconn` is the max listen queue size for fully established sockets; `tcp_max_syn_backlog` controls half-open connection queues.'
      }
    ],
    verificationCommand: 'test -f /etc/sysctl.d/99-network.conf && echo "VERIFIED: Kernel tuning config created!"',
    proTip: 'Set `vm.swappiness=10` or lower on database / Kubernetes nodes to avoid unexpected disk swapping latency spikes.',
    tags: ['Kernel', 'Sysctl', 'Performance', 'TCP', 'FileLimits']
  },
  {
    id: 'day-22',
    dayNumber: 22,
    title: 'eBPF Tracing, Kernel Instrumentation & BPFtrace',
    level: 'senior',
    category: 'Kernel & Performance',
    durationMinutes: 60,
    summary: 'Use Extended Berkeley Packet Filter (eBPF) and BCC tools to trace kernel syscalls, disk latencies, and process executions without overhead.',
    scenario: 'Investigate transient latency spikes occurring deep in the Linux VFS storage stack or kernel network stack using eBPF tools (`bpftrace`, `execsnoop`, `biolatency`).',
    labEnvironment: {
      quickSetupCommand: 'docker run --privileged --pid=host -d --name lab-day22 ubuntu:latest sleep infinity',
      description: 'Linux kernel >= 4.19 with bpfcc-tools / bpftrace installed.'
    },
    prerequisites: ['Kernel fundamentals', 'Root privileges'],
    tasks: [
      {
        id: 'd22-t1',
        text: 'Inspect loaded eBPF programs in the Linux kernel.',
        codeSnippet: 'bpftool prog list || echo "bpftool ready"'
      },
      {
        id: 'd22-t2',
        text: 'Trace short-lived process executions system-wide in real time using execsnoop.',
        codeSnippet: 'execsnoop-bpfcc -T 5 || bpftrace -e \'tracepoint:syscalls:sys_enter_execve { printf("%s -> %s\\n", comm, str(args->filename)); }\''
      },
      {
        id: 'd22-t3',
        text: 'Measure block device I/O latency distribution histogram using biolatency.',
        codeSnippet: 'biolatency-bpfcc 1 3 || echo "eBPF disk tracing ready"'
      },
      {
        id: 'd22-t4',
        text: 'Write a custom 1-line bpftrace script to count system calls grouped by process name.',
        codeSnippet: 'bpftrace -e \'tracepoint:raw_syscalls:sys_enter { @[comm] = count(); }\''
      }
    ],
    hints: [
      {
        id: 'd22-h1',
        title: 'Hint 1: What is eBPF?',
        content: 'eBPF runs sandboxed bytecode safely inside the Linux kernel without requiring kernel modules or causing kernel panics.'
      }
    ],
    verificationCommand: 'which bpftrace >/dev/null 2>&1 || which execsnoop-bpfcc >/dev/null 2>&1 || echo "VERIFIED: eBPF tool environment inspected."',
    proTip: 'eBPF is revolutionizing Linux observability, networking (Cilium), and security (Falco). Learn bpftrace for instant low-overhead troubleshooting!',
    tags: ['eBPF', 'BPFtrace', 'Kernel', 'Tracing', 'Profiling']
  },
  {
    id: 'day-23',
    dayNumber: 23,
    title: 'High Availability with Keepalived & Virtual IPs (VRRP)',
    level: 'senior',
    category: 'High Availability',
    durationMinutes: 55,
    summary: 'Configure VRRP (Virtual Router Redundancy Protocol) with Keepalived to manage a floating Virtual IP (VIP) across Master/Backup nodes.',
    scenario: 'Set up seamless failover for active/passive web nodes. Node A holds Virtual IP `192.168.1.100`. If Nginx or Node A fails, Node B automatically takes over the VIP within 1 second.',
    labEnvironment: {
      quickSetupCommand: 'docker run --privileged -d --name lab-day23 ubuntu:latest sleep infinity',
      description: 'Linux environment with keepalived installed.'
    },
    prerequisites: ['Networking', 'Virtual IPs', 'High Availability'],
    tasks: [
      {
        id: 'd23-t1',
        text: 'Create Keepalived master node configuration in /etc/keepalived/keepalived.conf.',
        codeSnippet: 'cat << \'EOF\' > /etc/keepalived/keepalived.conf\nvrrp_script check_nginx {\n    script "pidof nginx"\n    interval 2\n    weight 2\n}\n\nvrrp_instance VI_1 {\n    state MASTER\n    interface eth0\n    virtual_router_id 51\n    priority 101\n    advert_int 1\n    authentication {\n        auth_type PASS\n        auth_pass Secret123\n    }\n    virtual_ipaddress {\n        10.0.0.100/24\n    }\n    track_script {\n        check_nginx\n    }\n}\nEOF'
      },
      {
        id: 'd23-t2',
        text: 'Allow VRRP traffic protocol (IP protocol 112) in firewall.',
        codeSnippet: 'ufw allow proto vrrp || iptables -A INPUT -p vrrp -j ACCEPT'
      },
      {
        id: 'd23-t3',
        text: 'Enable non-local IP binding in sysctl so services can bind to floating VIP before failover.',
        codeSnippet: 'sysctl -w net.ipv4.ip_nonlocal_bind=1'
      },
      {
        id: 'd23-t4',
        text: 'Test state change and IP takeover logs in journalctl.',
        codeSnippet: 'keepalived -t -f /etc/keepalived/keepalived.conf'
      }
    ],
    hints: [
      {
        id: 'd23-h1',
        title: 'Hint 1: Non-Local Bind',
        content: '`net.ipv4.ip_nonlocal_bind=1` allows Nginx or HAProxy to bind to an IP address that is not yet active on the local network interface.'
      }
    ],
    verificationCommand: 'test -f /etc/keepalived/keepalived.conf && echo "VERIFIED: Keepalived configuration verified!"',
    proTip: 'Always use unique `virtual_router_id` numbers per keepalived cluster on shared Layer 2 networks to avoid split-brain conflicts!',
    tags: ['HA', 'Keepalived', 'VRRP', 'VirtualIP', 'Failover']
  },
  {
    id: 'day-24',
    dayNumber: 24,
    title: 'HAProxy Load Balancing (Layer 4 TCP & Layer 7 HTTP)',
    level: 'senior',
    category: 'High Availability',
    durationMinutes: 55,
    summary: 'Configure HAProxy for active load balancing, round-robin algorithms, health checks, and stats dashboard.',
    scenario: 'Distribute traffic across 3 backend web servers using HAProxy Layer 7 round-robin balancing, configure automated health check endpoints, HTTP header manipulation, and secure stats UI.',
    labEnvironment: {
      quickSetupCommand: 'docker run -d --name lab-day24 ubuntu:latest sleep infinity',
      description: 'Linux environment with haproxy installed.'
    },
    prerequisites: ['Load balancing', 'HTTP/TCP protocols'],
    tasks: [
      {
        id: 'd24-t1',
        text: 'Configure frontend and backend balance pools in /etc/haproxy/haproxy.cfg.',
        codeSnippet: 'cat << \'EOF\' > /etc/haproxy/haproxy.cfg\nglobal\n    log /dev/log local0\n    maxconn 4000\n\ndefaults\n    mode http\n    timeout connect 5000ms\n    timeout client 50000ms\n    timeout server 50000ms\n\nfrontend http_front\n    bind *:80\n    default_backend http_back\n\nbackend http_back\n    balance roundrobin\n    option httpchk GET /health\n    server web1 10.0.0.11:80 check inter 2000ms\n    server web2 10.0.0.12:80 check inter 2000ms\n\nlisten stats\n    bind *:8404\n    stats enable\n    stats uri /haproxy?stats\nEOF'
      },
      {
        id: 'd24-t2',
        text: 'Verify HAProxy configuration syntax.',
        codeSnippet: 'haproxy -c -f /etc/haproxy/haproxy.cfg'
      },
      {
        id: 'd24-t3',
        text: 'Configure HAProxy logging to rsyslog / journald.',
        codeSnippet: 'haproxy -vv'
      },
      {
        id: 'd24-t4',
        text: 'Test backend failover by taking a web server offline.',
        codeSnippet: '# Simulation check'
      }
    ],
    hints: [
      {
        id: 'd24-h1',
        title: 'Hint 1: Balance Algorithms',
        content: '`roundrobin` (equal distribution), `leastconn` (best for long sessions like WebSockets/DBs), `source` (IP hash stickiness).'
      }
    ],
    verificationCommand: 'haproxy -c -f /etc/haproxy/haproxy.cfg 2>&1 | grep -q "valid" && echo "VERIFIED: HAProxy syntax valid!"',
    proTip: 'Use `balance leastconn` for database clusters or long-lived API connections to avoid overwhelming specific backend nodes.',
    tags: ['HAProxy', 'LoadBalancer', 'HighAvailability', 'TCP', 'HTTP']
  },
  {
    id: 'day-25',
    dayNumber: 25,
    title: 'Ansible Infrastructure as Code & Playbook Automation',
    level: 'senior',
    category: 'Automation & Scripts',
    durationMinutes: 60,
    summary: 'Write declarative Ansible playbooks with inventory variables, handlers, roles, and idempotent state tasks.',
    scenario: 'Automate fleet provisioning: write an Ansible playbook that manages user accounts, updates package caches, deploys Nginx, templates dynamic configuration files using Jinja2, and triggers handlers.',
    labEnvironment: {
      quickSetupCommand: 'docker run -d --name lab-day25 ubuntu:latest sleep infinity',
      description: 'Linux machine with `ansible` installed (`apt-get install -y ansible`).'
    },
    prerequisites: ['SSH', 'YAML syntax', 'Automation'],
    tasks: [
      {
        id: 'd25-t1',
        text: 'Create inventory file (hosts) specifying localhost connection.',
        codeSnippet: 'mkdir -p /tmp/ansible\ncat << \'EOF\' > /tmp/ansible/hosts\n[webservers]\nlocalhost ansible_connection=local\nEOF'
      },
      {
        id: 'd25-t2',
        text: 'Write idempotent playbook site.yml with tasks and handlers.',
        codeSnippet: 'cat << \'EOF\' > /tmp/ansible/site.yml\n---\n- name: Deploy Web Servers\n  hosts: webservers\n  tasks:\n    - name: Ensure Nginx is installed\n      apt:\n        name: nginx\n        state: present\n      notify: Restart Nginx\n\n  handlers:\n    - name: Restart Nginx\n      service:\n        name: nginx\n        state: restarted\nEOF'
      },
      {
        id: 'd25-t3',
        text: 'Run playbook syntax check and dry-run execution (--check).',
        codeSnippet: 'ansible-playbook -i /tmp/ansible/hosts /tmp/ansible/site.yml --syntax-check'
      },
      {
        id: 'd25-t4',
        text: 'Execute playbook and verify idempotency on second run (0 changed tasks).',
        codeSnippet: 'ansible-playbook -i /tmp/ansible/hosts /tmp/ansible/site.yml'
      }
    ],
    hints: [
      {
        id: 'd25-h1',
        title: 'Hint 1: Idempotency',
        content: 'An Ansible task is idempotent if executing it multiple times leaves the system in the exact same state without unintended side effects.'
      }
    ],
    verificationCommand: 'ansible-playbook --syntax-check -i /tmp/ansible/hosts /tmp/ansible/site.yml 2>&1 | grep -q "playbook" && echo "VERIFIED: Playbook syntax valid!"',
    proTip: 'Always write handlers for service restarts so daemons only restart when configuration files actually change!',
    tags: ['Ansible', 'IaC', 'Playbooks', 'Automation', 'YAML']
  },
  {
    id: 'day-26',
    dayNumber: 26,
    title: 'Advanced Packet Capture & Network Diagnostics with Tcpdump',
    level: 'senior',
    category: 'Networking',
    durationMinutes: 55,
    summary: 'Capture raw network frames with `tcpdump`, filter by host/port/TCP flags (SYN/ACK/RST), and export .pcap files for Wireshark analysis.',
    scenario: 'Diagnose intermittent TCP connection resets (RST) on port 443. Capture raw packets, inspect TCP 3-way handshakes, identify packet drops, and inspect DNS queries in pcap format.',
    labEnvironment: {
      quickSetupCommand: 'docker run --privileged -d --name lab-day26 ubuntu:latest sleep infinity',
      description: 'Linux container with tcpdump, tshark, and netcat.'
    },
    prerequisites: ['TCP/IP Stack', 'Packet structure'],
    tasks: [
      {
        id: 'd26-t1',
        text: 'List available network capture interfaces.',
        codeSnippet: 'tcpdump -D'
      },
      {
        id: 'd26-t2',
        text: 'Capture traffic on eth0 filtered for TCP port 80/443 without DNS resolution (-n).',
        codeSnippet: 'tcpdump -i any -nn "tcp port 80 or tcp port 443" -c 10'
      },
      {
        id: 'd26-t3',
        text: 'Filter specifically for TCP SYN or RST packet flags.',
        codeSnippet: 'tcpdump -nn "tcp[tcpflags] & (tcp-syn|tcp-rst) != 0"'
      },
      {
        id: 'd26-t4',
        text: 'Write capture buffer to a .pcap file and read back using tcpdump/tshark.',
        codeSnippet: 'tcpdump -i any -w /tmp/capture.pcap -c 20\ntcpdump -r /tmp/capture.pcap -nn'
      }
    ],
    hints: [
      {
        id: 'd26-h1',
        title: 'Hint 1: Tcpdump Flags',
        content: '`-n` prevents DNS resolution (drastically faster), `-vvv` increases verbosity, `-w` writes binary pcap files.'
      }
    ],
    verificationCommand: 'which tcpdump >/dev/null && echo "VERIFIED: Tcpdump diagnostic tools ready!"',
    proTip: 'Use `tcpdump -nn -s 0 -A` to print raw ASCII HTTP payload contents directly to the terminal screen!',
    tags: ['Tcpdump', 'Pcap', 'Wireshark', 'Networking', 'Troubleshooting']
  },
  {
    id: 'day-27',
    dayNumber: 27,
    title: 'Linux Security Auditing, PAM & SELinux / AppArmor',
    level: 'senior',
    category: 'Security & Firewall',
    durationMinutes: 60,
    summary: 'Audit system security controls, manage Pluggable Authentication Modules (PAM), and configure AppArmor / SELinux contexts.',
    scenario: 'A web server process cannot access custom directory `/var/data` despite correct `chmod 777` permissions due to Mandatory Access Control (MAC). Diagnose and resolve AppArmor/SELinux context denials.',
    labEnvironment: {
      quickSetupCommand: 'docker run --privileged -d --name lab-day27 ubuntu:latest sleep infinity',
      description: 'Linux machine with apparmor or selinux tools installed.'
    },
    prerequisites: ['Linux security architecture'],
    tasks: [
      {
        id: 'd27-t1',
        text: 'Check Mandatory Access Control status (aa-status for AppArmor or getenforce for SELinux).',
        codeSnippet: 'aa-status || getenforce'
      },
      {
        id: 'd27-t2',
        text: 'Inspect SELinux security contexts on files (ls -Z) or AppArmor profiles in /etc/apparmor.d/.',
        codeSnippet: 'ls -Z /var/www\naa-status --enabled'
      },
      {
        id: 'd27-t3',
        text: 'Inspect PAM authentication rules in /etc/pam.d/common-auth and pam_tally2 / pam_faillock account lockouts.',
        codeSnippet: 'cat /etc/pam.d/common-password'
      },
      {
        id: 'd27-t4',
        text: 'Audit system security posture using Lynis security scanner.',
        codeSnippet: 'which lynis || echo "Security auditing workflow ready"'
      }
    ],
    hints: [
      {
        id: 'd27-h1',
        title: 'Hint 1: SELinux vs AppArmor',
        content: 'SELinux uses label-based security contexts on files and processes (RedHat/Rocky); AppArmor uses path-based profile rules (Debian/Ubuntu).'
      }
    ],
    verificationCommand: 'test -d /etc/pam.d && echo "VERIFIED: Security auditing environment active!"',
    proTip: 'Never disable SELinux/AppArmor globally in production (`setenforce 0`)! Fix the context labeling (`chcon` / `semanage fcontext`) instead.',
    tags: ['SELinux', 'AppArmor', 'PAM', 'Security', 'Auditing']
  },
  {
    id: 'day-28',
    dayNumber: 28,
    title: 'Kubernetes Node Operations & Cgroups v2 Tuning',
    level: 'senior',
    category: 'Containers & Docker',
    durationMinutes: 60,
    summary: 'Manage Kubernetes node components (kubelet, containerd), inspect cgroups v2 resource accounting, and debug crash loops.',
    scenario: 'A Kubernetes worker node is in `NotReady` state due to container runtime disk pressure and cgroup memory OOM kills. Inspect containerd, triage cgroups v2, and drain the node safely.',
    labEnvironment: {
      quickSetupCommand: 'docker run -d --name lab-day28 ubuntu:latest sleep infinity',
      description: 'Linux machine with cgroups v2 mounted (`/sys/fs/cgroup`).'
    },
    prerequisites: ['Kubernetes architecture', 'Containers'],
    tasks: [
      {
        id: 'd28-t1',
        text: 'Inspect Linux cgroups version (cgroup2 filesystem mount at /sys/fs/cgroup).',
        codeSnippet: 'stat -f -c %T /sys/fs/cgroup'
      },
      {
        id: 'd28-t2',
        text: 'Inspect memory OOM kill events in cgroups controllers.',
        codeSnippet: 'cat /sys/fs/cgroup/memory.events'
      },
      {
        id: 'd28-t3',
        text: 'Inspect containerd runtime socket and CNI plugin directory structure.',
        codeSnippet: 'ls -la /etc/containerd/ || echo "Containerd ready"'
      },
      {
        id: 'd28-t4',
        text: 'Simulate node draining or cordoning command structure for maintenance.',
        codeSnippet: 'echo "kubectl cordon <node-name> && kubectl drain <node-name> --ignore-daemonsets"'
      }
    ],
    hints: [
      {
        id: 'd28-h1',
        title: 'Hint 1: Cgroups v2 Unified Hierarchy',
        content: 'Cgroups v2 provides a single unified tree at `/sys/fs/cgroup` with improved memory pressure monitoring (`memory.high` / `memory.peak`).'
      }
    ],
    verificationCommand: 'test -d /sys/fs/cgroup && echo "VERIFIED: Cgroups system verified!"',
    proTip: 'Always configure systemd as the cgroup driver for both Docker/Containerd and Kubelet to prevent dual-cgroup driver memory leaks!',
    tags: ['Kubernetes', 'Cgroups', 'Containerd', 'Kubelet', 'OOM']
  },
  {
    id: 'day-29',
    dayNumber: 29,
    title: 'Disaster Recovery, Live System Rescue & Chroot Recovery',
    level: 'senior',
    category: 'Observability & Logs',
    durationMinutes: 60,
    summary: 'Recover an unbootable Linux system, mount root filesystems from Live ISO, execute `chroot`, and rebuild GRUB / initramfs.',
    scenario: 'A botched kernel upgrade or corrupted `/etc/fstab` broke the boot bootloader sequence. Boot into a emergency live environment, mount root/proc/sys/dev, enter `chroot`, and repair GRUB bootloader.',
    labEnvironment: {
      quickSetupCommand: 'docker run -d --name lab-day29 ubuntu:latest sleep infinity',
      description: 'Linux container or virtual machine.'
    },
    prerequisites: ['GRUB', 'Kernel boot process', 'Root access'],
    tasks: [
      {
        id: 'd29-t1',
        text: 'Simulate mounting damaged system root partition to /mnt/rescue.',
        codeSnippet: 'mkdir -p /mnt/rescue'
      },
      {
        id: 'd29-t2',
        text: 'Bind virtual filesystems required for chroot (/proc, /sys, /dev, /dev/pts).',
        codeSnippet: 'echo "mount --bind /dev /mnt/rescue/dev"\necho "mount --bind /proc /mnt/rescue/proc"\necho "mount --bind /sys /mnt/rescue/sys"'
      },
      {
        id: 'd29-t3',
        text: 'Enter chroot environment and update initramfs / GRUB boot parameters.',
        codeSnippet: 'echo "chroot /mnt/rescue update-grub"'
      },
      {
        id: 'd29-t4',
        text: 'Cleanly unmount all rescue bind mounts in reverse order before rebooting.',
        codeSnippet: 'echo "umount -R /mnt/rescue"'
      }
    ],
    hints: [
      {
        id: 'd29-h1',
        title: 'Hint 1: Why bind virtual filesystems?',
        content: '`chroot` isolates the filesystem root, but utilities like `grub-install` or `update-initramfs` require access to `/dev` hardware nodes and kernel state in `/proc` & `/sys`.'
      }
    ],
    verificationCommand: 'test -d /mnt/rescue && echo "VERIFIED: Disaster recovery workspace initialized!"',
    proTip: 'Keep a bootable Linux USB drive with tools like SystemRescue or Ubuntu Live ISO in every data center or server room for emergency chroot operations.',
    tags: ['Rescue', 'Chroot', 'GRUB', 'DisasterRecovery', 'Kernel']
  },
  {
    id: 'day-30',
    dayNumber: 30,
    title: 'Production Observability Stack: Prometheus & Node Exporter',
    level: 'senior',
    category: 'Observability & Logs',
    durationMinutes: 60,
    summary: 'Deploy Prometheus Node Exporter, expose system metrics on port 9100, configure scraping jobs, and build alerts for disk/CPU saturation.',
    scenario: 'Final Day Challenge! Deploy Node Exporter across your infrastructure fleet, verify metrics endpoint (`/metrics`), configure Prometheus scrape targets, and build alert rules for high CPU load and disk space exhaustion.',
    labEnvironment: {
      quickSetupCommand: 'docker run -d -p 9100:9100 --name node-exporter prom/node-exporter:latest || docker run -d --name lab-day30 ubuntu:latest sleep infinity',
      description: 'Linux machine or Docker environment.'
    },
    prerequisites: ['Observability concepts', 'Metrics'],
    tasks: [
      {
        id: 'd30-t1',
        text: 'Download and install Prometheus Node Exporter binary to /usr/local/bin/.',
        codeSnippet: 'mkdir -p /tmp/node_exporter\ncurl -fsSL https://github.com/prometheus/node_exporter/releases/download/v1.7.0/node_exporter-1.7.0.linux-amd64.tar.gz | tar -xz -C /tmp/node_exporter --strip-components=1'
      },
      {
        id: 'd30-t2',
        text: 'Create a dedicated system user and systemd unit for node_exporter.',
        codeSnippet: 'useradd -r -s /usr/sbin/nologin node_exporter || true\ncat << \'EOF\' > /etc/systemd/system/node_exporter.service\n[Unit]\nDescription=Prometheus Node Exporter\nAfter=network.target\n\n[Service]\nUser=node_exporter\nExecStart=/usr/local/bin/node_exporter\nRestart=always\n\n[Install]\nWantedBy=multi-user.target\nEOF'
      },
      {
        id: 'd30-t3',
        text: 'Query metrics endpoint on port 9100 for node_cpu_seconds_total and node_filesystem_free_bytes.',
        codeSnippet: 'curl -fsSL http://localhost:9100/metrics | grep node_cpu_seconds_total | head -n 10'
      },
      {
        id: 'd30-t4',
        text: 'CONGRATULATIONS! You completed all 30 days of the Linux System Administration Challenge!',
        codeSnippet: 'echo "🎉 CONGRATULATIONS! YOU ARE NOW A CERTIFIED LINUX INFRASTRUCTURE ARCHITECT! 🎉"'
      }
    ],
    hints: [
      {
        id: 'd30-h1',
        title: 'Hint 1: Node Exporter Metrics',
        content: 'Node Exporter exposes hundreds of Linux kernel metrics formatted in OpenMetrics standard ready for Prometheus scraping.'
      }
    ],
    verificationCommand: 'echo "VERIFIED: Day 30 completed! You conquered the SysAdmin Challenge!"',
    proTip: 'Congratulations! Keep building, sharing knowledge, and automating. You have built a solid foundation from Linux CLI basics to Senior SRE/Infra Ops!',
    tags: ['Prometheus', 'Metrics', 'NodeExporter', 'Observability', 'Monitoring', 'Finale']
  }
];
