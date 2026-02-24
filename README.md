# Rating Room — Expo MVP Action Plan

**Target: 3–4 weeks | Stack: React Native + Expo + Supabase**

---

## Stack Decisions (Decide Before Day 1)

- **Framework:** Expo (managed workflow) with TypeScript
- **Navigation:** Expo Router (file-based, works natively on iOS/Android/web)
- **Backend & Auth:** Supabase — handles Postgres, auth, real-time subscriptions, and row-level security in one service
- **State management:** Zustand — lightweight, no boilerplate, works great with Supabase subscriptions
- **Styling:** NativeWind (Tailwind for React Native) or StyleSheet — pick one and commit
- **Invite system:** Supabase magic links or short room codes (codes are simpler for MVP)

---

## Week 1 — Foundation & Auth

### Project Setup

- [x] `npx create-expo-app rating-room --template tabs` with TypeScript template
- [x] Install and configure Expo Router for file-based navigation
- [x] Set up ESLint, Prettier, and absolute import paths (`@/components`, `@/lib`, etc.)
- [x] Create a Supabase project at supabase.com
- [ ] Install `@supabase/supabase-js` and `expo-secure-store`
- [ ] Wire up Supabase client in `lib/supabase.ts` using `AsyncStorage` adapter for auth session persistence
- [ ] Set up environment variables with `expo-constants` (never hardcode keys)
- [ ] Configure EAS Build for later TestFlight/Play Store deployment (optional at this stage but good to do early)

### Database Schema

Design and create these tables in Supabase:

- [ ] **`profiles`** — `id` (references auth.users), `name`, `avatar_color`, `created_at`
- [ ] **`rooms`** — `id`, `name`, `emoji`, `created_by`, `created_at`
- [ ] **`room_members`** — `room_id`, `user_id`, `joined_at` (junction table)
- [ ] **`categories`** — `id`, `room_id` (null = global), `label`, `emoji`, `created_by`
- [ ] **`experiences`** — `id`, `room_id`, `title`, `category_id`, `date`, `added_by`, `created_at`
- [ ] **`ratings`** — `id`, `experience_id`, `user_id`, `score`, `note`, `created_at` — multiple rows per user per experience, latest by `created_at` wins
- [ ] Write Row Level Security (RLS) policies: users can only read/write data for rooms they are members of
- [ ] Seed the database with test data matching the prototype (two rooms, sample entries)

### Authentication

- [ ] Build `(auth)/login.tsx` screen — email + magic link flow (no passwords needed for MVP)
- [ ] Build `(auth)/verify.tsx` screen — "check your email" confirmation state
- [ ] Handle deep link callback from magic link email using `expo-linking`
- [ ] Create auth context/hook (`useAuth`) that exposes current user and session
- [ ] Auto-redirect: if session exists → rooms list, if not → login
- [ ] Create `profiles` row automatically on first sign-in (Supabase trigger or client-side on login)
- [ ] Build a simple onboarding screen to set display name after first login

---

## Week 2 — Core Screens: Rooms & Experiences

### Rooms List (Home)

- [ ] Build `(app)/index.tsx` — the rooms list screen matching the prototype
- [ ] Fetch rooms for current user via `room_members` join
- [ ] Show room name, emoji, member count, entry count, and pending-rating count
- [ ] "Pending" count = experiences where at least one other member has rated but you haven't
- [ ] Build **Create Room** sheet/modal: name input, emoji picker, add members by email or name
- [ ] Implement room invite via **short code** — generate a 6-character alphanumeric code stored on the room, user enters it to join
- [ ] Alternatively: generate a shareable deep link (`ratingroom://join/ABC123`) using `expo-linking`
- [ ] Write the `joinRoom(code)` function that validates membership and inserts into `room_members`

### Room Feed Screen

