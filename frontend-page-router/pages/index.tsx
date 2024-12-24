import {
  AuthContext,
  RoleType,
  UpdateAuthContext,
} from "@/contexts/auth.context";
import Link from "next/link";
import { useContext } from "react";

export default function Home() {
  const { role } = useContext(AuthContext);
  const updateAuthContext = useContext(UpdateAuthContext);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {/* Header */}
      <h1 className="text-4xl font-bold text-gray-800 mb-6">
        School Management System
      </h1>

      {/* Dropdown */}
      <div className="mb-6">
        <label
          htmlFor="role"
          className="block text-lg font-medium text-gray-700 mb-2"
        >
          Select your role
        </label>
        <select
          name="role"
          id="role"
          value={role ?? ""}
          onChange={(e) => updateAuthContext(e.target.value as RoleType)}
          className="block w-full max-w-xs bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 px-4 py-2"
        >
          <option value="" disabled>
            Select a role
          </option>
          <option value="admin">Admin</option>
          <option value="principal">Principal</option>
          <option value="teacher">Teacher</option>
        </select>
      </div>

      {/* Buttons */}
      <div className="flex space-x-4">
        <button
          disabled={role == null}
          className={`px-6 py-3 rounded ${
            role
              ? "bg-blue-500 text-white hover:bg-blue-700"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          <Link
            href={{ pathname: "/class", query: { role } }}
            className={`${!role ? "pointer-events-none" : ""}`}
          >
            Classes
          </Link>
        </button>
        <button
          disabled={role == null}
          className={`px-6 py-3 rounded ${
            role
              ? "bg-blue-500 text-white hover:bg-blue-700"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          <Link
            href={{ pathname: "/student", query: { role } }}
            className={`${!role ? "pointer-events-none" : ""}`}
          >
            Students
          </Link>
        </button>
      </div>
    </div>
  );
}
