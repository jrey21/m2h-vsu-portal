# Dashboard Refactoring

This document explains the new structure of the Dashboard component after refactoring.

## New Structure

The Dashboard component has been refactored to separate concerns and improve maintainability:

### Components Overview

```
src/
├── components/
│   ├── Dashboard.tsx          # Main dashboard container
│   ├── Navigation.tsx         # Bottom tab navigation
│   └── tabs/
│       ├── index.ts          # Tab exports
│       ├── HomeTab.tsx       # Home tab content
│       ├── ReportsTab.tsx    # Reports tab content
│       └── ProfileTab.tsx    # Profile tab content
```

### 1. Navigation Component (`Navigation.tsx`)
- **Purpose**: Handles the bottom tab navigation UI
- **Props**: 
  - `activeTab`: Current active tab
  - `onTabPress`: Callback function when tab is pressed
- **Features**: 
  - Configurable tabs with icons and labels
  - Active tab highlighting
  - Responsive design

### 2. Tab Components

#### HomeTab (`tabs/HomeTab.tsx`)
- **Purpose**: Displays the welcome screen and quick actions
- **Props**: 
  - `session`: User session information
- **Features**:
  - Welcome message
  - User email display
  - Quick action cards (Schedule, Announcements)

#### ReportsTab (`tabs/ReportsTab.tsx`)
- **Purpose**: Shows academic reports and statistics
- **Props**: None (self-contained)
- **Features**:
  - Interactive report cards with icons
  - Quick stats grid (GPA, Attendance, Assignments)
  - Scrollable content
  - Color-coded report categories

#### ProfileTab (`tabs/ProfileTab.tsx`)
- **Purpose**: User profile management and settings
- **Props**: 
  - `session`: User session
  - `username`, `website`, `avatarUrl`: Profile data
  - `loading`: Loading state
  - `onUpdateProfile`: Profile update callback
- **Features**:
  - Editable profile information
  - Avatar placeholder with edit button
  - Account settings menu
  - Sign out functionality

### 3. Main Dashboard (`Dashboard.tsx`)
- **Purpose**: Container component that manages state and renders tabs
- **Responsibilities**:
  - State management (profile data, active tab)
  - Data fetching from Supabase
  - Tab content rendering logic
  - Integration with Navigation component

## Benefits of This Refactoring

1. **Separation of Concerns**: Each component has a single responsibility
2. **Reusability**: Components can be easily reused or modified
3. **Maintainability**: Easier to maintain and debug individual components
4. **Scalability**: Easy to add new tabs or modify existing ones
5. **Code Organization**: Clear structure makes navigation easier
6. **Testing**: Individual components can be tested in isolation

## Usage

```tsx
// The main Dashboard component usage remains the same
<Dashboard session={session} />
```

## Adding New Tabs

To add a new tab:

1. Create a new component in `src/components/tabs/`
2. Add the tab configuration to `Navigation.tsx`
3. Add the tab case to `renderTabContent()` in `Dashboard.tsx`
4. Export the component in `tabs/index.ts`

## Styling

Each component maintains its own styles using StyleSheet.create(). Common design patterns:
- Card-based layouts with shadows
- Consistent color scheme (#007AFF for primary, #666 for secondary)
- Responsive design principles
- Material Design icons
