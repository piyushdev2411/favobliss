"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Upload, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface LocationGroup {
  id: string;
  name: string;
}

interface BulkImportProps {
  groups: LocationGroup[];
}

export const LocationBulkImport = ({ groups }: BulkImportProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [groupId, setGroupId] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("India");  // Default to India
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Reset on mount if groups empty
  useEffect(() => {
    if (groups.length === 0) {
      toast.warning("No location groups found. Create one first.");
    }
  }, [groups.length]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedGroupId = groupId?.trim();
    if (
      !file ||
      !trimmedGroupId ||
      trimmedGroupId === "undefined" ||
      trimmedGroupId.length !== 24 ||
      !city.trim() ||
      !state.trim() ||
      !country.trim()
    ) {
      toast.error("Please select a valid group, enter region details, and file");
      console.error("Debug: groupId:", groupId, "city:", city, "state:", state, "country:", country);
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("locationGroupId", trimmedGroupId);
    formData.append("city", city.trim());
    formData.append("state", state.trim());
    formData.append("country", country.trim());

    try {
      // Dynamic API call using storeId prop (not env)
      const res = await fetch(`/api/admin/${process.env.NEXT_PUBLIC_STORE_ID}/location/bulk`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed");

      toast.success(
        `Success! Created ${data.created} / ${data.totalProcessed || data.created + (data.skipped?.length || 0)} locations` +
          (data.skipped && data.skipped.length > 0
            ? ` (${data.skipped.length} skipped – already exist)`
            : "")
      );
      router.refresh();
      router.push("/admin/location");
    } catch (err: any) {
      console.error("Upload error:", err);
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
      setFile(null);
      setGroupId("");
      setCity("");
      setState("");
      setCountry("India");
      const input = document.getElementById("file-input") as HTMLInputElement;
      if (input) input.value = "";
    }
  };

  return (
    <div className="rounded-lg border bg-card p-6 space-y-6">
      <div className="flex items-center gap-3">
        <FileSpreadsheet className="w-8 h-8 text-green-600" />
        <div>
          <h3 className="text-lg font-semibold">Bulk Import Pincodes</h3>
          <p className="text-sm text-muted-foreground">
            Upload Excel/CSV with one column: <code className="font-mono">pincode</code> (6 digits)
          </p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <Label>Select Location Group</Label>
          <Select
            value={groupId}
            onValueChange={(value) => setGroupId(value || "")}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose group" />
            </SelectTrigger>
            <SelectContent>
              {groups.length > 0 ? (
                groups.map((g) => (
                  <SelectItem key={g.id} value={g.id}>
                    {g.name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="" disabled>
                  No groups available
                </SelectItem>
              )}
            </SelectContent>
          </Select>
          {groupId && (
            <p className="text-xs text-muted-foreground mt-1">
              Selected: {groupId.slice(0, 8)}...
            </p>
          )}
        </div>

        {/* UPDATED: Input fields for City, State, Country */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Enter city (e.g., Mumbai)"
              required
            />
          </div>

          <div>
            <Label htmlFor="state">State</Label>
            <Input
              id="state"
              value={state}
              onChange={(e) => setState(e.target.value)}
              placeholder="Enter state (e.g., Maharashtra)"
              required
            />
          </div>

          <div>
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="Enter country (e.g., India)"
              required
            />
          </div>
        </div>

        <div>
          <Label>Upload File (CSV or Excel)</Label>
          <Input
            id="file-input"
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            required
          />
          {file && (
            <p className="text-sm text-muted-foreground mt-1">{file.name}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={loading || !groupId || !city.trim() || !state.trim() || !country.trim() || groups.length === 0}
          className="w-full"
        >
          <Upload className="w-4 h-4 mr-2" />
          {loading ? "Uploading..." : "Import Pincodes"}
        </Button>
      </form>
    </div>
  );
};