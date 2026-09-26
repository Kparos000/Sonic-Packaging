import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getPageSections } from "@/lib/content/get-page-content";
import { ContentSection } from "@/components/sections/content-section";
import { Section } from "@/components/ui/section";

export const metadata: Metadata = {
  title: "Insights",
  description: "News, updates and stories from Sonic Packaging.",
};

export default async function InsightsPage() {
  const [sections, articles, categories] = await Promise.all([
    getPageSections("insights"),
    prisma.article.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" },
      include: { category: true },
    }),
    prisma.articleCategory.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <>
      <ContentSection content={sections["hero"]} tone="ivory" />

      <Section tone="white">
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <span
                key={category.id}
                className="border border-sonic-charcoal/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-sonic-charcoal/60"
              >
                {category.name}
              </span>
            ))}
          </div>
        )}

        {articles.length > 0 ? (
          <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <Link
                key={article.id}
                href={`/insights/${article.slug}`}
                className="block border border-sonic-charcoal/10 p-6 transition-colors hover:border-sonic-green"
              >
                {article.category && (
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-sonic-green">
                    {article.category.name}
                  </p>
                )}
                <h3 className="mt-2 font-bold text-sonic-charcoal">{article.title}</h3>
                {article.excerpt && (
                  <p className="mt-2 text-sm text-sonic-charcoal/70">{article.excerpt}</p>
                )}
              </Link>
            ))}
          </div>
        ) : (
          <p className="mt-8 max-w-lg text-sm text-sonic-charcoal/60">
            No articles have been published yet. Check back soon.
          </p>
        )}
      </Section>
    </>
  );
}
