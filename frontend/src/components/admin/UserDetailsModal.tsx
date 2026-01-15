import React from "react";
import { User } from "../../types/admin.types";
import Modal from "../common/Modal";
import { format } from "date-fns";

interface Props {
  user: User;
  onClose: () => void;
}

const UserDetailsModal: React.FC<Props> = ({ user, onClose }) => (
  <Modal isOpen={true} onClose={onClose} title="User Details">
    <div className="space-y-4">
      <div>
        <h3 className="font-bold text-lg mb-2">Basic Info</h3>
        <div>Email: {user.email}</div>
        <div>Name: {user.name}</div>
        <div>Status: {user.enabled ? "Enabled" : "Disabled"}</div>
      </div>
      <div>
        <h3 className="font-bold text-lg mb-2">Groups</h3>
        <div className="flex flex-wrap gap-2">
          {user.groups.map(g => (
            <span key={g} className="bg-blue-100 text-blue-700 px-2 py-1 rounded">{g}</span>
          ))}
        </div>
      </div>
      <div>
        <h3 className="font-bold text-lg mb-2">Roles</h3>
        <div className="flex flex-wrap gap-2">
          {user.roles.map(r => (
            <span key={r} className="bg-green-100 text-green-700 px-2 py-1 rounded">{r}</span>
          ))}
        </div>
      </div>
      <div>
        <h3 className="font-bold text-lg mb-2">Activity</h3>
        <div>Created: {format(new Date(user.createdAt), "PPpp")}</div>
        {/* Add last login if available */}
      </div>
      <button
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        aria-label="Close"
        onClick={onClose}
      >
        ×
      </button>
    </div>
  </Modal>
);

export default UserDetailsModal;
