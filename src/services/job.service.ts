import DataLoader from "dataloader";
import prisma from "../../prisma/client";

interface IPagination {
  limit: number;
  offset: number;
}

export const getJobs = async (args?: IPagination) => {
  const query: any = {};

  if (args?.limit) {
    (query as any).take = args.limit;
  }

  if (args?.offset !== undefined) {
    (query as any).skip = args.offset;
  }
  query.orderBy = [{ createdAt: "desc" }];

  const jobs = await prisma.job.findMany(query);

  const count = await prisma.job.count();

  return { jobs, count };
};

export const getJob = async (id: string) => {
  return await prisma.job.findFirst({
    where: { id },
  });
};

export const getJobsForACompany = async (companyId: string) => {
  const result = await prisma.job.findMany({
    where: { companyId },
  });
  return result;
};

// response data objects should follow the ids order
export const jobLoader = new DataLoader(async (ids: any) => {
  const jobs = await prisma.job.findMany({
    where: { companyId: { in: ids } },
    include: { user: true, company: true },
  });

  const sortedJobs = ids.map((id: string) =>
    jobs.find((job) => job.companyId === id)
  );

  console.log(sortedJobs);

  return sortedJobs;
});

export const createJob = async (
  companyId: string,
  title: string,
  userId: string,
  description?: string
) => {
  return await prisma.job.create({
    data: { title, companyId, description, userId },
  });
};

export const deleteJobHandler = async (id: string) => {
  return await prisma.job.delete({
    where: { id },
  });
};

export const updateJob = async (
  id: string,
  title: string,
  description: string
) => {
  try {
    if (!description.length) {
      description = "none";
    }

    await prisma.job.update({
      where: { id },
      data: { title, description },
    });
  } catch (err) {
    console.log(err);
  }
};
