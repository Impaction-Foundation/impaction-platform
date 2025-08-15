
'use client';
import { useTheme } from '@/components/theme-provider';
import { cn } from '@/lib/utils';

export const ThemeToggleSwitch = () => {
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        'relative inline-flex h-6 w-11 cursor-pointer items-center rounded-full transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-black',
        isDark ? 'bg-gradient-to-r from-gray-800 to-blue-900' : 'bg-gradient-to-r from-sky-400 to-blue-500'
      )}
      aria-label="Toggle theme"
    >
      <span
        className={cn(
          'absolute inline-block h-5 w-5 transform rounded-full bg-background shadow-lg transition-transform duration-300 ease-in-out',
          isDark ? 'translate-x-5' : 'translate-x-1'
        )}
      >
        <span className={cn(
            'absolute inset-0 rounded-full',
            isDark ? 'bg-gradient-to-br from-gray-300 to-gray-500' : 'bg-gradient-to-br from-yellow-300 to-orange-500'
        )}></span>
      </span>
    </button>
  );
};
