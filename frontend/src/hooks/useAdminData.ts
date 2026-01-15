import { useState, useCallback } from "react";
import { getUsers, getGroups } from "../services/api";
import { User, Group } from "../types/admin.types";

export function useAdminData() {
  const [users, setUsers] = useState<User[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getUsers(1, 10);
      setUsers(data);
    } catch (err: any) {
      setError(err?.message || "Failed to fetch users");
    }
    setLoading(false);
  }, []);

  const fetchGroups = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getGroups();
      setGroups(data);
    } catch (err: any) {
      setError(err?.message || "Failed to fetch groups");
    }
    setLoading(false);
  }, []);

  return {
    users,
    groups,
    loading,
    error,
    fetchUsers,
    fetchGroups,
  };
}
