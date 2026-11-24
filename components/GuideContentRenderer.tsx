import React from 'react';

function renderInlineFormatting(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return (
        <strong key={idx} className="font-bold text-[#144272]">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <React.Fragment key={idx}>{part}</React.Fragment>;
  });
}

function isSafeImageSrc(src: string): boolean {
  const trimmed = src.trim();
  return (
    trimmed.startsWith('https://') ||
    trimmed.startsWith('http://') ||
    trimmed.startsWith('/uploads/') ||
    trimmed.startsWith('data:image/')
  );
}

/**
 * Safely renders structured guide content (headings, callouts, lists, inline images, and paragraphs)
 * into clean React elements with strict 8px geometry and brand colors.
 */
export default function GuideContentRenderer({ content }: { content: string }) {
  const lines = (content || '').replace(/\r\n/g, '\n').split('\n');
  const blocks: React.ReactNode[] = [];

  let i = 0;
  while (i < lines.length) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    if (!line) {
      i++;
      continue;
    }

    // Inline markdown image: ![caption](url)
    const imgMatch = line.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (imgMatch && isSafeImageSrc(imgMatch[2])) {
      const caption = imgMatch[1].trim();
      const url = imgMatch[2].trim();
      blocks.push(
        <figure
          key={`img-${i}`}
          className="my-6 rounded-lg overflow-hidden border border-[#144272]/20 bg-[#F5F5F5]"
        >
          <img src={url} alt={caption || 'Study abroad guide illustration'} className="w-full max-h-[460px] object-cover" />
          {caption && (
            <figcaption className="px-4 py-2 text-xs font-medium text-black/70 border-t border-[#144272]/10">
              {caption}
            </figcaption>
          )}
        </figure>
      );
      i++;
      continue;
    }

    // H2 heading
    if (line.startsWith('## ')) {
      blocks.push(
        <h2
          key={`h2-${i}`}
          className="text-xl sm:text-2xl font-black text-[#144272] tracking-tight pt-4 pb-1 border-b border-[#144272]/15"
        >
          {line.slice(3).trim()}
        </h2>
      );
      i++;
      continue;
    }

    // H3 heading
    if (line.startsWith('### ')) {
      blocks.push(
        <h3 key={`h3-${i}`} className="text-base sm:text-lg font-extrabold text-[#144272] pt-3">
          {line.slice(4).trim()}
        </h3>
      );
      i++;
      continue;
    }

    // Blockquote / Callout box
    if (line.startsWith('> ')) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('> ')) {
        quoteLines.push(lines[i].trim().slice(2).trim());
        i++;
      }
      blocks.push(
        <div
          key={`quote-${i}`}
          className="p-4 sm:p-5 rounded-lg bg-[#FFD749]/25 border-l-4 border-[#144272] text-sm text-black leading-relaxed font-medium"
        >
          {quoteLines.map((ql, qi) => (
            <p key={qi} className={qi > 0 ? 'mt-2' : ''}>
              {renderInlineFormatting(ql)}
            </p>
          ))}
        </div>
      );
      continue;
    }

    // Unordered bullet list
    if (line.startsWith('- ') || line.startsWith('* ')) {
      const items: string[] = [];
      while (
        i < lines.length &&
        (lines[i].trim().startsWith('- ') || lines[i].trim().startsWith('* '))
      ) {
        items.push(lines[i].trim().slice(2).trim());
        i++;
      }
      blocks.push(
        <ul key={`ul-${i}`} className="space-y-2 pl-1">
          {items.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2.5 text-sm sm:text-base text-black/85 leading-relaxed">
              <span className="w-2 h-2 rounded-lg bg-[#3FC1C9] mt-2 flex-shrink-0" />
              <span>{renderInlineFormatting(item)}</span>
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // Ordered numbered list
    if (/^\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+\.\s+/, '').trim());
        i++;
      }
      blocks.push(
        <ol key={`ol-${i}`} className="space-y-2.5 pl-1">
          {items.map((item, idx) => (
            <li key={idx} className="flex items-start gap-3 text-sm sm:text-base text-black/85 leading-relaxed">
              <span className="w-6 h-6 rounded-lg bg-[#144272] text-[#FFD749] text-xs font-black flex items-center justify-center flex-shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <span>{renderInlineFormatting(item)}</span>
            </li>
          ))}
        </ol>
      );
      continue;
    }

    // Standard paragraph
    const paraLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !lines[i].trim().startsWith('## ') &&
      !lines[i].trim().startsWith('### ') &&
      !lines[i].trim().startsWith('> ') &&
      !lines[i].trim().startsWith('- ') &&
      !lines[i].trim().startsWith('* ') &&
      !/^\d+\.\s+/.test(lines[i].trim()) &&
      !/^!\[([^\]]*)\]\(([^)]+)\)$/.test(lines[i].trim())
    ) {
      paraLines.push(lines[i].trim());
      i++;
    }

    blocks.push(
      <p key={`p-${i}`} className="text-sm sm:text-base text-black/85 leading-relaxed">
        {renderInlineFormatting(paraLines.join(' '))}
      </p>
    );
  }

  return <div className="space-y-4">{blocks}</div>;
}
