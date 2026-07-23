import React, { useState } from 'react';
import { User, Github, Linkedin, Twitter, Mail, Heart, Code2, Globe, Shield, Terminal, Copy, Check, ExternalLink, Sparkles, Users } from 'lucide-react';
import { ABOUT_ME } from '../data/aboutData';
import { CodeBlock } from './CodeBlock';
import { ScrollReveal, ScrollRevealItem } from './motion/ScrollReveal';

export function AboutView() {
  const [copiedClone, setCopiedClone] = useState(false);

  const cloneCommand = 'git clone https://github.com/ahmedmediaworkx/linux-sysadmin-30-day-challenge.git';

  const handleCopyClone = async () => {
    try {
      await navigator.clipboard.writeText(cloneCommand);
      setCopiedClone(true);
      setTimeout(() => setCopiedClone(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Profile Card */}
      <ScrollReveal distance={40} duration={0.6}>
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 text-slate-100 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6 sm:gap-8">
            {/* Avatar / Profile Graphic */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-br from-emerald-400 via-teal-500 to-blue-600 flex items-center justify-center text-slate-950 font-black text-2xl sm:text-3xl shadow-xl shadow-emerald-500/20 shrink-0 border-2 border-white/20">
              AW
            </div>

            <div className="space-y-3 flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <User className="w-3.5 h-3.5" />
                <span>Community Founder & Open Source Contributor</span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                {ABOUT_ME.name}
              </h1>

              <p className="text-emerald-400 font-semibold text-xs sm:text-sm font-mono">
                cloud engineer & creative experience help and building community for sharing knowledge of modern IT.
              </p>

              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-2xl">
                {ABOUT_ME.bio}
              </p>

              {/* Social Links */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href={ABOUT_ME.socials.github}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-2 transition-colors"
                >
                  <Github className="w-4 h-4 text-emerald-400" />
                  <span>GitHub @ahmedmediaworkx</span>
                </a>

                <a
                  href={ABOUT_ME.socials.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-2 transition-colors"
                >
                  <Linkedin className="w-4 h-4 text-blue-400" />
                  <span>LinkedIn Profile</span>
                </a>

                {'twitter' in ABOUT_ME.socials && (ABOUT_ME.socials as Record<string, string>).twitter && (
                  <a
                    href={(ABOUT_ME.socials as Record<string, string>).twitter}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-2 transition-colors"
                  >
                    <Twitter className="w-4 h-4 text-sky-400" />
                    <span>X / Twitter</span>
                  </a>
                )}

                <a
                  href={ABOUT_ME.socials.email}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-colors shadow-lg shadow-emerald-500/10"
                >
                  <Mail className="w-4 h-4" />
                  <span>Get in Touch</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Community Mission & Quote */}
      <ScrollReveal
        staggerChildren={0.1}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <ScrollRevealItem distance={40} duration={0.6} className="md:col-span-2">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4 h-full">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-500" />
              <span>Modern IT Community & Knowledge Sharing Initiative</span>
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Our goal is to eliminate the gap between beginner theory and real-world infrastructure operations. This 30-Day Linux System Administrator challenge was designed as a 100% open-source interactive repository so engineers around the globe can practice real CLI commands, debug production scenarios, and level up together.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {ABOUT_ME.stats.map((st) => (
                <div key={st.label} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <span className="text-base font-extrabold text-emerald-500 block font-mono">{st.value}</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">{st.label}</span>
                </div>
              ))}
            </div>
          </div>
        </ScrollRevealItem>

        {/* Quote Card */}
        <ScrollRevealItem distance={40} duration={0.6}>
          <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-3xl p-6 flex flex-col justify-between space-y-4 h-full">
            <div className="space-y-2">
              <Sparkles className="w-6 h-6 text-emerald-500" />
              <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 italic leading-relaxed">
                "{ABOUT_ME.quote}"
              </p>
            </div>

            <div className="pt-4 border-t border-emerald-500/20 text-xs">
              <span className="font-bold text-slate-900 dark:text-slate-100 block">{ABOUT_ME.name}</span>
              <span className="text-slate-500 text-[11px]">Cloud Engineer</span>
            </div>
          </div>
        </ScrollRevealItem>
      </ScrollReveal>

      {/* GitHub Repository Showcase */}
      <ScrollReveal distance={40} duration={0.6} delay={0.2}>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Github className="w-5 h-5 text-emerald-500" />
                <span>Open-Source Repository on GitHub</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Fork, star, or contribute to this static web application codebase on GitHub.
              </p>
            </div>

            <a
              href="https://github.com/ahmedmediaworkx/linux-sysadmin-30-day-challenge"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-100 text-slate-100 dark:text-slate-900 font-bold text-xs flex items-center gap-1.5 hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors shadow-xs"
            >
              <span>Star on GitHub</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <CodeBlock
            code={cloneCommand}
            title="Clone Open-Source Repository"
          />
        </div>
      </ScrollReveal>
    </div>
  );
}
