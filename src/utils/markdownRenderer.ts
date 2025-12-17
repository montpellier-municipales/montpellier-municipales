import { marked } from "marked";

// Custom renderer to wrap h2 text in a span for styling
export const markdownRenderer = new marked.Renderer();
markdownRenderer.heading = ({ tokens, depth }) => {
  const text = tokens.map((t) => t.raw).join("");
  if (depth === 2) {
    return `<h2><span>${text}</span></h2>`;
  }
  return `<h${depth}>${text}</h${depth}>`;
};
