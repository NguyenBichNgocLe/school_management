import { StudentList } from "@/components/student-list";
import { AuthContext } from "@/contexts/auth.context";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useContext, useEffect } from "react";
import { Table } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import { gql, useMutation, useQuery } from "@apollo/client";
import { client } from "@/graphql";

interface Student {
  id: string;
  studentName: string;
  className: string;
}

const GET_ALL_STUDENTS = gql`
  query {
    getAllStudents {
      id
      studentName
      cls {
        className
      }
    }
  }
`;

const GET_STUDENTS_IN_SAME_CLASS = gql`
  query GetStudentsInSameClass($className: String!) {
    getStudentInSameClass(className: $className) {
      id
      studentName
      cls {
        className
      }
    }
  }
`;

const FILTER_STUDENT_BY_NAME = gql`
  query FilterStudents($searchString: String!) {
    filterStudents(searchString: $searchString) {
      id
      studentName
      cls {
        className
      }
    }
  }
`;

const DELETE_A_STUDENT = gql`
  mutation DeleteStudent($id: Int!) {
    deleteStudent(id: $id) {
      id
      studentName
      cls {
        className
      }
    }
  }
`;

export default function Page({
  students,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const { role } = useContext(AuthContext);
  const [deleteStudent] = useMutation(DELETE_A_STUDENT);

  const reloadPage = () => {
    router.push(`/student?role=${role}`);
  };

  const submitDeleteStudent = useCallback(
    async (id: string) => {
      try {
        await deleteStudent({
          variables: { id: parseInt(id as string) },
          context: {
            headers: {
              authorization: `Bearer ${role}`,
            },
          },
          refetchQueries: [GET_ALL_STUDENTS],
        });
        router.replace(router.asPath);
      } catch (error) {
        if (error instanceof Error) {
          alert(error.message);
        } else {
          alert("An unexpected error orccurred.");
        }
      }
    },
    [role, router, deleteStudent]
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
              submitDeleteStudent(record.id);
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
        <h1 className="flex justify-center text-2xl font-bold">All Students</h1>
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
        dataSource={students?.map((stu) => ({ ...stu, key: stu.id })) || []}
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

  try {
    if (studentName != null) {
      const { data } = await client.query({
        query: FILTER_STUDENT_BY_NAME,
        variables: { searchString: studentName },
        context: {
          headers: {
            authorization: `Bearer ${role}`,
          },
        },
        fetchPolicy: "no-cache",
        errorPolicy: "all",
      });

      students =
        data?.filterStudents?.map((student: any) => ({
          ...student,
          className: student.cls?.className || "No Class",
        })) || [];
    } else if (className != null) {
      const { data } = await client.query({
        query: GET_STUDENTS_IN_SAME_CLASS,
        variables: { className },
        context: {
          headers: {
            authorization: `Bearer ${role}`,
          },
        },
        fetchPolicy: "no-cache",
        errorPolicy: "all",
      });

      students =
        data?.getStudentInSameClass?.map((student: any) => ({
          ...student,
          className: student.cls?.className || "No Class",
        })) || [];
    } else {
      const { data } = await client.query({
        query: GET_ALL_STUDENTS,
        context: {
          headers: {
            authorization: `Bearer ${role}`,
          },
        },
        fetchPolicy: "no-cache",
        errorPolicy: "all",
      });

      students =
        data?.getAllStudents?.map((student: any) => ({
          ...student,
          className: student.cls?.className || "No Class",
        })) || [];
    }
  } catch (error) {
    console.error("Error fetching students: ", error);
    students = [];
  }

  return { props: { students } };
}) satisfies GetServerSideProps<{ students: Student[] }>;
