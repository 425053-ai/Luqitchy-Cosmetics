import React from 'react';
import twemoji from 'twemoji';

export function Emoji({ emoji, className = '', ...props }) {
  // Parse emoji to SVG using twemoji
  const codePoint = twemoji.convert.toCodePoint(emoji);
  const src = `https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/${codePoint}.svg`;
  return (
    <img
      src={src}
      alt={emoji}
      className={`emoji ${className}`}
      draggable={false}
      style={{ width: '1.5em', height: '1.5em', verticalAlign: 'middle' }}
      loading="lazy"
      {...props}
    />
  );
}