- [ ] Build `(app)/room/[id].tsx`
- [ ] Fetch experiences for the room, sorted by date descending
- [ ] For each experience, fetch the **latest** rating per member (use a Postgres view or query with `DISTINCT ON (user_id) ORDER BY created_at DESC`)
- [ ] Display per-member score dots — hollow/empty if that member hasn't rated
- [ ] Show average score across all members' latest ratings
- [ ] Show "rate this" badge on entries where others have rated but you haven't
- [ ] Implement category filter bar with horizontal scroll
- [ ] Build the **Add Experience** bottom sheet: title, category picker, date, your score + note
- [ ] Build the **Add Category** sheet: emoji picker + name, saves to `categories` table with `room_id`
- [ ] Implement optimistic UI updates — add entry to local state immediately, sync to Supabase in background
- [ ] Subscribe to real-time updates on `experiences` and `ratings` tables for this room using Supabase Realtime

### Experience Detail Screen

- [ ] Build `(app)/experience/[id].tsx`
- [ ] Show title, category, date, overall average
- [ ] Show per-member rating blocks: each member's **latest** score prominently, full rating history below (all rows for that member, newest first, tagged "latest")
- [ ] Show disagreement callout if score spread ≥ 3 points
- [ ] "Rate this" / "Rate again" button that opens the rating sheet
- [ ] **Rating sheet:** pre-populate with your last score if you've rated before, add new row to `ratings` table on submit (never update in place — always insert)
- [ ] After submitting a rating, refresh the detail view and update the feed

---

## Week 3 — Insights, Profiles & Invites

### Insights Tab

- [ ] Add tab to the room screen bottom nav
- [ ] **Category taste map:** for each category, compute average of all members' latest ratings, render as horizontal bar
- [ ] **Taste alignment score:** compute average spread across all experiences (lower spread = higher alignment), display as percentage
- [ ] **Highlights section:**
  - Most loved experience (highest avg)
  - Most divisive experience (highest spread)
  - Number of unanimous ratings (spread = 0 across all members)
  - Most generous rater (member with highest avg score)
  - Count of re-rated experiences
- [ ] All Insights computations should happen client-side from fetched data (no need for complex DB queries at MVP scale)

### Member Profile Screen

- [ ] Build `(app)/profile/[memberId].tsx`
- [ ] Show avatar (colored initial), display name, member since date
- [ ] Show stats: total experiences rated, total rating events, average score
- [ ] List all experiences they've rated with their current score and re-rate count
- [ ] Tapping an experience navigates to the detail screen
- [ ] If viewing your own profile, show an "Edit name" option

### Your Profile / Settings

- [ ] Build `(app)/settings.tsx` accessible from the home screen
- [ ] Display name editing — updates `profiles` table
- [ ] Avatar color picker (6–8 colour options)
- [ ] List of rooms you're in with a "Leave room" option
- [ ] Sign out button

### Invite Flow (Polish)

- [ ] Display the room's join code prominently in room settings
- [ ] "Share invite link" button using `expo-sharing` to share a deep link
- [ ] Handle incoming deep links on cold start and when app is backgrounded
- [ ] Joining a room via link: if not logged in → auth flow → then auto-join; if logged in → confirm screen → join

---

## Week 4 — Polish, Testing & Deployment

### Testing Multi-User Flows

- [ ] Create 3–4 test accounts in Supabase Auth dashboard
- [ ] Run two simulators simultaneously (Xcode + Android Studio), sign in as different users
- [ ] Test: User A adds an experience → User B sees it appear in real-time (Supabase Realtime)
- [ ] Test: User A rates → User B sees pending count drop from their feed
- [ ] Test: Both users rate → average updates correctly everywhere
- [ ] Test invite code flow end-to-end: User A creates room, shares code → User B enters code → both see each other in member strip
- [ ] Test re-rating: submit multiple ratings, confirm only latest score used in averages
- [ ] Test RLS: confirm users cannot read or write data for rooms they're not members of (test via Supabase SQL editor)

### Error States & Edge Cases

