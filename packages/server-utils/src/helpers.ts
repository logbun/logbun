export const trimCode = (content: string, line: number, maxLines = 5) => {
  const rows = content.split('\n');

  const lines: [number, string][] = rows.map((line, index) => [index + 1, line]);

  return lines.slice(Math.max(line - maxLines, 0), line + maxLines);
};
