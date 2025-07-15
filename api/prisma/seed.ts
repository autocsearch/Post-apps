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
    },
    {
      username: "nacha",
      email: "nacha@mail.com",
      password: await hash("password2", salt),
    },
    {
      username: "kelvin",
      email: "kelvin@mail.com",
      password: await hash("password3", salt),
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
