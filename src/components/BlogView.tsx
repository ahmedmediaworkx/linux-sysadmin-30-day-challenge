import React, { useState } from 'react';
import { BookOpen, Search, Clock, Tag, User, ArrowRight, X, Bookmark, Share2, Sparkles, ExternalLink, Globe, Book, Terminal, Shield, Layers } from 'lucide-react';
import { BlogPost } from '../types';
import { BLOG_POSTS } from '../data/blogData';
import { LINUX_DOCS_GROUPS } from '../data/docIndexData';
import { CodeBlock } from './CodeBlock';
import { MotionCard } from './motion/MotionCard';
import { ScrollReveal, ScrollRevealItem } from './motion/ScrollReveal';

export function BlogView() {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'articles' | 'doc-index'>('articles');

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBookmarkedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const filteredPosts = BLOG_POSTS.filter((post) => {
    if (selectedCategory !== 'all' && post.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = post.title.toLowerCase().includes(q);
      const matchExcerpt = post.excerpt.toLowerCase().includes(q);
      const matchTags = post.tags.some((t) => t.toLowerCase().includes(q));
      const matchCategory = post.category.toLowerCase().includes(q);
      if (!matchTitle && !matchExcerpt && !matchTags && !matchCategory) return false;
    }
    return true;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Blog Header */}
      <ScrollReveal distance={40} duration={0.6}>
        <div className="bg-white dark:bg-[#111113] border border-slate-200 dark:border-white/[0.08] rounded-3xl p-6 sm:p-10 text-slate-900 dark:text-slate-100 shadow-2xl relative overflow-hidden">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/20">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Technical Tutorials & Canonical Linux Documentation</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Linux SysAdmin Knowledge Base & Manual Index
            </h1>

            <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
              In-depth technical guides authored by <span className="text-[#22C55E] font-bold">Ahmed (ahmedmediaworkx) Wael</span>, fully integrated with official manual references from Kernel.org, GNU Bash, Red Hat, Ubuntu, Systemd, and POSIX standards.
            </p>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setActiveTab('articles')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'articles'
                    ? 'bg-[#22C55E] text-slate-950 shadow-md shadow-[#22C55E]/20'
                    : 'bg-slate-100 dark:bg-[#18181B] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#27272A]'
                }`}
              >
                Tutorial Articles ({BLOG_POSTS.length})
              </button>
              <button
                onClick={() => setActiveTab('doc-index')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === 'doc-index'
                    ? 'bg-[#22C55E] text-slate-950 shadow-md shadow-[#22C55E]/20'
                    : 'bg-slate-100 dark:bg-[#18181B] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#27272A]'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Official Linux Docs Index</span>
              </button>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {activeTab === 'articles' ? (
        <>
          {/* Search & Categories */}
          <ScrollReveal distance={40} duration={0.6} delay={0.1}>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-[#111113] border border-slate-200 dark:border-white/[0.08] rounded-2xl p-4 shadow-xs">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search tutorials (SSH, eBPF, Systemd, LVM)..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#22C55E]"
                />
              </div>

              <div className="flex flex-wrap gap-2 text-xs">
                {['all', 'Security', 'Automation', 'Kernel', 'Storage'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg font-semibold capitalize transition-colors ${
                      selectedCategory === cat
                        ? 'bg-[#22C55E] text-slate-950 font-bold shadow-xs'
                        : 'bg-slate-100 dark:bg-[#18181B] text-slate-600 dark:text-[#A1A1AA] hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Articles Grid with Staggered Animation */}
          <ScrollReveal
            key={`blog-grid-${selectedCategory}-${searchQuery}`}
            staggerChildren={0.08}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredPosts.map((post) => {
              const isBookmarked = bookmarkedIds.includes(post.id);
              return (
                <ScrollRevealItem key={post.id} distance={40} duration={0.6}>
                  <MotionCard
                    onClick={() => setSelectedPost(post)}
                    className="group bg-white dark:bg-[#111113] border border-slate-200 dark:border-white/[0.08] rounded-2xl p-6 shadow-xs hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between h-full"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/20">
                          {post.category}
                        </span>

                        <button
                          onClick={(e) => toggleBookmark(post.id, e)}
                          className="p-1 rounded hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400 hover:text-amber-400 transition-colors"
                        >
                          <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-400 text-amber-400' : ''}`} />
                        </button>
                      </div>

                      <h2 className="font-bold text-slate-900 dark:text-slate-100 text-lg group-hover:text-[#22C55E] transition-colors leading-snug">
                        {post.title}
                      </h2>

                      <p className="text-xs text-slate-500 dark:text-[#A1A1AA] line-clamp-3 leading-relaxed">
                        {post.excerpt}
                      </p>

                      <div className="flex flex-wrap gap-1">
                        {post.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 rounded text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Author & Read Time */}
                    <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/[0.08] flex items-center justify-between text-xs text-slate-500">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-[#22C55E] text-slate-950 flex items-center justify-center font-bold text-[10px]">
                          AW
                        </div>
                        <span className="font-medium text-slate-700 dark:text-slate-300">{post.author.name}</span>
                      </div>

                      <span className="flex items-center gap-1 font-mono text-[11px]">
                        <Clock className="w-3.5 h-3.5" />
                        {post.readTimeMinutes} min
                      </span>
                    </div>
                  </MotionCard>
                </ScrollRevealItem>
              );
            })}
          </ScrollReveal>
        </>
      ) : (
        /* Dedicated Official Documentation Index Section */
        <div className="space-y-8">
          <ScrollReveal distance={40} duration={0.6}>
            <div className="p-4 rounded-2xl bg-[#22C55E]/10 border border-[#22C55E]/20 text-[#22C55E] text-xs flex items-center gap-2">
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>
                Curated official Linux documentation references used throughout our curriculum, covering kernel subsystems, shell specs, distribution guides, and RFC security standards.
              </span>
            </div>
          </ScrollReveal>

          <ScrollReveal
            staggerChildren={0.08}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {LINUX_DOCS_GROUPS.map((group) => (
              <ScrollRevealItem key={group.category} distance={40} duration={0.6}>
                <div className="bg-white dark:bg-[#111113] border border-slate-200 dark:border-white/[0.08] rounded-3xl p-6 shadow-xs space-y-4 h-full">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <Globe className="w-4 h-4 text-[#22C55E]" />
                      <span>{group.category}</span>
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {group.description}
                    </p>
                  </div>

                  <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-white/[0.08]">
                    {group.links.map((link) => (
                      <a
                        key={link.url}
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="block p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-white/[0.04] border border-slate-200/80 dark:border-white/10 group transition-all"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-slate-900 dark:text-slate-100 group-hover:text-[#22C55E] transition-colors flex items-center gap-1.5">
                            {link.title}
                            <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-[#22C55E]" />
                          </span>
                          <span className="text-[10px] font-mono text-[#22C55E] truncate max-w-[150px]">
                            {new URL(link.url).hostname}
                          </span>
                        </div>
                        {link.description && (
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                            {link.description}
                          </p>
                        )}
                      </a>
                    ))}
                  </div>
                </div>
              </ScrollRevealItem>
            ))}
          </ScrollReveal>
        </div>
      )}

      {/* Article Reader Modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white dark:bg-[#111113] border border-slate-200 dark:border-white/[0.08] rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 dark:border-white/[0.08] pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/20">
                    {selectedPost.category}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    {selectedPost.readTimeMinutes} min read • Published {selectedPost.publishedAt}
                  </span>
                </div>

                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100">
                  {selectedPost.title}
                </h1>
              </div>

              <button
                onClick={() => setSelectedPost(null)}
                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400 hover:text-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Author Box */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#22C55E] text-slate-950 flex items-center justify-center font-bold text-xs">
                AW
              </div>
              <div>
                <span className="font-bold text-slate-900 dark:text-slate-100 text-xs block">
                  {selectedPost.author.name}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  {selectedPost.author.role}
                </span>
              </div>
            </div>

            {/* Official References Bar if available */}
            {selectedPost.docReferences && selectedPost.docReferences.length > 0 && (
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#22C55E] flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5" />
                  <span>Official Reference Documentation</span>
                </span>
                <div className="flex flex-wrap gap-2">
                  {selectedPost.docReferences.map((ref) => (
                    <a
                      key={ref.url}
                      href={ref.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 transition-colors"
                    >
                      <span>{ref.title}</span>
                      <ExternalLink className="w-3 h-3 text-[#22C55E]" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Article Content Render */}
            <div className="text-slate-800 dark:text-slate-200 text-xs sm:text-sm leading-relaxed space-y-4 font-sans">
              <p className="text-slate-600 dark:text-slate-300 font-medium italic border-l-2 border-[#22C55E] pl-3 py-1">
                {selectedPost.excerpt}
              </p>

              {/* Render article sections */}
              <div className="prose dark:prose-invert max-w-none space-y-4">
                {selectedPost.content.split('```').map((chunk, index) => {
                  if (index % 2 === 1) {
                    // Code block
                    const lines = chunk.trim().split('\n');
                    const lang = lines[0].trim();
                    const code = lines.slice(1).join('\n');
                    return <CodeBlock key={index} code={code || chunk} language={lang || 'bash'} />;
                  }
                  return (
                    <div key={index} className="whitespace-pre-wrap">
                      {chunk}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="pt-4 border-t border-slate-100 dark:border-white/[0.08] flex justify-end">
              <button
                onClick={() => setSelectedPost(null)}
                className="px-5 py-2 rounded-xl bg-[#22C55E] hover:bg-[#22C55E]/90 text-slate-950 font-bold text-xs"
              >
                Done Reading
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
