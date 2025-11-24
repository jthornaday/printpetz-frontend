import { Controller, FieldValues, Path, UseControllerProps, useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "../radioGroup";

type ControlledRadioProps<T extends FieldValues> = {
  name: Path<T>;
  label?: string;
  className?: string;
  rules?: UseControllerProps["rules"];
  disabled?: boolean;
  options: string[];
};

export function ControlledRadio<T extends FieldValues>(input: ControlledRadioProps<T>) {
  const { name, label, className, rules, disabled, options } = input;
  const { control } = useFormContext();

  return (
    <div className="flex flex-col space-y-1">
      {label && (
        <Label htmlFor={name} className="text-sm w-fit font-semibold text-grey-50">
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
              <RadioGroup
                value={field.value} // ✅ this keeps the selected item in sync
                onValueChange={field.onChange}
                id={name}
                className={cn("grid grid-cols-2 gap-2", className, {
                  "border-red-500 focus:ring-red-500": fieldState.error,
                })}
              >
                {options.map((item, i) => (
                  <RadioGroupItem key={i} value={item}>
                    <div className="font-semibold">{item}</div>
                  </RadioGroupItem>
                ))}
              </RadioGroup>
            </div>
            {fieldState.error && (
              <span className="text-xs text-red-500 mt-1">{fieldState.error.message}</span>
            )}
          </>
        )}
      />
    </div>
  );
}
