import { AuthContext } from "@/contexts/auth.context";
import { useRouter } from "next/navigation";
import { useCallback, useContext, useState } from "react";

export function StudentList() {
  const { role } = useContext(AuthContext);
  const router = useRouter();
  const [studentSearchString, setStudentSearchString] = useState("");
  const [classNameSearchString, setClassNameSearchString] = useState("");

  const submitStudentSearchByName = useCallback(async () => {
    router.push(`/student?role=${role}&student name=${studentSearchString}`);
    setStudentSearchString("");
  }, [studentSearchString]);

  const submitStudentSearchByClassName = useCallback(async () => {
    router.push(`/student?role=${role}&class name=${classNameSearchString}`);
    setClassNameSearchString("");
  }, [classNameSearchString]);

  return (
    // TODO: UPDATE FOR BETTER UI
    <div className="flex gap-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submitStudentSearchByName();
        }}
      >
        <label htmlFor="form--search-by-name">Search</label>
        <input
          id="form--search-by-name"
          className="block border-2 border-black rounded px-2"
          type="text"
          value={studentSearchString}
          onChange={(e) => setStudentSearchString(e.target.value)}
        />
      </form>

      <form
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
      </form>
    </div>
  );
}
