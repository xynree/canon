# Canon — Shared Taste, Visualized

**Canon** is a social rating app designed to help groups of friends track, rate, and compare their shared experiences. Whether it's movies, restaurants, or niche hobbies, Canon turns individual opinions into collective insights.

> [!IMPORTANT]
> **Project Status: Work in Progress (WIP)**  
> Currently in the **Foundation & Auth** phase (Week 1 of the Action Plan).

## ✨ Key Features

- **Private Rooms:** Group-based spaces for specific circles of friends or interests.
- **Experience Feed:** A real-time stream of what your group is experiencing.
- **Multi-Rating System:** Track how your opinions change over time with a "latest-rating-wins" history.
- **Taste Insights:**
  - **Category Taste Maps:** See the group's average rating across different categories.
  - **Taste Alignment Score:** A metric showing how much your group agrees (or disagrees) on things.
  - **Most Divisive vs. Most Loved:** Automatically identify the highlights and the outliers.
- **Real-time Collaboration:** Powered by Supabase Realtime for instant updates across all devices.

## 🛠 Tech Stack

- **Framework:** [Expo](https://expo.dev/) (Managed Workflow) with TypeScript
- **Navigation:** [Expo Router](https://docs.expo.dev/router/introduction/) (File-based navigation)
- **Backend:** [Supabase](https://supabase.com/) (PostgreSQL, Auth, Real-time)
- **State Management:** [Zustand](https://github.com/pmndrs/zustand)
- **Styling:** Native StyleSheet / [NativeWind](https://www.nativewind.dev/)
- **UI Components:** [React Native Bottom Sheet](https://gorhom.github.io/react-native-bottom-sheet/)

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS)
- npm or [pnpm](https://pnpm.io/)
- [Expo Go](https://expo.dev/expo-go) app on your physical device (optional, for testing)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/canon.git
   cd canon
   ```

2. **Install dependencies:**

   ```bash
   pnpm install
   ```

3. **Environment Setup:**
   Create a `.env.local` file in the root directory and add your Supabase credentials:

   ```env
   EXPO_PUBLIC_SUPABASE_URL=your-supabase-url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-supabase-key
   ```

4. **Start the development server:**

   ```bash
   pnpm start
   ```

## 🗺 Roadmap

| Phase      | Focus                                        | Status         |
| :--------- | :------------------------------------------- | :------------- |
| **Week 1** | Foundation, Auth & Database Schema           | 🏃 In Progress |
| **Week 2** | Core Screens (Rooms, Feed, Add Experience)   | 📅 Planned     |
| **Week 3** | Insights, Member Profiles & Polished Invites | 📅 Planned     |
| **Week 4** | Polish, Real-device Testing & EAS Deployment | 📅 Planned     |

## 🏗 Project Structure

```text
app/          # Expo Router file-based screens
components/   # Reusable UI components & bottom sheets
hooks/        # Custom hooks (auth, realtime, data fetching)
lib/          # Client initializations (Supabase)
stores/       # Zustand state stores
types/        # TypeScript interfaces and definitions
```

## 📄 License

This project is private and for demonstration purposes.
