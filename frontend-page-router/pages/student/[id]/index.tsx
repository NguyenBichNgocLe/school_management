import { GetStaticPaths, GetStaticProps } from "next";
import { Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { gql } from "@apollo/client";
import { client } from "@/graphql";

interface Student {
  id: string;
  studentName: string;
  cls: {
    id: number;
    className: string;
  };
}

interface PageProps {
  student: Student;
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

const GET_STUDENT_USING_ID = gql`
  query getStudentUsingID($id: Int!) {
    getStudentById(id: $id) {
      id
      studentName
      cls { id className }
    }
  }
`;

export default function Page({ student }: PageProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="text-3xl font-bold mb-8 text-center">
        Student Information
      </div>

      <div className="flex flex-row items-center bg-white p-6 rounded shadow-md max-w-xl w-full">
        <div className="mr-6">
          <Avatar size={64} icon={<UserOutlined />} />
        </div>
        <div>
          <div className="text-lg font-semibold text-gray-700">
            Student ID: <span className="font-normal">{student.id}</span>
          </div>
          <div className="text-lg font-semibold text-gray-700 mt-2">
            Student name:{" "}
            <span className="font-normal">{student.studentName}</span>
          </div>
          <div className="text-lg font-semibold text-gray-700 mt-2">
            Class: <span className="font-normal">{student.cls.className}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const { data } = await client.query({
    query: GET_ALL_STUDENTS,
    context: {
      headers: {
        authorization: `Bearer admin`,
      },
    },
    fetchPolicy: "no-cache",
  });
  const students = data?.getAllStudents ?? [];

  return {
    paths: students.map((student: Student) => ({
      params: {
        id: String(student.id),
      },
    })),
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps<PageProps> = async ({ params }) => {
  const { data, error } = await client.query({
    query: GET_STUDENT_USING_ID,
    variables: { id: parseInt(params?.id as string) },
    context: {
      headers: {
        authorization: `Bearer admin`,
      },
    },
    fetchPolicy: "no-cache",
  });

  if(error) {
    alert(error.message);
    return {
      props: { student: null},
      revalidate: 60,
    };
  }

  return {
    props: {
      student: {
        ...data.getStudentById,
      },
    },
    revalidate: 60,
  };
};
