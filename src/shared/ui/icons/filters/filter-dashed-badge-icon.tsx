function FilterDashedBadgeIcon({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" className={className} {...props}>
      <rect width="20" height="20" fill="currentColor" fillOpacity="0.1" />
      <path d="M10 2.5L15.3033 4.6967L17.5 10L15.3033 15.3033L10 17.5L4.6967 15.3033L2.5 10L4.6967 4.6967L10 2.5Z" stroke="currentColor" strokeDasharray="5 2.4" />
      <path d="M4.7 15.3169L2.5 10.0002L4.7 4.7002" stroke="currentColor" />
      <path d="M10.0001 8.33301V9.7219L8.75008 12.4997H7.91675L6.66675 9.7219V8.33301" stroke="currentColor" strokeLinecap="square" />
      <path d="M13.3333 8.33301V9.7219L12.0833 12.4997H11.25L10 9.7219V8.33301" stroke="currentColor" strokeLinecap="square" />
      <path d="M4.77679 3.13817L6.94492 4.04359L6.07287 6.22536" stroke="currentColor" strokeLinejoin="bevel" />
    </svg>
  );
}

export default FilterDashedBadgeIcon;
