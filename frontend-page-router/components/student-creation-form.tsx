import { AuthContext } from "@/contexts/auth.context";
import { useRouter } from "next/navigation";
import { useCallback, useContext, useEffect, useState } from "react";

interface StudentClass {
  id: number;
  className: string;
}

export default function StudentCreationForm() {
  const { role } = useContext(AuthContext);
  const [studentName, setStudentName] = useState("");
  const [className, setClassName] = useState("");
  const router = useRouter();

  const [classes, setClasses] = useState<StudentClass[]>([]);
  useEffect(() => {
    fetch("http://localhost:3000/class/all", {
      headers: [["Authorization", `Bearer ${role}`]],
    })
      .then((res) => (res.ok ? res.json() : []))
      .then((classes) => setClasses(classes));
  }, [setClasses]);

  const submitStudentCreationForm = useCallback(async () => {
    const classId = classes.find(
      (cls) => cls.className.toLowerCase() === className.toLowerCase()
    )?.id;

    if (classId == null) {
      return alert("The input class does not exist");
    }

    const res = await fetch("http://localhost:3000/student", {
      method: "POST",
      headers: [
        ["Authorization", `Bearer ${role}`],
        ["Content-Type", "application/json"],
      ],
      body: JSON.stringify({
        studentName,
        classId,
      }),
    });

    const resContent = await res.json();
    if (res.ok) {
      router.replace(`/student?role=${role}`);
      return;
    }

    alert(resContent.devMessage);
  }, [studentName, className]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="flex justify-center text-2xl font-bold mb-4">
        Create A New Student
      </h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submitStudentCreationForm();
        }}
      >
        <label htmlFor="form--student-name">Student name</label>
        <input
          id="form--student-name"
          className="block w-full border-2 border-black rounded px-2 py-1 mb-2"
          name="studentName"
          type="text"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
        />

        <label htmlFor="form--class-name">Class name</label>
        <input
          id="form--class-name"
          className="block w-full border-2 border-black rounded px-2 py-1 mb-3"
          name="className"
          type="text"
          value={className}
          onChange={(e) => setClassName(e.target.value)}
        />

        <input
          type="submit"
          value="Create Student"
          className="flex justify-end bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-900"
        />
      </form>
    </div>
  );
}
