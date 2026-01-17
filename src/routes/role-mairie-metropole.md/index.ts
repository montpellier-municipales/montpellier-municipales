import { serveStaticMarkdown } from "~/utils/markdown-server";
export const onGet = serveStaticMarkdown("role-mairie-metropole");
