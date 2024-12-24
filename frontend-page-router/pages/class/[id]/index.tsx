import { GetStaticPaths, GetStaticProps } from "next";
import { Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";

interface Class {
  id: string;
  className: string;
}

interface PageProps {
  schoolClass: Class;
}

export default function Page({ schoolClass }: PageProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="text-3xl font-bold mb-8 text-center">
        Class Information
      </div>

      <div className="flex flex-row items-center bg-white p-6 rounded shadow-md max-w-xl w-full">
        <div className="mr-6">
          <Avatar size={64} icon={<UserOutlined />} />
        </div>
        <div>
          <div className="text-lg font-semibold text-gray-700">
            Class ID: <span className="font-normal">{schoolClass.id}</span>
          </div>
          <div className="text-lg font-semibold text-gray-700 mt-2">
            Class name: <span className="font-normal">{schoolClass.className}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const schooClasses: Class[] = await fetch("http://localhost:3000/class/all", {
    headers: [["Authorization", "Bearer admin"]],
  }).then((res) => res.json());

  return {
    paths: schooClasses.map((c) => ({
      params: {
        id: String(c.id),
      },
    })),
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps<PageProps> = async ({ params }) => {
  const schoolClass: Class = await fetch(
    `http://localhost:3000/class/usingID/${params?.id}`,
    {
      headers: [["Authorization", "Bearer admin"]],
    }
  ).then((res) => res.json());

  return {
    props: {
      schoolClass,
    },
    revalidate: 60,
  };
};
