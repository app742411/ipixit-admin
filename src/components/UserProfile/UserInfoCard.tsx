import { useState, useEffect } from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { updateAdminProfile } from "../../api/authApi";
import { useAdminProfile } from "../../context/AdminProfileContext";

export default function UserInfoCard() {
  const { isOpen, openModal, closeModal } = useModal();
  const { profile, loading, refreshProfile } = useAdminProfile();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    mail: "",
    phone: "",
    bio: "",
    facebookLink: "",
    instagramLink: "",
    twitterLink: "",
    linkedinLink: "",
  });

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  //  Populate form from GET api
  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.firstName ?? "",
        lastName: "",
        mail: profile.email ?? "",
        phone: profile.phone ?? "",
        bio: profile.bio ?? "",
        facebookLink: profile.facebookLink ?? "",
        instagramLink: profile.instagramLink ?? "",
        twitterLink: profile.twitterLink ?? "",
        linkedinLink: profile.linkedinLink ?? "",
      });

      setImagePreview(profile.profileImage); //  context image
      setProfileImage(null);                 //  clear local file
    }
  }, [profile]);

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  //  Image handlers
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setProfileImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    setProfileImage(null);
    setImagePreview(null);
  };

  //  Save profile
  const handleSave = async () => {
    try {
      const payload = new FormData();

      payload.append("firstName", formData.firstName);
      payload.append("mail", formData.mail);
      payload.append("phone", formData.phone);

      if (formData.bio) payload.append("bio", formData.bio);
      if (formData.facebookLink) payload.append("facebookLink", formData.facebookLink);
      if (formData.instagramLink) payload.append("instagramLink", formData.instagramLink);
      if (formData.twitterLink) payload.append("twitterLink", formData.twitterLink);
      if (formData.linkedinLink) payload.append("linkedinLink", formData.linkedinLink);

      //  CORRECT KEY
      if (profileImage) {
        payload.append("profilePic", profileImage);
      }

      //  ONLY remove if user explicitly removed
      if (!profileImage && imagePreview === null) {
        payload.append("removeProfileImage", "true");
      }

      await updateAdminProfile(payload);
      await refreshProfile();

      //  reset local state so context image shows
      setProfileImage(null);

      closeModal();
    } catch (error) {
      console.error("Profile update failed", error);
    }
  };


  if (loading) return null;

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            Personal Information
          </h4>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
            <div>
              <p className="mb-2 text-xs text-gray-500">Full Name</p>
              <p className="text-sm font-medium">{formData.firstName}</p>
            </div>

            <div>
              <p className="mb-2 text-xs text-gray-500">Email</p>
              <p className="text-sm font-medium">{formData.mail}</p>
            </div>

            <div>
              <p className="mb-2 text-xs text-gray-500">Phone</p>
              <p className="text-sm font-medium">{formData.phone}</p>
            </div>

            <div>
              <p className="mb-2 text-xs text-gray-500">Bio</p>
              <p className="text-sm font-medium">{formData.bio}</p>
            </div>
          </div>
        </div>

        <button
          onClick={openModal}
          className="flex w-full items-center justify-center rounded-full border px-4 py-3 text-sm font-medium lg:w-auto"
        >
          Edit
        </button>
      </div>

      {/* ================= MODAL ================= */}
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <form className="flex flex-col">
            <div className="h-[450px] overflow-y-auto px-2 pb-3">

              {/*  Profile Image */}
              <div className="flex flex-col items-center gap-3 mb-6">
                <div className="relative w-28 h-28">
                  <img
                    src={imagePreview || "/images/default-avatar.png"}
                    alt="Profile"
                    className="w-28 h-28 rounded-full object-cover border"
                  />

                  {imagePreview && (
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full"
                    >
                      ✕
                    </button>
                  )}
                </div>

                <label className="cursor-pointer text-sm font-medium text-brand-600">
                  Change Photo
                  <input type="file" accept="image/*" hidden onChange={handleImageChange} />
                </label>
              </div>

              {/* ================= FORM ================= */}
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div>
                  <Label>Facebook</Label>
                  <Input value={formData.facebookLink} onChange={(e) => handleChange("facebookLink", e.target.value)} />
                </div>

                <div>
                  <Label>X.com</Label>
                  <Input value={formData.twitterLink} onChange={(e) => handleChange("twitterLink", e.target.value)} />
                </div>

                <div>
                  <Label>LinkedIn</Label>
                  <Input value={formData.linkedinLink} onChange={(e) => handleChange("linkedinLink", e.target.value)} />
                </div>

                <div>
                  <Label>Instagram</Label>
                  <Input value={formData.instagramLink} onChange={(e) => handleChange("instagramLink", e.target.value)} />
                </div>

                <div>
                  <Label>Full Name</Label>
                  <Input value={formData.firstName} onChange={(e) => handleChange("firstName", e.target.value)} />
                </div>

                <div>
                  <Label>Email</Label>
                  <Input value={formData.mail} onChange={(e) => handleChange("mail", e.target.value)} />
                </div>

                <div>
                  <Label>Phone</Label>
                  <Input value={formData.phone} onChange={(e) => handleChange("phone", e.target.value)} />
                </div>

                <div className="col-span-2">
                  <Label>Bio</Label>
                  <Input value={formData.bio} onChange={(e) => handleChange("bio", e.target.value)} />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button size="sm" variant="outline" onClick={closeModal}>
                Close
              </Button>
              <Button size="sm" onClick={handleSave}>
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}
