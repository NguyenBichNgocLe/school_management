import { AuthContext, UpdateAuthContext } from "@/contexts/auth.context";
import { client } from "@/graphql";
import { gql, useMutation, useQuery } from "@apollo/client";
import { Table } from "antd";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useContext, useEffect, useState } from "react";

interface Class {
  id: string;
  className: string;
}

interface PaginatedClassResponse {
  data: Class[];
  total: number;
  currentPage: number;
  totalPages: number;
}

const GET_ALL_CLASSES = gql`
  query GetAllClasses($page: Int!, $limit: Int!) {
    getAllClass(page: $page, limit: $limit) {
      data {
        id
        className
      }
      total
      currentPage
      totalPages
    }
  }
`;

const DELETE_A_CLASS = gql`
  mutation DeleteClass($id: Int!) {
    deleteClass(id: $id) {
      id
      className
    }
  }
`;

export default function ClassPage({
  initialData,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const { role } = useContext(AuthContext);
  const [deleteClass] = useMutation(DELETE_A_CLASS);
  
  const [currentPage, setCurrentPage] = useState(1);
  useEffect(() => {
    if (!currentPage) {
      return;
    }

    router.replace(`/class?role=${role}&page=${currentPage}`);
  }, [currentPage, role]);

  const submitDeleteClass = useCallback(
    async (id: string) => {
      try {
        await deleteClass({
          variables: { id: parseInt(id as string) },
          context: {
            headers: {
              authorization: `Bearer ${role}`,
            },
          },
        });

        if (currentPage > 1 && initialData.data.length === 1) {
          setCurrentPage(currentPage - 1);
        } else {
          router.replace(router.asPath);
        }
      } catch (error) {
        if (error instanceof Error) {
          alert(error.message);
        } else {
          alert("An unexpected error orccurred.");
        }
      }
    },
    [initialData, role, deleteClass, currentPage, setCurrentPage]
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
              submitDeleteClass(record.id);
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
        dataSource={initialData.data.map((cls) => ({
          ...cls,
          key: cls.id,
        }))}
        pagination={{
          current: currentPage,
          pageSize: 5,
          total: initialData.total,
          onChange: (page) => setCurrentPage(page),
        }}
      />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<{
  initialData: PaginatedClassResponse;
}> = async (context) => {
  const role = context.query.role;
  const page = context.query.page ? parseInt(context.query.page as string) : 1;
  const { data } = await client.query({
    query: GET_ALL_CLASSES,
    variables: {
      page,
      limit: 5,
    },
    context: {
      headers: {
        authorization: `Bearer ${role}`,
      },
    },
    fetchPolicy: "no-cache",
  });

  return {
    props: {
      initialData: data.getAllClass,
    },
  };
};
