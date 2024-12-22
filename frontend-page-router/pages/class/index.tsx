import { ClassList } from "@/components/class-list";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Link from "next/link";

interface Class {
  id: string;
  className: string;
}

export default function ClassPage({
  classes,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <div>
      <h1 className="flex justify-center text-2xl font-bold">All classes</h1>
      <div className="flex justify-center mb-2 mt-2">
        <Link
          href={"/class/create"}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-900"
        >
          Create New Class
        </Link>
      </div>
      <div className="flex justify-start mb-2 mt-2">
        <Link
          href={"/"}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-900"
        >
          Back to Main Page
        </Link>
      </div>
      <ClassList initialData={classes} />
    </div>
  );
}

export const getServerSideProps = (async () => {
  let classes: Class[] = [];
  const res = await fetch("http://localhost:3000/class/all", {
    headers: [["Authorization", "Bearer admin"]],
  });
  classes = res.ok ? await res.json() : [];
  return { props: { classes } };
}) satisfies GetServerSideProps<{ classes: Class[] }>;
