import { cn } from "@/lib/utils";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";

function RadioGroup({ ...props }: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return <RadioGroupPrimitive.Root data-slot="radio-group" {...props} />;
}

function RadioGroupIndicator({
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Indicator>) {
  return <RadioGroupPrimitive.Indicator data-slot="radio-group-indicator" {...props} />;
}

function RadioGroupItem({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        "rounded-full border border-gray-300 py-2 data-[state=checked]:bg-primary data-[state=checked]:text-white text-sm cursor-pointer transition-all",
        className
      )}
      {...props}
    />
  );
}

export { RadioGroup, RadioGroupIndicator, RadioGroupItem };
