import React, { useState } from "react";
import { UserFormData } from "../../types/admin.types";
import toast from "react-hot-toast";

interface Props {
  initial?: UserFormData;
  onSubmit?: (data: UserFormData) => void;
  onCancel?: () => void;
}

const defaultForm: UserFormData = {
  email: "",
  firstName: "",
  lastName: "",
  password: "",
  confirmPassword: "",
  enabled: true,
  roles: [],
  groups: [],
};

const UserForm: React.FC<Props> = ({ initial, onSubmit, onCancel }) => {
  const [form, setForm] = useState<UserFormData>(initial || defaultForm);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.email) errs.email = "Email is required";
    if (!form.password && !initial) errs.password = "Password is required";
    if (form.password !== form.confirmPassword) errs.confirmPassword = "Passwords do not match";
    return errs;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({
      ...f,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setLoading(true);
    try {
      onSubmit && await onSubmit(form);
      toast.success("User saved");
    } catch (err: any) {
      toast.error(err?.message || "Failed to save user");
    }
    setLoading(false);
  };

  return (
    <form className="p-4 bg-white rounded-lg shadow-lg max-w-md mx-auto" onSubmit={handleSubmit}>
      <label className="block mb-2 font-medium">Email</label>
      <input
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
        className="w-full mb-1 p-2 rounded-md border"
        required
        aria-label="Email"
      />
      {errors.email && <div className="text-red-500 text-sm mb-2">{errors.email}</div>}

      <label className="block mb-2 font-medium">First Name</label>
      <input
        name="firstName"
        type="text"
        value={form.firstName}
        onChange={handleChange}
        className="w-full mb-1 p-2 rounded-md border"
        aria-label="First Name"
      />

      <label className="block mb-2 font-medium">Last Name</label>
      <input
        name="lastName"
        type="text"
        value={form.lastName}
        onChange={handleChange}
        className="w-full mb-1 p-2 rounded-md border"
        aria-label="Last Name"
      />

      <label className="block mb-2 font-medium">Password</label>
      <input
        name="password"
        type="password"
        value={form.password}
        onChange={handleChange}
        className="w-full mb-1 p-2 rounded-md border"
        required={!initial}
        aria-label="Password"
      />
      {errors.password && <div className="text-red-500 text-sm mb-2">{errors.password}</div>}

      <label className="block mb-2 font-medium">Confirm Password</label>
      <input
        name="confirmPassword"
        type="password"
        value={form.confirmPassword}
        onChange={handleChange}
        className="w-full mb-1 p-2 rounded-md border"
        required={!initial}
        aria-label="Confirm Password"
      />
      {errors.confirmPassword && <div className="text-red-500 text-sm mb-2">{errors.confirmPassword}</div>}

      <label className="block mb-2 font-medium">Enabled</label>
      <input
        name="enabled"
        type="checkbox"
        checked={form.enabled}
        onChange={handleChange}
        className="mr-2"
        aria-label="Enabled"
      />

      <label className="block mb-2 font-medium">Roles</label>
      <select
        name="roles"
        multiple
        value={form.roles}
        onChange={handleChange}
        className="w-full mb-2 p-2 rounded-md border"
        aria-label="Roles"
      >
        <option value="clinician">Clinician</option>
        <option value="admin">Admin</option>
        <option value="auditor">Auditor</option>
      </select>

      <label className="block mb-2 font-medium">Groups</label>
      <input
        name="groups"
        type="text"
        value={form.groups.join(",")}
        onChange={e => setForm(f => ({ ...f, groups: e.target.value.split(",") }))}
        className="w-full mb-2 p-2 rounded-md border"
        aria-label="Groups"
        placeholder="Comma separated group names"
      />

      <div className="flex gap-2 mt-4">
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"
          disabled={loading}
        >
          {loading && <span className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent mr-2"></span>}
          Save
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
  );
};

export default UserForm;
