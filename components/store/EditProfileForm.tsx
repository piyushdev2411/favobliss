// New file: app/profile/EditProfileForm.tsx
"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const EditProfileForm = ({
  currentName,
  currentMobile,
  currentDob,
}: {
  currentName: string;
  currentMobile: string;
  currentDob: string;
}) => {
  const [name, setName] = useState(currentName);
  const [mobile, setMobile] = useState(currentMobile);
  const [dob, setDob] = useState(currentDob);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/v1/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          mobileNumber: mobile || null,
          dob: dob ? new Date(dob).toISOString() : null, // Send as ISO string
        }),
      });
      if (!res.ok) {
        throw new Error((await res.text()) || "Failed to update profile");
      }
      window.location.reload(); // Reload to reflect changes
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-red-500">{error}</p>}
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="mobile">Phone Number</Label>
        <Input
          id="mobile"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="dob">Date of Birth</Label>
        <Input
          id="dob"
          type="date"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
        />
      </div>
      <Button type="submit" disabled={loading}>
        Save Changes
      </Button>
    </form>
  );
};

export default EditProfileForm;
