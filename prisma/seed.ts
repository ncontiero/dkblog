import { PrismaClient, type PostStatus, type Tag } from "@prisma/client";
import { slugify } from "@/utils/slugify";

const prisma = new PrismaClient();

type createUserProps = {
  externalId: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  image?: string;
  bio?: string;
  brandColor?: string;
};
type createPostProps = {
  title: string;
  description?: string | null;
  content: string;
  userId: string;
  status?: PostStatus;
  tags?: Tag[];
};
type createTagProps = {
  title: string;
  description?: string;
  image?: string;
  color?: string;
};

async function createUser(data: createUserProps) {
  return await prisma.user.create({
    data,
  });
}
async function createPost({ tags, ...props }: createPostProps) {
  return await prisma.post.create({
    data: {
      ...props,
      slug: slugify(props.title),
      tags: { connect: tags },
    },
  });
}
async function createTag(props: createTagProps) {
  return await prisma.tag.create({
    data: {
      ...props,
      slug: slugify(props.title),
    },
  });
}

async function main() {
  console.log("\n🌱Starting seeding...🌱\n");

  const user1 = await createUser({
    externalId: "1",
    username: "firstUser",
    firstName: "First",
    lastName: "User",
    email: "user1@email.com",
  });
  console.log(`Created user ${user1.id} successfully`);

  const user2 = await createUser({
    externalId: "2",
    username: "secondUser",
    firstName: "Second",
    lastName: "User",
    email: "user2@email.com",
  });
  console.log(`Created user ${user2.id} successfully`);

  const tag1 = await createTag({
    title: "JavaScript",
    image:
      "https://dev-to-uploads.s3.amazonaws.com/uploads/badge/badge_image/16/js-badge.png",
    description:
      "Once relegated to the browser as one of the 3 core technologies of the web, JavaScript can now be found almost anywhere you find code. JavaScript developers move fast and push software development forward; they can be as opinionated as the frameworks they use, so let's keep it clean here and make it a place to learn from each other!",
    color: "53 93% 54%",
  });
  console.log(`Created tag ${tag1.id} successfully`);

  const tag2 = await createTag({
    title: "React",
    image:
      "https://dev-to-uploads.s3.amazonaws.com/uploads/badge/badge_image/26/react-sticker.png",
    description:
      "React is a JavaScript library for building user interfaces. It is maintained by Facebook and a community of individual developers and companies. React can be used as a base in the development of single-page or mobile applications.",
    color: "193 95% 68%",
  });
  console.log(`Created tag ${tag2.id} successfully`);

  const tag3 = await createTag({
    title: "Next.js",
    image:
      "https://dev-to-uploads.s3.amazonaws.com/uploads/badge/badge_image/89/next-js-badge.pngg",
    description:
      "Next.js is an open-source web development framework created by Vercel. It is used to build single-page applications and is used to build server-side rendered applications.",
    color: "0 0% 0%",
  });
  console.log(`Created tag ${tag3.id} successfully`);

  const post1 = await createPost({
    title: "React Basics",
    description: "A short description of the post",
    content: "## Hello World\nThis is the content of the post",
    userId: user1.id,
    status: "PUBLISHED",
    tags: [tag1, tag2],
  });
  console.log(`Created post ${post1.id} successfully`);

  const post2 = await createPost({
    title: "Next.js Basics",
    description: "A short description of the post",
    content: "## Hello World\nThis is the content of the post",
    userId: user2.id,
    status: "PUBLISHED",
    tags: [tag3],
  });
  console.log(`Created post ${post2.id} successfully`);

  const post3 = await createPost({
    title: "JavaScript Basics",
    description: "A short description of the post",
    content: "## Hello World\nThis is the content of the post",
    userId: user2.id,
    status: "PUBLISHED",
    tags: [tag1],
  });
  console.log(`Created post ${post3.id} successfully`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
