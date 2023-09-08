import { Elysia, t } from "elysia";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const app = new Elysia()
  .post(
    "/users",
    async ({ body }) =>
      await prisma.user.create({ data: { id: body.id, name: body.name } }),
    { body: t.Object({ id: t.String(), name: t.String() }) }
  )
  .get(
    "/events/:id",
    ({ params: { id } }) =>
      prisma.event.findFirstOrThrow({ where: { id: id } }),
    {
      params: t.Object({ id: t.Number() }),
      transform({ params }) {
        const id = parseInt(params.id + "");
        if (!Number.isNaN(id)) params.id = id;
      },
    }
  )
  .post("/events", ({ body }) => prisma.event.create({ data: body }), {
    body: t.Object({
      name: t.String(),
      description: t.String(),
      start: t.String(),
      end: t.String(),
      rsvp: t.String(),
      ownerId: t.String(),
    }),
  })
  .put(
    "/events/:id",
    ({ params: { id }, body }) =>
      prisma.event.update({ where: { id: id }, data: body }),
    {
      params: t.Object({ id: t.Number() }),
      body: t.Object({
        name: t.String(),
        description: t.String(),
        start: t.String(),
        end: t.String(),
        rsvp: t.String(),
        ownerId: t.String(),
      }),
      transform({ params }) {
        const id = parseInt(params.id + "");
        if (!Number.isNaN(id)) params.id = id;
      },
    }
  )
  .delete(
    "/events/:id",
    ({ params: { id } }) => prisma.event.delete({ where: { id: id } }),
    {
      params: t.Object({ id: t.Number() }),
      transform({ params }) {
        const id = parseInt(params.id + "");
        if (!Number.isNaN(id)) params.id = id;
      },
    }
  )
  .put(
    "/events/:id/toggleJoin",
    async ({ params: { id }, body }) => {
      const hasJoined =
        (await prisma.eventParticipants.count({
          where: { eventId: id, userId: body.userId },
        })) > 0;

      if (hasJoined) {
        await prisma.eventParticipants.deleteMany({
          where: { eventId: id, userId: body.userId },
        });
        return;
      }

      await prisma.eventParticipants.create({
        data: { eventId: id, userId: body.userId },
      });
    },
    {
      params: t.Object({ id: t.Number() }),
      body: t.Object({ userId: t.String() }),
      transform({ params }) {
        const id = parseInt(params.id + "");
        if (!Number.isNaN(id)) params.id = id;
      },
    }
  )
  .listen(3000);

/*
id    Int     @id @default(autoincrement())
  name String  @unique
  description  String?
  start String
  end String?
  rsvp String?
  participants EventParticipants[]
  owner User @relation(fields: [ownerId], references: [id])
  ownerId String
*/

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
