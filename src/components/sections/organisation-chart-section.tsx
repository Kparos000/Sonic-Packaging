import { prisma } from "@/lib/prisma";
import { Section } from "@/components/ui/section";

type FlatNode = {
  id: string;
  label: string;
  parentId: string | null;
  executive: { name: string; title: string } | null;
};

type TreeNode = FlatNode & { children: TreeNode[] };

// Fetched flat (one query, no depth limit) and assembled into a tree in
// memory — simpler and safer than a fixed-depth nested Prisma `include`,
// and an org chart is small enough that this costs nothing.
function buildTree(flat: FlatNode[]): TreeNode[] {
  const byId = new Map<string, TreeNode>();
  flat.forEach((n) => byId.set(n.id, { ...n, children: [] }));
  const roots: TreeNode[] = [];
  for (const n of flat) {
    const node = byId.get(n.id);
    if (!node) continue;
    if (n.parentId && byId.has(n.parentId)) {
      byId.get(n.parentId)!.children.push(node);
    } else {
      roots.push(node);
    }
  }
  return roots;
}

export async function OrganisationChartSection() {
  const flat = await prisma.organisationNode.findMany({
    where: { isPublished: true },
    orderBy: { order: "asc" },
    include: { executive: { select: { name: true, title: true } } },
  });
  const tree = buildTree(flat);

  return (
    <Section tone="ivory">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-sonic-green">Organisation</p>
      <h2 className="mt-3 text-3xl font-extrabold lg:text-4xl">How we&rsquo;re organised.</h2>

      {tree.length > 0 ? (
        <div className="mt-10">
          <OrgTree nodes={tree} />
        </div>
      ) : (
        <p className="mt-8 max-w-lg border border-dashed border-sonic-charcoal/25 bg-sonic-white p-6 text-sm text-sonic-charcoal/60">
          Organisation chart will appear here once published from Admin.
        </p>
      )}
    </Section>
  );
}

function OrgTree({ nodes }: { nodes: TreeNode[] }) {
  return (
    <ul className="space-y-4">
      {nodes.map((node) => (
        <li key={node.id} className="border-l-2 border-sonic-green/30 pl-4">
          <p className="font-bold text-sonic-charcoal">{node.label}</p>
          {node.executive && (
            <p className="text-sm text-sonic-charcoal/60">{node.executive.name}</p>
          )}
          {node.children.length > 0 && (
            <div className="mt-3 ml-2">
              <OrgTree nodes={node.children} />
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
