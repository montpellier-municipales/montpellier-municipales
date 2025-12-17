import { RouteLocation } from "@builder.io/qwik-city";

const cleanPath = (path: string) => {
  if (path.length <= 1) return path;
  if (path.endsWith("/")) return path.substring(0, path.length - 1);
  return path;
};

const cleanHref = (href: string) => {
  if (href.length > 3 && href[0] === "/" && href[3] === "/")
    return href.substring(3);
  return href;
};

export const getIsPathActive = (loc: RouteLocation) => {
  const cleanedPath = cleanPath(loc.url.pathname);
  return (href: string) => cleanedPath === cleanHref(href);
};
