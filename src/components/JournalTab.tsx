import React, { useState, useEffect } from "react";
import { PenTool, Calendar, BookOpen, Check, Save } from "lucide-react";
import { weeklyData, WeekData } from "../data/devotionals";

interface JournalTabProps {
  hisJournal: Record<number, string>;
  herJournal: Record<number, string>;
  updateHisJournal: (week: number, note: string) => void;
  updateHerJournal: (week: number, note: string) => void;
  hisName?: string;
  herName?: string;
  activeUser?: 'his' | 'her' | null;
}

export default function JournalTab({
  hisJournal,
  herJournal,
  updateHisJournal,
  updateHerJournal,
  hisName,
  herName,
  activeUser
}: JournalTabProps) {
  const [activeWeekIndex, setActiveWeekIndex] = useState(0);
  const activeWeek = weeklyData[activeWeekIndex];

  // Temporary local states for textarea inputs to prevent stuttering on rapid state updates
  const [localHisText, setLocalHisText] = useState("");
  const [localHerText, setLocalHerText] = useState("");
  const [isSavingHis, setIsSavingHis] = useState(false);
  const [isSavingHer, setIsSavingHer] = useState(false);

  // Sync local text when week changes or when parent loads
  useEffect(() => {
    setLocalHisText(hisJournal[activeWeek.weekNumber] || "");
    setLocalHerText(herJournal[activeWeek.weekNumber] || "");
  }, [activeWeek.weekNumber, hisJournal, herJournal]);

  // Debounced auto-save effect for His Journal
  useEffect(() => {
    const currentTextInState = hisJournal[activeWeek.weekNumber] || "";
    if (localHisText === currentTextInState) return;

    setIsSavingHis(true);
    const timer = setTimeout(() => {
      updateHisJournal(activeWeek.weekNumber, localHisText);
      setIsSavingHis(false);
    }, 800); // 800ms debounce

    return () => clearTimeout(timer);
  }, [localHisText, activeWeek.weekNumber, updateHisJournal, hisJournal]);

  // Debounced auto-save effect for Her Journal
  useEffect(() => {
    const currentTextInState = herJournal[activeWeek.weekNumber] || "";
    if (localHerText === currentTextInState) return;

    setIsSavingHer(true);
    const timer = setTimeout(() => {
      updateHerJournal(activeWeek.weekNumber, localHerText);
      setIsSavingHer(false);
    }, 800); // 800ms debounce

    return () => clearTimeout(timer);
  }, [localHerText, activeWeek.weekNumber, updateHerJournal, herJournal]);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Week Selector Sub-tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100/80 rounded-2xl border border-slate-200/50">
        {weeklyData.map((week, idx) => {
          const isActive = idx === activeWeekIndex;
          const hasHisEntry = !!hisJournal[week.weekNumber]?.trim();
          const hasHerEntry = !!herJournal[week.weekNumber]?.trim();

          return (
            <button
              key={week.weekNumber}
              onClick={() => setActiveWeekIndex(idx)}
              className={`flex-grow md:flex-grow-0 flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                isActive
                  ? "bg-white text-slate-800 shadow-md scale-[1.02]"
                  : "text-slate-500 hover:text-slate-800 hover:bg-white/40"
              }`}
            >
              <Calendar className={`w-4 h-4 ${isActive ? "text-emerald-700" : "text-slate-400"}`} />
              <span>Week {week.weekNumber} Journal</span>
              {(hasHisEntry || hasHerEntry) && (
                <div className="flex gap-0.5">
                  {hasHisEntry && <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />}
                  {hasHerEntry && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Prompts Panel */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4">
        <h3 className="font-serif text-lg font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
          <PenTool className="w-5 h-5 text-emerald-700" />
          Week {activeWeek.weekNumber} Journal Prompts
        </h3>
        <ol className="space-y-3 pl-4 list-decimal text-slate-600 text-sm leading-relaxed">
          {activeWeek.journalPrompts.map((prompt, pIdx) => (
            <li key={pIdx} className="font-medium">
              {prompt}
            </li>
          ))}
        </ol>
      </div>

      {/* Writing Areas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* His Journal Box */}
        <div className={`flex flex-col space-y-3 bg-white rounded-2xl border p-6 shadow-sm hover:shadow-md transition duration-300 ${
          activeUser === "his" ? "border-blue-200 ring-2 ring-blue-900/10 bg-blue-50/5" : "border-slate-100"
        }`}>
          <div className="flex items-center justify-between">
            <h4 className="font-serif text-base font-bold text-blue-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-800 animate-pulse" />
              {hisName ? `${hisName}'s Journal` : "Mr. Journal"}
            </h4>
            <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5">
              {activeUser === "her" ? (
                <span className="text-slate-400 text-[10px]">Read Only</span>
              ) : isSavingHis ? (
                <>
                  <Save className="w-3.5 h-3.5 animate-pulse text-blue-800" />
                  Saving draft...
                </>
              ) : localHisText.trim() ? (
                <>
                  <Check className="w-3.5 h-3.5 text-blue-800" />
                  Saved to browser
                </>
              ) : (
                "Empty journal entry"
              )}
            </div>
          </div>
          
          <textarea
            value={localHisText}
            onChange={(e) => setLocalHisText(e.target.value)}
            readOnly={activeUser === "her"}
            placeholder={
              activeUser === "his"
                ? "Type your reflections here... What has God been speaking to you this week?"
                : `${hisName || "Mr."} profile is not active. Switch to ${hisName || "Mr."} at the top to write or edit.`
            }
            className={`flex-grow min-h-[300px] w-full p-4 rounded-xl border outline-none text-slate-700 text-sm leading-relaxed transition-all resize-y placeholder:text-slate-350 placeholder:font-light ${
              activeUser === "his"
                ? "border-slate-200 focus:border-blue-900 focus:ring-2 focus:ring-blue-100"
                : "border-slate-100 bg-slate-50/65 text-slate-400 cursor-not-allowed"
            }`}
          />
          <div className="text-[10px] text-slate-400 text-right">
            {activeUser === "his" ? "Saves automatically as you type." : "Select profile to unlock editing."}
          </div>
        </div>

        {/* Her Journal Box */}
        <div className={`flex flex-col space-y-3 bg-white rounded-2xl border p-6 shadow-sm hover:shadow-md transition duration-300 ${
          activeUser === "her" ? "border-rose-205 ring-2 ring-rose-400/10 bg-rose-50/5" : "border-slate-100"
        }`}>
          <div className="flex items-center justify-between">
            <h4 className="font-serif text-base font-bold text-rose-800 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-450 animate-pulse bg-rose-400" />
              {herName ? `${herName}'s Journal` : "Ms. Journal"}
            </h4>
            <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5">
              {activeUser === "his" ? (
                <span className="text-slate-400 text-[10px]">Read Only</span>
              ) : isSavingHer ? (
                <>
                  <Save className="w-3.5 h-3.5 animate-pulse text-rose-500" />
                  Saving draft...
                </>
              ) : localHerText.trim() ? (
                <>
                  <Check className="w-3.5 h-3.5 text-rose-500" />
                  Saved to browser
                </>
              ) : (
                "Empty journal entry"
              )}
            </div>
          </div>
          
          <textarea
            value={localHerText}
            onChange={(e) => setLocalHerText(e.target.value)}
            readOnly={activeUser === "his"}
            placeholder={
              activeUser === "her"
                ? "Type your reflections here... What has God been speaking to you this week?"
                : `${herName || "Ms."} profile is not active. Switch to ${herName || "Ms."} at the top to write or edit.`
            }
            className={`flex-grow min-h-[300px] w-full p-4 rounded-xl border outline-none text-slate-700 text-sm leading-relaxed transition-all resize-y placeholder:text-slate-350 placeholder:font-light ${
              activeUser === "her"
                ? "border-slate-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                : "border-slate-100 bg-slate-50/65 text-slate-400 cursor-not-allowed"
            }`}
          />
          <div className="text-[10px] text-slate-400 text-right">
            {activeUser === "her" ? "Saves automatically as you type." : "Select profile to unlock editing."}
          </div>
        </div>
      </div>
    </div>
  );
}
