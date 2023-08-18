import DataLoader from "dataloader";
import prisma from "../../prisma/client";

export const getUserByEmail = async (email: string) => {
  const user = await prisma.user.findFirst({ where: { email } });

  if (!user) throw Error("Invalid credentials");

  return user;
};

export const getUserById = async (id: string) => {
  const user = await prisma.user.findFirst({ where: { id } });

  if (!user) throw Error("Invalid credentials");

  return user;
};

export const userLoader = new DataLoader(async (ids: any) => {
  const users = await prisma.user.findMany({ where: { id: { in: ids } } });

  return ids.map((id: string) => users.find((user) => user.id === id));
});
