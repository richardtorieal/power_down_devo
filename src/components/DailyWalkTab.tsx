import React, { useState, useEffect } from "react";
import { 
  ArrowLeft, 
  BookOpen, 
  Check, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight, 
  Lock, 
  MessageSquare, 
  Sparkles, 
  ExternalLink 
} from "lucide-react";
import { weeklyData } from "../data/devotionals";

// Re-fetch helper to get verbatim data list
const devotionals = weeklyData.flatMap(week => week.days);

interface DailyWalkTabProps {
  dayNumber: number;
  hisProgress: Record<number, boolean>;
  herProgress: Record<number, boolean>;
  hisRead: Record<number, boolean>;
  herRead: Record<number, boolean>;
  hisReflections: Record<number, string>;
  herReflections: Record<number, string>;
  updateHisReflection: (day: number, text: string) => void;
  updateHerReflection: (day: number, text: string) => void;
  updateHisRead: (day: number, isRead: boolean) => void;
  updateHerRead: (day: number, isRead: boolean) => void;
  hisName: string;
  herName: string;
  activeUser: "his" | "her" | null;
  onBackToList: () => void;
  setExpandedDay: (day: number | null) => void;
  jumpToDay: (day: number) => void;
}

export default function DailyWalkTab({
  dayNumber,
  hisProgress,
  herProgress,
  hisRead,
  herRead,
  hisReflections,
  herReflections,
  updateHisReflection,
  updateHerReflection,
  updateHisRead,
  updateHerRead,
  hisName,
  herName,
  activeUser,
  onBackToList,
  setExpandedDay,
  jumpToDay
}: DailyWalkTabProps) {
  const day = devotionals.find((d) => d.dayNumber === dayNumber) || devotionals[0];

  const [activeStep, setActiveStep] = useState<1 | 2>(1);
  const [bibleVersion, setBibleVersion] = useState<"ESV" | "NIV" | "KJV">("ESV");
  const [passageText, setPassageText] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Swipe gesture hooks
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    const tagName = (e.target as HTMLElement).tagName;
    if (tagName === "INPUT" || tagName === "TEXTAREA" || tagName === "SELECT") return;
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart === null || touchEnd === null) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 70;
    const isRightSwipe = distance < -70;

    if (isLeftSwipe && activeStep === 1 && myRead) {
      setActiveStep(2);
    } else if (isRightSwipe && activeStep === 2) {
      setActiveStep(1);
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  // Active partner statuses
  const isHisDone = !!hisProgress[day.dayNumber];
  const isHerDone = !!herProgress[day.dayNumber];
  const isUnity = isHisDone && isHerDone;

  const myRead = activeUser === "his" ? !!hisRead[day.dayNumber] : !!herRead[day.dayNumber];
  const myProgress = activeUser === "his" ? isHisDone : isHerDone;
  const myName = activeUser === "his" ? hisName : herName;
  const partnerName = activeUser === "his" ? herName : hisName;
  const partnerProgress = activeUser === "his" ? isHerDone : isHisDone;

  const myReflection = activeUser === "his" ? hisReflections[day.dayNumber] || "" : herReflections[day.dayNumber] || "";
  const partnerReflection = activeUser === "his" ? herReflections[day.dayNumber] || "" : hisReflections[day.dayNumber] || "";

  // Fetch passage text
  useEffect(() => {
    let active = true;
    async function fetchPassage() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `/api/bible/passage?scripture=${encodeURIComponent(day.scripture)}&version=${bibleVersion}`
        );
        if (!res.ok) {
          throw new Error("Failed to load scripture text.");
        }
        const data = await res.json();
        if (active) {
          setPassageText(data.content);
        }
      } catch (err: any) {
        if (active) {
          setError(err.message || "Failed to load scripture.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    fetchPassage();

    return () => {
      active = false;
    };
  }, [day.scripture, bibleVersion]);

  // Read toggle handlers
  const handleMarkRead = (readStatus: boolean) => {
    if (activeUser === "his") {
      updateHisRead(day.dayNumber, readStatus);
    } else {
      updateHerRead(day.dayNumber, readStatus);
    }

    // Auto-advance to Step 2 if marking as read
    if (readStatus) {
      setTimeout(() => {
        setActiveStep(2);
      }, 400);
    }
  };

  const handleReflectionChange = (text: string) => {
    if (activeUser === "his") {
      updateHisReflection(day.dayNumber, text);
    } else {
      updateHerReflection(day.dayNumber, text);
    }
  };

  // Navigations
  const handlePrevDay = () => {
    if (day.dayNumber > 1) {
      jumpToDay(day.dayNumber - 1);
      setActiveStep(1);
    }
  };

  const handleNextDay = () => {
    if (day.dayNumber < 31) {
      jumpToDay(day.dayNumber + 1);
      setActiveStep(1);
    }
  };

  // Path-based deep link for external reading
  const getYouVersionLink = (scripture: string) => {
    const bookMap: Record<string, string> = {
      "Hebrews": "HEB",
      "Romans": "ROM",
      "Proverbs": "PRO",
      "Ephesians": "EPH",
      "Mark": "MRK",
      "2 Corinthians": "2CO",
      "Psalm": "PSA",
      "Psalms": "PSA",
      "James": "JAS",
      "1 Samuel": "1SA",
      "Daniel": "DAN",
      "Luke": "LUK",
      "Galatians": "GAL",
      "Matthew": "MAT",
      "Philippians": "PHP",
      "Isaiah": "ISA",
      "2 Timothy": "2TI",
      "1 Peter": "1PE",
      "1 John": "1JN",
      "1 Timothy": "1TI"
    };

    const regex = /^(\d?\s*[a-zA-Z\s]+)\s+(\d+[:\d\-\s,]*)$/;
    const match = scripture.match(regex);
    if (!match) return `https://www.bible.com/search/passages?q=${encodeURIComponent(scripture)}`;

    const fullBookName = match[1].trim();
    const reference = match[2].trim();
    const abbrev = bookMap[fullBookName] || fullBookName.substring(0, 3).toUpperCase();
    const formattedRef = reference.replace(":", ".");

    return `https://www.bible.com/bible/59/${abbrev}.${formattedRef}.ESV`;
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn pb-12">
      {/* Top Header Nav */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToList}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Devotional List
        </button>

        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200/50">
          <button
            onClick={handlePrevDay}
            disabled={day.dayNumber === 1}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 disabled:opacity-40 disabled:hover:text-slate-500 transition-all cursor-pointer"
            title="Previous Day"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-bold text-slate-700 px-2">
            Day {day.dayNumber} of 31
          </span>
          <button
            onClick={handleNextDay}
            disabled={day.dayNumber === 31}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 disabled:opacity-40 disabled:hover:text-slate-500 transition-all cursor-pointer"
            title="Next Day"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Focus Container */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-lg overflow-hidden flex flex-col">
        {/* Stepper Tabs */}
        <div className="grid grid-cols-2 border-b border-slate-100 bg-slate-50/40">
          <button
            onClick={() => setActiveStep(1)}
            className={`py-4 px-6 text-sm font-semibold flex items-center justify-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeStep === 1
                ? activeUser === "his"
                  ? "border-blue-900 text-blue-900 bg-white"
                  : "border-rose-400 text-rose-800 bg-white"
                : "border-transparent text-slate-400 hover:text-slate-600"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>1. Read Passage</span>
            {myRead && <CheckCircle2 className={`w-4 h-4 ${activeUser === "his" ? "text-blue-900 fill-blue-900/10" : "text-rose-500 fill-rose-500/10"}`} />}
          </button>

          <button
            onClick={() => {
              if (myRead) {
                setActiveStep(2);
              }
            }}
            disabled={!myRead}
            className={`py-4 px-6 text-sm font-semibold flex items-center justify-center gap-2 border-b-2 transition-all ${
              activeStep === 2
                ? activeUser === "his"
                  ? "border-blue-900 text-blue-900 bg-white cursor-pointer"
                  : "border-rose-400 text-rose-800 bg-white cursor-pointer"
                : myRead
                ? "border-transparent text-slate-400 hover:text-slate-600 cursor-pointer"
                : "border-transparent text-slate-300 opacity-60 cursor-not-allowed"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>2. Reflection Journal</span>
            {myProgress && <CheckCircle2 className={`w-4 h-4 ${activeUser === "his" ? "text-blue-900 fill-blue-900/10" : "text-rose-500 fill-rose-500/10"}`} />}
          </button>
        </div>

        {/* Dynamic Step View with touch swipe gesture */}
        <div 
          className="p-6 md:p-8 space-y-6 overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {activeStep === 1 ? (
            /* STEP 1: READ PASSAGE */
            <div className="space-y-6 animate-slideInRight">
              {/* Scripture Title Block */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-emerald-700 tracking-wider uppercase bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100 inline-block">
                    Scripture Passage
                  </span>
                  <h1 className="text-2xl md:text-3xl font-bold font-serif text-slate-800 flex items-center gap-2">
                    {day.scripture}
                  </h1>
                </div>

                {/* Bible Version Toggle */}
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/50 self-start md:self-auto">
                  {(["ESV", "NIV", "KJV"] as const).map((version) => (
                    <button
                      key={version}
                      onClick={() => setBibleVersion(version)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        bibleVersion === version
                          ? "bg-white text-teal-800 shadow-sm"
                          : "text-slate-400 hover:text-slate-700"
                      }`}
                    >
                      {version}
                    </button>
                  ))}
                </div>
              </div>

              {/* Styled Scrollable HTML Scripture Embed */}
              <div className="space-y-2">
                {loading ? (
                  <div className="bg-slate-50/50 border border-slate-105 rounded-2xl p-12 flex flex-col items-center justify-center min-h-[200px] space-y-4">
                    <div className="relative w-10 h-10">
                      <div className="absolute inset-0 rounded-full border-4 border-teal-50" />
                      <div className="absolute inset-0 rounded-full border-4 border-teal-600 border-t-transparent animate-spin" />
                    </div>
                    <span className="text-xs text-slate-400 font-medium font-serif italic animate-pulse">Fetching passage from YouVersion...</span>
                  </div>
                ) : error ? (
                  <div className="bg-red-50/50 border border-red-200 rounded-2xl p-6 text-xs text-red-650 font-medium leading-relaxed">
                    Could not embed scripture text: {error}
                  </div>
                ) : passageText ? (
                  <div 
                    className="bg-[#FCFCFB] border border-slate-200/80 rounded-2xl p-6 md:p-8 shadow-2xs text-slate-700 text-base max-h-[350px] overflow-y-auto youversion-passage-embed leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: passageText }}
                  />
                ) : (
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 flex items-center justify-center min-h-[60px]">
                    <span className="text-xs text-slate-350 italic">No scripture text available</span>
                  </div>
                )}

                <div className="flex justify-end">
                  <a
                    href={getYouVersionLink(day.scripture)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-emerald-600 hover:text-emerald-700 flex items-center gap-1 font-semibold hover:underline group/link"
                  >
                    Open on bible.com
                    <ExternalLink className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                  </a>
                </div>
              </div>

              {/* Progress and Continue controls */}
              <div className="border-t border-slate-100 pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/30 p-6 rounded-2xl border">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleMarkRead(!myRead)}
                    className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all cursor-pointer ${
                      myRead
                        ? activeUser === "his"
                          ? "bg-blue-900 border-blue-900 text-white shadow-sm"
                          : "bg-rose-500 border-rose-500 text-white shadow-sm"
                        : "border-slate-300 hover:border-slate-400 bg-white"
                    }`}
                  >
                    {myRead && <Check className="w-4 h-4 stroke-[3px]" />}
                  </button>
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-slate-700">I have read this passage</p>
                    <p className="text-[10px] text-slate-400">Persist read validation in your shared walk</p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (!myRead) {
                      handleMarkRead(true);
                    } else {
                      setActiveStep(2);
                    }
                  }}
                  className={`px-6 py-3 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1 cursor-pointer shrink-0 ${
                    activeUser === "his"
                      ? "bg-blue-900 hover:bg-blue-950"
                      : "bg-rose-500 hover:bg-rose-600"
                  }`}
                >
                  {myRead ? "Continue to Reflection" : "Mark as Read & Continue"}
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* STEP 2: REFLECTION JOURNAL */
            <div className="space-y-6 animate-slideInRight">
              {/* Question Block */}
              <div className={`bg-gradient-to-br border rounded-2xl p-5 md:p-6 space-y-2 ${
                activeUser === "his"
                  ? "from-blue-50/40 to-slate-50/50 border-blue-100/50"
                  : "from-rose-50/40 to-slate-50/50 border-rose-100/50"
              }`}>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                  activeUser === "his" ? "text-blue-900 bg-blue-50 border border-blue-100" : "text-rose-800 bg-rose-50 border border-rose-100"
                }`}>
                  Day {day.dayNumber} Reflection Prompt
                </span>
                <p className="text-base md:text-lg font-medium text-slate-800 font-serif italic leading-relaxed">
                  &ldquo;{day.reflection}&rdquo;
                </p>
              </div>

              {/* Reflection Text Area */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    My Reflection Answer ({myName})
                  </label>
                  <span className={`text-[10px] font-bold ${
                    myProgress
                      ? activeUser === "his" ? "text-blue-900" : "text-rose-600"
                      : "text-amber-500"
                  }`}>
                    {myProgress ? "Walk Checked ✓" : "Writing answers auto-saves progress"}
                  </span>
                </div>
                <textarea
                  value={myReflection}
                  onChange={(e) => handleReflectionChange(e.target.value)}
                  placeholder="Type your reflection answer here. Writing your thoughts will automatically check off this day's walk."
                  className={`w-full min-h-[160px] p-5 rounded-2xl border outline-none text-slate-700 text-sm leading-relaxed transition-all resize-y bg-white placeholder:text-slate-350 shadow-2xs ${
                    activeUser === "his"
                      ? "border-slate-200 focus:border-blue-900 focus:ring-2 focus:ring-blue-100"
                      : "border-slate-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                  }`}
                />
              </div>

              {/* Partner Reflection Reveal */}
              <div className="border-t border-slate-100 pt-6 space-y-3">
                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  {partnerName}&apos;s thoughts
                </h4>

                {!myProgress ? (
                  <div className="bg-slate-100/60 border border-slate-200/20 rounded-2xl p-6 text-center text-xs text-slate-400 italic">
                    Complete your own reflection answer to unlock {partnerName}&apos;s thoughts.
                  </div>
                ) : !partnerProgress ? (
                  <div className="bg-slate-100/60 border border-slate-200/20 rounded-2xl p-6 text-center text-xs text-slate-400 italic">
                    {partnerName} is still working on their reflection for today.
                  </div>
                ) : partnerReflection.trim() ? (
                  <div className="bg-[#FAF9F6] border border-slate-200/50 rounded-2xl p-6 text-sm text-slate-700 italic leading-relaxed font-serif shadow-2xs">
                    &ldquo;{partnerReflection}&rdquo;
                  </div>
                ) : (
                  <div className="bg-[#FAF9F6] border border-slate-200/50 rounded-2xl p-6 text-center text-xs text-slate-400 italic">
                    {partnerName} completed this day without writing a reflection.
                  </div>
                )}
              </div>

              {/* Stepper Footer Nav */}
              <div className="border-t border-slate-100 pt-6 flex flex-wrap items-center justify-between gap-4">
                <button
                  onClick={() => setActiveStep(1)}
                  className="px-5 py-3 border border-slate-200 text-slate-600 font-semibold text-xs rounded-xl hover:bg-slate-50 hover:text-slate-800 transition-all flex items-center gap-1 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Review Passage
                </button>

                <div className="flex gap-2">
                  <button
                    onClick={onBackToList}
                    className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
                  >
                    Finish & View Weeks
                  </button>
                  
                  {day.dayNumber < 31 && (
                    <button
                      onClick={handleNextDay}
                      disabled={!myProgress}
                      className={`px-6 py-3 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer ${
                        activeUser === "his"
                          ? "bg-blue-900 hover:bg-blue-950"
                          : "bg-rose-500 hover:bg-rose-600"
                      }`}
                    >
                      Next Day Walk
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
