import { Resolvers } from "../generated/schema";
import {
  companyLoader,
  getCompanies,
  getCompany,
} from "../services/company.service";
import {
  createJob,
  deleteJobHandler,
  getJob,
  getJobs,
  getJobsForACompany,
  updateJob,
} from "../services/job.service";
import { userLoader } from "../services/user.service";
import { ICreatedAtField } from "../types/objectTypes";
import { throwGqlError } from "../utils/response/customErrors";
import { PubSub } from "graphql-subscriptions";

const pubSub = new PubSub();

const resolvers: Resolvers = {
  Query: {
    jobs: async (parent: any, args, context) => {
      return await getJobs(args as any);
    },
    job: async (parent: any, args: { id: string }, context) => {
      const job = await getJob(args.id);

      if (!job) throwGqlError("Cannot find job with that id", "NOT_FOUND");

      return job;
    },
    companies: async (parent: any, args, context) => {
      return await getCompanies();
    },
    company: async (parent: any, args: { id: string }, context) => {
      const company = await getCompany(args.id);

      if (!company)
        throwGqlError("Cannot find company with that id", "NOT_FOUND");

      return company;
    },
  },

  Subscription: {
    jobAdded: {
      subscribe: (_root, _args, { user }) => {
        if (!user) throwGqlError("Unauthorized", "UNAUTHORIZED");

        return pubSub.asyncIterator("JOB_CREATED") as any;
      },
    },

    jobDeleted: {
      subscribe: (_root, _args, { user }) => {
        if (!user) throwGqlError("Unauthorized", "UNAUTHORIZED");

        return pubSub.asyncIterator("JOB_DELETED") as any;
      },
    },
  },

  Mutation: {
    createJob: (_parent: any, args: any, { user }) => {
      if (user) {
        const userId = user.id;
        const { title, description } = args.input;
        const job = createJob(user.companyId, title, userId, description);
        pubSub.publish("JOB_CREATED", { jobAdded: job });
        return job;
      }
    },

    deleteJob: async (_parent: any, { id }, { user }) => {
      const jobForDeletion = await getJob(id);

      if (jobForDeletion && user && user.id === jobForDeletion.userId) {
        const deletedJob = await deleteJobHandler(id);
        pubSub.publish("JOB_DELETED", { jobDeleted: deletedJob });
        return deletedJob;
      } else {
        throwGqlError(
          "Only the creator can delete this job post.",
          "FORBIDDEN"
        );
      }
    },

    updateJob: async (
      _parent: any,
      { input: { title, id, description } },
      { user }
    ) => {
      const jobForUpdate = await getJob(id);

      if (jobForUpdate && user && user.id === jobForUpdate.userId) {
        await updateJob(id, title, description as string);
        return getJobs({ limit: 10, offset: 0 });
      } else {
        throwGqlError(
          "Only the creator can update this job post.",
          "FORBIDDEN"
        );
      }
    },
  },

  // resolver function for the Job type
  // add batch loading to the Job resolver functions
  Job: {
    date: (job: ICreatedAtField) => {
      const date = new Date(job.createdAt);
      // console.log(date);
      return date.toDateString();
    },
    company: async (job: any) => {
      return companyLoader.load(job.companyId);
      // return await getCompany(job.companyId);
    },
    user: async (job: any) => {
      // console.log(job);
      // return await getUserById(job.userId);
      return userLoader.load(job.userId);
    },
  },

  // resolver functions for the Company type
  // get all jobs when a jobs field is requested in the query
  Company: {
    jobs: async (company) => {
      return await getJobsForACompany(company.id);
    },
  },
};

export default resolvers;
