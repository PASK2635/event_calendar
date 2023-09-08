import { Elysia, t } from "elysia";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const app = new Elysia()
  .post("/user", ({ body }) =>
    prisma.user.create({ data: { id: body.id, name: body.name } })
  )
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
