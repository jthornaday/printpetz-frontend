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
        Fast training is underway. Most pets are ready in about 2–3 minutes. You can close this
        window and keep exploring—we&apos;ll email you as soon as your model is ready.
      </p>
    </div>
  );
};
