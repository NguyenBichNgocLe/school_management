import { GetStaticPaths, GetStaticProps } from "next";

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
    <div>
      {student.id} - {student.studentName} - {student.className}
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
    fallback: 'blocking',
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
