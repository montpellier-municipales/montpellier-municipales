import {
  createContextId,
  useContext,
  useContextProvider,
  useStore,
  component$,
  Slot
} from '@builder.io/qwik';

// Map: 'fr' -> '/blog/mon-slug', 'en' -> '/en/blog/my-slug'
export type UrlMapping = Record<string, string>;

export const UrlMappingContext = createContextId<UrlMapping>('url-mapping-context');

export const useUrlMapping = () => useContext(UrlMappingContext);

// Provider component pour simplifier l'usage
export const UrlMappingProvider = component$(() => {
  const mapping = useStore<UrlMapping>({});
  useContextProvider(UrlMappingContext, mapping);
  return <Slot />;
});
