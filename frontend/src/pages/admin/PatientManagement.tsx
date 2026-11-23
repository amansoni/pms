import React, { useEffect, useState } from "react";
import { getPatients, getTrusts } from "../../services/api";
import { PatientRecord, TrustSummary } from "../../types/admin.types";
import Table from "../../components/common/Table";

const PatientManagement: React.FC = () => {
  const [trusts, setTrusts] = useState<TrustSummary[]>([]);
  const [selectedGroupNid, setSelectedGroupNid] = useState("");
  const [patients, setPatients] = useState<PatientRecord[]>([]);
  const [search, setSearch] = useState("");
  const [loadingTrusts, setLoadingTrusts] = useState(true);
  const [loadingPatients, setLoadingPatients] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getTrusts()
      .then((items) => {
        setTrusts(items);
        if (items.length > 0) setSelectedGroupNid(String(items[0].drupal_group_nid));
      })
      .catch(() => setError("Unable to load groups. Please try again."))
      .finally(() => setLoadingTrusts(false));
  }, []);

  useEffect(() => {
    if (!selectedGroupNid) {
      setPatients([]);
      return;
    }

    let cancelled = false;
    setLoadingPatients(true);
    setError("");
    getPatients(Number(selectedGroupNid))
      .then((items) => {
        if (!cancelled) setPatients(items);
      })
      .catch(() => {
        if (!cancelled) {
          setPatients([]);
          setError("Unable to load patients for this group.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingPatients(false);
      });

    return () => {
      cancelled = true;
    };
  }, [selectedGroupNid]);

  const normalizedSearch = search.trim().toLowerCase();
  const visiblePatients = patients.filter((patient) =>
    `${patient.name} ${patient.identifier}`.toLowerCase().includes(normalizedSearch)
  );
  const selectedTrust = trusts.find((trust) => String(trust.drupal_group_nid) === selectedGroupNid);

  return (
    <main className="p-6">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase text-blue-700">Care directory</p>
          <h1 className="text-2xl font-bold text-gray-900">Groups &amp; patients</h1>
        </div>
        <label className="flex min-w-64 flex-col gap-1 text-sm font-medium text-gray-700">
          Group
          <select
            className="rounded border border-gray-300 bg-white px-3 py-2"
            value={selectedGroupNid}
            onChange={(event) => setSelectedGroupNid(event.target.value)}
            disabled={loadingTrusts || trusts.length === 0}
          >
            {trusts.length === 0 && <option value="">No groups available</option>}
            {trusts.map((trust) => (
              <option key={trust.drupal_group_nid} value={trust.drupal_group_nid}>
                {trust.trust_id} · Group {trust.drupal_group_nid}
              </option>
            ))}
          </select>
        </label>
      </header>

      {error && (
        <div role="alert" className="mb-4 border-l-4 border-red-600 bg-red-50 px-4 py-3 text-red-800">
          {error}
        </div>
      )}

      {loadingTrusts ? (
        <div className="animate-pulse h-12 bg-blue-100" />
      ) : trusts.length === 0 ? (
        <p className="py-10 text-center text-gray-500">No groups are available.</p>
      ) : (
        <section aria-label="Patients in selected group">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 pb-3">
            <div>
              <h2 className="font-semibold text-gray-900">{selectedTrust?.trust_id}</h2>
              <p className="text-sm text-gray-500">
                {loadingPatients ? "Loading patients…" : `${patients.length} patients`}
              </p>
            </div>
            <label className="text-sm text-gray-700">
              <span className="sr-only">Search patients</span>
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search name or identifier"
                className="w-64 rounded border border-gray-300 px-3 py-2"
                disabled={loadingPatients}
              />
            </label>
          </div>

          {loadingPatients ? (
            <div className="animate-pulse h-12 bg-blue-100" />
          ) : visiblePatients.length === 0 ? (
            <p className="py-10 text-center text-gray-500">
              {patients.length === 0 ? "No patients in this group." : "No patients match your search."}
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table
                columns={[
                  { key: "name", label: "Patient" },
                  { key: "identifier", label: "Identifier" },
                ]}
                data={visiblePatients.map((patient) => ({
                  name: patient.name || `Patient ${patient.serial}`,
                  identifier: patient.identifier,
                }))}
              />
            </div>
          )}
        </section>
      )}
    </main>
  );
};

export default PatientManagement;
