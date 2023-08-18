import DataLoader from "dataloader";

import prisma from "../../prisma/client";

export const getCompanies = async () => {
  return await prisma.company.findMany();
};

export const getCompany = async (id: string) => {
  return await prisma.company.findFirst({ where: { id } });
};

// used for batch loading which means collect all ids and make one query for all the ids
export const companyLoader = new DataLoader(async (ids: any) => {
  const companies = await prisma.company.findMany({
    where: { id: { in: ids } },
  });

  return ids.map((id: any) =>
    companies.find((company: any) => company.id === id)
  );
});

export const createCompany = async () => {};
