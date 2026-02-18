import React from 'react';
import twemoji from 'twemoji';

interface EmojiProps {
  emoji: string;
  className?: string;
  size?: number; // px
  title?: string;
}

export const Emoji: React.FC<EmojiProps> = ({ emoji, className = '', size = 24, title }) => {
  // Parse emoji to Twemoji SVG URL
  const codePoint = twemoji.convert.toCodePoint(emoji);
  const url = `https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/${codePoint}.svg`;

  return (
    <img
      src={url}
      alt={title || emoji}
      title={title || emoji}
      className={`emoji twemoji ${className}`}
      style={{
        width: size,
        height: size,
        display: 'inline-block',
        verticalAlign: 'middle',
        imageRendering: 'auto',
      }}
      loading="lazy"
      draggable={false}
      decoding="async"
    />
  );
};
