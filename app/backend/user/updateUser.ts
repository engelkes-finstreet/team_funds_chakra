import { db } from "~/utils/db.server";

type UpdateUser = {
  userId: string;
  firstName: string;
  lastName: string;
};

export async function updateUser({ userId, firstName, lastName }: UpdateUser) {
  return db.user.update({
    where: { id: userId },
    data: {
      firstName,
      lastName,
      slug: `${firstName}-${lastName}`,
    },
  });
}
