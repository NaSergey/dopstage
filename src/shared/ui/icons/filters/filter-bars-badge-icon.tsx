function FilterBarsBadgeIcon({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" className={className} {...props}>
      <rect width="20" height="20" fill="currentColor" fillOpacity="0.1" />
      <path d="M11.2499 13.3337V6.66699H9.73477L7.08325 8.88921" stroke="currentColor" />
      <path d="M6.66675 13.333L13.3334 13.333" stroke="currentColor" />
      <path d="M9.16675 13.3333V7.5" stroke="currentColor" />
      <path d="M10 2.5L15.3033 4.6967L17.5 10L15.3033 15.3033L10 17.5L7.34835 16.4017L3.04598 16.954L3.59835 12.6517L2.5 10L4.6967 4.6967L10 2.5Z" stroke="currentColor" />
    </svg>
  );
}

export default FilterBarsBadgeIcon;
