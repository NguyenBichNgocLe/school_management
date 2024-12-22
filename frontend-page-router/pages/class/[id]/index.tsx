import { GetStaticPaths, GetStaticProps } from "next";

interface Class {
  id: string;
  className: string;
}

interface PageProps {
  schoolClass: Class;
}

export default function Page({ schoolClass }: PageProps) {
  return (
    <div>
      {schoolClass.id} - {schoolClass.className}
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
