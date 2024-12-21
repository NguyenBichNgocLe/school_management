import { ClassList } from "@/components/class-list";
import Link from "next/link";

export default async function ClassPage() {
  let classes: Class[] = [];
  const res = await fetch("http://localhost:3000/class/all", {
    headers: [["Authorization", "Bearer admin"]],
  });
  classes = res.ok ? await res.json() : [];

  return (
    <div>
      <h1 className="flex justify-center text-2xl font-bold">All classes</h1>
      <div className="flex justify-end mb-2 mt-2">
        <Link
          href={"/class/create"}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-900"
        >
          Create New Class
        </Link>
      </div>
      <ClassList initialData={classes} />
    </div>
  );
}

interface Class {
  id: string;
  className: string;
}
