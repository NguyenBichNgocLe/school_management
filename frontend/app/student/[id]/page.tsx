interface Student {
  id: string;
  studentName: string;
  className: string;
}

export const revalidate = 60;

export const dynamicParams = true; 

export async function generateStaticParams() {
  const students: Student[] = await fetch("http://localhost:3000/student/all", {
    headers: [["Authorization", "Bearer admin"]],
  }).then((res) => res.json());

  return students.map((student) => ({
    id: String(student.id),
  }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const student: Student = await fetch(
    `http://localhost:3000/student/usingID/${id}`,
    {
      headers: [["Authorization", "Bearer admin"]],
    }
  ).then((res) => res.json());

  return (
    <div>
      {student.id} - {student.studentName} - {student.className}
    </div>
  );
}
