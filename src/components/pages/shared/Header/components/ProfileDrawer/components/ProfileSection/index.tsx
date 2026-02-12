import { FilledUserIcon } from "@/components/icons";
import { InputSingleImage } from "@/components/pages/shared/InputSingleImage";
import { Button } from "@/components/ui/button";
import { ControlledInput } from "@/components/ui/form/ControlledInput";
import { useGetUser } from "@/hooks/user/useGetUser";
import { useToast } from "@/hooks/useToast";
import { updateUserSchema } from "@/lib/validations/user";
import { dataURLtoFile } from "@/services/shared/image";
import { useUploadFileMutation } from "@/store/api/fileApi";
import { useUpdateUserMutation } from "@/store/api/userApi";
import { ApiError } from "@/types/api";
import { ImageMetadata } from "@/types/common";
import { EUploadFile } from "@/types/file";
import { EToastType } from "@/types/toast";
import { IUpdateUserRequest } from "@/types/user";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { UserProfileImage } from "../../../shared/UserProfileImage";
import { Loader } from "@/components/ui/loader";

export const ProfileSection = () => {
  const { toast } = useToast();

  const { user, isUserLoading } = useGetUser();

  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [uploadFile, { isLoading: isFileUploading }] = useUploadFileMutation();

  const [selectedImage, setSelectedImage] = useState<ImageMetadata | null>(null);

  const methods = useForm<IUpdateUserRequest>({
    defaultValues: { name: "", email: "", profile_image: "" },
    resolver: yupResolver(updateUserSchema),
  });
  const { handleSubmit, reset } = methods;

  useEffect(() => {
    if (!user) return;

    reset({
      email: user.email,
      ...(user.name && { name: user.name }),
      ...(user.profile_image && { profile_image: user.profile_image }),
    });
  }, [user, reset]);

  const onSubmit = handleSubmit(async (formData) => {
    if (!user) return;

    if (selectedImage) {
      const file = dataURLtoFile(selectedImage.src, "image.jpg");

      try {
        const response = await uploadFile({
          files: [file],
          type: EUploadFile.PROFILE_IMAGE,
        }).unwrap();
        const { success, data, message } = response;
        if (!success || !data) {
          toast(EToastType.ERROR, message ?? "Something went wrong");
          return false;
        }

        const url = data.fileUrls[0];
        if (url) {
          formData.profile_image = url;
        }
      } catch (error: unknown) {
        console.error("Create company error:", error);
        const err = error as ApiError;
        const errorMessage = err?.data?.message || "Failed to generate image";
        toast(EToastType.ERROR, errorMessage);
        return false;
      }
    }

    const { data } = await updateUser({ id: user.id, ...formData });
    const { message, success } = data || {};
    if (!success) {
      toast(EToastType.ERROR, message ?? "Something went wrong");
      return false;
    }

    toast(EToastType.SUCCESS, "Profile Updated Successfully");
    return true;
  });

  if (isUserLoading || !user) return <Loader />;

  const userImage = selectedImage?.src ?? user.profile_image;

  return (
    <FormProvider {...methods}>
      <section className="bg-black-90 rounded-lg p-4">
        <div className="flex flex-col gap-4">
          {/* Title */}
          <div className="flex items-center gap-4 font-bold">
            <FilledUserIcon size={20} />
            <span>My Profile</span>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4 py-4">
              <UserProfileImage
                image={userImage}
                text={user.name ?? user.email}
                className="w-20 h-20 text-3xl"
              />

              <InputSingleImage setImage={(metadata: ImageMetadata) => setSelectedImage(metadata)}>
                <Button variant={"secondary"} className="w-fit">
                  Change Image
                </Button>
              </InputSingleImage>
            </div>

            {/* Username */}
            <ControlledInput
              name="name"
              label="User Name"
              placeholder="Enter your name"
              className="text-sm border-black-70 !bg-black-80"
            />

            {/* Email */}
            <ControlledInput
              name="email"
              label="Email"
              placeholder="Enter your email"
              className="text-sm border-black-70 !bg-black-80"
              disabled
            />
          </div>

          <Button
            onClick={onSubmit}
            disabled={isFileUploading || isUpdating}
            loading={isFileUploading || isUpdating}
            className="w-[70px] ml-auto"
          >
            Save
          </Button>
        </div>
      </section>
    </FormProvider>
  );
};
