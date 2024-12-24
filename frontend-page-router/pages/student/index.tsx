import { StudentList } from "@/components/student-list";
import { AuthContext } from "@/contexts/auth.context";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useContext, useEffect } from "react";
import { Table } from "antd";
import { ReloadOutlined } from "@ant-design/icons";

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

  const reloadPage = () => {
    router.push(`/student?role=${role}`);
  };

  const deleteStudent = useCallback(
    async (id: string) => {
      const res = await fetch(`http://localhost:3000/student/${id}`, {
        method: "DELETE",
        headers: [["Authorization", `Bearer ${role}`]],
      });

      if (!res.ok) {
        const resContent = await res.json();
        alert(resContent.devMessage);
        return;
      }

      router.replace(router.asPath);
    },
    [role, router]
  );

  useEffect(() => {
    if (role == null) {
      alert("Please select a role");
      router.replace("/");
    }
  });

  const columns = [
    {
      title: "Student name",
      dataIndex: "studentName",
      key: "studentName",
    },
    {
      title: "Class name",
      dataIndex: "className",
      key: "className",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Student) => (
        <div className="flex gap-2">
          <button className="px-3 py-1 rounded border bg-blue-400 hover:bg-blue-600">
            <Link href={{ pathname: `/student/${record.id}` }}>Details</Link>
          </button>
          <button className="px-3 py-1 rounded border bg-green-300 hover:bg-green-500">
            <Link href={{ pathname: `/student/update/${record.id}` }}>
              Update
            </Link>
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              deleteStudent(record.id);
            }}
            className="px-3 py-1 rounded border bg-red-400 hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-4 items-center justify-center h-screen">
      <div className="flex items-center gap-2">
        <h1 className="flex justify-center text-2xl font-bold">
          All Students
        </h1>
        <button
          onClick={reloadPage}
          className="flex items-center p-2 hover:bg-gray-200 active:bg-gray-300 rounded"
        >
          <ReloadOutlined style={{ fontSize: "12px" }} />
        </button>
      </div>

      <div className="mb-4">
        <button className="px-6 py-3 rounded bg-blue-500 text-white hover:bg-blue-700 mx-2">
          <Link href={{ pathname: "/student/create" }}>Create New Student</Link>
        </button>
        <button className="px-6 py-3 rounded bg-white text-gray-800 border border-gray-300 hover:bg-slate-400">
          <Link href={{ pathname: "/" }}>Back to Main Page</Link>
        </button>
      </div>
      <StudentList />
      <Table
        columns={columns}
        dataSource={students.map((stu) => ({ ...stu, key: stu.id }))}
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
}

export const getServerSideProps = (async ({ query }) => {
  let students: Student[] = [];

  const role = query["role"];
  const studentName = query["student name"];
  const className = query["class name"];

  console.log(studentName);
  console.log(className);

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
