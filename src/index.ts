import { Elysia, t } from "elysia";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const app = new Elysia()
  .model({
    event: t.Object({
      name: t.String(),
      description: t.String(),
      start: t.Date(),
      end: t.Union([t.Null(), t.Date()]),
      rsvp: t.Union([t.Null(), t.Date()]),
      ownerId: t.String(),
    }),
    user: t.Object({ id: t.String(), name: t.String() }),
  })
  .post(
    "/users",
    async ({ body }) => {
      const exists = (await prisma.user.count({ where: { id: body.id } })) > 0;
      if (exists) return body;
      return await prisma.user.create({ data: body });
    },
    { body: "user" }
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
  .get("/events", () => prisma.event.findMany())
  .post("/events", ({ body }) => prisma.event.create({ data: body }), {
    body: "event",
  })
  .put(
    "/events/:id",
    ({ params: { id }, body }) =>
      prisma.event.update({ where: { id: id }, data: body }),
    {
      params: t.Object({ id: t.Number() }),
      body: "event",
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

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
