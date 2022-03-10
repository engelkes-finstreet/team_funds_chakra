import prisma from "../client";
import { adminUserFactory } from "./adminUserFactory";

export async function seasonFactory() {
  const { id: adminUserId } = await adminUserFactory();
  return prisma.season.create({
    data: {
      adminUserId,
      startDate: new Date(2021, 5, 30),
      endDate: new Date(2022, 6, 1),
      slug: "2021-2022",
    },
  });
}
