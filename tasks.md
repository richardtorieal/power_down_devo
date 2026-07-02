# Tasks: Faith That Shows Up

- [x] Initialize Next.js app in the project directory
- [x] Configure Tailwind CSS, fonts, and Lucide React icons
- [x] Create devotional dataset (`src/data/devotionals.ts`) with all 31 days verbatim
- [x] Create state synchronization hook (`src/hooks/useDevoState.ts`) with localStorage
- [x] Implement Dashboard navigation layout
- [x] Build the **Overview** Component
- [x] Build the **Devotional (Weeks 1-5)** Component
- [x] Build the **Journal** Component
- [x] Apply CSS/Tailwind details (Sage green / Teal colors, transitions, responsive UI)
- [x] Build and check for compile/type errors
- [x] Create project README.md
- [x] Run `node index_projects.js` to update the projects index
- [x] Send Discord update
- [x] Take screenshots and verify final UI

## Part 2 Refinements: Profile Flow & UI Cleanup
- [x] Implement His/Her Name states in `useDevoState` custom hook
- [x] Design Onboarding Setup overlay for first-time profile designation
- [x] Build Profile Selector / switcher component in header
- [x] Hide Reset Button inside settings submenu in the profile selection view
- [x] Remove diagnostic text ("Dual Tracking Active: Partner Devotional" etc.) from sub-banner
- [x] Integrate user custom names in circular progress rings, check-off labels, and journal headers
- [x] Compile check and run locally to verify updates
- [x] Update tasks.md

## Part 3: Expandable Reflection Drawers & YouVersion Integration
- [x] Add reflection answers storage in `useDevoState` custom hook
- [x] Replace BibleGateway links with YouVersion search links
- [x] Redesign daily cards to remove dual checkboxes
- [x] Build daily expandable reflection drawer/accordion component in `DevotionalTab.tsx`
- [x] Implement active-user auto-assignment for reflection answers and progress checking
- [x] Compile check and run locally to verify updates
- [x] Update tasks.md

## Part 4: Mandatory Reflections, YouVersion Deep Linking & Renaming
- [x] Rename layout metadata and navbar titles to "July Power Down Devo"
- [x] Implement path-based YouVersion link generation helper in DevotionalTab
- [x] Remove "Mark as completed (without text)" checkbox from daily drawer
- [x] Update state hooks to sync completion directly to answer non-emptiness
- [x] Compile check and run locally to verify updates
- [x] Update tasks.md

## Part 5: Ephesians 3 Excerpt Update
- [x] Replace welcome banner placeholder quote with Ephesians 3:16-19 scripture excerpt
- [x] Compile check and run locally to verify updates
- [x] Update tasks.md

## Part 6: Call To Actions & Verse of the Day Card
- [x] Implement `jumpToDay` navigation logic lifting week/drawer states to `page.tsx`
- [x] Replace green welcome card on Overview tab with a "Verse of the Day" card containing "Read & Journal" button
- [x] Add "Jump to Today's Devotional" Call to Action buttons inside the partner progress trackers
- [x] Build a top sticky notification callout bar showing today's scripture and a "Go" button
- [x] Compile check and run locally to verify updates
- [x] Update tasks.md

## Part 7: Clean Hero Card Details
- [x] Remove Ephesians 3 excerpt quote and Core Plan text from Overview welcome/hero card
- [x] Compile check and run locally to verify updates
- [x] Update tasks.md

## Part 8: Remove Church Callout from Hero
- [x] Remove "One Community Church" text from welcome card on Overview tab
- [x] Compile check and run locally to verify updates
- [x] Update tasks.md

## Part 9: YouVersion Embed Integration
- [x] Create Next.js API route `/src/app/api/bible/passage/route.ts` to proxy requests securely
- [x] Fetch credentials from `youversion_credentials.txt` to authenticate API calls
- [x] Integrate passage rendering inside `DevotionalTab.tsx` when card drawer is expanded
- [x] Compile check and run locally to verify updates
- [x] Update tasks.md

## Part 10: Multi-Device Server-Side State Sync
- [x] Create server endpoint `/api/devo/state` supporting Vercel KV and local filesystem fallback
- [x] Refactor `useDevoState.ts` custom hook to run debounced server POST updates and poll every 8 seconds
- [x] Implement Role-Partitioned merge logic to prevent active typing input collision
- [x] Update `.gitignore` to ignore the local state database file
- [x] Compile check and run locally to verify updates
- [x] Update tasks.md

