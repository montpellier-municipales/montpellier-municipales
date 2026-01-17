import { serveStaticMarkdown } from "~/utils/markdown-server";
export const onGet = serveStaticMarkdown("mentions-legales");
