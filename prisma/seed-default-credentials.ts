import { Prisma, PrismaClient } from "@prisma/client";
import { hash } from "argon2";
import slugify from "slugify";

let database: PrismaClient | null = null;
if (process.env.NODE_ENV === "production") {
  database = new PrismaClient();
} else {
  if (!database) {
    database = new PrismaClient();
  }
  database = database;
}

const administratorAccount: (p: string) => any = (password: string) => {
  return [
    {
      fullname: "Oussama Jaaouani",
      email: "oussama.jaaouani@nokta.dev",
      password: password,
      organizations: {
        create: {
          name: "NOKTA Technologies LLC",
          address_line_1: "1309 Coffeen Avenue",
          address_line_2: "STE 1200",
          city: "Sheridan",
          zipOrPostcode: "82801",
          stateOrProvinceOrCounty: "Wyoming",
          country: {
            create: {
              name: "United States",
              slug: slugify("United States".toLocaleLowerCase()),
            },
          },
        },
      },
    },
  ];
};

async function main() {
  const password = await hash("password2022@@");
  for (let a of administratorAccount(password)) {
    const account = await database?.user.create({ data: a });
  }
}

main()
  .then(async () => {
    await database?.$disconnect();
  })
  .catch(async (error) => {
    console.log(error);
    await database?.$disconnect();
    process.exit(1);
  });
