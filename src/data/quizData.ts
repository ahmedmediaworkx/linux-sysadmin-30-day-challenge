import { DayChallenge, QuizQuestion } from '../types';

export const CATEGORY_QUIZZES: Record<string, QuizQuestion[]> = {
  'Basics & CLI': [
    {
      id: 'q1-cli',
      question: 'Which Linux command options display hidden files (starting with .) along with detailed permissions and file sizes?',
      options: ['ls -a', 'ls -l', 'ls -la', 'ls -R'],
      correctAnswerIndex: 2,
      explanation: 'ls -la combines -a (all files including hidden dotfiles) and -l (long format detailing permissions, owner, size, and modification timestamp).'
    },
    {
      id: 'q2-cli',
      question: 'What is the primary function of the "tar -xvf archive.tar.gz" flags?',
      options: [
        'eXtract, Verbose logging, and File output from a tarball',
        'eXecute, Validate, and Filter files',
        'eXpress Archive and Compress with gzip',
        'eXport Volume and Format filesystem'
      ],
      correctAnswerIndex: 0,
      explanation: '-x stands for extract, -v enables verbose progress output, and -f specifies the archive filename to process.'
    },
    {
      id: 'q3-cli',
      question: 'How do you recursively search for the string "ERROR" across all .log files under /var/log using grep?',
      options: [
        'grep -r "ERROR" /var/log/*.log',
        'grep -rn "ERROR" --include="*.log" /var/log/',
        'grep -f "ERROR" /var/log',
        'find /var/log -name ERROR'
      ],
      correctAnswerIndex: 1,
      explanation: 'grep -rn searches recursively (-r) with line numbers (-n) and respects --include filters for specific file extensions.'
    }
  ],
  'Permissions & Users': [
    {
      id: 'q1-perm',
      question: 'What numerical octal representation corresponds to file permissions rwxr-xr--?',
      options: ['754', '755', '644', '775'],
      correctAnswerIndex: 0,
      explanation: 'rwx (4+2+1=7), r-x (4+0+1=5), r-- (4+0+0=4). Thus 754 represents owner:rwx, group:r-x, others:r--.'
    },
    {
      id: 'q2-perm',
      question: 'Which command sets the SetUID (SUID) bit on an executable binary /usr/local/bin/custom-tool?',
      options: [
        'chmod 4755 /usr/local/bin/custom-tool',
        'chmod 2755 /usr/local/bin/custom-tool',
        'chmod 1755 /usr/local/bin/custom-tool',
        'chmod u+x /usr/local/bin/custom-tool'
      ],
      correctAnswerIndex: 0,
      explanation: 'Octal 4000 represents SetUID (4755). When executed, the process runs with the file owner privileges rather than the calling user privileges.'
    },
    {
      id: 'q3-perm',
      question: 'Where are default sudoer permissions safely edited using syntax validation on RHEL/Ubuntu systems?',
      options: [
        'nano /etc/sudoers',
        'visudo',
        'chmod 777 /etc/sudoers',
        'useradd -G sudoers'
      ],
      correctAnswerIndex: 1,
      explanation: 'Always use visudo to edit /etc/sudoers because it performs strict syntax checking prior to saving, preventing locked-out root states.'
    }
  ],
  'Processes & Services': [
    {
      id: 'q1-proc',
      question: 'Which signal does "kill -9 <PID>" send to a running process, and can it be caught or ignored?',
      options: [
        'SIGTERM; can be caught by the application',
        'SIGKILL; cannot be caught, blocked, or ignored by any process',
        'SIGINT; requests immediate graceful reload',
        'SIGHUP; re-reads configuration files'
      ],
      correctAnswerIndex: 1,
      explanation: 'SIGKILL (signal 9) forces the kernel to immediately terminate the process without letting it run cleanup handlers or catch signals.'
    },
    {
      id: 'q2-proc',
      question: 'Which systemctl command enables a service to start automatically upon system boot and starts it immediately?',
      options: [
        'systemctl start --boot service',
        'systemctl enable --now service',
        'systemctl reload-or-restart service',
        'systemctl status service -f'
      ],
      correctAnswerIndex: 1,
      explanation: 'The --now flag combined with systemctl enable activates the service immediately in addition to creating symlinks for boot activation.'
    },
    {
      id: 'q3-proc',
      question: 'Where are system-wide custom systemd unit files recommended to be stored by modern SysAdmins?',
      options: [
        '/usr/lib/systemd/system/',
        '/etc/systemd/system/',
        '/var/run/systemd/system/',
        '/lib/systemd/system/'
      ],
      correctAnswerIndex: 1,
      explanation: '/etc/systemd/system/ holds local administrative unit files which override distribution-provided files located in /usr/lib/systemd/system/.'
    }
  ],
  'Networking': [
    {
      id: 'q1-net',
      question: 'Which command replaces legacy "ifconfig" and displays active network interfaces, IP addresses, and CIDR masks on modern Linux distributions?',
      options: ['ip addr show', 'netstat -tuln', 'route -n', 'ifstatus'],
      correctAnswerIndex: 0,
      explanation: 'ip addr (or ip a) from the iproute2 suite is the modern replacement for deprecated net-tools like ifconfig.'
    },
    {
      id: 'q2-net',
      question: 'Which SS command options list all listening TCP ports along with their associated Process IDs (PID)?',
      options: ['ss -a', 'ss -tulnp', 'ss -s', 'ss -r'],
      correctAnswerIndex: 1,
      explanation: '-t (tcp), -u (udp), -l (listening), -n (numeric ports), -p (processes/PIDs).'
    },
    {
      id: 'q3-net',
      question: 'How do you inspect the path packets take to reach a destination host line-by-line using ICMP/UDP probes?',
      options: ['ping -c 4', 'traceroute (or tracepath)', 'dig +trace', 'nc -zv'],
      correctAnswerIndex: 1,
      explanation: 'traceroute tracks packet route hops by gradually increasing TTL (Time To Live) values on outbound probe packets.'
    }
  ],
  'Storage & LVM': [
    {
      id: 'q1-lvm',
      question: 'What is the correct logical hierarchy order when building storage with Linux LVM?',
      options: [
        'Physical Volume (PV) -> Volume Group (VG) -> Logical Volume (LV)',
        'Volume Group (VG) -> Physical Volume (PV) -> Filesystem',
        'Logical Volume (LV) -> Partition Table -> Physical Volume',
        'Filesystem -> Block Device -> Physical Volume'
      ],
      correctAnswerIndex: 0,
      explanation: 'Raw block devices are initialized as Physical Volumes (pvcreate), aggregated into a Volume Group (vgcreate), and carved into Logical Volumes (lvcreate).'
    },
    {
      id: 'q2-lvm',
      question: 'Which command extends a logical volume by 10GB and automatically grows the underlying Ext4 or XFS filesystem online?',
      options: [
        'lvextend -L +10G -r /dev/vg0/lv_data',
        'vgextend -L 10G /dev/vg0',
        'resize2fs /dev/vg0/lv_data 10G',
        'pvresize /dev/sda1'
      ],
      correctAnswerIndex: 0,
      explanation: 'The -r (--resizefs) flag instructs lvextend to automatically invoke resize2fs or xfs_growfs upon extending the logical volume volume space.'
    },
    {
      id: 'q3-lvm',
      question: 'Which file dictates static filesystem mount parameters and auto-mounts block devices at boot time?',
      options: ['/etc/fstab', '/etc/exports', '/etc/mnttab', '/proc/mounts'],
      correctAnswerIndex: 0,
      explanation: '/etc/fstab contains device UUIDs, mount points, filesystem types, and mount options processed by systemd-fstab-generator during boot.'
    }
  ],
  'Security & Firewall': [
    {
      id: 'q1-sec',
      question: 'Which UFW command allows incoming SSH connections strictly from IP 192.168.1.50 on port 22?',
      options: [
        'ufw allow from 192.168.1.50 to any port 22',
        'ufw allow ssh',
        'ufw enable 192.168.1.50:22',
        'iptables -A INPUT -p tcp --dport 22 -j ACCEPT'
      ],
      correctAnswerIndex: 0,
      explanation: '"ufw allow from 192.168.1.50 to any port 22" creates a targeted firewall rule granting port 22 access solely to that specific source IP address.'
    },
    {
      id: 'q2-sec',
      question: 'In SELinux enforcing mode, which command changes the security context of a file to httpd_sys_content_t persistent across relabels?',
      options: [
        'semanage fcontext -a -t httpd_sys_content_t "/var/www/html(/.*)?" && restorecon -R /var/www/html',
        'chcon -t httpd_sys_content_t /var/www/html',
        'setenforce 0',
        'chmod -R 777 /var/www/html'
      ],
      correctAnswerIndex: 0,
      explanation: 'semanage fcontext registers permanent policy mappings in SELinux, and restorecon applies those policies to filesystem inodes.'
    },
    {
      id: 'q3-sec',
      question: 'Which file stores encrypted user password hashes on modern Linux systems with root-only read access?',
      options: ['/etc/passwd', '/etc/shadow', '/etc/security/limits.conf', '/etc/pam.d/common-auth'],
      correctAnswerIndex: 1,
      explanation: '/etc/shadow holds salted shadow hashes with permission 600 owned by root, separating sensitive credentials from world-readable /etc/passwd.'
    }
  ],
  'Web Servers & Proxy': [
    {
      id: 'q1-web',
      question: 'Which Nginx configuration directive acts as a reverse proxy forwarding client requests to a backend server on port 8080?',
      options: ['proxy_pass http://127.0.0.1:8080;', 'fastcgi_pass http://127.0.0.1:8080;', 'root /var/www/backend;', 'alias http://127.0.0.1:8080;'],
      correctAnswerIndex: 0,
      explanation: 'proxy_pass specifies the protocol and address of the upstream proxied server to pass incoming matching location requests to.'
    },
    {
      id: 'q2-web',
      question: 'How do you test Nginx configuration files for syntax errors prior to reloading the service?',
      options: ['nginx -t', 'nginx -s reload', 'systemctl check nginx', 'nginx --verify'],
      correctAnswerIndex: 0,
      explanation: 'nginx -t validates syntax and attempts to open configuration files referenced in nginx.conf, alerting you to syntax errors before service downtime.'
    },
    {
      id: 'q3-web',
      question: 'What command requests a free, automated Let’s Encrypt TLS certificate for Nginx using Certbot?',
      options: ['certbot --nginx', 'openssl req -new -x509', 'certbot renew --force', 'certutil -N'],
      correctAnswerIndex: 0,
      explanation: 'certbot --nginx automatically verifies domain ownership via ACME HTTP-01 challenges and modifies Nginx server blocks with SSL paths.'
    }
  ],
  'Automation & Scripts': [
    {
      id: 'q1-auto',
      question: 'What does "set -euo pipefail" at the beginning of a Bash script enforce?',
      options: [
        'Exit on error (-e), exit on unset variable (-u), and propagate pipeline failure statuses (pipefail)',
        'Enable quiet execution mode and suppress stdout',
        'Execute in POSIX sh compatibility mode',
        'Run script concurrently in background threads'
      ],
      correctAnswerIndex: 0,
      explanation: 'set -euo pipefail is standard defensive Bash programming to catch uninitialized variables, command errors, and hidden pipeline failures early.'
    },
    {
      id: 'q2-auto',
      question: 'How do you safely parse JSON data on the CLI within shell scripts?',
      options: ['jq', 'awk', 'sed', 'grep -j'],
      correctAnswerIndex: 0,
      explanation: 'jq is the industry-standard lightweight and flexible command-line JSON processor.'
    },
    {
      id: 'q3-auto',
      question: 'What field in a systemd .timer unit file specifies an execution schedule matching cron expression patterns (e.g., Mon-Fri at 3am)?',
      options: ['OnCalendar=Mon..Fri *-*-* 03:00:00', 'OnBootSec=15m', 'OnUnitActiveSec=1d', 'CronSchedule=0 3 * * 1-5'],
      correctAnswerIndex: 0,
      explanation: 'OnCalendar defines calendar event expressions in systemd timer specifications with microsecond precision.'
    }
  ],
  'Containers & Docker': [
    {
      id: 'q1-docker',
      question: 'Which Docker command creates an isolated, disposable container, executes a command inside, and removes the container upon exit?',
      options: ['docker run --rm -it alpine sh', 'docker exec -it container_id sh', 'docker build --no-cache .', 'docker container prune'],
      correctAnswerIndex: 0,
      explanation: 'The --rm flag automatically deletes the container container file system footprint once its primary process terminates.'
    },
    {
      id: 'q2-docker',
      question: 'What is the purpose of multi-stage Docker builds using multiple FROM instructions in a Dockerfile?',
      options: [
        'To separate build-time dependencies (compilers/SDKs) from minimal production runtime images',
        'To run multiple containers simultaneously in one container',
        'To mirror images across different registries',
        'To automatically scale CPU limits'
      ],
      correctAnswerIndex: 0,
      explanation: 'Multi-stage builds allow compiling code in heavy builder stages and copying strictly compiled binaries into tiny scratch or distroless base images.'
    },
    {
      id: 'q3-docker',
      question: 'How do you mount a host directory /opt/data into a container at /data in read-only mode?',
      options: ['-v /opt/data:/data:ro', '-v /opt/data:/data:rw', '--mount type=bind,src=/data,dst=/opt/data', '-p 8080:80'],
      correctAnswerIndex: 0,
      explanation: 'Adding the suffix :ro to volume bind mounts prevents processes inside the container from modifying host files.'
    }
  ],
  'Kernel & Performance': [
    {
      id: 'q1-kernel',
      question: 'Which tool dynamically modifies kernel parameters at runtime without requiring a reboot or rebuild?',
      options: ['sysctl', 'dmesg', 'lsmod', 'modprobe'],
      correctAnswerIndex: 0,
      explanation: 'sysctl reads and writes runtime kernel configuration values exposed in the /proc/sys/ pseudo-filesystem.'
    },
    {
      id: 'q2-kernel',
      question: 'What does the Linux kernel OOM (Out Of Memory) Killer do when system RAM and swap are exhausted?',
      options: [
        'Selects and terminates a high oom_score process to reclaim physical memory pages',
        'Automatically reboots the physical machine',
        'Expands swap partition size on disk',
        'Freezes all kernel threads until memory is freed'
      ],
      correctAnswerIndex: 0,
      explanation: 'The OOM Killer calculates an oom_score for active processes based on memory footprint and kills the highest scoring non-essential process.'
    },
    {
      id: 'q3-kernel',
      question: 'Which command displays kernel ring buffer log messages related to hardware initialization and kernel panics?',
      options: ['dmesg -T', 'journalctl -u kernel', 'cat /var/log/syslog', 'lspci -v'],
      correctAnswerIndex: 0,
      explanation: 'dmesg prints hardware driver init logs and kernel ring buffer events (-T adds human-readable timestamps).'
    }
  ],
  'Observability & Logs': [
    {
      id: 'q1-obs',
      question: 'Which journalctl command follows live system logs for a specific unit service with human-readable timestamps?',
      options: ['journalctl -u nginx.service -f', 'journalctl -k -b', 'journalctl --vacuum-time=2d', 'tail -f /var/log/messages'],
      correctAnswerIndex: 0,
      explanation: '-u filters logs by systemd unit name and -f operates in follow mode (similar to tail -f).'
    },
    {
      id: 'q2-obs',
      question: 'How do you clean up journald binary logs that exceed 500MB on disk?',
      options: ['journalctl --vacuum-size=500M', 'rm -rf /var/log/journal/*', 'systemctl stop journald', 'logrotate -f /etc/logrotate.conf'],
      correctAnswerIndex: 0,
      explanation: 'journalctl --vacuum-size safely trims old archived log files until total disk usage falls below the specified threshold.'
    },
    {
      id: 'q3-obs',
      question: 'Which command provides real-time top-like metrics for per-process disk read and write I/O bandwidth?',
      options: ['iotop', 'htop', 'vmstat 1', 'iostat -xz 1'],
      correctAnswerIndex: 0,
      explanation: 'iotop monitors disk read/write bandwidth consumption per process in real time using Linux kernel netlink taskstats.'
    }
  ],
  'High Availability': [
    {
      id: 'q1-ha',
      question: 'What virtual router redundancy protocol does Keepalived use to manage shared floating virtual IPs across cluster nodes?',
      options: ['VRRP (Virtual Router Redundancy Protocol)', 'BGP', 'OSPF', 'LACP'],
      correctAnswerIndex: 0,
      explanation: 'Keepalived uses VRRP (IP protocol 112) to broadcast heartbeat state packets between MASTER and BACKUP nodes.'
    },
    {
      id: 'q2-ha',
      question: 'In HAProxy configuration, what specifies round-robin layer 7 load balancing across 2 backend web servers?',
      options: [
        'balance roundrobin in backend section',
        'mode udp in frontend section',
        'option http-server-close',
        'bind *:8080 ssl'
      ],
      correctAnswerIndex: 0,
      explanation: 'The "balance roundrobin" algorithm distributes incoming requests sequentially across healthy server directives declared in a backend block.'
    },
    {
      id: 'q3-ha',
      question: 'What is "split-brain" in high-availability cluster architecture?',
      options: [
        'A network partition where both nodes lose heartbeat contact and simultaneously assume primary master roles causing data corruption',
        'When CPU core usage exceeds 100%',
        'When database read replicas sync faster than the primary instance',
        'A memory allocation failure in kernel space'
      ],
      correctAnswerIndex: 0,
      explanation: 'Split-brain occurs when cluster nodes lose communication and both assume active primary rights, leading to conflicting data writes.'
    }
  ]
};

