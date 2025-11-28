import { Controller, FieldValues, Path, UseControllerProps, useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type ControlledInputProps<T extends FieldValues> = {
  name: Path<T>;
  label?: string;
  type?: string;
  placeholder?: string;
  className?: string;
  rules?: UseControllerProps["rules"];
  renderRight?: ReactNode; // e.g., eye icon for password toggle
  disabled?: boolean;
};

export function ControlledInput<T extends FieldValues>(input: ControlledInputProps<T>) {
  const {
    name,
    label,
    type = "text",
    placeholder,
    className,
    rules,
    renderRight,
    disabled,
  } = input;
  const { control } = useFormContext();

  return (
    <div className="flex flex-col gap-2.5">
      {label && (
        <Label htmlFor={name} className="text-sm w-fit font-semibold text-white">
          {label}
        </Label>
      )}
      <Controller
        name={name}
        control={control}
        rules={rules}
        disabled={disabled}
        render={({ field, fieldState }) => (
          <>
            <div className="relative">
              <Input
                {...field}
                id={name}
                type={type}
                placeholder={placeholder}
                className={cn("pr-10 text-white", className, {
                  "border-red-500 focus:ring-red-500 focus-visible:border-red-500": fieldState.error,
                })}
              />
              {renderRight && (
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  {renderRight}
                </div>
              )}
            </div>
            {fieldState.error && (
              <span className="text-xs text-red-500 -mt-1">{fieldState.error.message}</span>
            )}
          </>
        )}
      />
    </div>
  );
}
