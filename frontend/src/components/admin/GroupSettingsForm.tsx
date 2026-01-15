import React, { useState } from "react";
import { Group, GroupSettings } from "../../types/admin.types";
import { updateGroupSettings } from "../../services/api";
import toast from "react-hot-toast";
import Modal from "../common/Modal";

interface Props {
  group: Group;
  onClose: () => void;
}

const defaultFeatures = [
  { key: "2FA Required", value: "2fa" },
  { key: "Audit Logging", value: "audit" },
  { key: "Export Data", value: "export" },
];

const GroupSettingsForm: React.FC<Props> = ({ group, onClose }) => {
  const [settings, setSettings] = useState<GroupSettings>(group.attributes as GroupSettings || {});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setSettings(s => ({
      ...s,
      [name]: type === "checkbox"
        ? checked
          ? [...(s.features || []), value]
          : (s.features || []).filter(f => f !== value)
        : value,
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateGroupSettings(group.id, settings);
      toast.success("Group settings updated");
      onClose();
    } catch {
      toast.error("Failed to update settings");
    }
    setLoading(false);
  };

  return (
    <Modal isOpen={true} onClose={onClose} title={`Edit Settings: ${group.name}`}>
      <div className="space-y-4">
        <label className="block font-medium">Max Assessments</label>
        <input
          name="max_assessments"
          type="number"
          value={settings.max_assessments || ""}
          onChange={handleChange}
          className="w-full p-2 rounded-md border"
        />
        <label className="block font-medium">Data Retention Days</label>
        <input
          name="data_retention_days"
          type="number"
          value={settings.data_retention_days || ""}
          onChange={handleChange}
          className="w-full p-2 rounded-md border"
        />
        <label className="block font-medium">Features</label>
        <div className="flex gap-2">
          {defaultFeatures.map(f => (
            <label key={f.value} className="flex items-center gap-1">
              <input
                type="checkbox"
                name="features"
                value={f.value}
                checked={settings.features?.includes(f.value) || false}
                onChange={handleChange}
              />
              {f.key}
            </label>
          ))}
        </div>
        {/* Custom attributes omitted for brevity */}
        <div className="flex gap-2 mt-4">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </button>
          <button
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
        <div className="text-xs text-gray-500 mt-2">
          All changes are logged for compliance.
        </div>
      </div>
    </Modal>
  );
};

export default GroupSettingsForm;
