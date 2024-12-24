import { AuthContext } from "@/contexts/auth.context";
import { useRouter } from "next/router";
import { useCallback, useContext, useState } from "react";

export default function ClassUpdateForm() {
  const { role } = useContext(AuthContext);
  const [className, setClassName] = useState("");
  const router = useRouter();

  const id = router.query["id"];

  const submitClassUpdateForm = useCallback(async () => {
    const res = await fetch(`http://localhost:3000/class/${id}`, {
      method: "PATCH",
      headers: [
        ["Authorization", `Bearer ${role}`],
        ["Content-Type", "application/json"],
      ],
      body: JSON.stringify({
        className,
      }),
    });

    const resContent = await res.json();
    if (res.ok) {
      router.replace(`/class?role=${role}`);
      return;
    }

    alert(resContent.devMessage);
  }, [id, className, role, router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="flex justify-center text-2xl font-bold mb-4">
        Update Class Information
      </h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submitClassUpdateForm();
        }}
      >
        <label htmlFor="form--class-name">Class name</label>
        <input
          id="form--class-name"
          name="className"
          type="text"
          value={className}
          onChange={(e) => setClassName(e.target.value)}
          className="block w-full border-2 border-black rounded px-2 py-1 mb-2"
        />
        <input
          type="submit"
          value="Update Class"
          className="flex justify-end bg-green-500 text-white px-4 py-2 rounded hover:bg-green-800"
        />
      </form>
    </div>
  );
}
