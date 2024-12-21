interface Class {
  id: string;
  className: string;
}

export const revalidate = 60;

export const dynamicParams = true;

export async function generateStaticParams() {
  const classes: Class[] = await fetch("http://localhost:3000/class/all", {
    headers: [["Authorization", "Bearer admin"]],
  }).then((res) => res.json());

  return classes.map((c) => ({
    id: String(c.id),
  }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
    const id = (await params).id;
    const cls: Class = await fetch(`http://localhost:3000/class/usingID/${id}`,
        {
            headers: [["Authorization", "Bearer admin"]],
        }
    ).then((res) => res.json());

    return (
        <div>
            {cls.id} - {cls.className}
        </div>
    );
}
