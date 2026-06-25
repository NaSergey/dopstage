function FilterGearsBadgeIcon({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <rect width="20" height="20" fill="currentColor" fillOpacity="0.1" />
      <path d="M8.0815 3.47754L4.839 4.82063L3.22729 8.71163" stroke="currentColor" />
      <path d="M5.60742 2.5L8.5422 3.23369L7.07481 5.89816" stroke="currentColor" strokeLinejoin="bevel" />
      <path d="M16.5012 8.10225L15.1581 4.85975L11.2671 3.24805" stroke="currentColor" />
      <path d="M17.4788 5.62891L16.7451 8.56368L14.0806 7.09629" stroke="currentColor" strokeLinejoin="bevel" />
      <path d="M11.8758 16.5225L15.1183 15.1794L16.73 11.2884" stroke="currentColor" />
      <path d="M14.3499 17.5L11.4151 16.7663L12.8825 14.1018" stroke="currentColor" strokeLinejoin="bevel" />
      <path d="M3.45605 11.8977L4.79914 15.1402L8.69015 16.752" stroke="currentColor" />
      <path d="M2.47852 14.3711L3.21221 11.4363L5.87668 12.9037" stroke="currentColor" strokeLinejoin="bevel" />
      <path d="M8.33325 12.5V7.5H10.8333L12.4999 9.16667V10.8333L10.8333 12.5H8.33325Z" stroke="currentColor" />
    </svg>
  );
}

export default FilterGearsBadgeIcon;