export function getQuizForDay(day: DayChallenge): QuizQuestion[] {
  // If the day challenge itself has customized quiz questions, use them
  if (day.quizQuestions && day.quizQuestions.length > 0) {
    return day.quizQuestions;
  }

  // Look up by category
  const categoryQuestions = CATEGORY_QUIZZES[day.category];
  if (categoryQuestions && categoryQuestions.length >= 3) {
    return categoryQuestions.slice(0, 3);
  }

  // Fallback tailored questions based on day details
  return [
    {
      id: `q1-${day.id}`,
      question: `In Day ${day.dayNumber} (${day.title}), what is the primary objective of the scenario?`,
      options: [
        day.summary,
        'Format all disks with FAT32 filesystems',
        'Disable system logging and firewall rules permanently',
        'Reinstall the operating system from scratch'
      ],
      correctAnswerIndex: 0,
      explanation: `Day ${day.dayNumber} focuses on ${day.title} under the ${day.category} domain.`
    },
    {
      id: `q2-${day.id}`,
      question: `Which verification command is recommended for verifying Day ${day.dayNumber} lab execution?`,
      options: [
        `Execute verification rule: ${day.verificationCommand}`,
        'reboot --force',
        'rm -rf /var/log/*',
        'cat /dev/null > /etc/passwd'
      ],
      correctAnswerIndex: 0,
      explanation: `The verification command "${day.verificationCommand}" asserts correct system state for this lab.`
    },
    {
      id: `q3-${day.id}`,
      question: `What pro-tip guidance is emphasized for Day ${day.dayNumber}?`,
      options: [
        day.proTip,
        'Never inspect system log output',
        'Always disable security options on production systems',
        'Ignore file permissions when writing scripts'
      ],
      correctAnswerIndex: 0,
      explanation: `Pro-tip for Day ${day.dayNumber}: "${day.proTip}"`
    }
  ];
}