## Part 11: Polling Frequency Adjustment
- [x] Change polling interval in `useDevoState.ts` to 2 minutes (120000ms)
- [x] Compile check and run locally to verify updates
- [x] Update tasks.md

## Part 12: YouVersion HTML Verse Styling & Scrolling Embed
- [x] Update `/api/bible/passage` route to fetch `format=html`
- [x] Modify `DevotionalTab.tsx` to render raw HTML safely with `dangerouslySetInnerHTML`
- [x] Add CSS overrides for `.yv-vlbl` (verse numbers) and `.p` (paragraphs) to support high-fidelity layout
- [x] Compile check and run locally to verify updates
- [x] Update tasks.md

## Part 13: Daily Walk Stepper Flow & Bible Version Toggles
- [x] Add `hisRead` and `herRead` state variables and sync them in `useDevoState.ts` and `/api/devo/state`
- [x] Update `/api/bible/passage/route.ts` to accept `version` parameter mapping ESV/NIV/KJV to authorized YouVersion IDs
- [x] Design and implement the self-contained `DailyWalkTab` component (with Step 1: Read, Step 2: Reflection, version selector, and progress verification)
- [x] Refactor homepage navigation layout to redirect all jump actions to this new stepper flow
- [x] Compile check and run locally to verify updates
- [x] Update tasks.md

## Part 14: Premium Transitions, Swipe Gestures, Testing & Vercel Deploy
- [x] Add dynamic SVG rotating loading spinner in `DailyWalkTab.tsx`
- [x] Make top navbar title and logo clickable, redirecting to Overview
- [x] Define Framer-like animation transition keyframes in `globals.css` and wrap tabs/stepper steps in animated CSS classes
- [x] Implement touch swipe controls (`onTouchStart`, `onTouchMove`, `onTouchEnd`) for tab switches and stepper steps
- [x] Configure testing environment with `vitest` and implement unit + E2E test suite
- [x] Deploy live to Vercel using the Vercel MCP/CLI server
- [x] Verify build and live sync correctness
- [x] Grade rubric to 100% completion
- [x] Update tasks.md

## Part 15: Session-Based Onboarding & Invite Magic Link
- [x] Remove "Today's Reading" callout banner from top of page
- [x] Create single-user onboarding form (name, email, role)
- [x] Generate session UUID on first onboarding
- [x] Scoping `/api/devo/state` under `?session=UUID` query parameters
- [x] Build `InviteModal` to share unique `/?join=UUID` magic links
- [x] Show "Invite Partner" banner on dashboard and dropdown option
- [x] Implement magic link landing page join flow auto-assigning remaining partner role
- [x] Set up E2E test coverage for onboarding, invite links, and joint walks

## Part 16: Mr./Ms. Vocabulary, Vercel KV Setup & State Isolation
- [x] Replace Husband/Wife labels with Mr./Ms. throughout the app
- [x] Style active roles, progress meters, and cards with subtle Navy Blue and Blush Pink accents
- [x] Provision and connect Vercel Upstash Redis KV Database to the project
- [x] Delete all hardcoded fallback json files containing name fields
- [x] Disable and label the "Invite Partner" dropdown option when partner has joined
- [x] Run compilation checks, local unit/E2E test runs, and promote build to production on Vercel

## Part 17: User Menu Click-Outside, Hidden Switcher & Owner Reset Security Modal
- [x] Initialize Git repository, push to GitHub user `richartorieal/power_down_devo`, and connect Vercel to auto deploy on push
- [x] Hide the "switch to partner" dropdown action to enforce single-user viewpoints
- [x] Implement Ref click-outside listener to dismiss the user settings menu cleanly
- [x] Introduce `ownerRole` tracking to restrict the Reset Devotional button to the creator user
- [x] Create a custom Reset Confirmation security modal prompting Yes/No choices before wiping data
- [x] Verify local unit + E2E test runs, ensure production Vercel build connects correctly, and update logs
- [x] Modify resetAll to keep names, activeUser, and ownerRole active so both users stay logged in
- [x] Update fetchServerState to overwrite progress metrics when partners reset

