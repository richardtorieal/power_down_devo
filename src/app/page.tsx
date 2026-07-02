"use client";

import React, { useState, useEffect } from "react";
import { useDevoState } from "../hooks/useDevoState";
import OverviewTab from "../components/OverviewTab";
import DevotionalTab from "../components/DevotionalTab";
import JournalTab from "../components/JournalTab";
import DailyWalkTab from "../components/DailyWalkTab";
import InviteModal from "../components/InviteModal";
import {
  BookOpen, RefreshCw, Layers, PenTool, Sparkles, Heart,
  ChevronDown, Check, Settings, X, Link2, UserPlus
} from "lucide-react";
import { weeklyData } from "../data/devotionals";

type ActiveTab = "overview" | "devotional" | "journal" | "daily-walk";

// ─── Onboarding state for first user ────────────────────────────────────────
interface OnboardingState {
  name: string;
  email: string;
  role: "his" | "her" | "";
}

// ─── Join state for partner arriving via magic link ──────────────────────────
interface JoinState {
  name: string;
  email: string;
}

export default function FaithApp() {
  const {
    hisProgress, herProgress,
    hisRead, herRead,
    hisJournal, herJournal,
    hisReflections, herReflections,
    hisName, herName,
    hisEmail, herEmail,
    activeUser, sessionId, isLoaded,
    setHisName, setHerName,
    setHisEmail, setHerEmail,
    setActiveUser,
    updateHisRead, updateHerRead,
    updateHisJournal, updateHerJournal,
    updateHisReflection, updateHerReflection,
    resetAll
  } = useDevoState();

  const [activeTab, setActiveTab] = useState<ActiveTab>("overview");
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);

  // Detect if arriving via magic link ?join=UUID
  const [isJoinFlow, setIsJoinFlow] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      // useDevoState already strips ?join from URL; we detect join by checking
      // if the session was set from URL (user has no name yet + sessionId is set)
      const urlParams = new URLSearchParams(window.location.search);
      // Check original URL before useDevoState cleans it (stored in state before clearing)
      const joinParam = urlParams.get("join");
      // The hook already stripped it — so if they arrived via join and have no active user,
      // and the localStorage session matches, we show join flow
      // We detect this via: no active user + no name for their role + session exists
    }
  }, []);

  // Stepper state
  const [activeWeekIndex, setActiveWeekIndex] = useState(0);
  const [expandedDay, setExpandedDay] = useState<number | null>(null);
  const [activeWalkDay, setActiveWalkDay] = useState<number>(1);

  // Temporary onboarding state
  const [onboarding, setOnboarding] = useState<OnboardingState>({ name: "", email: "", role: "" });
  // Temporary join state (for partner arriving via magic link)
  const [joinState, setJoinState] = useState<JoinState>({ name: "", email: "" });
  // Edit profile state
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");

  // Toast notification
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // Jump to day handler
  const handleSelectDay = (dayNumber: number, step: 1 | 2 = 1) => {
    setActiveWalkDay(dayNumber);
    setActiveTab("daily-walk");
  };

  // Today's data (used only by Overview tab)
  const today = new Date();
  const currentDayNumber = Math.min(31, Math.max(1, today.getDate()));
  const allDays = weeklyData.flatMap(week => week.days);
  const todayDevo = allDays.find(d => d.dayNumber === currentDayNumber) || allDays[0];

  // ── Loading gate ────────────────────────────────────────────────────────────
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#FBFBFA] flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-3 border-emerald-700 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-400 font-serif italic text-sm animate-pulse">Entering devotional walk...</p>
      </div>
    );
  }

  // ── Determine what flow to show ─────────────────────────────────────────────
  // Partner join flow: sessionId is set (possibly from magic link), no activeUser yet
  // AND session has the other partner's name already (meaning user 1 onboarded)
  const partnerAlreadyExists = (hisName && !herName) || (!hisName && herName);
  const showJoinFlow = !activeUser && partnerAlreadyExists;
  const showOnboarding = !activeUser && !partnerAlreadyExists;

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleOnboardingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { name, email, role } = onboarding;
    if (!name.trim() || !role) return;
    if (role === "his") {
      setHisName(name.trim());
      setHisEmail(email.trim());
    } else {
      setHerName(name.trim());
      setHerEmail(email.trim());
    }
    setActiveUser(role);
  };

  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { name, email } = joinState;
    if (!name.trim()) return;
    // Auto-assign remaining role
    const role: "his" | "her" = hisName ? "her" : "his";
    if (role === "his") {
      setHisName(name.trim());
      setHisEmail(email.trim());
    } else {
      setHerName(name.trim());
      setHerEmail(email.trim());
    }
    setActiveUser(role);
  };

  const handleEditProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) return;
    if (activeUser === "his") {
      setHisName(editName.trim());
      setHisEmail(editEmail.trim());
    } else if (activeUser === "her") {
      setHerName(editName.trim());
      setHerEmail(editEmail.trim());
    }
    setShowEditProfile(false);
    setShowProfileMenu(false);
  };

  const openEditProfile = () => {
    setEditName(activeUser === "his" ? hisName : herName);
    setEditEmail(activeUser === "his" ? hisEmail : herEmail);
    setShowEditProfile(true);
  };

  // Partner role for invite modal (opposite of active user)
  const partnerRole: "his" | "her" = activeUser === "his" ? "her" : "his";
  const partnerHasJoined = activeUser === "his" ? !!herName : !!hisName;

  // ── ONBOARDING SCREEN ───────────────────────────────────────────────────────
  if (showOnboarding || showJoinFlow) {
    const isJoin = showJoinFlow;
    const existingPartnerName = hisName || herName;
    const autoRole: "his" | "her" = hisName ? "her" : "his";
    const autoRoleLabel = autoRole === "her" ? "Ms." : "Mr.";

    return (
      <div className="min-h-screen bg-[#FBFBFA] flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* Ambient blobs */}
        <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-teal-500/5 rounded-full blur-3xl -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-sm bg-white border border-slate-100 rounded-3xl p-8 shadow-xl space-y-6 relative overflow-hidden animate-fadeIn">
          <div className="absolute top-0 right-0 w-28 h-28 bg-emerald-500/5 rounded-full blur-2xl -mr-6 -mt-6 pointer-events-none" />

          {/* Icon + Title */}
          <div className="text-center space-y-2 relative z-10">
            <div className="inline-flex p-3 rounded-full bg-emerald-50">
              <Heart className="w-6 h-6 fill-emerald-600 text-emerald-600 animate-pulse" />
            </div>
            {isJoin ? (
              <>
                <h2 className="text-2xl font-bold font-serif text-slate-900">Join the Walk</h2>
                <p className="text-xs text-slate-500 leading-relaxed">
                  <span className="font-semibold text-slate-700">{existingPartnerName}</span> has invited
                  you to join their 31-day devotional walk together.
                </p>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold font-serif text-slate-900">Begin Your Walk</h2>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Start your 31-day spiritual journey. You can invite your partner after signing in.
                </p>
              </>
            )}
          </div>

          {/* Form */}
          {isJoin ? (
            <form onSubmit={handleJoinSubmit} className="space-y-4 relative z-10">
              {/* Auto-assigned role badge */}
              <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${
                autoRole === "her"
                  ? "bg-rose-50 border-rose-100"
                  : "bg-blue-50 border-blue-100"
              }`}>
                <div className={`w-2 h-2 rounded-full ${autoRole === "her" ? "bg-rose-400" : "bg-blue-800"}`} />
                <span className={`text-xs font-semibold ${autoRole === "her" ? "text-rose-800" : "text-blue-900"}`}>
                  You will join as {autoRoleLabel}
                </span>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Your Name</label>
                <input
                  type="text"
                  required
                  value={joinState.name}
                  onChange={e => setJoinState(s => ({ ...s, name: e.target.value }))}
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 outline-none text-sm transition-all bg-[#FAF9F6] text-slate-800 font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Email <span className="text-slate-400 normal-case font-normal">(optional)</span>
                </label>
                <input
                  type="email"
                  value={joinState.email}
                  onChange={e => setJoinState(s => ({ ...s, email: e.target.value }))}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 outline-none text-sm transition-all bg-[#FAF9F6] text-slate-800 font-medium"
                />
              </div>

              <button
                type="submit"
                disabled={!joinState.name.trim()}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-teal-700 to-emerald-700 hover:from-teal-800 hover:to-emerald-800 text-white text-sm font-semibold tracking-wide transition-all shadow-md active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                Join the Walk →
              </button>
            </form>
          ) : (
            <form onSubmit={handleOnboardingSubmit} className="space-y-4 relative z-10">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Your Name</label>
                <input
                  type="text"
                  required
                  value={onboarding.name}
                  onChange={e => setOnboarding(s => ({ ...s, name: e.target.value }))}
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 outline-none text-sm transition-all bg-[#FAF9F6] text-slate-800 font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Email <span className="text-slate-400 normal-case font-normal">(optional)</span>
                </label>
                <input
                  type="email"
                  value={onboarding.email}
                  onChange={e => setOnboarding(s => ({ ...s, email: e.target.value }))}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none text-sm transition-all bg-[#FAF9F6] text-slate-800 font-medium"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">I am the</label>
                <div className="grid grid-cols-2 gap-3">
                  {(["his", "her"] as const).map(role => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setOnboarding(s => ({ ...s, role }))}
                      className={`py-3 rounded-xl border text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                        onboarding.role === role
                          ? role === "his"
                            ? "border-blue-900 bg-blue-50 text-blue-900 ring-2 ring-blue-900/25"
                            : "border-rose-400 bg-rose-50 text-rose-800 ring-2 ring-rose-400/25"
                          : "border-slate-200 bg-[#FAF9F6] text-slate-500 hover:border-slate-300"
                      }`}
                    >
                      {role === "his" ? "Mr." : "Ms."}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={!onboarding.name.trim() || !onboarding.role}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-teal-700 to-emerald-700 hover:from-teal-800 hover:to-emerald-800 text-white text-sm font-semibold tracking-wide transition-all shadow-md active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                Begin Spiritual Walk →
              </button>
            </form>
          )}
        </div>

        {/* App branding */}
        <p className="mt-6 text-xs text-slate-400 text-center">July Power Down Devo · One Community Church</p>
      </div>
    );
  }

  // ── MAIN APP ────────────────────────────────────────────────────────────────
  const myName = activeUser === "his" ? hisName : herName;

  return (
    <div className="min-h-screen bg-[#FBFBFA] text-slate-800 flex flex-col font-sans relative selection:bg-emerald-100 selection:text-emerald-900 overflow-x-hidden">
      {/* Background ambient blobs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-teal-500/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-emerald-50/5 rounded-full blur-3xl pointer-events-none" />

      {/* Toast notification */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-lg animate-fadeIn flex items-center gap-2">
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          {toast}
        </div>
      )}

      {/* ── Top Navbar ───────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-[#FBFBFA]/85 border-b border-slate-100/80 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <button
            onClick={() => setActiveTab("overview")}
            className="flex items-center gap-2.5 hover:opacity-85 text-left cursor-pointer transition-all active:scale-[0.98]"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-700 to-emerald-600 flex items-center justify-center text-white shadow-md">
              <Sparkles className="w-5 h-5 text-emerald-100" />
            </div>
            <div>
              <span className="font-serif text-lg font-bold tracking-tight text-slate-900 block leading-tight">
                July Power Down Devo
              </span>
              <span className="text-[10px] font-semibold text-emerald-700 tracking-wider uppercase block">
                One Community Church
              </span>
            </div>
          </button>

          {/* Profile dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-all text-xs font-semibold text-slate-700 shadow-sm active:scale-98 cursor-pointer"
            >
              <div className={`w-2.5 h-2.5 rounded-full ${activeUser === "his" ? "bg-blue-900 animate-pulse" : "bg-rose-400 animate-pulse"}`} />
              <span>{myName}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showProfileMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowProfileMenu(false)} />
                <div className="absolute right-0 mt-2 w-60 rounded-2xl bg-white border border-slate-150 shadow-lg py-2.5 z-50 animate-fadeIn">
                  {/* Current user */}
                  <div className="px-4 py-1.5 border-b border-slate-100 mb-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Signed in as</span>
                    <span className="text-sm font-semibold text-slate-800 truncate block">{myName}</span>
                    <span className="text-[10px] text-slate-400 truncate block">{activeUser === "his" ? hisEmail : herEmail}</span>
                  </div>

                  {/* Switch partner if they've joined */}
                  {partnerHasJoined && (
                    <button
                      onClick={() => {
                        setActiveUser(partnerRole);
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center gap-2.5 text-xs font-medium text-slate-700 cursor-pointer"
                    >
                      <div className={`w-2 h-2 rounded-full ${partnerRole === "his" ? "bg-blue-900" : "bg-rose-400"}`} />
                      <span>Switch to {partnerRole === "his" ? (hisName || "Mr.") : (herName || "Ms.")}</span>
                    </button>
                  )}

                  {/* Invite Partner */}
                  <button
                    onClick={() => {
                      if (!partnerHasJoined) {
                        setShowInviteModal(true);
                        setShowProfileMenu(false);
                      }
                    }}
                    disabled={partnerHasJoined}
                    className={`w-full text-left px-4 py-2 flex items-center gap-2.5 text-xs font-medium ${
                      partnerHasJoined
                        ? "text-slate-350 cursor-not-allowed opacity-60"
                        : "hover:bg-teal-50 text-teal-700 cursor-pointer"
                    }`}
                  >
                    <UserPlus className={`w-3.5 h-3.5 ${partnerHasJoined ? "text-slate-300" : "text-teal-500"}`} />
                    <span>{partnerHasJoined ? "Partner Joined ✓" : "Invite Partner"}</span>
                  </button>

                  <div className="border-t border-slate-100 my-2" />

                  <button
                    onClick={openEditProfile}
                    className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center gap-2 text-xs font-medium text-slate-600 cursor-pointer"
                  >
                    <Settings className="w-3.5 h-3.5 text-slate-400" />
                    <span>Edit My Profile</span>
                  </button>

                  <button
                    onClick={() => {
                      resetAll();
                      setShowProfileMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-rose-50 text-rose-600 flex items-center gap-2 text-xs font-medium cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-rose-400" />
                    <span>Reset Devotional</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ── Main Content ─────────────────────────────────────────────────────── */}
      <main className="flex-grow max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 relative z-10">
        {/* Invite partner banner (shown when partner hasn't joined yet) */}
        {!partnerHasJoined && (
          <div className="bg-teal-50 border border-teal-100 rounded-2xl px-4 py-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <Link2 className="w-4 h-4 text-teal-600 shrink-0" />
              <p className="text-xs font-medium text-teal-800 truncate">
                Invite your partner to join this devotional walk
              </p>
            </div>
            <button
              onClick={() => setShowInviteModal(true)}
              className="shrink-0 px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg transition-all cursor-pointer active:scale-95 whitespace-nowrap"
            >
              Send Invite →
            </button>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex justify-center sm:justify-start">
          <nav className="flex w-full sm:w-auto space-x-1 sm:space-x-1.5 p-1 bg-slate-100/80 rounded-2xl border border-slate-200/50">
            <button
              onClick={() => setActiveTab("overview")}
              className={`flex flex-1 sm:flex-none items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 cursor-pointer whitespace-nowrap ${
                activeTab === "overview" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-800 hover:bg-white/40"
              }`}
            >
              <BookOpen className={`w-4 h-4 shrink-0 ${activeTab === "overview" ? "text-emerald-700" : "text-slate-400"}`} />
              Overview
            </button>

            <button
              onClick={() => setActiveTab("devotional")}
              className={`flex flex-1 sm:flex-none items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 cursor-pointer whitespace-nowrap ${
                activeTab === "devotional" || activeTab === "daily-walk" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-800 hover:bg-white/40"
              }`}
            >
              <Layers className={`w-4 h-4 shrink-0 ${activeTab === "devotional" || activeTab === "daily-walk" ? "text-emerald-700" : "text-slate-400"}`} />
              Weeks 1–5
            </button>

            <button
              onClick={() => setActiveTab("journal")}
              className={`flex flex-1 sm:flex-none items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 cursor-pointer whitespace-nowrap ${
                activeTab === "journal" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-800 hover:bg-white/40"
              }`}
            >
              <PenTool className={`w-4 h-4 shrink-0 ${activeTab === "journal" ? "text-emerald-700" : "text-slate-400"}`} />
              Journal
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="min-h-[400px]">
          {activeTab === "overview" && (
            <div className="animate-pageTransition">
              <OverviewTab
                hisProgress={hisProgress}
                herProgress={herProgress}
                hisRead={hisRead}
                herRead={herRead}
                hisName={hisName}
                herName={herName}
                activeUser={activeUser}
                onSelectDay={handleSelectDay}
                onSwitchToDevotionalTab={() => setActiveTab("devotional")}
              />
            </div>
          )}

          {activeTab === "devotional" && (
            <div className="animate-pageTransition">
              <DevotionalTab
                hisProgress={hisProgress}
                herProgress={herProgress}
                hisRead={hisRead}
                herRead={herRead}
                hisName={hisName}
                herName={herName}
                activeUser={activeUser}
                activeWeekIndex={activeWeekIndex}
                setActiveWeekIndex={setActiveWeekIndex}
                onSelectDay={handleSelectDay}
              />
            </div>
          )}

          {activeTab === "daily-walk" && (
            <div className="animate-pageTransition">
              <DailyWalkTab
                dayNumber={activeWalkDay}
                hisProgress={hisProgress}
                herProgress={herProgress}
                hisRead={hisRead}
                herRead={herRead}
                hisReflections={hisReflections}
                herReflections={herReflections}
                updateHisReflection={updateHisReflection}
                updateHerReflection={updateHerReflection}
                updateHisRead={updateHisRead}
                updateHerRead={updateHerRead}
                hisName={hisName}
                herName={herName}
                activeUser={activeUser}
                onBackToList={() => setActiveTab("devotional")}
                setExpandedDay={setExpandedDay}
                jumpToDay={(d) => setActiveWalkDay(d)}
              />
            </div>
          )}

          {activeTab === "journal" && (
            <div className="animate-pageTransition">
              <JournalTab
                hisJournal={hisJournal}
                herJournal={herJournal}
                updateHisJournal={updateHisJournal}
                updateHerJournal={updateHerJournal}
                hisName={hisName}
                herName={herName}
                activeUser={activeUser}
              />
            </div>
          )}
        </div>
      </main>

      {/* ── Edit Profile Modal ─────────────────────────────────────────────── */}
      {showEditProfile && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-150 p-6 w-full max-w-sm shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-serif font-bold text-slate-900 text-base">Edit My Profile</h3>
              <button onClick={() => setShowEditProfile(false)} className="p-1 rounded-lg text-slate-400 hover:bg-slate-50 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleEditProfileSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-teal-100 outline-none text-slate-800 font-medium"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email</label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={e => setEditEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-teal-100 outline-none text-slate-800 font-medium"
                  placeholder="your@email.com"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-all cursor-pointer"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── Invite Modal ───────────────────────────────────────────────────── */}
      {showInviteModal && (
        <InviteModal
          sessionId={sessionId}
          partnerRole={partnerRole}
          hisName={hisName}
          herName={herName}
          activeUser={activeUser}
          onClose={() => setShowInviteModal(false)}
        />
      )}

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer className="mt-auto border-t border-slate-100 py-6 text-center text-xs text-slate-400">
        <div className="max-w-6xl mx-auto px-4">
          <p>© {new Date().getFullYear()} July Power Down Devo. All data saved securely to your shared session.</p>
          <p className="mt-1 font-medium">One Community Church · Ephesians 3:14-21</p>
        </div>
      </footer>
    </div>
  );
}
