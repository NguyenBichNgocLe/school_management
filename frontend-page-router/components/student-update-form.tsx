import { AuthContext } from "@/contexts/auth.context";
import { client } from "@/graphql";
import { gql, useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import { useCallback, useContext, useEffect, useState } from "react";

interface StudentClass {
  id: number;
  className: string;
}

const GET_ALL_CLASSES = gql`
  query {
    getAllClass {
      id
      className
    }
  }
`;

const UPDATE_STUDENT = gql`
  mutation UpdateStudent($id: Int!, $classId: Int, $studentName: String) {
    updateStudent(
      id: $id
      updateStudentDto: { classId: $classId, studentName: $studentName }
    ) {
      id
      studentName
      cls { className }
    }
  }
`;

export default function StudentUpdateForm() {
  const { role } = useContext(AuthContext);
  const [className, setClassName] = useState("");
  const [studentName, setStudentName] = useState("");
  const router = useRouter();
  const [updateStudent] = useMutation(UPDATE_STUDENT);

  const [classes, setClasses] = useState<StudentClass[]>([]);

  useEffect(() => {
    client
      .query({
        query: GET_ALL_CLASSES,
        context: {
          headers: {
            authorization: `Bearer ${role}`,
          },
        },
        fetchPolicy: "no-cache",
      })
      .then(({ data }) => setClasses(data.getAllClass));
  }, [setClasses]);

  const id = router.query["id"];

  const submitStudentUpdateForm = useCallback(async () => {
    let classId = null;
    if (className !== "") {
      classId = classes.find(
        (cls) => cls.className.toLowerCase() === className.toLowerCase()
      )?.id;

      if (classId == null) {
        return alert("The input class does not exist");
      }
    }

    try {
      await updateStudent({
        variables: {
          id: parseInt(id as string),
          classId: classId === null ? undefined : classId,
          studentName: studentName === "" ? undefined : studentName,
        },
        context: {
          headers: {
            authorization: `Bearer ${role}`,
          },
        },
      });
      router.replace(`/student?role=${role}`);
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("An unexpected error orccurred.");
      }
    }
  }, [id, studentName, className, role, router, updateStudent]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="flex justify-center text-2xl font-bold mb-4">
        Update Student Information
      </h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submitStudentUpdateForm();
        }}
      >
        <label htmlFor="form--student-name">Student name</label>
        <input
          id="form--student-name"
          name="studentName"
          type="text"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
          className="block w-full border-2 border-black rounded px-2 py-1 mb-2"
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
          value="Update Student"
          className="flex justify-end bg-green-500 text-white px-4 py-2 rounded hover:bg-green-900"
        />
      </form>
    </div>
  );
}
