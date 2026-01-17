import { serveStaticMarkdown } from "~/utils/markdown-server";
export const onGet = serveStaticMarkdown("contact");
