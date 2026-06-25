function TelegramIcon({
    className,
    width = 16,
    height = 16,
    ...props
  }: React.ComponentProps<"svg"> & { width?: number; height?: number }) {
    return (
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width={width} 
          height={height} 
          viewBox="0 0 16 16" 
          fill="none"
          className={className}
          {...props}
        >
            <path d="M6.11 13.6701L4.22 9.08008L1.25 7.73008V7.19008L13.67 2.33008L14.75 2.87008L12.05 13.6701H11.51L6.92 10.1601L10.7 6.38008" stroke="currentColor" strokeWidth="1.6"/>
        </svg>
    );
  }
  
  export default TelegramIcon;
  