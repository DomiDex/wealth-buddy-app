# Wealth Buddy App

A React Native personal finance app built with Expo Router, TypeScript, and SQLite.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI
- EAS CLI (for building)

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Start with development client
npm run dev:dev-client
```

## 📱 EAS Build & Deploy

This project is configured with Expo Application Services (EAS) for building and deploying.

### Build Profiles

- **Development**: For testing with development client
- **Preview**: Internal distribution builds
- **Production**: App store ready builds

### Available Commands

```bash
# Development builds (with dev client)
npm run build:development

# Preview builds (internal testing)
npm run build:preview

# Production builds (app store)
npm run build:production

# Platform-specific builds
npm run build:ios
npm run build:android

# Submit to app stores
npm run submit:ios
npm run submit:android
```

### First Time Setup

1. **Login to EAS**:

   ```bash
   npx eas login
   ```

2. **Configure credentials** (for iOS):

   ```bash
   npx eas credentials
   ```

3. **Build your first development build**:
   ```bash
   npm run build:development
   ```

### EAS Configuration

The `eas.json` file contains three build profiles:

- **development**: Creates a development client build
- **preview**: Creates internal distribution builds (APK for Android)
- **production**: Creates store-ready builds (AAB for Android, optimized for iOS)

## 🛠️ Development

### Code Quality

```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Check TypeScript types
npm run type-check
```

### Project Structure

```
├── app/                 # App Router pages
├── features/           # Feature-based components
├── services/           # Database and API services
├── hooks/              # Custom React hooks
├── types/              # TypeScript type definitions
├── assets/             # Static assets
└── eas.json           # EAS build configuration
```

## 📦 Tech Stack

- **Framework**: Expo with Expo Router
- **Language**: TypeScript
- **Database**: SQLite (expo-sqlite)
- **State Management**: Zustand
- **Styling**: React Native StyleSheet
- **Icons**: Lucide React Native
- **Build & Deploy**: EAS (Expo Application Services)

## 🔧 Configuration Files

- `eas.json` - EAS build and submit configuration
- `app.json` - Expo app configuration
- `tsconfig.json` - TypeScript configuration
- `eslint.config.js` - ESLint configuration
- `.prettierrc` - Prettier formatting rules
- `.easignore` - Files to exclude from EAS builds

## 📋 Environment Setup

For production builds, you'll need to configure:

1. **iOS**: Apple Developer account, certificates, and provisioning profiles
2. **Android**: Google Play Console account and upload keystore
3. **EAS**: Update the submit configuration in `eas.json` with your credentials

## 🚀 Deployment

1. **Build**: Create builds using EAS
2. **Test**: Download and test preview builds
3. **Submit**: Submit production builds to app stores
4. **Monitor**: Track builds and submissions in EAS dashboard

Visit [EAS Documentation](https://docs.expo.dev/eas/) for detailed setup instructions.