- [ ] Empty room state (no experiences yet)
- [ ] Room with only one member (no insights / averages yet)
- [ ] Offline handling: show a banner if no network, queue writes if possible
- [ ] Loading skeletons on all data-fetching screens (don't show blank screens)
- [ ] Handle Supabase errors gracefully with user-facing toasts
- [ ] Input validation: empty titles, duplicate room codes, invalid join codes

### Performance

- [ ] Paginate the experience feed (20 items at a time) using Supabase `.range()`
- [ ] Memoize Insights calculations with `useMemo` to avoid recalculating on every render
- [ ] Use a Postgres view for "latest rating per member per experience" so you fetch it once cleanly
- [ ] Add appropriate indexes in Supabase: `ratings(experience_id, user_id, created_at)`, `room_members(user_id)`

### Deployment

- [ ] Configure `app.json` with correct bundle ID, app name, icons, and splash screen
- [ ] Generate assets: app icon (1024×1024), splash screen, adaptive icon for Android
- [ ] Run `eas build --platform ios --profile preview` for internal TestFlight build
- [ ] Run `eas build --platform android --profile preview` for internal Play Store track
- [ ] Distribute to 2–3 test users on real devices for a final round of feedback
- [ ] Set up Supabase production environment (separate from dev) and point the preview build at it

---

## File Structure

```
rating-room/
├── app/
│   ├── (auth)/
│   │   ├── login.tsx
│   │   └── verify.tsx
│   ├── (app)/
│   │   ├── index.tsx              # Rooms list
│   │   ├── room/
│   │   │   └── [id].tsx           # Room feed + tabs
│   │   ├── experience/
│   │   │   └── [id].tsx           # Experience detail
│   │   ├── profile/
│   │   │   └── [memberId].tsx     # Member profile
│   │   └── settings.tsx
│   └── _layout.tsx
├── components/
│   ├── sheets/
│   │   ├── AddExperienceSheet.tsx
│   │   ├── AddCategorySheet.tsx
│   │   ├── CreateRoomSheet.tsx
│   │   └── RateSheet.tsx
│   ├── RoomRow.tsx
│   ├── EntryRow.tsx
│   ├── MemberRatingBlock.tsx
│   └── InsightCard.tsx
├── lib/
│   ├── supabase.ts                # Client init
│   ├── queries.ts                 # All DB query functions
│   └── helpers.ts                 # avgEntry, spreadEntry, latestRating, etc.
├── stores/
│   └── useRoomStore.ts            # Zustand store for current room state
├── hooks/
│   ├── useAuth.ts
│   ├── useRoom.ts
│   └── useRealtime.ts
└── types/
    └── index.ts                   # Room, Experience, Rating, Member types
```

---

## Key Decisions to Make Early

| Decision             | Recommendation                                                      |
| -------------------- | ------------------------------------------------------------------- |
| Invite method        | **Short code** is simpler to build; deep links add polish in week 4 |
| Auth method          | **Magic link** — no password reset flow to build                    |
| Real-time            | Enable Supabase Realtime from the start, not as an afterthought     |
| Bottom sheet library | `@gorhom/bottom-sheet` — the standard, well-maintained choice       |
| Date picker          | `@react-native-community/datetimepicker` wrapped in a modal         |
| Rating input         | Custom slider using `@react-native-community/slider`                |

---

## What's Explicitly Out of Scope for MVP

- Push notifications (notify when someone rates an experience you added)
- Photos on experiences
- Public sharing or exporting a room's history
- Search within a room
- Room admin roles or removing members
- Web version (focus on native first, Expo Router makes web easy to add later)

| Real-time | Enable Supabase Realtime from the start, not as an afterthought |
| Bottom sheet library | `@gorhom/bottom-sheet` — the standard, well-maintained choice |
| Date picker | `@react-native-community/datetimepicker` wrapped in a modal |
| Rating input | Custom slider using `@react-native-community/slider` |

---

## What's Explicitly Out of Scope for MVP

- Push notifications (notify when someone rates an experience you added)
- Photos on experiences
- Public sharing or exporting a room's history
- Search within a room
- Room admin roles or removing members
- Web version (focus on native first, Expo Router makes web easy to add later)
