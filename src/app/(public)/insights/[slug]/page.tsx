import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Section } from "@/components/ui/section";

type Params = Promise<{ slug: string }>;

async function getArticle(slug: string) {
  return prisma.article.findFirst({
    where: { slug, status: "PUBLISHED" },
    include: { category: true, author: true },
  });
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) return {};
  return {
    title: article.seoTitle || article.title,
    description: article.seoDescription || article.excerpt || undefined,
  };
}

export default async function ArticlePage({ params }: { params: Params }) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) notFound();

  const byline = [
    article.authorRole || article.author.name,
    article.publishedAt?.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <Section tone="white" containerClassName="max-w-3xl">
      {article.category && (
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-sonic-green">
          {article.category.name}
        </p>
      )}
      <h1 className="mt-3 text-3xl font-extrabold text-sonic-charcoal lg:text-4xl">
        {article.title}
      </h1>
      {byline && <p className="mt-4 text-sm text-sonic-charcoal/60">{byline}</p>}

      {/* Rendered as plain paragraphs for now — full markdown rendering
          (headings, links, lists, images within the body) lands with the
          Insights admin CMS, once its rich-editing UX settles which
          markdown feature set articles actually need. */}
      <div className="mt-8 whitespace-pre-line text-base leading-relaxed text-sonic-charcoal/80">
        {article.body}
      </div>
    </Section>
  );
}
