import { FilledUserIcon } from "@/components/icons";
import { InputSingleImage } from "@/components/pages/shared/InputSingleImage";
import { Avatar } from "@/components/shared/Avatar";
import { CustomImagePreview } from "@/components/shared/CustomImagePreview";
import { Button } from "@/components/ui/button";
import { ControlledInput } from "@/components/ui/form/ControlledInput";
import { useToast } from "@/hooks/useToast";
import { updateUserSchema } from "@/lib/validations/user";
import { dataURLtoFile } from "@/services/shared/image";
import { uploadFileToStorage } from "@/services/supabase/functions";
import { useAppSelector } from "@/store";
import { useUploadFileMutation } from "@/store/api/fileApi";
import { useGetUserByIdQuery, useUpdateUserMutation } from "@/store/api/userApi";
import { ImageMetadata } from "@/types/common";
import { EUploadFile } from "@/types/file";
import { IUpdateUserRequest } from "@/types/user";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

export const ProfileSection = () => {
  const { toast } = useToast();

  const { user: supabaseUser } = useAppSelector((state) => state.auth);

  const { data: user } = useGetUserByIdQuery(supabaseUser?.id ?? "");

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
  }, [user]);

  const onSubmit = handleSubmit(async (formData) => {
    if (!user) return;

    if (selectedImage) {
      const file = dataURLtoFile(selectedImage.src, "image.jpg");

      const { data: resData, error } = await uploadFile({
        files: [file],
        type: EUploadFile.PROFILE_IMAGE,
      });
      if (error) {
        toast("ERROR", "Something went wrong");
        return;
      }

      const url = resData?.data?.fileUrls[0];
      if (resData?.data?.fileUrls) {
        formData.profile_image = url;
      }
    }

    const { error } = await updateUser({ id: user.id, updates: formData });
    if (error) {
      toast("ERROR", error.message ?? "Something went wrong");
      return;
    }
    toast("SUCCESS", "Profile Updated Successfully");
  });

  const userImage = selectedImage?.src ?? user?.profile_image;

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
            {/* Avatar */}
            <div className="flex items-center gap-4 py-4">
              <div className="relative w-20 h-20 rounded-full bg-black-100 flex items-center justify-center text-3xl font-semibold overflow-hidden">
                {userImage ? <CustomImagePreview image={userImage} /> : <Avatar />}
              </div>

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
