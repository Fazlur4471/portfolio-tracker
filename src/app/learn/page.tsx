'use client';

import { useState, useEffect } from 'react';
import { GraduationCap, Search, BookOpen, CheckCircle, Lightbulb, Sparkles } from 'lucide-react';
import { LESSONS, CATEGORIES, getDailyLesson, type Lesson } from '@/lib/lessons';

export default function LearnPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedLesson, setExpandedLesson] = useState<string | null>(null);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const dailyLesson = getDailyLesson();

  // Load progress from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('portfolio-tracker-lessons-completed');
    if (saved) {
      try {
        setCompletedLessons(new Set(JSON.parse(saved)));
      } catch { /* ignore */ }
    }
  }, []);

  const markCompleted = (lessonId: string) => {
    const updated = new Set(completedLessons);
    if (updated.has(lessonId)) {
      updated.delete(lessonId);
    } else {
      updated.add(lessonId);
    }
    setCompletedLessons(updated);
    localStorage.setItem('portfolio-tracker-lessons-completed', JSON.stringify([...updated]));
  };

  const filteredLessons = LESSONS.filter(lesson => {
    const matchesCategory = selectedCategory === 'all' || lesson.category === selectedCategory;
    const matchesSearch = searchQuery === '' ||
      lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const progress = LESSONS.length > 0 ? Math.round((completedLessons.size / LESSONS.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-zinc-950 to-black">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/50 flex items-center gap-3">
              <GraduationCap className="text-primary" size={32} />
              Finance Learning Center
            </h1>
            <p className="text-muted-foreground mt-2">
              Master personal finance with daily concepts, real-world Indian examples, and actionable takeaways.
            </p>
          </div>

          {/* Progress */}
          <div className="glass px-4 py-3 rounded-xl border border-white/5 min-w-[200px]">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">Progress</span>
              <span className="text-white/90 font-medium">{completedLessons.size}/{LESSONS.length}</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-primary to-emerald-500 rounded-full h-2 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Daily Featured Lesson */}
        <div className="glass rounded-2xl p-6 border border-primary/20 bg-gradient-to-r from-primary/5 to-transparent relative overflow-hidden">
          <div className="absolute top-3 right-4 flex items-center gap-1 text-xs text-primary/70">
            <Sparkles size={12} />
            Today&apos;s Lesson
          </div>
          <div className="flex items-start gap-4">
            <div className="text-4xl">{dailyLesson.emoji}</div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-white/90">{dailyLesson.title}</h2>
              <p className="text-sm text-muted-foreground mt-1">{dailyLesson.summary}</p>
              <button
                onClick={() => setExpandedLesson(expandedLesson === dailyLesson.id ? null : dailyLesson.id)}
                className="mt-3 text-sm text-primary hover:text-primary/80 font-medium transition-colors"
              >
                {expandedLesson === dailyLesson.id ? 'Collapse ↑' : 'Read More →'}
              </button>
            </div>
          </div>
          {expandedLesson === dailyLesson.id && (
            <LessonContent lesson={dailyLesson} isCompleted={completedLessons.has(dailyLesson.id)} onToggle={() => markCompleted(dailyLesson.id)} />
          )}
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search lessons..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-white/20"
            />
          </div>
          <div className="flex gap-1 p-1 bg-white/5 rounded-lg overflow-x-auto">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all whitespace-nowrap flex items-center gap-1.5 ${selectedCategory === cat.id
                    ? 'bg-primary text-white shadow-md'
                    : 'text-muted-foreground hover:text-white'
                  }`}
              >
                <span>{cat.emoji}</span>
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Lesson Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredLessons.map(lesson => {
            const isExpanded = expandedLesson === lesson.id;
            const isCompleted = completedLessons.has(lesson.id);
            return (
              <div
                key={lesson.id}
                className={`glass rounded-2xl border transition-all ${isCompleted ? 'border-emerald-500/20' : 'border-white/5'
                  } ${isExpanded ? 'md:col-span-2' : ''}`}
              >
                <div className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <span className="text-2xl">{lesson.emoji}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-white/90">{lesson.title}</h3>
                          {isCompleted && <CheckCircle size={14} className="text-emerald-500" />}
                        </div>
                        <p className="text-sm text-muted-foreground mt-0.5">{lesson.summary}</p>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full capitalize ${lesson.category === 'basics' ? 'bg-blue-500/10 text-blue-500' :
                        lesson.category === 'stocks' ? 'bg-emerald-500/10 text-emerald-500' :
                          lesson.category === 'mutual-funds' ? 'bg-purple-500/10 text-purple-500' :
                            lesson.category === 'tax' ? 'bg-amber-500/10 text-amber-500' :
                              'bg-red-500/10 text-red-500'
                      }`}>{lesson.category.replace('-', ' ')}</span>
                  </div>

                  <button
                    onClick={() => setExpandedLesson(isExpanded ? null : lesson.id)}
                    className="mt-3 text-sm text-primary hover:text-primary/80 font-medium transition-colors"
                  >
                    {isExpanded ? 'Collapse ↑' : 'Read Lesson →'}
                  </button>
                </div>

                {isExpanded && (
                  <LessonContent lesson={lesson} isCompleted={isCompleted} onToggle={() => markCompleted(lesson.id)} />
                )}
              </div>
            );
          })}
        </div>

        {filteredLessons.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="mx-auto text-muted-foreground mb-4" size={48} />
            <p className="text-white/70">No lessons found.</p>
            <p className="text-muted-foreground text-sm mt-1">Try adjusting your search or category filter.</p>
          </div>
        )}
      </div>

      {/* Background glow */}
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-purple-500/10 rounded-full blur-[128px] pointer-events-none -z-0" />
    </div>
  );
}

function LessonContent({ lesson, isCompleted, onToggle }: { lesson: Lesson; isCompleted: boolean; onToggle: () => void }) {
  return (
    <div className="border-t border-white/5 px-5 pb-5 pt-4 space-y-4">
      {/* Main Content */}
      <div className="text-sm text-white/70 leading-relaxed whitespace-pre-line">
        {lesson.content}
      </div>

      {/* Example */}
      <div className="bg-blue-500/5 border border-blue-500/10 rounded-xl p-4">
        <div className="flex items-center gap-2 text-blue-400 text-sm font-medium mb-2">
          <Lightbulb size={14} />
          Real-World Example
        </div>
        <div className="text-sm text-white/60 leading-relaxed whitespace-pre-line">
          {lesson.example}
        </div>
      </div>

      {/* Key Takeaway */}
      <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-4">
        <div className="text-sm text-emerald-400 font-medium mb-1">🔑 Key Takeaway</div>
        <div className="text-sm text-white/70">{lesson.takeaway}</div>
      </div>

      {/* Mark Complete */}
      <button
        onClick={onToggle}
        className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg transition-all ${isCompleted
            ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
            : 'bg-white/5 text-muted-foreground hover:text-white border border-white/10'
          }`}
      >
        <CheckCircle size={14} />
        {isCompleted ? 'Completed ✓' : 'Mark as Complete'}
      </button>
    </div>
  );
}
