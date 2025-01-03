import { GetStaticPaths, GetStaticProps } from "next";
import { Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { gql } from "@apollo/client";
import { client } from "@/graphql";

interface Class {
  id: string;
  className: string;
}

interface PageProps {
  schoolClass: Class | null;
}

export const GET_ALL_CLASSES = gql`
  query {
    getAllClass {
      id
      className
    }
  }
`;

export const GET_CLASS_USING_ID = gql`
  query getClassUsingID($id: Int!) {
    getClassById(id: $id) {
      id
      className
    }
  }
`;

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
            Class ID: <span className="font-normal">{schoolClass?.id}</span>
          </div>
          <div className="text-lg font-semibold text-gray-700 mt-2">
            Class name:{" "}
            <span className="font-normal">{schoolClass?.className}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const { data } = await client.query({
    query: GET_ALL_CLASSES,
    context: {
      headers: {
        authorization: `Bearer admin`,
      },
    },
    fetchPolicy: "network-only",
  });

  const schoolClasses = data?.getAllClass || [];

  return {
    paths: schoolClasses.map((c: Class) => ({
      params: {
        id: String(c.id),
      },
    })),
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps<PageProps> = async ({ params }) => {

  const { data, error } = await client.query({
    query: GET_CLASS_USING_ID,
    variables: { id: parseInt(params?.id as string) },
    context: {
      headers: {
        authorization: `Bearer admin`,
      },
    },
  });

  if (error != null) {
    alert(error.message);
    return {
      props: { schoolClass: null },
      revalidate: 60,
    };
  }

  return {
    props: {
      schoolClass: data?.getClassById,
    },
    revalidate: 60,
  };
};
