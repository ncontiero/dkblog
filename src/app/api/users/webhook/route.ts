import type { WebhookEvent } from "@clerk/nextjs/server";

import { Webhook } from "svix";
import { randomBytes } from "node:crypto";
import { headers } from "next/headers";
import { env } from "@/env.mjs";
import { errorResponse } from "@/utils/errorResponse";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = env.CLERK_WEBHOOK_SIGNING_SECRET;

  // Get the headers
  const headerPayload = headers();
  const svixId = headerPayload.get("svix-id");
  const svixTimestamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svixId || !svixTimestamp || !svixSignature) {
    const errMessages = "Error occurred -- no svix headers";
    return errorResponse(errMessages, [errMessages]);
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new SVIX instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    const errMessages = "Error occurred -- could not verify webhook";
    return errorResponse(errMessages, [errMessages]);
  }

  // Get the ID and type
  const eventType = evt.type;
  try {
    switch (eventType) {
      case "user.created":
      case "user.updated": {
        const username =
          evt.data.username || `user_${randomBytes(15).toString("hex")}`;
        const emails = evt.data.email_addresses;

        if (emails.length === 0) {
          throw new Error("No email address provided");
        }

        const data = {
          externalId: evt.data.id,
          email: emails[0].email_address,
          username,
          firstName: evt.data.first_name,
          lastName: evt.data.last_name,
          image: evt.data.image_url,
        };
        await prisma.user.upsert({
          where: { externalId: evt.data.id },
          create: data,
          update: data,
        });
        break;
      }
      case "user.deleted": {
        await prisma.user.delete({ where: { externalId: evt.data.id } });
        break;
      }
      default:
        throw new Error("Unknown or unaccepted event");
    }
  } catch (err) {
    console.error("Error processing webhook:", err);
    return errorResponse(err, [
      "Unknown or unaccepted event",
      "No email address provided",
    ]);
  }

  return new Response("", { status: 201 });
}
