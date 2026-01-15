import React from "react";
import Modal from "./Modal";

interface Props {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog: React.FC<Props> = ({
  isOpen,
  title,
  message,
  confirmText,
  onConfirm,
  onCancel,
}) => (
  <Modal isOpen={isOpen} onClose={onCancel} title={title}>
    <div className="mb-4">{message}</div>
    <div className="flex gap-2">
      <button
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        onClick={onConfirm}
      >
        {confirmText}
      </button>
      <button
        className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
        onClick={onCancel}
      >
        Cancel
      </button>
    </div>
  </Modal>
);

export default ConfirmDialog;
