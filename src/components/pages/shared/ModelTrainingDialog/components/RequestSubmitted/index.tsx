import { CustomImagePreview } from "@/components/shared/CustomImagePreview";
import requestSubmittedSuccessImage from "@/utils/images/modelTraining/request-submitted.svg";

export const RequestSubmitted = () => {
  return (
    <div className="w-full h-full p-5 flex flex-col gap-4 items-center justify-center">
      <div className="relative w-35 aspect-square">
        <CustomImagePreview image={requestSubmittedSuccessImage} />
      </div>
      <p className="text-lg font-bold">
        Your <span className="text-primary">AI request</span> has been submitted
      </p>
      <p className="text-sm text-black-40 text-center max-w-[520px] leading-4.5">
        We&apos;re now training your pet&apos;s AI model. This usually takes around 10–15 minutes.
        You&apos;ll get an email as soon as your Model is ready!
      </p>
    </div>
  );
};
