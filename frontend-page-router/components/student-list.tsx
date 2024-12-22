import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

interface Student {
  id: string;
  studentName: string;
  className: string;
}

export interface StudentListProps {
  initialData: Student[];
}

export function StudentList(props: StudentListProps) {
  const router = useRouter();
  const [studentSearchString, setStudentSearchString] = useState("");
  const [classNameSearchString, setClassNameSearchString] = useState("");

  const submitStudentSearchByName = useCallback(async () => {
    router.push(`/student?student name=${studentSearchString}`);
    setStudentSearchString("");
  }, [studentSearchString]);

  const submitStudentSearchByClassName = useCallback(async () => {
    router.push(`/student?class name=${classNameSearchString}`);
    setClassNameSearchString("");
  }, [classNameSearchString]);

  return (
    <div>
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

      <ul>
        {props.initialData.map((s, index) => (
          <Link key={`student-${index}`} href={`student/${s.id}`}>
            <li className="hover:bg-slate-400">
              {s.className} - {s.studentName}
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
}
