import { PrismaClient, Prisma } from "@prisma/client";
import { genSalt, hash } from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("Start seeeing");
  const salt = await genSalt(10);

  const userData: Prisma.UserCreateInput[] = [
    {
      username: "agus",
      email: "agus@mail.com",
      password: await hash("password1", salt),
      Post: {
        create: {
          title: "Frieren",
          imageUrl: "https://i.pinimg.com/736x/93/07/53/930753c37e9dc070a1da739b1b2de9ea.jpg",
          description: "frieren image",
        },
      },
    },
    {
      username: "nacha",
      email: "nacha@mail.com",
      password: await hash("password2", salt),
      Post: {
        create: {
          title: "cars",
          imageUrl: "https://i.pinimg.com/736x/6a/d8/8a/6ad88ae2aad1f197a08731f932eb2ca2.jpg",
          description: "cars Image",
        },
      },
    },
    {
      username: "kelvin",
      email: "kelvin@mail.com",
      password: await hash("password3", salt),
      Post: {
        create: {
          title: "cars",
          imageUrl: "https://i.pinimg.com/736x/6a/d8/8a/6ad88ae2aad1f197a08731f932eb2ca2.jpg",
          description: "cars Image",
        },
      },
    },
  ];

  for (const u of userData) {
    const user = await prisma.user.create({
      data: u,
    });
    console.log(`succesfully create user with id ${user.id}`);
  }
  console.log("seeding data finished!");
}

main()
  .catch((e) => {
    console.error(e.message);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
