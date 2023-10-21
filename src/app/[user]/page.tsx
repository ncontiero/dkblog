type Props = {
  params: { user: string };
};

export default function UserPage({ params }: Props) {
  return <h1>Hello {params.user}</h1>;
}
