import { AuthContext } from "@/contexts/auth.context";
import { useRouter } from "next/navigation";
import { Switch } from "antd";
import { useCallback, useContext, useState } from "react";

export function StudentList() {
  const { role } = useContext(AuthContext);
  const router = useRouter();
  // const [studentSearchString, setStudentSearchString] = useState("");
  // const [classNameSearchString, setClassNameSearchString] = useState("");
  const [searchString, setSearchString] = useState("");
  const [isSearchByName, setIsSearchByName] = useState(true);

  // const submitStudentSearchByName = useCallback(async () => {
  //   router.push(`/student?role=${role}&student name=${studentSearchString}`);
  //   setStudentSearchString("");
  // }, [studentSearchString]);

  // const submitStudentSearchByClassName = useCallback(async () => {
  //   router.push(`/student?role=${role}&class name=${classNameSearchString}`);
  //   setClassNameSearchString("");
  // }, [classNameSearchString]);

  const handleSearch = useCallback(async () => {
    if (isSearchByName) {
      router.push(`/student?role=${role}&student name=${searchString}`);
    } else {
      router.push(`/student?role=${role}&class name=${searchString}`);
    }
    setSearchString("");
  }, [searchString, isSearchByName, role, router]);

  return (
    <div className="flex gap-4 items-center">
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
          className="block border-2 border-black rounded px-2"
          type="text"
          value={searchString}
          onChange={(e) => setSearchString(e.target.value)}
          placeholder={`Enter ${
            isSearchByName ? "student name" : "class name"
          }`}
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
        >
          Search
        </button>

        <div>
          <Switch
            checked={isSearchByName}
            onChange={() => setIsSearchByName(!isSearchByName)}
            checkedChildren="By Name"
            unCheckedChildren="By Class"
          />
        </div>
      </form>

      {/* <form
        onSubmit={(e) => {
          e.preventDefault();
          submitStudentSearchByClassName();
        }}
      >
        <label htmlFor="form--search-by-class">Search by class name</label>
        <input
          id="form--search-by-class"
          className="block border-2 border-black rounded px-2"
          type="text"
          value={classNameSearchString}
          onChange={(e) => setClassNameSearchString(e.target.value)}
        />
      </form> */}
    </div>
  );
}
