// import { ClassList } from "@/components/class-list";
import {
  AuthContext,
  RoleType,
  UpdateAuthContext,
} from "@/contexts/auth.context";
import { Table } from "antd";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useContext, useEffect } from "react";

interface Class {
  id: string;
  className: string;
}

export default function ClassPage({
  classes,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const { role } = useContext(AuthContext);
  const updateAuthContext = useContext(UpdateAuthContext);

  const deleteClass = useCallback(
    async (id: string) => {
      const res = await fetch(`http://localhost:3000/class/${id}`, {
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
      title: "Class name",
      dataIndex: "className",
      key: "className",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Class) => (
        <div className="flex gap-2">
          <button className="px-3 py-1 rounded border bg-blue-400 hover:bg-blue-600">
            <Link href={{ pathname: `/class/${record.id}` }}>Details</Link>
          </button>
          <button className="px-3 py-1 rounded border bg-green-300 hover:bg-green-500">
            <Link href={{ pathname: `/class/update/${record.id}` }}>
              Update
            </Link>
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              deleteClass(record.id);
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
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="flex justify-center text-2xl font-bold mb-4">
        All Classes
      </h1>
      <div className="mb-4">
        <button className="px-6 py-3 rounded bg-blue-500 text-white hover:bg-blue-700 mx-2">
          <Link href={{ pathname: "/class/create" }}>Create New Class</Link>
        </button>
        <button className="px-6 py-3 rounded bg-white text-gray-800 border border-gray-300 hover:bg-slate-400">
          <Link href={{ pathname: "/" }}>Back to Main Page</Link>
        </button>
      </div>
      <Table
        columns={columns}
        dataSource={classes.map((cls) => ({ ...cls, key: cls.id }))}
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
}

export const getServerSideProps = (async (context) => {
  const { role } = context.query;
  let classes: Class[] = [];

  const res = await fetch("http://localhost:3000/class/all", {
    headers: [["Authorization", `Bearer ${role}`]],
  });
  classes = res.ok ? await res.json() : [];
  return { props: { classes } };
}) satisfies GetServerSideProps<{
  classes: Class[];
}>;
