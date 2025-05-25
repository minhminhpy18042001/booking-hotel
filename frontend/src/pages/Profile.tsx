import { useQuery, useMutation, useQueryClient } from "react-query";
import * as apiClient from "../api-client";
import { useState, useEffect } from "react";
import { useAppContext } from "../contexts/AppContext";

const Profile = () => {
  const queryClient = useQueryClient();
  const { showToast } = useAppContext();
  const { data: user, isLoading, isError } = useQuery("fetchCurrentUser", apiClient.fetchCurrentUser);
  const { mutate: changePassword, isLoading: isChanging } = useMutation(
    ({ currentPassword, newPassword }: { currentPassword: string; newPassword: string }) =>
      apiClient.changePassword(currentPassword, newPassword),
    {
      onSuccess: () => {
        setShowPassword(false);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        showToast({ message: "Change Password Success!", type: "SUCCESS" });
      },
      onError: (error: any) => {
        showToast({ message: error.message, type: "ERROR" });
      },
    }
  );
  const { mutate: updateProfile } = useMutation(
    async ({ firstName, lastName, phone }: { firstName: string; lastName: string; phone: string }) => {
      return apiClient.updateUserProfile(firstName, lastName, phone);
    },
    {
      onSuccess: () => {
        showToast({ message: "Profile updated successfully!", type: "SUCCESS" });
        setEditField(null);
        queryClient.invalidateQueries("fetchCurrentUser");
      },
      onError: (error: any) => {
        showToast({ message: error.message || "Failed to update profile.", type: "ERROR" });
      },
    }
  );
  const { mutate: updateAvatar } = useMutation(
    async (avatarFile: File) => {
      const formData = new FormData();
      formData.append("avatar", avatarFile);
      return apiClient.uploadAvatar(formData);
    },
    {
      onSuccess: () => {
        showToast({ message: "Avatar updated successfully!", type: "SUCCESS" });
        queryClient.invalidateQueries("fetchCurrentUser");
      },
      onError: (error: any) => {
        showToast({ message: error.message || "Failed to update avatar.", type: "ERROR" });
      },
    }
  );
  
  const [editField, setEditField] = useState<string | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setPhone(user.phone || "");
      setAvatar(user.avatar || null);
    }
  }, [user]);

  if (isLoading) {
    return <div className="container mx-auto mt-10">Loading...</div>;
  }

  if (isError || !user) {
    return (
      <div className="container mx-auto mt-10">
        <h2 className="text-2xl font-bold mb-4">Profile</h2>
        <p className="text-red-500">Unable to load profile. Please sign in.</p>
      </div>
    );
  }

  // Dummy save handlers (replace with real API calls)
  const handleSave = () => {
    updateProfile({ firstName, lastName, phone });
  };
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      updateAvatar(e.target.files[0]);

    }
  };
  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      showToast({ message: "Please fill in all password fields.", type: "ERROR" });
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast({ message: "New passwords do not match.", type: "ERROR" });
      return;
    }
    if (newPassword.length < 6) {
      showToast({ message: "New password must be at least 6 characters.", type: "ERROR" });
      return;
    }
    if (currentPassword === newPassword) {
      showToast({ message: "New password cannot be the same as current password.", type: "ERROR" });
      return;
    }
    changePassword({ currentPassword, newPassword });
  };

  return (
    <div className="container mx-auto mt-10 max-w-lg bg-white rounded-xl shadow-lg p-8 flex flex-col items-center">
      <div className="relative mb-6">
        <img
          src={avatar ? avatar : "/images/avatar.png"}
          alt="User Avatar"
          className="w-24 h-24 rounded-full border-4 border-blue-500 shadow"
        />
        <label className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 cursor-pointer hover:bg-blue-700 transition">
          <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
          <span className="text-xs">Edit</span>
        </label>
      </div>
      <div className="w-full space-y-6">
        {/* Name */}
        <div className="flex items-center justify-between">
          <div>
            <span className="font-semibold text-gray-700">Name:</span>
            {editField === "name" ? (
              <span className="ml-2">
                <input
                  className="border rounded px-2 py-1 mr-2"
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  placeholder="First Name"
                />
                <input
                  className="border rounded px-2 py-1"
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                  placeholder="Last Name"
                />
              </span>
            ) : (
              <span className="ml-2">{user.firstName} {user.lastName}</span>
            )}
          </div>
          {editField === "name" ? (
            <button className="ml-2 text-blue-600 font-bold" onClick={handleSave}>Save</button>
          ) : (
            <button className="ml-2 text-blue-600 font-bold" onClick={() => setEditField("name")}>Edit</button>
          )}
        </div>
        {/* Email (not editable) */}
        <div className="flex items-center justify-between">
          <div>
            <span className="font-semibold text-gray-700">Email:</span>
            <span className="ml-2">{user.email}</span>
          </div>
        </div>
        {/* Phone (editable) */}
        <div className="flex items-center justify-between">
          <div>
            <span className="font-semibold text-gray-700">Phone:</span>
            {editField === "phone" ? (
              <input
                className="ml-2 border rounded px-2 py-1"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="Phone"
              />
            ) : (
              <span className="ml-2">{(user as any).phone || "-"}</span>
            )}
          </div>
          {editField === "phone" ? (
            <button className="ml-2 text-blue-600 font-bold" onClick={handleSave}>Save</button>
          ) : (
            <button className="ml-2 text-blue-600 font-bold" onClick={() => setEditField("phone")}>Edit</button>
          )}
        </div>
        {/* Password */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-gray-700">Password:</span>
            {showPassword ? (
              <span className="ml-2 text-gray-400">Change Password</span>
            ) : (
              <span className="ml-2 text-gray-400">********</span>
            )}
            {showPassword ? (
              <button className="ml-2 text-blue-600 font-bold" onClick={() => setShowPassword(false)}>Cancel</button>
            ) : (
              <button className="ml-2 text-blue-600 font-bold" onClick={() => setShowPassword(true)}>Change</button>
            )}
          </div>
          {showPassword && (
            <div className="flex flex-col gap-2 mt-2">
              <input
                className="border rounded px-2 py-1"
                type="password"
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                placeholder="Current Password"
              />
              <input
                className="border rounded px-2 py-1"
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="New Password"
              />
              <input
                className="border rounded px-2 py-1"
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Re-enter New Password"
              />
              <button
                className="w-fit bg-blue-600 text-white px-4 py-1 rounded font-bold mt-2 hover:bg-blue-700"
                disabled={isChanging}
                onClick={handlePasswordChange}
              >
                {isChanging ? "Saving..." : "Save Password"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
