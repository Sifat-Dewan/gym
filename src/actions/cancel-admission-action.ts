"use server";

import { currentUser } from "@/lib/current-user";
import db from "@/lib/db";

export async function cancelAdmission() {
  const user = await currentUser();

  if (!user) {
    return {
      error: "Unauthenticated",
    };
  }

  const member = await db.member.findFirst({
    where: {
      email: user.email,
    },
  });

  if (!member) {
    return { error: "Member not found" };
  }

  await db.member.delete({
    where: {
      id: member.id,
    },
  });

  return { success: "Admission was canceled!" };
}
