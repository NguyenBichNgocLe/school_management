import Link from "next/link";

export default function Home() {
  return (
    <div>
      <div className="flex justify-center mt-4 mb-2">
        <Link
          href={"/class"}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-900"
        >
          Classes
        </Link>
      </div>
      <div className="flex justify-center">
        <Link
          href={"/student"}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-900"
        >
          Students
        </Link>
      </div>
    </div>
  );
}
