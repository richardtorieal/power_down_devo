import React from "react";
import { Check, BookOpen, ExternalLink, Calendar, Sparkles, MessageSquare, ChevronRight } from "lucide-react";
import { weeklyData, DevotionalDay, WeekData } from "../data/devotionals";

interface DevotionalTabProps {
  hisProgress: Record<number, boolean>;
  herProgress: Record<number, boolean>;
  hisRead: Record<number, boolean>;
  herRead: Record<number, boolean>;
  hisName?: string;
  herName?: string;
  activeUser?: 'his' | 'her' | null;
  activeWeekIndex: number;
  setActiveWeekIndex: (idx: number) => void;
  onSelectDay: (dayNumber: number, step: 1 | 2) => void;
}

export default function DevotionalTab({
  hisProgress,
  herProgress,
  hisRead,
  herRead,
  hisName,
  herName,
  activeUser,
  activeWeekIndex,
  setActiveWeekIndex,
  onSelectDay
}: DevotionalTabProps) {
  const activeWeek = weeklyData[activeWeekIndex];

  // Stats calculation
  const calculateWeekStats = (week: WeekData) => {
    const days = week.days;
    const totalDays = days.length;
    let hisCount = 0;
    let herCount = 0;
    let unityCount = 0;

    days.forEach(day => {
      if (hisProgress[day.dayNumber]) hisCount++;
      if (herProgress[day.dayNumber]) herCount++;
      if (hisProgress[day.dayNumber] && herProgress[day.dayNumber]) unityCount++;
    });

    return {
      hisPercent: Math.round((hisCount / totalDays) * 100),
      herPercent: Math.round((herCount / totalDays) * 100),
      unityPercent: Math.round((unityCount / totalDays) * 100),
      hisCount,
      herCount,
      unityCount,
      totalDays
    };
  };

  const stats = calculateWeekStats(activeWeek);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Week Selector Sub-tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100/80 rounded-2xl border border-slate-200/50">
        {weeklyData.map((week, idx) => {
          const isActive = idx === activeWeekIndex;
          const weekStats = calculateWeekStats(week);
          
          return (
            <button
              key={week.weekNumber}
              onClick={() => {
                setActiveWeekIndex(idx);
              }}
              className={`flex-grow md:flex-grow-0 flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-300 cursor-pointer ${
                isActive
                  ? "bg-white text-slate-800 shadow-md scale-[1.02]"
                  : "text-slate-500 hover:text-slate-800 hover:bg-white/40"
              }`}
            >
              <Calendar className={`w-4 h-4 ${isActive ? "text-emerald-700" : "text-slate-400"}`} />
              <span>Week {week.weekNumber}</span>
              {weekStats.unityCount === weekStats.totalDays && (
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
              )}
            </button>
          );
        })}
      </div>

      {/* Week Header */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-indigo-50/20 border border-emerald-100 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-2xl">
            <div className="text-xs font-bold text-emerald-700 tracking-wider uppercase">
              Week {activeWeek.weekNumber} Theme
            </div>
            <h2 className="text-2xl font-bold text-slate-800 font-serif">
              {activeWeek.weekNumber === 1 && "Understanding Faith"}
              {activeWeek.weekNumber === 2 && "Demonstrating Faith"}
              {activeWeek.weekNumber === 3 && "Overcoming Anxiety, Doubt & Fear"}
              {activeWeek.weekNumber === 4 && "Experiencing Peace"}
              {activeWeek.weekNumber === 5 && "Equipping Yourself for Spiritual Battles"}
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed font-light">
              {activeWeek.theme}
            </p>
          </div>

          {/* Mini week-level progress */}
          <div className="grid grid-cols-3 gap-4 shrink-0 bg-white/70 backdrop-blur-sm p-4 rounded-xl border border-slate-100">
            <div className="text-center">
              <div className="text-[10px] font-bold text-slate-400 truncate max-w-[80px] uppercase tracking-wider" title={hisName || "Mr. Walk"}>
                {hisName ? `${hisName}'s Walk` : "Mr. Walk"}
              </div>
              <div className="text-lg font-bold text-blue-900 mt-0.5">{stats.hisCount}/{stats.totalDays}</div>
              <div className="w-12 h-1 bg-slate-100 rounded-full mx-auto mt-1 overflow-hidden">
                <div className="h-full bg-blue-800 transition-all duration-500" style={{ width: `${stats.hisPercent}%` }} />
              </div>
            </div>
            <div className="text-center border-x border-slate-150 px-3">
              <div className="text-[10px] font-bold text-slate-400 truncate max-w-[80px] uppercase tracking-wider" title={herName || "Ms. Walk"}>
                {herName ? `${herName}'s Walk` : "Ms. Walk"}
              </div>
              <div className="text-lg font-bold text-rose-500 mt-0.5">{stats.herCount}/{stats.totalDays}</div>
              <div className="w-12 h-1 bg-slate-100 rounded-full mx-auto mt-1 overflow-hidden">
                <div className="h-full bg-rose-400 transition-all duration-500" style={{ width: `${stats.herPercent}%` }} />
              </div>
            </div>
            <div className="text-center">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Unity</div>
              <div className="text-lg font-bold text-indigo-700 mt-0.5">{stats.unityCount}/{stats.totalDays}</div>
              <div className="w-12 h-1 bg-slate-100 rounded-full mx-auto mt-1 overflow-hidden">
                <div className="h-full bg-indigo-500 transition-all duration-500" style={{ width: `${stats.unityPercent}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Devotional Cards Grid */}
      <div className="flex flex-col gap-6">
        {activeWeek.days.map((day) => {
          const isHisDone = !!hisProgress[day.dayNumber];
          const isHerDone = !!herProgress[day.dayNumber];
          const isUnity = isHisDone && isHerDone;

          const myRead = activeUser === "his" ? !!hisRead[day.dayNumber] : !!herRead[day.dayNumber];
          const myReflection = activeUser === "his" ? isHisDone : isHerDone;

          return (
            <div
              key={day.dayNumber}
              id={`day-card-${day.dayNumber}`}
              className={`bg-white rounded-2xl border transition-all duration-500 shadow-sm flex flex-col md:flex-row md:items-center justify-between p-6 gap-6 ${
                isUnity 
                  ? "border-indigo-200 bg-indigo-50/5 hover:shadow-md" 
                  : "border-slate-100 hover:border-slate-200 hover:shadow-md"
              }`}
            >
              {/* Day info and scripture */}
              <div className="space-y-3 flex-grow max-w-xl">
                <div className="flex items-center gap-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold">
                    D{day.dayNumber}
                  </span>
                  <span className="text-sm font-semibold text-slate-400">Day {day.dayNumber}</span>
                  
                  {/* Status Badges for Active User */}
                  <div className="flex items-center gap-2">
                    <span 
                      onClick={() => onSelectDay(day.dayNumber, 1)}
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full border cursor-pointer select-none transition-all ${
                        myRead 
                          ? "bg-emerald-50 text-emerald-700 border-emerald-250/50" 
                          : "bg-slate-50 text-slate-450 border-slate-200"
                      }`}
                    >
                      {myRead ? "Passage Read ✓" : "Passage Not Read"}
                    </span>
                    <span 
                      onClick={() => {
                        if (myRead) onSelectDay(day.dayNumber, 2);
                      }}
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full border transition-all ${
                        myReflection 
                          ? "bg-teal-50 text-teal-700 border-teal-250/50 cursor-pointer" 
                          : "bg-slate-50 text-slate-450 border-slate-200 cursor-not-allowed"
                      }`}
                    >
                      {myReflection ? "Reflected ✓" : "Reflection Missing"}
                    </span>
                    {isUnity && (
                      <span className="flex items-center gap-1 text-[9px] font-bold text-indigo-650 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                        <Sparkles className="w-2.5 h-2.5 text-indigo-500 fill-indigo-500" />
                        Unified
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="font-serif text-lg font-bold text-slate-800 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-emerald-700 shrink-0" />
                    {day.scripture}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-1 italic font-serif">
                    &ldquo;{day.reflection}&rdquo;
                  </p>
                </div>
              </div>

              {/* Stepper Launch Action buttons */}
              <div className="flex flex-wrap items-center gap-3 shrink-0">
                {/* Passage read redirect */}
                <button
                  onClick={() => onSelectDay(day.dayNumber, 1)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-850 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-all"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Read Passage</span>
                </button>

                {/* Reflection redirect */}
                <button
                  onClick={() => {
                    if (myRead) {
                      onSelectDay(day.dayNumber, 2);
                    } else {
                      onSelectDay(day.dayNumber, 1);
                    }
                  }}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold shadow-2xs flex items-center gap-1 cursor-pointer transition-all ${
                    myReflection
                      ? "bg-slate-150 hover:bg-slate-200 text-slate-700"
                      : myRead
                      ? "bg-teal-800 hover:bg-teal-900 text-white"
                      : "bg-teal-850/85 hover:bg-teal-900 text-white animate-pulse"
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>
                    {myReflection ? "View Journal" : myRead ? "Write Reflection" : "Begin Walk"}
                  </span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
