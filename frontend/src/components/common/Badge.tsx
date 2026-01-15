import React from "react";

interface Props {
  text: string;
  color?: "blue" | "green" | "red" | "gray";
}

const colorMap = {
  blue: "bg-blue-100 text-blue-700",
  green: "bg-green-100 text-green-700",
  red: "bg-red-100 text-red-700",
  gray: "bg-gray-100 text-gray-700",
};

const Badge: React.FC<Props> = ({ text, color = "gray" }) => (
  <span className={`px-2 py-1 rounded ${colorMap[color]}`}>{text}</span>
);

export default Badge;
