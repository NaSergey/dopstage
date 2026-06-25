function FilterDiamondBadgeIcon({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <rect width="20" height="20" fill="currentColor" fillOpacity="0.1" />
      <path d="M11.7046 5.90936L9.65918 5.22754" stroke="currentColor" />
      <path d="M13.0683 5.90936L15.1138 5.22754" stroke="currentColor" />
      <ellipse cx="11.0226" cy="6.25018" rx="0.681818" ry="0.681818" fill="currentColor" />
      <ellipse cx="13.7499" cy="6.25018" rx="0.681818" ry="0.681818" fill="currentColor" />
      <path d="M15.1137 9.31781L13.75 7.97852H12.7273" stroke="currentColor" />
      <path d="M14.1939 11.9784L16.0019 11.2295L17.4996 7.61364L16.0019 3.99775L12.386 2.5L8.77012 3.99775L8.02124 5.80569" stroke="currentColor" />
      <path d="M7.61364 7.27246L11.2295 8.77021L12.7273 12.3861L11.2295 16.002L7.61364 17.4997L3.99775 16.002L2.5 12.3861L3.99775 8.77021L7.61364 7.27246Z" stroke="currentColor" />
      <ellipse cx="5.95781" cy="11.4122" rx="0.73052" ry="0.730519" fill="currentColor" />
      <ellipse cx="9.36675" cy="11.4122" rx="0.73052" ry="0.730519" fill="currentColor" />
      <path d="M4.32593 12.7518L6.15223 14.5781H9.0743L10.9006 12.7518" stroke="currentColor" />
    </svg>
  );
}

export default FilterDiamondBadgeIcon;
