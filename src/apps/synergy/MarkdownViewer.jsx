import React from 'react';

export const MarkdownViewer = ({ content }) => {
  if (!content) return null;

  // Bold and italic inline parsing
  const parseInline = (inlineText) => {
    // Bold: **text** or __text__
    let result = inlineText.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    result = result.replace(/__(.+?)__/g, '<strong>$1</strong>');
    
    // Italic: *text* or _text_
    result = result.replace(/\*(.+?)\*/g, '<em>$1</em>');
    result = result.replace(/_(.+?)_/g, '<em>$1</em>');
    
    return <span dangerouslySetInnerHTML={{ __html: result }} />;
  };

  const parseMarkdown = (text) => {
    const lines = text.split('\n');
    const elements = [];
    let inCodeBlock = false;
    let codeBlockContent = [];
    let inList = false;
    let listItems = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Code block detection
      if (line.startsWith('```')) {
        if (inCodeBlock) {
          elements.push(
            <pre key={`code-${i}`} className="markdown-code-block">
              <code>{codeBlockContent.join('\n')}</code>
            </pre>
          );
          codeBlockContent = [];
          inCodeBlock = false;
        } else {
          inCodeBlock = true;
        }
        continue;
      }

      if (inCodeBlock) {
        codeBlockContent.push(line);
        continue;
      }

      // Horizontal rule
      if (line.match(/^---+$/)) {
        if (inList) {
          elements.push(<ul key={`list-${i}`}>{listItems}</ul>);
          listItems = [];
          inList = false;
        }
        elements.push(<hr key={`hr-${i}`} className="markdown-hr" />);
        continue;
      }

      // Headers
      const headerMatch = line.match(/^(#{1,6})\s+(.+)$/);
      if (headerMatch) {
        if (inList) {
          elements.push(<ul key={`list-${i}`}>{listItems}</ul>);
          listItems = [];
          inList = false;
        }
        const level = headerMatch[1].length;
        const text = headerMatch[2];
        const HeaderTag = `h${level}`;
        elements.push(
          <HeaderTag key={`header-${i}`} className={`markdown-h${level}`}>
            {parseInline(text)}
          </HeaderTag>
        );
        continue;
      }

      // Lists
      if (line.match(/^-\s+(.+)$/)) {
        const listContent = line.match(/^-\s+(.+)$/)[1];
        listItems.push(<li key={`li-${i}`}>{parseInline(listContent)}</li>);
        inList = true;
        continue;
      }

      if (inList && line.trim() === '') {
        elements.push(<ul key={`list-${i}`}>{listItems}</ul>);
        listItems = [];
        inList = false;
        continue;
      }

      // Numbered lists
      if (line.match(/^\d+\.\s+(.+)$/)) {
        if (inList) {
          elements.push(<ul key={`list-${i}`}>{listItems}</ul>);
          listItems = [];
          inList = false;
        }
        const numContent = line.match(/^\d+\.\s+(.+)$/)[1];
        elements.push(
          <ol key={`ol-${i}`} start={parseInt(line.match(/^\d+/)[0])}>
            <li>{parseInline(numContent)}</li>
          </ol>
        );
        continue;
      }

      // Blockquotes
      if (line.startsWith('> ')) {
        if (inList) {
          elements.push(<ul key={`list-${i}`}>{listItems}</ul>);
          listItems = [];
          inList = false;
        }
        const quoteContent = line.substring(2);
        elements.push(
          <blockquote key={`quote-${i}`} className="markdown-blockquote">
            {parseInline(quoteContent)}
          </blockquote>
        );
        continue;
      }

      // Regular paragraphs
      if (line.trim() !== '') {
        if (inList) {
          elements.push(<ul key={`list-${i}`}>{listItems}</ul>);
          listItems = [];
          inList = false;
        }
        elements.push(
          <p key={`p-${i}`} className="markdown-paragraph">
            {parseInline(line)}
          </p>
        );
      } else {
        // Empty line - close any open list
        if (inList) {
          elements.push(<ul key={`list-${i}`}>{listItems}</ul>);
          listItems = [];
          inList = false;
        }
      }
    }

    // Close any remaining list
    if (inList) {
      elements.push(<ul>{listItems}</ul>);
    }

    return elements;
  };

  return (
    <div className="markdown-viewer">
      {parseMarkdown(content)}
    </div>
  );
};
