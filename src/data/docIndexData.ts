import { LinuxDocRef } from '../types';

export interface DocCategoryGroup {
  category: string;
  description: string;
  links: LinuxDocRef[];
}

export const LINUX_DOCS_GROUPS: DocCategoryGroup[] = [
  {
    category: 'Core Linux Kernel & Manuals',
    description: 'Official Linux kernel architecture guides, system call interfaces, and POSIX manual pages.',
    links: [
      {
        title: 'Linux Kernel Documentation',
        url: 'https://docs.kernel.org/',
        description: 'Official kernel subsystem guides, memory management, and driver development.'
      },
      {
        title: 'Kernel.org Document Archive',
        url: 'https://www.kernel.org/doc/',
        description: 'Comprehensive release notes, source code documentation, and HOWTO guides.'
      },
      {
        title: 'Linux Manual Pages (Man7.org)',
        url: 'https://man7.org/',
        description: 'Kerrisk’s authoritative online Linux man-pages for C functions and CLI utilities.'
      },
      {
        title: 'Linux Kernel Man-Pages Project',
        url: 'https://www.kernel.org/doc/man-pages/',
        description: 'Primary man-pages project maintaining section 2 (syscalls) and section 3 (C library).'
      }
    ]
  },
  {
    category: 'GNU / Bash Shell Reference',
    description: 'GNU toolchain manuals, shell parameter expansion, POSIX compliance, and scripting standards.',
    links: [
      {
        title: 'GNU Software Manuals',
        url: 'https://www.gnu.org/software/',
        description: 'Official documentation for Coreutils, Grep, Gawk, Sed, Make, and GCC.'
      },
      {
        title: 'GNU Bash Reference Manual',
        url: 'https://www.gnu.org/software/bash/manual/',
        description: 'The primary reference manual for the GNU Bourne-Again SHell (bash).'
      }
    ]
  },
  {
    category: 'Distributions & Enterprise Ecosystems',
    description: 'Vendor-specific admin handbooks, package management guides, and community knowledgebases.',
    links: [
      {
        title: 'Red Hat Enterprise Linux Docs',
        url: 'https://docs.redhat.com/',
        description: 'Enterprise guide for RHEL storage, security, SELinux, and system administration.'
      },
      {
        title: 'Ubuntu Official Documentation',
        url: 'https://documentation.ubuntu.com/',
        description: 'Canonical Ubuntu Server guides, Cloud-init, Subiquity installer, and Netplan configuration.'
      },
      {
        title: 'Debian Documentation Library',
        url: 'https://www.debian.org/doc/',
        description: 'Debian Administrator’s Handbook, APT guide, and policy manuals.'
      },
      {
        title: 'Arch Linux Wiki',
        url: 'https://wiki.archlinux.org/',
        description: 'World-class community wiki detailing Linux system administration and CLI tools.'
      },
      {
        title: 'Fedora Project Documentation',
        url: 'https://docs.fedoraproject.org/',
        description: 'Upstream guides for Fedora Server, CoreOS, Flatpak, and OSTree.'
      },
      {
        title: 'SUSE / openSUSE Documentation',
        url: 'https://documentation.suse.com/',
        description: 'Enterprise guides for SUSE Linux Enterprise Server (SLES) and YaST.'
      }
    ]
  },
  {
    category: 'System Architecture, Security & Standards',
    description: 'Systemd service management, OpenSSH security specifications, and POSIX standards.',
    links: [
      {
        title: 'OpenSSH Manual Pages',
        url: 'https://www.openssh.com/manual.html',
        description: 'Official specifications for sshd_config, ssh_config, ssh-keygen, and sftp-server.'
      },
      {
        title: 'Systemd Official Documentation',
        url: 'https://systemd.io/',
        description: 'Primary documentation for systemd, journald, networkd, resolved, and systemctl.'
      },
      {
        title: 'Linux From Scratch (LFS)',
        url: 'https://www.linuxfromscratch.org/',
        description: 'In-depth guide to building a custom Linux system from source code.'
      },
      {
        title: 'POSIX IEEE Std 1003.1 Standard',
        url: 'https://pubs.opengroup.org/onlinepubs/9699919799/',
        description: 'The Open Group Base Specifications for Unix and Portable Operating System Interface.'
      }
    ]
  }
];
