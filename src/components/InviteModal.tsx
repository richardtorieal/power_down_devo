"use client";

import React, { useState } from "react";
import { X, Link2, Check, Copy, Share2 } from "lucide-react";

interface InviteModalProps {
  sessionId: string;
  partnerRole: "his" | "her";
  hisName: string;
  herName: string;
  activeUser: "his" | "her" | null;
  onClose: () => void;
}

export default function InviteModal({
  sessionId,
  partnerRole,
  hisName,
  herName,
  activeUser,
  onClose,
}: InviteModalProps) {
  const [copied, setCopied] = useState(false);

  const partnerLabel = partnerRole === "her"
    ? (herName || "Ms.")
    : (hisName || "Mr.");

  const myName = activeUser === "his" ? hisName : herName;

  const inviteLink =
    typeof window !== "undefined"
      ? `${window.location.origin}/?join=${sessionId}`
      : `https://powerdowndevo.vercel.app/?join=${sessionId}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback for older browsers
      const el = document.createElement("textarea");
      el.value = inviteLink;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: "July Power Down Devo",
          text: `${myName || "Your partner"} has invited you to join their 31-day devotional walk together.`,
          url: inviteLink,
        });
      } catch {
        // User cancelled or share failed — fall back to copy
        handleCopy();
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-3xl border border-slate-100 p-6 w-full max-w-sm shadow-2xl space-y-5 relative overflow-hidden animate-fadeIn">
        {/* Ambient decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-700 to-emerald-600 flex items-center justify-center shadow-md">
              <Link2 className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-slate-900 text-base leading-tight">
                Invite Your Partner
              </h3>
              <p className="text-[10px] text-emerald-700 font-semibold uppercase tracking-wider">
                Magic Link
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-50 cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Description */}
        <p className="text-sm text-slate-600 leading-relaxed">
          Share this link with{" "}
          <span className="font-semibold text-slate-800">{partnerLabel}</span> to
          invite them into your devotional walk. When they open it, they'll
          instantly join your shared session.
        </p>

        {/* Link Display */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-3">
          <div className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0 animate-pulse" />
            <p className="text-xs text-slate-500 font-mono break-all leading-relaxed select-all">
              {inviteLink}
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                copied
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-900 hover:bg-slate-800 text-white active:scale-95"
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  Copy Link
                </>
              )}
            </button>

            <button
              onClick={handleShare}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-semibold transition-all cursor-pointer active:scale-95 border border-teal-200"
            >
              <Share2 className="w-3.5 h-3.5" />
              Share
            </button>
          </div>
        </div>

        {/* Security note */}
        <p className="text-[10px] text-slate-400 text-center leading-relaxed">
          🔒 This link is unique to your session and only works for your partner.
          Keep it private.
        </p>
      </div>
    </div>
  );
}
