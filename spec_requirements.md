# Specifications: July Power Down Devo (31-Day Devotional Tracker)

A highly polished, single-page, responsive Next.js application for a couple ("His Walk" / "Her Walk") to track their spiritual intimacy, read 31 days of devotional scriptures/reflections, and write/save weekly journal notes.

## 1. Core Features & Technical Requirements

- **Framework**: Next.js (App Router), React, Tailwind CSS, Lucide React icons.
- **State Management & Persistence**:
  - `localStorage` hook to persist checkbox progress (for both His and Her walks) and weekly journal logs (for both His and Her).
  - Synchronized updates between progress bars and reflection answers.
- **User Profiles & Onboarding Flow**:
  - First-time onboarding overlay: If a user's name is not yet designated in the browser, they are prompted to select their profile role ("HIS" or "HER") and enter their name.
  - Subsequent visits: Display a clean, elegant profile switcher in the top navigation bar showing the active user (e.g., "Active: [His Name]" or "Active: [Her Name]").
  - State persistence for His Name (`hisName`) and Her Name (`herName`).
  - Active profile restrictions: Users can toggle entries for both, but the interface highlights the active partner's workspace, encouraging them to update their own logs while keeping their partner's visible.
  - Hide the Reset option inside a settings submenu in the profile selection modal to prevent accidental data loss.
- **Tabbed Dashboard Navigation**:
  - **Overview Tab**:
    - Title: July Power Down Devo
    - **Verse of the Day Card**: Replaces the main welcome/devotional summary card. Automatically calculates the day of the month (1-31), displays the corresponding scripture reference and reflection question, and provides a "Read & Journal" Call to Action button.
    - **Walk Tracker CTAs**: Interactive buttons below each progress bar that let partners jump directly to their active reading tasks.
    - F-A-I-T-H Strategy (Focus, Act, Inspire, Trust, Hold) with custom icons and explanations.
    - Clean, modern couple progress rings utilizing the customized names (e.g., "David's Walk" and "Sarah's Walk" instead of "His Progress" and "Her Progress").
  - **Today's Reading Top Bar Callout**: A compact, floating banner placed directly under the top navbar showing today's active scripture reference (determined by the date) with a quick "Go to Devotional" button that redirects, opens, and scrolls directly to that day's drawer.
  - **Weeks 1–5 Tab**:
    - Sub-navigation for Week 1 (Days 1–7), Week 2 (Days 8–14), Week 3 (Days 15–21), Week 4 (Days 22–28), and Week 5 (Days 29–31).
    - Responsive card layout for each day with verbatim scriptures and reflection questions.
    - Scripture "Read" links pointing directly to the YouVersion path-based translation URL structure (`https://www.bible.com/bible/59/{BOOK}.{CHAPTER}.{VERSES}.ESV`).
    - **YouVersion Embedded Text**: Integrates the YouVersion Platform REST API using the key stored in `youversion_credentials.txt` requesting `format=html`. A Next.js API route proxies requests to keep the API key secure. When a daily drawer expands, the corresponding scripture HTML text is fetched dynamically and rendered with verse-by-verse styling, superscript numbers, paragraph separations, and an elegant serif typography layout.
      - **Simplified Labeling**: The header is simplified to "Scripture Passage" with the active version tag.
      - **Version Toggle**: Supports dynamic translation toggling between ESV (default, mapped to BSB ID 3034), NIV (mapped to FBV ID 1932), and KJV (mapped to ASV ID 12).
    - **YouVersion Loading Spinner**: Displays an animated SVG rotating loading indicator while the HTML Bible text is being fetched from the proxy.
    - **Framer-Like CSS Transitions**: Applies smooth translation and opacity transitions across tab changes and daily stepper steps to elevate the interactive feel.
    - **Touch Swipe Navigation**: Enables swipe-left and swipe-right gestures on touch-enabled devices (like iPhones and iPads) to switch between main tabs and advance through study steps.
    - **Self-Contained Daily Walk Stepper Flow**:
      - Replaces the inline expandable daily drawers with a focused, dedicated workspace view for the selected day.
      - **Step 1: Focused Reading**: Displays the styled scripture passage with the version toggle. The user must click "Mark as Read" (which persists to the shared database as `hisRead`/`herRead`). This unlocks Step 2.
      - **Step 2: Reflection & Journaling**: Prompts the active user to enter their reflection text. Saving a non-empty response marks their day complete.
      - Seamless navigation buttons to switch between Step 1 (Read) and Step 2 (Reflection), and go back to the Overview list.
    - **Clickable Navbar Header**: Clicking the navbar logo/title resets navigation state back to the Overview homepage.
    - **Multi-Device Sync**: Runs debounced server POST mutations and polls the database backend once every 2 minutes while active (tab focused) to sync partners' read status, reflections, and journal entries.
    - Remove the check-off without text option. A day's walk is marked as complete if and only if they write a reflection answer. Clearing the reflection text automatically unchecks their progress for that day.
    - Daily card list shows status indicators indicating completion, and clicking any card redirects the user into the self-contained Daily Walk Stepper flow.
  - **Testing Setup**:
    - **Unit Tests**: Powered by Vitest to validate translation parameters, route proxying, and math metrics.
    - **E2E Testing**: Programmatic automation checking onboarding, step transitions, read verification, and state merges.
  - **Journal Tab**:
    - Organized by Week (1–5) containing the weekly journal prompts verbatim.
    - High-quality textareas for both partner journals (labeled with their custom names), autosaving drafts to localStorage.
- **UX & Design Aesthetics**:
  - Spiritual, calm, and modern look.
  - Colors: Earthy Sage Green (`#708A50`), Deep Teal (`#2E8B83`), Warm Cream (`#FDFBF7`), Clean Slate (`#0F172A`).
  - Smooth custom transitions between tabs and sub-tabs.
  - Micro-animations (e.g. checkmark scales, card hover elevations).
  - Completely responsive: fully usable on mobile, tablet, and desktop screens.
- **Verbatim Content Integration**:
  - All 31 days mapped out fully with correct scripture references and reflection questions (no placeholders, no cutoffs).
  - All weekly journal prompts mapped out.
- **Git & Vercel Connection**:
  - Initialized git repository connected to GitHub user `richartorieal/power_down_devo`.
  - Linked to Vercel for continuous integration and auto deployment on updates and PRs.
- **Access Control & Security Rules**:
  - Hidden "switch to" partner profile toggle in user menu (users only see their active view).
  - Click-outside detection: Clicking anywhere outside the user dropdown menu automatically closes it.
  - Reset Authorization: Only the user who onboarded first and created the session (`ownerRole`) is permitted to trigger the "Reset Devotional" action.
  - Reset Confirmation: When resetting, a custom modal confirmation popup prompts the user with "Yes" or "No" to prevent accidental data deletion. Wiping progress clears all devotional read and reflection states, resetting all counters to 0, but preserves active user profile configurations (names, emails, active role, and session ID) so both users stay logged in.

## 2. Technical Architecture & File Layout

- `/src/app/page.tsx`: Single page application containing the main dashboard structure.
- `/src/app/layout.tsx`: Root layout with styling, fonts, and metadata.
- `/src/components/OverviewTab.tsx`: Overview content, F-A-I-T-H strategy, and global stats.
- `/src/components/DevotionalTab.tsx`: Weeks navigation and Day devotionals.
- `/src/components/JournalTab.tsx`: Weekly journal inputs.
- `/src/hooks/useDevoState.ts`: Custom React hook encapsulating state loading, saving, and ownerRole validation.
- `/src/data/devotionals.ts`: Static dataset containing the 31 days data and journal prompts.
