import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getPageSections } from "@/lib/content/get-page-content";
import { ContentSection } from "@/components/sections/content-section";
import { Section } from "@/components/ui/section";
import { ApplicationForm } from "@/components/forms/application-form";

export const metadata: Metadata = {
  title: "Careers",
  description: "Build your career with Sonic Packaging.",
};

export default async function CareersPage() {
  const [sections, openJobs] = await Promise.all([
    getPageSections("careers"),
    prisma.job.findMany({
      where: { status: "OPEN" },
      orderBy: { postedAt: "desc" },
    }),
  ]);

  return (
    <>
      <ContentSection content={sections["hero"]} tone="ivory" />

      <Section tone="white">
        {openJobs.length > 0 ? (
          <div className="space-y-6">
            <h2 className="text-2xl font-extrabold text-sonic-charcoal">Open Positions</h2>
            {openJobs.map((job) => (
              <div key={job.id} className="border border-sonic-charcoal/10 p-6">
                <h3 className="font-bold text-sonic-charcoal">{job.title}</h3>
                <p className="mt-1 text-sm text-sonic-charcoal/60">
                  {[job.department, job.location].filter(Boolean).join(" · ")}
                </p>
                {job.summary && (
                  <p className="mt-3 text-sm text-sonic-charcoal/70">{job.summary}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="max-w-xl space-y-4 text-base leading-relaxed text-sonic-charcoal/80">
            <p>There are currently no open positions.</p>
            <p>But we&rsquo;re always interested in exceptional people.</p>
            <p>
              If you believe your experience, skills and ambition could contribute to what Sonic
              Packaging is building, send us your CV.
            </p>
          </div>
        )}
      </Section>

      <Section tone="ivory">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-2xl font-extrabold text-sonic-charcoal">Apply</h2>
          <div className="mt-6">
            <ApplicationForm jobs={openJobs.map((job) => ({ id: job.id, title: job.title }))} />
          </div>
        </div>
      </Section>
    </>
  );
}
