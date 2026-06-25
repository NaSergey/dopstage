import React from "react";
import { Input } from "./input";
import { cn } from "@/shared/lib/utils/css";

type IAppInputProps = React.ComponentProps<typeof Input> & {
  additionalContent?: React.ReactNode;
};

function AppInput({ additionalContent, ...props }: IAppInputProps) {
  return (
    <Input
      {...props}
      className={cn(
        "w-full px-3 text-sm leading-sm text-white bg-transparent",
        props.className,
      )}
      icon={additionalContent ? (
        <span className="text-zinc-500 text-sm">{additionalContent}</span>
      ) : props.icon}
      iconPosition={additionalContent ? "right" : props.iconPosition}
    />
  );
}

export default AppInput;
