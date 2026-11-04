type Member = {
  name: string;
  email: string;
  role?: string;
  status: string;
  lastActive: string;
  selected?: boolean;
  menuOpen?: boolean;
};

const demo: Member[] = [
  { name: "Margaret Nguyen", email: "margaret@acme.com", role: "Owner", status: "Active", lastActive: "2 hours ago" },
  { name: "Hoshi Nakamura", email: "hoshi@acme.com", role: "Editor", status: "Invited", lastActive: "Yesterday" },
  { name: "Daniel Ortiz", email: "daniel@acme.com", role: "Viewer", status: "Active", lastActive: "3 days ago" },
];

const worst: Member[] = [
  {
    name: "Aleksandra Wiśniewska-Kowalczyk",
    email: "aleksandra.wisniewska-kowalczyk@northwind-industries-holdings.example.com",
    role: "Senior Director of Partner Engineering, EMEA and APAC",
    status: "Active",
    lastActive: "2 hours ago",
    selected: true,
  },
  {
    name: "Jo",
    email: "bartholomew.fitzgerald@northwind-industries-holdings.example.com",
    status: "Invited",
    lastActive: "Never",
    menuOpen: true,
  },
  {
    name: "Nguyễn Thị Phương Thảo",
    email: "thao@vn.example",
    role: "Biên tập viên",
    status: "Ausstehende Einladung",
    lastActive: "14 months ago",
  },
  { name: "محمد عبد الرحمن الشمري", email: "mohammed@example.sa", role: "مدير المشروع", status: "Active", lastActive: "1 minute ago" },
  { name: "👩🏽‍💻 Priya Raghunathan", email: "priya+billing@example.in", role: "Billing admin", status: "Expired", lastActive: "3 years ago" },
  { name: "田中 太郎", email: "t.tanaka@example.jp", role: "閲覧者", status: "Active", lastActive: "Today" },
];

const huge: Member[] = Array.from({ length: 1000 }, (_, index) => ({
  ...worst[index % worst.length],
  selected: false,
  menuOpen: false,
}));

const datasets = {
  demo: ["Demo data", demo, 3],
  worst: ["Worst case", worst, 1284],
  empty: ["Empty", [], 0],
  one: ["One", demo.slice(0, 1), 1],
  huge: ["1,000 rows", huge, 1000],
} as const;

type DatasetKey = keyof typeof datasets;

const plural = new Intl.PluralRules("en-US");
const count = (value: number) =>
  `${new Intl.NumberFormat("en-US").format(value)} ${plural.select(value) === "one" ? "member" : "members"}`;

// Development stress page for the table component. Not rendered into the static site.
export function TableBreak({ data, width }: { data?: string; width?: string }) {
  const key: DatasetKey = data && data in datasets ? (data as DatasetKey) : "demo";
  const [, rows, total] = datasets[key];
  const containerWidth = width === "320" ? "320px" : width === "sidebar" ? "28rem" : "100%";

  return (
    <main class="docs-page container stack" style="padding-block-end: 6rem">
      <h1>Table stress cases</h1>
      <p>
        Dataset: {datasets[key][0]}. Container: {width ?? "full"}.{" "}
        <a href={`?data=${key}&width=full`}>Full</a> ·{" "}
        <a href={`?data=${key}&width=sidebar`}>28rem</a> ·{" "}
        <a href={`?data=${key}&width=320`}>320px</a>
      </p>
      <div style={`width: ${containerWidth}; max-width: 100%`}>
        <div data-slot="table-container" class="card" role="region" aria-labelledby="members-caption" tabindex={0}>
          <table>
            <caption id="members-caption">Workspace members</caption>
            <thead>
              <tr>
                <th scope="col">
                  <input type="checkbox" aria-label="Select all" />
                </th>
                <th scope="col">Name</th>
                <th scope="col">Email</th>
                <th scope="col">Role</th>
                <th scope="col">Status</th>
                <th scope="col">Last active</th>
                <th scope="col">
                  <span class="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colspan={7}>No members yet.</td>
                </tr>
              ) : (
                rows.map((member) => (
                  <tr aria-selected={member.selected ? "true" : undefined}>
                    <td>
                      <input type="checkbox" aria-label={`Select ${member.name}`} checked={member.selected} />
                    </td>
                    <th scope="row">{member.name}</th>
                    <td>{member.email}</td>
                    <td>{member.role ?? ""}</td>
                    <td>
                      <span class="badge" data-variant={member.status === "Active" ? undefined : "secondary"}>
                        {member.status}
                      </span>
                    </td>
                    <td>{member.lastActive}</td>
                    <td>
                      <button
                        type="button"
                        data-variant="ghost"
                        data-size="icon"
                        aria-label={`Open menu for ${member.name}`}
                        aria-expanded={member.menuOpen ? "true" : "false"}
                      >
                        •••
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            <tfoot>
              <tr>
                <th scope="row" colspan={6}>
                  Total
                </th>
                <td>{count(total)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
      <nav
        aria-label="Dataset"
        style="position: fixed; inset-block-end: 1rem; inset-inline-start: 50%; translate: -50% 0; display: flex; max-width: calc(100vw - 1rem); overflow-x: auto; gap: 2px; padding: 3px; border-radius: 999px; background: #e5e5e5; font: 13px system-ui, sans-serif; z-index: 10"
      >
        {(Object.keys(datasets) as DatasetKey[]).map((option) => (
          <a
            href={`?data=${option}${width ? `&width=${width}` : ""}`}
            aria-current={option === key ? "page" : undefined}
            style={`padding: 4px 12px; border-radius: 999px; color: #171717; text-decoration: none; white-space: nowrap; ${option === key ? "background: #fff; box-shadow: 0 1px 2px rgb(0 0 0 / 15%)" : ""}`}
          >
            {datasets[option][0]}
          </a>
        ))}
      </nav>
    </main>
  );
}
