import { Elysia, t } from "elysia";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const app = new Elysia()
  .model({
    event: t.Object({
      name: t.String(),
      description: t.String(),
      start: t.String(),
      end: t.Union([t.Null(), t.String()]),
      rsvp: t.Union([t.Null(), t.String()]),
      ownerId: t.String(),
    }),
    user: t.Object({ name: t.String() }),
  })
  .post(
    "/users",
    async ({ body }) => {
      const exists =
        (await prisma.user.count({ where: { name: body.name } })) > 0;
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
    "/events/:id/toggle-join",
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
  .get(
    "/events/:id/slack-message",
    async ({ params }) => {
      const event = await prisma.event.findFirstOrThrow({
        where: { id: params.id },
      });

      const openAiResponse = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            authorization: `Bearer ${process.env.OPENAI_TOKEN}`,
            accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "user",
                content: `The following is a danish description for an event. Please write a danish motivational slack message containing a lot of emojis etc. so people want to join. \\n ${event.description}`,
              },
            ],
          }),
        }
      );

      return (await openAiResponse.json()).choices[0].message.content;
    },
    {
      params: t.Object({ id: t.Number() }),
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
