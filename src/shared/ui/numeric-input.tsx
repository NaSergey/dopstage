import React from "react";
import AppInput from "./app-input";

type Props = Omit<React.ComponentProps<typeof AppInput>, "onChange"> & {
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
};

export default function NumericInput({ onChange, ...rest }: Props) {
  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const cleaned = (e.target.value || "").replace(/\D+/g, "");
    const synthetic = Object.create(e);
    synthetic.target = { ...e.target, value: cleaned };
    synthetic.currentTarget = { ...e.currentTarget, value: cleaned };
    onChange?.(synthetic);
  };

  return (
    <AppInput
      {...rest}
      onChange={handleChange}
      inputMode="numeric"
      pattern="\d*"
    />
  );
}
