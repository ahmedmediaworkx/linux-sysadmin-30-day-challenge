# 🐧 Linux SysAdmin 30-Day Challenge & Learning Platform

<div align="center">

![Linux SysAdmin Banner](https://img.shields.io/badge/Linux_SysAdmin-30--Day_Challenge-22C55E?style=for-the-badge&logo=linux&logoColor=white)
[![React 19](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.0-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

**An interactive, open-source Linux System Administration & Cloud DevOps learning engine built for modern IT engineers.**

[🚀 Live Interactive App](https://github.com/ahmedmediaworkx/linux-sysadmin-30-day-challenge) • [📖 Knowledge Base](#-technical-knowledge-base) • [⚡ Keyboard Shortcuts](#-keyboard-shortcuts) • [💬 Community](#-community--author)

</div>

---

```
  _     _                  ____                  _     _ min 
 | |   (_)_ __  _   ___  __/ ___| _   _ ___  / \   __| |_ __ ___ (_)_ __  
 | |   | | '_ \| | | \ \/ /\___ \| | | / __|/ _ \ / _` | '_ ` _ \| | '_ \ 
 | |___| | | | | |_| |>  <  ___) | |_| \__ / ___ \ (_| | | | | | | | | | |
 |_____|_|_| |_|\__,_/_/\_\|____/ \__, |___/_/   \_\__,_|_| |_| |_|_|_| |_|
                                  |___/                                   
  30-DAY INTERACTIVE SYSADMIN & CLOUD ENGINEERING CURRICULUM PLATFORM
```

---

## ✨ Highlights & Key Features

* **📅 30-Day Step-by-Step Curriculum**: Covers Linux fundamentals, File System Heirarchy, Systemd, Storage/LVM, eBPF Kernel Tuning, eBPF & Observability, SSH & Hardening, Container Engines, and Cloud DevOps Automation.
* **🖥️ Built-In Interactive Terminal Simulator**: Run authentic Linux commands (`ls`, `cat`, `systemctl`, `journalctl`, `chmod`, `ip`, `ps`, `df`, `free`, `uptime`, `whoami`, `uname`, etc.) directly inside an in-browser terminal emulator.
* **🔥 Interactive Progress & GitHub-Style Heatmap**: Track completed days, current streaks, total points, and visualize activity on an interactive 30-day commit-style heatmap.
* **⚡ Global Command Palette & Keyboard Shortcuts**:
  * Press `⌘K` or `Ctrl+K` to trigger global search across all curriculum modules, docs, and commands.
  * Press `?` or `Shift+/` anytime to display the instant keyboard hotkeys cheat sheet.
  * Press `Alt+1` through `Alt+4` to navigate between main views effortlessly.
* **📚 Integrated Canonical Linux Docs Index**: Instant access to official documentation for Kernel.org, GNU Bash, Systemd, POSIX specifications, Red Hat, and Ubuntu manuals.
* **📤 Progress Export & Backup**: Save, restore, or export your 30-day completion progress into a single JSON file.
* **🌙 Dark / Light System Workspace**: Seamless transition between high-contrast dark ops mode and crisp light theme.

---

## ⌨️ Keyboard Shortcuts Cheat Sheet

| Keybinding | Action |
| :--- | :--- |
| <kbd>⌘</kbd> + <kbd>K</kbd> / <kbd>Ctrl</kbd> + <kbd>K</kbd> | Open Global Command Palette & Search |
| <kbd>?</kbd> / <kbd>Shift</kbd> + <kbd>/</kbd> | Open Keyboard Shortcuts Cheat Sheet |
| <kbd>Alt</kbd> + <kbd>1</kbd> | Go to 30-Day Challenge View |
| <kbd>Alt</kbd> + <kbd>2</kbd> | Go to Interactive Terminal Lab |
| <kbd>Alt</kbd> + <kbd>3</kbd> | Go to Technical Knowledge Base |
| <kbd>Alt</kbd> + <kbd>4</kbd> | Go to Community & About Page |
| <kbd>Alt</kbd> + <kbd>T</kbd> | Toggle Dark / Light Theme |
| <kbd>[</kbd> / <kbd>]</kbd> | Previous / Next Day Challenge |
| <kbd>C</kbd> | Toggle Mark Active Day Complete |
| <kbd>Esc</kbd> | Close Active Modal / Command Palette |

---

## 🚀 Quick Start & Installation

Follow these steps to run the platform locally on your system:

### 1. Clone the Repository
```bash
git clone https://github.com/ahmedmediaworkx/linux-sysadmin-30-day-challenge.git
cd linux-sysadmin-30-day-challenge
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Launch Development Server
```bash
npm run dev
```

Open your browser and navigate to `http://localhost:3000` to start your 30-day Linux journey!

---

## 🛠️ Technology Stack

* **Frontend Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
* **Build Tooling**: [Vite](https://vitejs.dev/) + `@tailwindcss/vite`
* **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
* **Animations**: [Motion (Framer Motion v12)](https://motion.dev/)
* **Icons**: [Lucide React](https://lucide.dev/)
* **Data Visualizations**: [Recharts](https://recharts.org/)
* **Celebrations**: [Canvas Confetti](https://github.com/catdad/canvas-confetti)

---

## 📑 Curriculum Overview

```
WEEK 1: Linux Core Essentials & File Systems
├── Day 01: Linux Architecture & Kernel Basics
├── Day 02: Navigation & Shell Command Power-Tools
├── Day 03: File Operations, Permissions & ACLs
├── Day 04: Process Management & Signals
├── Day 05: Disk Partitioning, File Systems & LVM
├── Day 06: User & Group Administration
└── Day 07: System Logging, Journald & Rsyslog

WEEK 2: Networking, Services & Security
├── Day 08: Networking Fundamentals & IP Routing
├── Day 09: Systemd Service Management & Timers
├── Day 10: SSH Hardening & Public Key Authentication
├── Day 11: Firewall Configuration (UFW & Firewalld)
├── Day 12: Package Management & Repositories
├── Day 13: Cron Jobs, Systemd Timers & Automation
└── Day 14: System Performance Monitoring & Benchmarking

WEEK 3: Storage, Backup & Advanced Shell Scripting
├── Day 15: Bash Scripting - Variables, Loops & Functions
├── Day 16: RAID Configuration & ZFS Basics
├── Day 17: Network Storage (NFS, Samba, iSCSI)
├── Day 18: Backup Strategies, Rsync & Restic
├── Day 19: SELinux & AppArmor Mandatory Access Control
├── Day 20: Troubleshooting Boot Process & GRUB
└── Day 21: High Availability & Load Balancing

WEEK 4: Containers, Cloud Ops & eBPF Observability
├── Day 22: Container Fundamentals with Docker & Podman
├── Day 23: Kubernetes Architecture & kubectl Basics
├── Day 24: Infrastructure as Code with Ansible
├── Day 25: Cloud Infrastructure & GCP / AWS Core Services
├── Day 26: Kernel Tuning, Sysctl & eBPF Tracing
├── Day 27: Web Servers & Reverse Proxies (Nginx / Apache)
├── Day 28: Centralized Monitoring (Prometheus & Grafana)
├── Day 29: Disaster Recovery & Security Incident Response
└── Day 30: Final Capstone SysAdmin Exam & Certificate
```

---

## 👥 Community & Author

Authored and maintained by **Ahmed Wael** (*ahmedmediaworkx*).

* **GitHub**: [@ahmedmediaworkx](https://github.com/ahmedmediaworkx)
* **LinkedIn**: [Ahmed Wael](https://linkedin.com/in/ahmedmediaworkx)
* **Email**: [ahmedmediaworkx.freelance@gmail.com](mailto:ahmedmediaworkx.freelance@gmail.com)

---

## 📄 License

This repository is licensed under the [MIT License](LICENSE) — free to use, fork, modify, and distribute for educational and commercial purposes.

---

<div align="center">
  <sub>Designed with ❤️ for Linux SysAdmins, DevOps, and Cloud Engineers worldwide.</sub>
</div>
