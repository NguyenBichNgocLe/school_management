import { StudentList } from "@/components/student-list";
import Link from "next/link";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const studentName = (await searchParams)["student name"];
  const className = (await searchParams)["class name"];

  let students: Student[] = [];

  if (studentName != null) {
    const res = await fetch(
      `http://localhost:3000/student/usingName?searchString=${studentName}`,
      {
        headers: [
          ["Authorization", "Bearer admin"],
          ["Content-Type", "application/json"],
        ],
      }
    );
    students = res.ok ? await res.json() : [];
  } else if (className != null) {
    const res = await fetch(
      `http://localhost:3000/student/inOneClass?className=${className}`,
      {
        headers: [
          ["Authorization", "Bearer admin"],
          ["Content-Type", "application/json"],
        ],
      }
    );
    students = res.ok ? await res.json() : [];
  } else {
    const res = await fetch("http://localhost:3000/student/all", {
      headers: [["Authorization", "Bearer admin"]],
    });
    students = res.ok ? await res.json() : [];
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">All students</h1>
      <div className="flex justify-start">
        <Link
          href={"/student/create"}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-900"
        >
          Create New Student
        </Link>
      </div>
      <div className="flex justify-start mt-2">
        <Link
          href={"/"}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-900"
        >
          Back to Main Page
        </Link>
      </div>
      <StudentList initialData={students} />
    </div>
  );
}

interface Student {
  id: string;
  studentName: string;
  className: string;
}
