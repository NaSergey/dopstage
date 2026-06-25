import { cn } from "@/shared/lib/utils/css";

const AchievementContainer = ({
  children,
  size = "default",
}: {
  children: React.ReactNode;
  size?: "default" | "large";
}) => {
  return (
    <div
      className={cn(
        "flex items-center justify-center",
        size === "large"
          ? "size-17 [@media(max-height:800px)]:size-15"
          : "size-12 [@media(max-height:800px)]:size-11 [@media(max-height:700px)]:!size-9",
      )}
    >
      {children}
    </div>
  );
};

export default AchievementContainer;
