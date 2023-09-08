import { Elysia } from "elysia";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

const app = new Elysia().get("/", () => prisma.user.create({data:{id:"2134",name:"john"}})).listen(3000);



console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
