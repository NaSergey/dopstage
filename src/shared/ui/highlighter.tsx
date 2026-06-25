import React from "react";

const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

type Props = {
  text: string;
  query: string;
  className?: string;
  as?: React.ElementType;
};

export default function Highlighter({
  text,
  query,
  className = "rounded px-1 bg-violet-500/20 text-violet-300",
  as = "mark",
}: Props) {
  if (!query) return <>{text}</>;
  const rx = new RegExp(`(${escapeRegExp(query)})`, "gi");
  const Tag: React.ElementType = as;

  return (
    <>
      {text.split(rx).map((part, i) =>
        rx.test(part) ? (
          <Tag key={i} className={className}>
            {part}
          </Tag>
        ) : (
          <React.Fragment key={i}>{part}</React.Fragment>
        ),
      )}
    </>
  );
}
