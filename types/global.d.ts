declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.svg';

// Expo Router types
declare module 'expo-router' {
  import { ComponentType, ReactNode } from 'react';

  interface TabsProps {
    screenOptions?: any;
    children?: ReactNode;
  }

  interface TabsScreenProps {
    name: string;
    options?: any;
  }

  interface LinkProps {
    href: string;
    children?: ReactNode;
    [key: string]: any;
  }

  interface StackProps {
    children?: ReactNode;
    [key: string]: any;
  }

  interface StackScreenProps {
    name?: string;
    options?: any;
  }

  export const Tabs: ComponentType<TabsProps> & {
    Screen: ComponentType<TabsScreenProps>;
  };

  export const Link: ComponentType<LinkProps>;
  export const Stack: ComponentType<StackProps> & {
    Screen: ComponentType<StackScreenProps>;
  };
}

// Lucide React Native types
declare module 'lucide-react-native' {
  import { ComponentType } from 'react';

  interface IconProps {
    size?: number;
    color?: string;
    strokeWidth?: number;
    style?: any;
  }

  export const BarChart3: ComponentType<IconProps>;
  export const CreditCard: ComponentType<IconProps>;
  export const TrendingUp: ComponentType<IconProps>;
  export const User: ComponentType<IconProps>;
  export const Landmark: ComponentType<IconProps>;
  export const Plus: ComponentType<IconProps>;
  export const X: ComponentType<IconProps>;
  export const DollarSign: ComponentType<IconProps>;
  export const TrendingDown: ComponentType<IconProps>;
  export const ArrowUpRight: ComponentType<IconProps>;
  export const ArrowDownLeft: ComponentType<IconProps>;
  export const ArrowDownRight: ComponentType<IconProps>;
  export const ArrowRightLeft: ComponentType<IconProps>;
  export const Trash2: ComponentType<IconProps>;
  export const Settings: ComponentType<IconProps>;
  export const Database: ComponentType<IconProps>;
  export const FolderSync: ComponentType<IconProps>;
  export const Calendar: ComponentType<IconProps>;
  export const Tag: ComponentType<IconProps>;
  export const Percent: ComponentType<IconProps>;
  export const Edit3: ComponentType<IconProps>;
  export const ChevronDown: ComponentType<IconProps>;
}
