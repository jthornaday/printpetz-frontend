import { Button } from "@/components/ui/button";
import { EyeIcon, EyeOffIcon } from "lucide-react";

type Props = {
  visible: boolean;
  onChange: React.Dispatch<React.SetStateAction<boolean>>;
};

export const PasswordEyeButton = ({ visible, onChange }: Props) => {
  return (
    <Button
      variant="link"
      size={"icon"}
      className=" text-black-50"
      onClick={(e) => {
        e.stopPropagation();
        onChange(!visible);
      }}
    >
      {visible ? <EyeIcon size={18} /> : <EyeOffIcon size={18} />}
    </Button>
  );
};
