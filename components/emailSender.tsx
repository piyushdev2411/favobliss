"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Mail } from "lucide-react";
import { sendOrderEmail } from "@/lib/mail2";

interface EmailSenderProps {
  order: any;
  storeId: string;
}

export default function EmailSender({ order, storeId }: EmailSenderProps) {
  const [open, setOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;

    const formData = new FormData(formRef.current);
    setIsPending(true);
    try {
      await sendOrderEmail(formData);
      formRef.current.reset();
      setOpen(false);
    } catch (error) {
      console.error("Failed to send email:", error);
      // Optionally, show an error message to the user here
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Mail className="mr-2 h-4 w-4" />
          Send Email
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Send Email to Customer</DialogTitle>
            <DialogDescription>
              Email will be sent to {order.customerEmail}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              name="subject"
              type="text"
              placeholder="Enter email subject"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="body">Message (HTML supported)</Label>
            <Textarea
              id="body"
              name="body"
              placeholder="Enter email body"
              rows={6}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="attachment">Attachment (Optional)</Label>
            <Input
              id="attachment"
              name="attachment"
              type="file"
              accept="*/*"
            />
          </div>
          <input type="hidden" name="orderId" value={order.id} />
          <input type="hidden" name="storeId" value={storeId} />
          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Sending..." : "Send Email"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}