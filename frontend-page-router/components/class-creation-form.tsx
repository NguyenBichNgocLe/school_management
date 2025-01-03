import { AuthContext } from "@/contexts/auth.context";
import { gql, useMutation } from "@apollo/client";
import { useRouter } from "next/navigation";
import { useCallback, useContext, useState } from "react";

const ADD_CLASS = gql`
  mutation AddClass($className: String!) {
    addClass(createClassDto: { className: $className }) {
      id
      className
    }
  }
`;

export default function ClassCreationForm() {
  const { role } = useContext(AuthContext);
  const [className, setClassName] = useState("");
  const router = useRouter();
  const [addClass] = useMutation(ADD_CLASS);

  const submitClassCreationForm = useCallback(async () => {
    try {
      await addClass({
        variables: { className },
        context: {
          headers: {
            authorization: `Bearer ${role}`,
          },
        },
      });

      router.replace(`/class?role=${role}`);
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("An unexpected error orccurred.");
      }
    }
  }, [role, className, router, addClass]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="flex justify-center text-2xl font-bold mb-4">
        Create A New Class
      </h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submitClassCreationForm();
        }}
      >
        <label htmlFor="form--class-name">Class name</label>
        <input
          id="form--class-name"
          className="block w-full border-2 border-black rounded px-2 py-1 mb-2"
          name="className"
          type="text"
          value={className}
          onChange={(e) => setClassName(e.target.value)}
        />

        <input
          type="submit"
          value="Create Class"
          className="flex justify-end bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-900"
        />
      </form>
    </div>
  );
}
