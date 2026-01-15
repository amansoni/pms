import React, { useEffect, useState } from "react";
import { getGroupMembers, addUserToGroup, removeUserFromGroup, searchUsers } from "../../services/api";
import { Group, User } from "../../types/admin.types";
import Modal from "../common/Modal";
import ConfirmDialog from "../common/ConfirmDialog";
import SearchBar from "../common/SearchBar";
import toast from "react-hot-toast";

interface Props {
  group: Group;
  onClose: () => void;
}

const GroupMembersModal: React.FC<Props> = ({ group, onClose }) => {
  const [members, setMembers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [removeUserId, setRemoveUserId] = useState<string | null>(null);
  const [addSearch, setAddSearch] = useState("");
  const [addResults, setAddResults] = useState<User[]>([]);

  useEffect(() => {
    setLoading(true);
    getGroupMembers(group.id)
      .then(setMembers)
      .catch(() => toast.error("Failed to load members"))
      .finally(() => setLoading(false));
  }, [group.id]);

  useEffect(() => {
    if (addSearch.length > 2) {
      searchUsers(addSearch).then(setAddResults).catch(() => {});
    } else {
      setAddResults([]);
    }
  }, [addSearch]);

  const handleRemove = async () => {
    if (!removeUserId) return;
    try {
      await removeUserFromGroup(group.id, removeUserId);
      setMembers(members.filter(u => u.id !== removeUserId));
      toast.success("Member removed");
    } catch {
      toast.error("Failed to remove member");
    }
    setShowConfirm(false);
    setRemoveUserId(null);
  };

  // Add member logic
  const handleAdd = async (userId: string) => {
    try {
      await addUserToGroup(group.id, userId);
      toast.success("Member added");
      setMembers([...members, addResults.find(u => u.id === userId)!]);
    } catch {
      toast.error("Failed to add member");
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} title={`Members of ${group.name}`}>
      <SearchBar value={search} onChange={setSearch} placeholder="Filter members..." />
      <div className="mt-2">
        {loading ? (
          <div className="animate-pulse h-12 bg-blue-100 rounded mb-4" />
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {members
                .filter(u =>
                  (u.name && u.name.includes(search)) ||
                  (u.email && u.email.includes(search))
                )
                .map(u => (
                  <tr key={u.id} className="hover:bg-blue-50">
                    <td>{u.name || "-"}</td>
                    <td>{u.email || "-"}</td>
                    <td>{Array.isArray(u.roles) ? u.roles.join(", ") : "-"}</td>
                    <td>
                      <button
                        className="text-red-600 hover:text-red-800"
                        aria-label="Remove"
                        onClick={() => { setRemoveUserId(u.id); setShowConfirm(true); }}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>
      <div className="mt-4">
        <h4 className="font-bold mb-2">Add Member</h4>
        <SearchBar value={addSearch} onChange={setAddSearch} placeholder="Search users to add..." />
        <ul>
          {addResults.map(u => (
            <li key={u.id} className="flex justify-between items-center py-1">
              <span>{u.name} ({u.email})</span>
              <button
                className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                onClick={() => handleAdd(u.id)}
              >
                Add
              </button>
            </li>
          ))}
        </ul>
      </div>
      <ConfirmDialog
        isOpen={showConfirm}
        title="Remove Member"
        message="Are you sure you want to remove this member from the group?"
        confirmText="Remove"
        onConfirm={handleRemove}
        onCancel={() => setShowConfirm(false)}
      />
    </Modal>
  );
};

export default GroupMembersModal;
