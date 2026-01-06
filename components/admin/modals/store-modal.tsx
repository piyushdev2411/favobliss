"use client";

import { Modal } from "@/components/admin/modal";
import { useStoreModal } from "@/hooks/admin/use-store-modal";
import { StoreForm } from "@/components/admin/store/forms/store-form";

export const StoreModal = () => {
  const { isOpen, onClose } = useStoreModal();

  return (
    <Modal
      title="Create store"
      description="Add a new store to manage products and categories"
      isOpen={isOpen}
      onClose={onClose}
    >
      <StoreForm />
    </Modal>
  );
};
