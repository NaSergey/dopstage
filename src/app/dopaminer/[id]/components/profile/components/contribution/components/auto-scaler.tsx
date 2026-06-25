import { cn } from "@/shared/lib/utils/css";
import {
  useRef,
  useState,
  useLayoutEffect,
  ReactNode,
  CSSProperties,
} from "react";

interface IAutoScalerProps {
  children: ReactNode;

  minScale?: number;
  scaleX?: boolean;
  scaleY?: boolean;
  animated?: boolean;
  className?: string;
}

export function AutoScaler({
  children,
  minScale = 0.2,
  scaleX = false,
  scaleY = true,
  animated = true,
  className,
}: IAutoScalerProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const wrapper = wrapperRef.current;
    const content = contentRef.current;
    if (!wrapper || !content) return;

    const updateScale = () => {
      const parentHeight = wrapper.clientHeight;
      const contentHeight = content.scrollHeight;

      const heightScale = scaleY ? parentHeight / contentHeight : 1;
      const finalScale = Math.min(1, Math.max(minScale, heightScale));

      setScale(finalScale);
    };

    updateScale();

    const ro = new ResizeObserver(() => updateScale());
    ro.observe(wrapper);
    ro.observe(content);

    return () => ro.disconnect();
  }, [minScale, scaleY]);

  const style: CSSProperties = {
    transform: `scale(${scale})`,
    transformOrigin: "top center",
    height: "fit-content",
    width: scaleX ? "fit-content" : "100%",
    transition: animated ? "transform 0.15s ease-out" : undefined,
  };

  return (
    <div ref={wrapperRef} className={cn("h-full overflow-hidden flex items-start justify-center", className)}>
      <div style={style}>
        <div ref={contentRef}>{children}</div>
      </div>
    </div>
  );
}
