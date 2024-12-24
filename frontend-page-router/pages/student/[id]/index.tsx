import { GetStaticPaths, GetStaticProps } from "next";
import { Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";

interface Student {
  id: string;
  studentName: string;
  className: string;
}

interface PageProps {
  student: Student;
}

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
            Student name: <span className="font-normal">{student.studentName}</span>
          </div>
          <div className="text-lg font-semibold text-gray-700 mt-2">
            Class: <span className="font-normal">{student.className}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const students: Student[] = await fetch("http://localhost:3000/student/all", {
    headers: [["Authorization", "Bearer admin"]],
  }).then((res) => res.json());

  return {
    paths: students.map((student) => ({
      params: {
        id: String(student.id),
      },
    })),
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps<PageProps> = async ({ params }) => {
  const student: Student = await fetch(
    `http://localhost:3000/student/usingID/${params?.id}`,
    {
      headers: [["Authorization", "Bearer admin"]],
    }
  ).then((res) => res.json());

  return {
    props: {
      student,
    },
    revalidate: 60,
  };
};
