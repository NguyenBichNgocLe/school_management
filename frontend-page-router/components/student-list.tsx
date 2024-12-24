import { AuthContext } from "@/contexts/auth.context";
import { useRouter } from "next/navigation";
import { Switch } from "antd";
import { useCallback, useContext, useState } from "react";

export function StudentList() {
  const { role } = useContext(AuthContext);
  const router = useRouter();
  const [searchString, setSearchString] = useState("");
  const [isSearchByName, setIsSearchByName] = useState(true);

  const handleSearch = useCallback(async () => {
    if (isSearchByName) {
      router.push(`/student?role=${role}&student name=${searchString}`);
    } else {
      router.push(`/student?role=${role}&class name=${searchString}`);
    }
    setSearchString("");
  }, [searchString, isSearchByName, role, router]);

  return (
    <div className="flex gap-4 items-center mb-2">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch();
        }}
        className="flex items-center gap-2"
      >
        <label htmlFor="form--search-input">
          {isSearchByName ? "Search by Student Name" : "Search by Class Name"}
        </label>
        <input
          id="form--search-input"
          className="block border-2 border-slate-400 rounded px-2"
          type="text"
          value={searchString}
          onChange={(e) => setSearchString(e.target.value)}
          placeholder={`Enter ${
            isSearchByName ? "student name" : "class name"
          }`}
        />
        <button
          type="submit"
          className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-700 text-sm"
        >
          Search
        </button>

        <div>
          <Switch
            checked={isSearchByName}
            onChange={() => setIsSearchByName(!isSearchByName)}
            checkedChildren="N"
            unCheckedChildren="C"
          />
        </div>
      </form>
    </div>
  );
}
