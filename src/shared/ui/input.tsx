"use client";
import * as React from "react";

import { cn } from "@/shared/lib/utils/css";
import { useComposedRefs } from "@radix-ui/react-compose-refs";
import { FrameSurface } from "@/shared/ui/frame-surface";
import { CloseIcon } from "@/shared/ui/icons";

interface InputProps extends React.ComponentProps<"input"> {
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  variant?: 'default' | 'gray';
  bgClassName?: string;
  frameColorDefault?: string;
  frameColorActive?: string;
  clearable?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, disabled, icon, iconPosition = 'left', variant = 'default', bgClassName, frameColorDefault = "#000000", frameColorActive = "#6314FF", clearable = false, onFocus, onBlur, onChange, value, ...props }, forwardedRef) => {
    const resolvedBgClassName = bgClassName ?? (variant === 'gray' ? 'bg-zinc-900' : 'bg-black');
    const inputRef = React.useRef<HTMLInputElement>(null);
    const composedRefs = useComposedRefs(forwardedRef, inputRef);

    const [isFocused, setIsFocused] = React.useState(false);
    const [isHovered, setIsHovered] = React.useState(false);
    const [frameHeight, setFrameHeight] = React.useState(36);
    const { style: styleProp, ...restProps } = props;

    // Track input value for clear button visibility (for uncontrolled inputs)
    const [internalValue, setInternalValue] = React.useState("");
    const isControlled = value !== undefined;
    
    // Get current value for clear button visibility
    const currentValue = isControlled ? String(value ?? "") : internalValue;
    const hasValue = currentValue !== "" && currentValue !== null && currentValue !== undefined;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!isControlled) {
        setInternalValue(e.target.value);
      }
      onChange?.(e);
    };

    const handleClear = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      
      if (inputRef.current) {
        // For uncontrolled inputs, set value directly
        if (!isControlled) {
          const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
            window.HTMLInputElement.prototype,
            "value"
          )?.set;
          nativeInputValueSetter?.call(inputRef.current, "");
          
          const event = new Event("input", { bubbles: true });
          inputRef.current.dispatchEvent(event);
          setInternalValue("");
        }
        
        // Trigger onChange for both controlled and uncontrolled
        onChange?.({
          target: { value: "" },
        } as React.ChangeEvent<HTMLInputElement>);
        
        inputRef.current.focus();
      }
    };

    const showClearButton = clearable && hasValue && !disabled;

    React.useLayoutEffect(() => {
      const element = inputRef.current;
      if (!element) return;

      const updateHeight = () => {
        const nextHeight = element.offsetHeight || 0;
        setFrameHeight(nextHeight > 0 ? nextHeight : 36);
      };

      const resizeObserver = new ResizeObserver(updateHeight);
      resizeObserver.observe(element);

      updateHeight();

      return () => resizeObserver.disconnect();
    }, []);

    const inputStyle = React.useMemo<React.CSSProperties | undefined>(
      () =>
        styleProp || frameHeight
          ? {
              ...(frameHeight ? { lineHeight: `${frameHeight}px` } : {}),
              ...styleProp,
            }
          : undefined,
      [frameHeight, styleProp],
    );

    const renderIcon = (position: 'left' | 'right') => {
      if (!icon) return null;
      const cloned = React.isValidElement(icon)
        ? React.cloneElement(icon as React.ReactElement<{ className?: string; style?: React.CSSProperties }>, {
            className: cn(
              (icon as React.ReactElement<{ className?: string }>).props?.className,
              "transition-colors text-[#52525B] duration-300 group-hover:text-[#6314FF] group-focus-within:text-[#6314FF]",
            ),
          })
        : icon;

      return (
        <div
          className={cn(
            "absolute z-30 flex items-center justify-center",
            position === 'left' ? "left-4" : "right-4",
          )}
        >
          {cloned}
        </div>
      );
    };

    return (
      <FrameSurface
        height={frameHeight}
        inset={12}
        bottomLineOffset={0.3}
        strokeColor={(isFocused || isHovered) ? frameColorActive : frameColorDefault}
        pathClassName="transition-colors duration-300"
        className={cn("relative inline-block w-full group", undefined)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        contentElement={null}
        renderUnderlay={(context) => (
          <>
            {/* Outer Glow */}
            <div
              className="absolute top-[-8px] left-[-8px] right-[-8px] bottom-[-8px] rounded-full bg-primary/30 opacity-0 transition-opacity duration-300 group-hover:opacity-70 pointer-events-none"
              aria-hidden="true"
            />
            {/* Inner Glow */}
            <div
              className="absolute top-[-3px] left-[-3px] right-[-3px] bottom-[-3px] rounded-full bg-primary/50 opacity-0 transition-opacity duration-300 group-hover:opacity-80 pointer-events-none"
              aria-hidden="true"
            />
            {/* Background */}
            <div
              className={cn("absolute top-0 left-0 right-0 rounded-full bottom-0 opacity-100 pointer-events-none", resolvedBgClassName)}
              style={context.clipPathStyle}
              aria-hidden="true"
            />
          </>
        )}
      >
        <div className="relative z-20 flex items-center w-full">
          {icon && iconPosition === 'left' && renderIcon('left')}

          <input
            ref={composedRefs}
            type={type}
            disabled={disabled}
            data-slot="input"
            {...(isControlled ? { value } : {})}
            onFocus={(e) => {
              setIsFocused(true);
              onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              onBlur?.(e);
            }}
            onChange={handleChange}
            className={cn(
              "w-full bg-transparent border-0 outline-none text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
              icon && iconPosition === 'left' ? "pl-12" : "pl-4",
              showClearButton ? "pr-10" : icon && iconPosition === 'right' ? "pr-12" : "pr-4",
              className,
            )}
            style={inputStyle}
            {...restProps}
          />

          {showClearButton && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute z-30 right-4 flex items-center cursor-pointer justify-center w-5 h-5 rounded-full transition-colors hover:text-[#6314FF] focus:outline-none"
              aria-label="Clear input"
            >
              <CloseIcon className="w-4 h-4" />
            </button>
          )}

          {icon && iconPosition === 'right' && !showClearButton && renderIcon('right')}
        </div>
      </FrameSurface>
    );
  },
);

Input.displayName = "Input";

export { Input };