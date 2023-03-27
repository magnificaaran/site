import { createBcmsMostServerRoutes } from "@becomes/cms-most";
import { JobEntry, JobEntryMeta } from "~~/bcms/types/entry/job";
import { JobLight, JobPageData } from "~~/types";
import { apiRoute } from "./_api-route";

export const jobToLight = (jobs: JobEntry[]): JobLight[] => {
  return jobs.map((e) => {
    const meta = e.meta.en as JobEntryMeta;

    return {
      title: meta.title,
      slug: meta.slug,
      description: meta.description,
      featured: meta.featured || false,
      location: meta.location.meta.en?.title || "",
      type: meta.type.meta.en?.title || "",
    };
  });
};

export const JobsApi = createBcmsMostServerRoutes({
  "/jobs/:slug/data.json": apiRoute<JobPageData>({
    method: "get",
    async handler({ bcms, params }) {
      const entry = (await bcms.content.entry.findOne(
        "job",
        async (e) => e.meta.en.slug === params.slug
      )) as unknown as JobEntry;

      if (!entry) {
        throw new Error("Job page entry does not exist.");
      }

      const jobs = (await bcms.content.entry.find("job", async (e) => {
        return e.meta.en.slug !== entry.meta.en?.slug;
      })) as unknown as JobEntry[];

      return {
        meta: entry.meta.en as JobEntryMeta,
        jobs: jobToLight(jobs),
      };
    },
  }),
});
