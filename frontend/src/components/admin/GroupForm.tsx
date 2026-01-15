import React, { useState } from "react";
import { GroupFormData } from "../../types/admin.types";
import Modal from "../common/Modal";

interface Props {
  onSubmit: (data: GroupFormData) => void;
  onCancel: () => void;
}

const GroupForm: React.FC<Props> = ({ onSubmit, onCancel }) => {
  const [form, setForm] = useState<GroupFormData>({ name: "" });

  return (
    <Modal isOpen={true} onClose={onCancel} title="Create Group">
      <form
        onSubmit={e => {
          e.preventDefault();
          onSubmit(form);
        }}
      >
        <label className="block mb-2 font-medium">Group Name</label>
        <input
          name="name"
          type="text"
          value={form.name}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
          className="w-full mb-2 p-2 rounded-md border"
          required
        />
        <div className="flex gap-2 mt-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Create
          </button>
          <button
            type="button"
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default GroupForm;
