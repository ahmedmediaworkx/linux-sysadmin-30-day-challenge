import React, { useState, useEffect } from 'react';
import {
  X,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Award,
  Sparkles,
  ArrowRight,
  RotateCcw,
  BookOpen,
  Brain,
  ShieldCheck,
  Check
} from 'lucide-react';
import { DayChallenge, QuizQuestion } from '../types';
import { getQuizForDay } from '../data/quizData';
import { triggerDayCompleteCelebration } from '../lib/utils';

interface QuickQuizModalProps {
  day: DayChallenge;
  onClose: () => void;
  onQuizFinished?: (score: number, total: number) => void;
}

export function QuickQuizModal({ day, onClose, onQuizFinished }: QuickQuizModalProps) {
  const [questions] = useState<QuizQuestion[]>(() => getQuizForDay(day));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [isFinished, setIsFinished] = useState(false);

  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;

  const handleSelectOption = (index: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null) return;
    setIsAnswerSubmitted(true);
    setUserAnswers((prev) => [...prev, selectedOption]);
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      setIsFinished(true);
      const score = userAnswers.reduce((acc, ans, idx) => {
        return ans === questions[idx].correctAnswerIndex ? acc + 1 : acc;
      }, selectedOption === questions[currentIndex].correctAnswerIndex ? 1 : 0);

      if (score >= 2) {
        triggerDayCompleteCelebration();
      }

      if (onQuizFinished) {
        onQuizFinished(score, totalQuestions);
      }
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setUserAnswers([]);
    setIsFinished(false);
  };

  // Score calculation
  const correctCount = userAnswers.filter((ans, idx) => ans === questions[idx]?.correctAnswerIndex).length;
  const scorePercent = Math.round((correctCount / totalQuestions) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full p-5 sm:p-8 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150 relative max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-4 shrink-0">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center gap-1">
                <Brain className="w-3 h-3" />
                <span>Knowledge Check • Day {day.dayNumber}</span>
              </span>
              <span className="text-xs text-slate-400 font-mono">
                3 Questions
              </span>
            </div>

            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-slate-100">
              {day.title} Quiz
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-100 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Close Quiz"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!isFinished ? (
          /* Active Question View */
          <div className="space-y-5 overflow-y-auto pr-1 flex-1">
            {/* Progress bar & Question Counter */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                <span>Question {currentIndex + 1} of {totalQuestions}</span>
                <span className="font-mono text-emerald-500">{Math.round(((currentIndex + 1) / totalQuestions) * 100)}%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 transition-all duration-300 rounded-full"
                  style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
                />
              </div>
            </div>

            {/* Question Text */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800/80 space-y-2">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 leading-snug">
                {currentQuestion.question}
              </h3>
            </div>

            {/* Options List */}
            <div className="space-y-2.5">
              {currentQuestion.options.map((optionText, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = currentQuestion.correctAnswerIndex === idx;

                let optionStyle = 'bg-white dark:bg-slate-900/90 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-700';

                if (isAnswerSubmitted) {
                  if (isCorrect) {
                    optionStyle = 'bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold';
                  } else if (isSelected && !isCorrect) {
                    optionStyle = 'bg-rose-500/10 border-rose-500 text-rose-600 dark:text-rose-400 font-bold';
                  } else {
                    optionStyle = 'opacity-50 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-400';
                  }
                } else if (isSelected) {
                  optionStyle = 'bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold ring-2 ring-emerald-500/20';
                }

                return (
                  <button
                    key={idx}
                    disabled={isAnswerSubmitted}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full text-left p-3.5 sm:p-4 rounded-2xl border text-xs sm:text-sm transition-all flex items-start justify-between gap-3 min-h-[48px] touch-manipulation ${optionStyle}`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full border border-current shrink-0 flex items-center justify-center text-[10px] font-bold font-mono mt-0.5">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="leading-relaxed">{optionText}</span>
                    </div>

                    {isAnswerSubmitted && isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                    )}
                    {isAnswerSubmitted && isSelected && !isCorrect && (
                      <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation box after submission */}
            {isAnswerSubmitted && (
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5 animate-in fade-in duration-200">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                  <Sparkles className="w-4 h-4" />
                  <span>Explanation & Key Concept:</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  {currentQuestion.explanation}
                </p>
              </div>
            )}

            {/* Footer Controls */}
            <div className="pt-3 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 shrink-0">
              <span className="text-[11px] text-slate-500 hidden sm:inline">
                {isAnswerSubmitted ? 'Review explanation then proceed.' : 'Select one answer to test your memory.'}
              </span>

              {!isAnswerSubmitted ? (
                <button
                  disabled={selectedOption === null}
                  onClick={handleSubmitAnswer}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-extrabold text-xs shadow-md shadow-emerald-500/20 transition-all min-h-[44px] flex items-center justify-center"
                >
                  Confirm Answer
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-1.5 min-h-[44px]"
                >
                  <span>{currentIndex < totalQuestions - 1 ? 'Next Question' : 'See Results'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Finished Screen */
          <div className="space-y-6 text-center py-2">
            <div className="inline-flex p-4 rounded-3xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 mb-1">
              <Award className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100">
                {scorePercent >= 66 ? 'Lab Concept Mastered! 🎉' : 'Quiz Complete'}
              </h3>

              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                You scored <span className="text-emerald-500 font-bold font-mono text-base">{correctCount} / {totalQuestions}</span> ({scorePercent}% accuracy) on Day {day.dayNumber} key concepts.
              </p>
            </div>

            {/* Answer Review Cards */}
            <div className="space-y-3 text-left max-h-60 overflow-y-auto pr-1 border-y border-slate-100 dark:border-slate-800 py-4">
              {questions.map((q, idx) => {
                const userAns = userAnswers[idx];
                const isCorrect = userAns === q.correctAnswerIndex;
                return (
                  <div
                    key={q.id}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800/80 space-y-1.5 text-xs"
                  >
                    <div className="flex items-center justify-between font-bold">
                      <span className="text-slate-800 dark:text-slate-200">
                        {idx + 1}. {q.question}
                      </span>
                      {isCorrect ? (
                        <span className="text-emerald-500 flex items-center gap-1 shrink-0 font-mono text-[11px]">
                          <Check className="w-3.5 h-3.5" /> Correct
                        </span>
                      ) : (
                        <span className="text-rose-500 flex items-center gap-1 shrink-0 font-mono text-[11px]">
                          <X className="w-3.5 h-3.5" /> Incorrect
                        </span>
                      )}
                    </div>

                    <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                      <span className="font-semibold text-emerald-400">Answer:</span> {q.options[q.correctAnswerIndex]}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={handleRestart}
                className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retry Quiz</span>
              </button>

              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-500/20 transition-all"
              >
                Return to Lab Roadmap
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
