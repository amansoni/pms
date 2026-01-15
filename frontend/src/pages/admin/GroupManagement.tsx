import React, { useEffect, useState } from "react";
import { getGroups, createGroup } from "../../services/api";
import { Group } from "../../types/admin.types";
import GroupMembersModal from "../../components/admin/GroupMembersModal";
import GroupSettingsForm from "../../components/admin/GroupSettingsForm";
import GroupForm from "../../components/admin/GroupForm";
import toast from "react-hot-toast";

const GroupManagement: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [showMembers, setShowMembers] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showGroupForm, setShowGroupForm] = useState(false);

  useEffect(() => {
    setLoading(true);
    getGroups()
      .then(setGroups)
      .catch(() => toast.error("Failed to load groups"))
      .finally(() => setLoading(false));
  }, []);

  const handleCreateGroup = async (data: any) => {
    await createGroup(data);
    toast.success("Group created");
    setShowGroupForm(false);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-blue-700 mb-4">Group Management</h1>
      <div className="mb-4 flex justify-end">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => setShowGroupForm(true)}
        >
          + Add Group
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="animate-pulse h-32 bg-blue-100 rounded-lg" />
          ))
        ) : groups.length === 0 ? (
          <div className="col-span-3 text-gray-500 text-center py-8">
            No groups configured. Contact your Keycloak administrator.
          </div>
        ) : (
          groups.map(g => (
            <div key={g.id} className="bg-white rounded-lg shadow-md p-4 flex flex-col gap-2">
              <h2 className="font-bold text-lg">{g.name}</h2>
              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded self-start">
                {g.memberCount} members
              </span>
              <div>
                {Object.entries(g.attributes || {}) // <-- fix: ensure g.attributes is an object
                  .slice(0, 3)
                  .map(([k, v]) => (
                    <div key={k} className="text-sm">
                      <span className="font-medium">{k}:</span> {Array.isArray(v) ? v.join(", ") : String(v)}
                    </div>
                  ))}
              </div>
              <div className="flex gap-2 mt-auto">
                <button
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  onClick={() => { setSelectedGroup(g); setShowMembers(true); }}
                >
                  View Members
                </button>
                <button
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                  onClick={() => { setSelectedGroup(g); setShowSettings(true); }}
                >
                  Edit Settings
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      {showMembers && selectedGroup && (
        <GroupMembersModal group={selectedGroup} onClose={() => setShowMembers(false)} />
      )}
      {showSettings && selectedGroup && (
        <GroupSettingsForm group={selectedGroup} onClose={() => setShowSettings(false)} />
      )}
      {showGroupForm && (
        <GroupForm
          onSubmit={handleCreateGroup}
          onCancel={() => setShowGroupForm(false)}
        />
      )}
    </div>
  );
};

export default GroupManagement;
