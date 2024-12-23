import { StudentList } from "@/components/student-list";
import { AuthContext } from "@/contexts/auth.context";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";

interface Student {
  id: string;
  studentName: string;
  className: string;
}

export default function Page({
  students,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const { role } = useContext(AuthContext);

  useEffect(() => {
    if (role == null) {
      alert("Please select a role");
      router.replace("/");
    }
  });

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

export const getServerSideProps = (async ({ query }) => {
  let students: Student[] = [];

  const role = query["role"];
  const studentName = query["student name"];
  const className = query["class name"];

  if (studentName != null) {
    const res = await fetch(
      `http://localhost:3000/student/usingName?searchString=${studentName}`,
      {
        headers: [
          ["Authorization", `Bearer ${role}`],
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
          ["Authorization", `Bearer ${role}`],
          ["Content-Type", "application/json"],
        ],
      }
    );
    students = res.ok ? await res.json() : [];
  } else {
    const res = await fetch("http://localhost:3000/student/all", {
      headers: [["Authorization", `Bearer ${role}`]],
    });
    students = res.ok ? await res.json() : [];
  }

  return { props: { students } };
}) satisfies GetServerSideProps<{ students: Student[] }>;
