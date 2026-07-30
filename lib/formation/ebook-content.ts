/** Contenu ebook pour l'espace membre — source = ebook officiel */
import { OFFICIAL_PARTS } from "./official-ebook";

function blocksToMarkdown(
  blocks: (typeof OFFICIAL_PARTS)[number]["blocks"]
): string {
  return blocks
    .map((b) => {
      switch (b.type) {
        case "h2":
          return `## ${b.text}`;
        case "h3":
          return `### ${b.text}`;
        case "p":
          return b.text;
        case "bullet":
          return `- ${b.text}`;
        case "tip":
          return `### ${b.title}\n\n*${b.text}*`;
        case "spacer":
          return "";
      }
    })
    .filter(Boolean)
    .join("\n\n");
}

export const EBOOK_PARTS = OFFICIAL_PARTS.map((part) => ({
  id: part.id,
  title: part.title,
  image: `/formation/illustrations/${part.image}`,
  content: `## ${part.title}\n\n${blocksToMarkdown(part.blocks)}`,
}));
