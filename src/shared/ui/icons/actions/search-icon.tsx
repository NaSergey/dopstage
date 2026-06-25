function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M11.9999 5.10639V9.02561L8.99992 12H4.99991L1.99992 9.02561V5L4.99991 2H8.99992L11.9999 5.10639Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path d="M12 12L15 15" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export default SearchIcon;
