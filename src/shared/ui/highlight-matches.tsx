import React from "react";

function HighlightMatches({
  text,
  query = "",
}: {
  text: string;
  query?: string;
}) {
  const safeText = String(text ?? "");
  const trimmed = (query ?? "").trim();
  if (!trimmed) return <>{safeText}</>;

  const escaped = trimmed.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escaped})`, "ig");
  const parts = safeText.split(regex);

  return (
    <>
      {parts.map((part, idx) =>
        idx % 2 === 1 ? (
          <mark key={idx} className=" bg-[#6314FF] text-white">
            {part}
          </mark>
        ) : (
          <React.Fragment key={idx}>{part}</React.Fragment>
        ),
      )}
    </>
  );
}

export default HighlightMatches;
