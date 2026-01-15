import React, { useEffect, useState } from "react";
import { getUsers, deleteUser, searchUsers, createUser, updateUser } from "../../services/api";
import { User } from "../../types/admin.types";
import UserForm from "../../components/admin/UserForm";
import UserDetailsModal from "../../components/admin/UserDetailsModal";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import Table from "../../components/common/Table";
import SearchBar from "../../components/common/SearchBar";
import toast from "react-hot-toast";

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [showUserForm, setShowUserForm] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);

  useEffect(() => {
    setLoading(true);
    (search ? searchUsers(search) : getUsers(page, 10))
      .then(setUsers)
      .catch(() => toast.error("Failed to load users"))
      .finally(() => setLoading(false));
  }, [search, page]);

  const handleDelete = async () => {
    if (!deleteUserId) return;
    try {
      await deleteUser(deleteUserId);
      toast.success("User deleted");
      setUsers(users.filter(u => u.id !== deleteUserId));
    } catch {
      toast.error("Failed to delete user");
    }
    setShowDelete(false);
    setDeleteUserId(null);
  };

  const handleCreate = async (data: any) => {
    await createUser(data);
    toast.success("User created");
    setShowUserForm(false);
    setPage(1);
  };

  const handleEdit = async (data: any) => {
    if (!editUser) return;
    await updateUser(editUser.id, data);
    toast.success("User updated");
    setEditUser(null);
    setShowUserForm(false);
    setPage(1);
  };

  return (
    <div className="p-6">
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-700">User Management</h1>
        <div className="flex gap-2">
          <SearchBar value={search} onChange={setSearch} placeholder="Search users..." />
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={() => { setEditUser(null); setShowUserForm(true); }}
          >
            + Add User
          </button>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-md p-4">
        {loading ? (
          <div className="animate-pulse h-12 bg-blue-100 rounded mb-4" />
        ) : users.length === 0 ? (
          <div className="text-gray-500 text-center py-8">No users found.</div>
        ) : (
          <Table
            columns={[
              { key: "name", label: "Name" },
              { key: "email", label: "Email" },
              { key: "groups", label: "Groups" },
              { key: "roles", label: "Roles" },
              { key: "enabled", label: "Status" },
              { key: "actions", label: "Actions" },
            ]}
            data={users.map(u => ({
              ...u,
              groups: Array.isArray(u.groups)
                ? u.groups.map(g => <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded mr-1">{g}</span>)
                : null,
              roles: Array.isArray(u.roles)
                ? u.roles.map(r => <span className="bg-green-100 text-green-700 px-2 py-1 rounded mr-1">{r}</span>)
                : null,
              enabled: u.enabled ? (
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded">Enabled</span>
              ) : (
                <span className="bg-red-100 text-red-700 px-2 py-1 rounded">Disabled</span>
              ),
              actions: (
                <div className="flex gap-2">
                  <button
                    aria-label="View"
                    className="text-blue-600 hover:text-blue-800"
                    onClick={() => { setSelectedUser(u); setShowDetails(true); }}
                  >
                    <i className="ri-eye-line"></i>
                  </button>
                  <button
                    aria-label="Edit"
                    className="text-green-600 hover:text-green-800"
                    onClick={() => { setEditUser(u); setShowUserForm(true); }}
                  >
                    <i className="ri-edit-line"></i>
                  </button>
                  <button
                    aria-label="Delete"
                    className="text-red-600 hover:text-red-800"
                    onClick={() => { setDeleteUserId(u.id); setShowDelete(true); }}
                  >
                    <i className="ri-delete-bin-line"></i>
                  </button>
                </div>
              ),
            }))}
          />
        )}
      </div>
      {showUserForm && (
        <UserForm
          initial={editUser || undefined}
          onSubmit={editUser ? handleEdit : handleCreate}
          onCancel={() => { setShowUserForm(false); setEditUser(null); }}
        />
      )}
      {showDetails && selectedUser && (
        <UserDetailsModal user={selectedUser} onClose={() => setShowDetails(false)} />
      )}
      <ConfirmDialog
        isOpen={showDelete}
        title="Delete User"
        message="Are you sure you want to delete this user? This action cannot be undone."
        confirmText="Delete"
        onConfirm={handleDelete}
        onCancel={() => setShowDelete(false)}
      />
      {/* Pagination controls */}
      <div className="flex justify-center mt-4 gap-2">
        <button
          className="px-3 py-1 rounded bg-blue-500 text-white disabled:bg-blue-200"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Prev
        </button>
        <span className="px-3 py-1">{page}</span>
        <button
          className="px-3 py-1 rounded bg-blue-500 text-white disabled:bg-blue-200"
          disabled={users.length < 10}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default UserManagement;
