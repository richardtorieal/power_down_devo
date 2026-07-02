import React from "react";
import { Compass, Shield, Sparkles, Activity, Anchor, Heart, BookOpen, Quote } from "lucide-react";
import { coreStrategy, weeklyData } from "../data/devotionals";

interface OverviewTabProps {
  hisProgress: Record<number, boolean>;
  herProgress: Record<number, boolean>;
  hisRead: Record<number, boolean>;
  herRead: Record<number, boolean>;
  hisName?: string;
  herName?: string;
  activeUser?: 'his' | 'her' | null;
  onSelectDay: (dayNumber: number, step: 1 | 2) => void;
  onSwitchToDevotionalTab: () => void;
}

export default function OverviewTab({
  hisProgress,
  herProgress,
  hisRead,
  herRead,
  hisName,
  herName,
  activeUser,
  onSelectDay,
  onSwitchToDevotionalTab
}: OverviewTabProps) {
  const totalDays = 31;

  // Get today's day number (1-31) and current devotional
  const today = new Date();
  const currentDayNumber = Math.min(31, Math.max(1, today.getDate()));
  const allDays = weeklyData.flatMap(week => week.days);
  const todayDevo = allDays.find(d => d.dayNumber === currentDayNumber) || allDays[0];

  // Calculate stats
  const hisCompletedCount = Object.values(hisProgress).filter(Boolean).length;
  const herCompletedCount = Object.values(herProgress).filter(Boolean).length;

  const hisPercent = Math.round((hisCompletedCount / totalDays) * 100);
  const herPercent = Math.round((herCompletedCount / totalDays) * 100);

  // Unity count = days where BOTH are true
  let unityCount = 0;
  for (let d = 1; d <= totalDays; d++) {
    if (hisProgress[d] && herProgress[d]) {
      unityCount++;
    }
  }
  const unityPercent = Math.round((unityCount / totalDays) * 100);

  // Map letters to icons
  const getIcon = (letter: string) => {
    switch (letter) {
      case "F": return <Compass className="w-6 h-6 text-teal-600" />;
      case "A": return <Shield className="w-6 h-6 text-emerald-600" />;
      case "I": return <Sparkles className="w-6 h-6 text-indigo-650" />;
      case "T": return <Activity className="w-6 h-6 text-teal-700" />;
      case "H": return <Anchor className="w-6 h-6 text-emerald-700" />;
      default: return <Heart className="w-6 h-6 text-teal-600" />;
    }
  };

  // Check completion states for today
  const isHisCompletedToday = !!hisProgress[currentDayNumber];
  const isHerCompletedToday = !!herProgress[currentDayNumber];
  const isHisReadToday = !!hisRead[currentDayNumber];
  const isHerReadToday = !!herRead[currentDayNumber];

  const isActiveUserCompletedToday = activeUser === "his" ? isHisCompletedToday : isHerCompletedToday;
  const isActiveUserReadToday = activeUser === "his" ? isHisReadToday : isHerReadToday;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Dynamic Verse of the Day Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-900 via-emerald-800 to-teal-950 p-6 md:p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold uppercase tracking-wider">
              Verse of the Day • Day {todayDevo.dayNumber}
            </div>
          </div>
          
          <div className="space-y-4">
            <h1 className="text-2xl md:text-4xl font-bold tracking-tight font-serif flex items-center gap-2.5">
              <BookOpen className="w-6 h-6 md:w-8 md:h-8 text-emerald-400 shrink-0" />
              {todayDevo.scripture}
            </h1>
            <div className="pl-6 border-l-2 border-emerald-500/30 py-1">
              <p className="text-xs text-emerald-400 font-bold uppercase tracking-wider mb-1">Reflection Prompt</p>
              <p className="text-emerald-100/90 text-sm md:text-base font-light italic leading-relaxed">
                &ldquo;{todayDevo.reflection}&rdquo;
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 pt-2">
            <button
              onClick={() => {
                // If already read, jump to Step 2 (Reflection), otherwise Step 1 (Read)
                onSelectDay(todayDevo.dayNumber, isActiveUserReadToday ? 2 : 1);
              }}
              className="px-6 py-3 rounded-xl bg-white text-slate-900 hover:bg-emerald-50 font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer scale-100 hover:scale-[1.02] active:scale-95"
            >
              <span>
                {isActiveUserCompletedToday 
                  ? "View Today's Reflection" 
                  : isActiveUserReadToday 
                  ? "Write Today's Reflection" 
                  : "Begin Today's Walk"}
              </span>
              <Quote className="w-4 h-4 text-emerald-700" />
            </button>
            <button
              onClick={onSwitchToDevotionalTab}
              className="px-6 py-3 rounded-xl bg-teal-800/40 hover:bg-teal-800/60 border border-teal-700/50 text-white font-semibold text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer animate-pulse"
            >
              Go to Weeks 1–5
            </button>
          </div>
        </div>
      </div>

      {/* Progress Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* His Progress Card */}
        <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-100 flex flex-col items-center justify-between space-y-4 hover:shadow-lg transition duration-300">
          <div className="flex items-center justify-between w-full">
            <span className="text-sm font-semibold text-slate-700">{hisName ? `${hisName}'s Walk` : "Mr. Walk"}</span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-900 border border-blue-100 uppercase tracking-wider">
              {hisName || "MR."}
            </span>
          </div>

          <div className="relative flex items-center justify-center w-36 h-36">
            {/* SVG Progress Circle */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="72"
                cy="72"
                r="60"
                className="text-slate-100"
                strokeWidth="10"
                stroke="currentColor"
                fill="transparent"
              />
              <circle
                cx="72"
                cy="72"
                r="60"
                className="text-blue-900 transition-all duration-1000 ease-out"
                strokeWidth="10"
                strokeDasharray={377}
                strokeDashoffset={377 - (377 * hisPercent) / 100}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
              />
            </svg>
            <div className="absolute text-center">
              <span className="text-3xl font-bold text-slate-800">{hisPercent}%</span>
              <p className="text-xs text-slate-500 mt-1">{hisCompletedCount} of {totalDays} days</p>
            </div>
          </div>

          <button
            onClick={() => {
              // Redirect to active step based on progress
              onSelectDay(currentDayNumber, isHisReadToday ? 2 : 1);
            }}
            className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
              isHisCompletedToday
                ? "bg-slate-50 text-slate-600 hover:text-slate-800 hover:bg-slate-100 border-slate-200"
                : "bg-blue-50/70 hover:bg-blue-100/80 text-blue-900 border-blue-200 hover:scale-[1.01]"
            }`}
          >
            {isHisCompletedToday ? "View Today's Reading" : `Write ${hisName || "Mr."} Reflection`}
          </button>
        </div>

        {/* Her Progress Card */}
        <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-100 flex flex-col items-center justify-between space-y-4 hover:shadow-lg transition duration-300">
          <div className="flex items-center justify-between w-full">
            <span className="text-sm font-semibold text-slate-700">{herName ? `${herName}'s Walk` : "Ms. Walk"}</span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-800 border border-rose-100 uppercase tracking-wider">
              {herName || "MS."}
            </span>
          </div>

          <div className="relative flex items-center justify-center w-36 h-36">
            {/* SVG Progress Circle */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="72"
                cy="72"
                r="60"
                className="text-slate-100"
                strokeWidth="10"
                stroke="currentColor"
                fill="transparent"
              />
              <circle
                cx="72"
                cy="72"
                r="60"
                className="text-rose-400 transition-all duration-1000 ease-out"
                strokeWidth="10"
                strokeDasharray={377}
                strokeDashoffset={377 - (377 * herPercent) / 100}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
              />
            </svg>
            <div className="absolute text-center">
              <span className="text-3xl font-bold text-slate-800">{herPercent}%</span>
              <p className="text-xs text-slate-500 mt-1">{herCompletedCount} of {totalDays} days</p>
            </div>
          </div>

          <button
            onClick={() => {
              onSelectDay(currentDayNumber, isHerReadToday ? 2 : 1);
            }}
            className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
              isHerCompletedToday
                ? "bg-slate-50 text-slate-600 hover:text-slate-800 hover:bg-slate-100 border-slate-200"
                : "bg-rose-50/70 hover:bg-rose-100/80 text-rose-800 border-rose-200 hover:scale-[1.01]"
            }`}
          >
            {isHerCompletedToday ? "View Today's Reading" : `Write ${herName || "Ms."} Reflection`}
          </button>
        </div>

        {/* Shared Progress Card */}
        <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-100 flex flex-col items-center justify-between space-y-4 hover:shadow-lg transition duration-300">
          <div className="flex items-center justify-between w-full">
            <span className="text-sm font-semibold text-slate-700 font-serif flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-500 fill-indigo-500/20" />
              Spiritual Unity
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100 uppercase tracking-wider">
              Shared Walk
            </span>
          </div>

          <div className="relative flex items-center justify-center w-36 h-36">
            {/* SVG Progress Circle */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="72"
                cy="72"
                r="60"
                className="text-slate-100"
                strokeWidth="10"
                stroke="currentColor"
                fill="transparent"
              />
              <circle
                cx="72"
                cy="72"
                r="60"
                className="text-indigo-600 transition-all duration-1000 ease-out"
                strokeWidth="10"
                strokeDasharray={377}
                strokeDashoffset={377 - (377 * unityPercent) / 100}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
              />
            </svg>
            <div className="absolute text-center">
              <span className="text-3xl font-bold text-slate-800">{unityPercent}%</span>
              <p className="text-xs text-slate-500 mt-1">{unityCount} of {totalDays} days</p>
            </div>
          </div>

          <button
            onClick={() => {
              // Direct active user to today's active task
              onSelectDay(currentDayNumber, isActiveUserReadToday ? 2 : 1);
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs border border-indigo-200 transition-all hover:scale-[1.01] cursor-pointer"
          >
            Complete Shared Devotional
          </button>
        </div>
      </div>

      {/* The F-A-I-T-H Strategy Section */}
      <div className="bg-slate-50/50 rounded-2xl p-6 border border-slate-100">
        <h2 className="text-xl font-bold text-slate-800 font-serif">The F-A-I-T-H Strategy</h2>
        <p className="text-xs text-slate-500 mt-0.5">Five core pillars to guide your spiritual intimacy throughout this devotional.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mt-6">
          {coreStrategy.faithSteps.map((pillar) => (
            <div key={pillar.letter} className="bg-white rounded-xl p-4 border border-slate-100 hover:shadow-md transition duration-350">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-350">0{coreStrategy.faithSteps.indexOf(pillar) + 1}</span>
                {getIcon(pillar.letter)}
              </div>
              <h3 className="text-sm font-bold text-slate-800 font-serif mt-3">
                <span className="text-teal-700">{pillar.letter}</span>
                {pillar.title.substring(1)}
              </h3>
              <p className="text-[11px] text-slate-500 leading-relaxed font-light mt-1">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
