// New file: app/profile/ClientEditSection.tsx (or wherever your ProfilePage is located)
// This is a client component for handling forms
"use client";

import { useState } from "react";
import EditProfileForm from "./EditProfileForm";
import ChangePasswordForm from "./ChangePasswordForm";
import { Button } from "@/components/ui/button";

const ClientEditSection = ({
  currentName,
  currentMobile,
  currentDob,
}: {
  currentName: string;
  currentMobile: string;
  currentDob: string;
}) => {
  const [showEdit, setShowEdit] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <div className="grid grid-cols-2 items-start mt-4 gap-4">
        <Button onClick={() => setShowEdit(!showEdit)} className="w-fit">
          {showEdit ? "Cancel" : "Edit Profile"}
        </Button>
        <Button
          onClick={() => setShowPassword(!showPassword)}
          className="mt-0 w-fit"
        >
          {showPassword ? "Cancel" : "Change Password"}
        </Button>
      </div>
      <div className="grid grid-cols-1 items-start mt-4">
        {showEdit && (
          <EditProfileForm
            currentName={currentName}
            currentMobile={currentMobile}
            currentDob={currentDob}
          />
        )}
        {showPassword && <ChangePasswordForm />}
      </div>
    </>
  );
};

export default ClientEditSection;
