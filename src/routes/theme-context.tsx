import {
  createContextId,
  useContext,
  type Signal
} from '@builder.io/qwik';

export interface ThemeContextState {
  themeSig: Signal<'light' | 'dark'>;
}

export const ThemeContext = createContextId<ThemeContextState>('theme-context');

export const useTheme = () => useContext(ThemeContext);