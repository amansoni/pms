import React from "react";

interface Column {
  key: string;
  label: string;
}

interface Props {
  columns: Column[];
  data: any[];
  actions?: React.ReactNode;
}

const Table: React.FC<Props> = ({ columns, data }) => (
  <table className="w-full text-sm rounded-lg overflow-hidden">
    <thead>
      <tr>
        {columns.map(col => (
          <th key={col.key} className="bg-blue-100 text-blue-700 px-4 py-2">{col.label}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      {data.map((row, i) => (
        <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-blue-50"}>
          {columns.map(col => (
            <td key={col.key} className="px-4 py-2">{row[col.key]}</td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
);

export default Table;
