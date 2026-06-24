import { createServerSupabaseClient } from "@/lib/supabase/server";
import Card from "@/components/ui/Card";
import { FileText, BookOpen, Wrench, Map, GraduationCap, MessageCircle, FileCode } from "lucide-react";
import PageHead from "@/components/members/PageHead";
import { isAdmin } from "@/lib/admin";

interface Material {
  id: string;
  title: string;
  description: string | null;
  category: string;
  week: number | null;
  file_url: string;
  file_size_bytes: number | null;
  file_type: string | null;
  plan_required: string | null;
  sort_order: number | null;
  created_at: string;
}

const CATEGORIES = [
  { key: "week", label: "週次教材", icon: BookOpen },
  { key: "phrase", label: "フレーズ集", icon: MessageCircle },
  { key: "troubleshooting", label: "トラブルシューティング", icon: Wrench },
  { key: "glossary", label: "用語集", icon: FileText },
  { key: "roadmap", label: "卒業後ロードマップ", icon: Map },
  { key: "reference", label: "参考資料", icon: GraduationCap },
  { key: "template", label: "テンプレート", icon: FileCode },
  { key: "prompt", label: "プロンプト集", icon: MessageCircle },
];

function formatSize(bytes: number | null): string {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default async function MaterialsPage() {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("users")
    .select("plan")
    .eq("email", user?.email)
    .single();

  const planHierarchy = ["video-only", "video-email", "zoom"];
  // 管理者はプラン行が無くても全教材を閲覧できる
  const userPlan = isAdmin(user?.email) ? "zoom" : profile?.plan ?? "video-only";
  const userPlanIndex = planHierarchy.indexOf(userPlan);

  const { data: materials } = await supabase
    .from("materials")
    .select(
      "id, title, description, category, week, file_url, file_size_bytes, file_type, plan_required, sort_order, created_at"
    )
    .order("category")
    .order("sort_order", { ascending: true })
    .order("week", { ascending: true });

  const accessibleMaterials = (materials ?? []).filter((m: Material) => {
    if (!m.plan_required) return true;
    const requiredIndex = planHierarchy.indexOf(m.plan_required);
    return userPlanIndex >= requiredIndex;
  });

  return (
    <div>
      <PageHead
        num="03"
        kicker="MATERIALS"
        title="資料ダウンロード"
        intro="Week 別教材・フレーズ集・トラブルシューティング等を PDF でダウンロードできます。"
      />

      {CATEGORIES.map(({ key, label, icon: Icon }) => {
        const items = accessibleMaterials.filter(
          (m: Material) => m.category === key
        );
        if (items.length === 0) return null;

        return (
          <section key={key} className="mb-8 sm:mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Icon className="w-5 h-5 text-primary" strokeWidth={1.5} />
              </div>
              <h2 className="font-serif font-bold text-lg">{label}</h2>
              <span className="text-text-muted text-xs ml-auto">
                {items.length} 件
              </span>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              {items.map((material: Material) => (
                <Card
                  key={material.id}
                  className="flex flex-col gap-3 hover:border-primary/40 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 w-10 h-10 rounded bg-bg border border-border flex items-center justify-center">
                      <span className="text-xs font-bold text-primary">
                        PDF
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-sm leading-snug">
                        {material.week
                          ? `Week ${material.week}: `
                          : ""}
                        {material.title}
                      </h3>
                      {material.description && (
                        <p className="text-text-muted text-xs mt-1">
                          {material.description}
                        </p>
                      )}
                      <p className="text-text-muted text-[10px] mt-1">
                        {formatSize(material.file_size_bytes)} ・{" "}
                        {new Date(material.created_at).toLocaleDateString(
                          "ja-JP"
                        )}
                      </p>
                    </div>
                  </div>
                  <a
                    href={`/api/download?path=${encodeURIComponent(material.file_url)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-center bg-primary/15 hover:bg-primary/25 text-primary font-bold text-sm px-4 py-2 rounded-lg transition-colors"
                  >
                    ダウンロード
                  </a>
                </Card>
              ))}
            </div>
          </section>
        );
      })}

      {accessibleMaterials.length === 0 && (
        <Card className="text-center py-12">
          <FileText
            className="w-12 h-12 text-text-muted/40 mx-auto mb-3"
            strokeWidth={1.5}
          />
          <p className="text-text-muted">
            資料はまだ登録されていません
          </p>
        </Card>
      )}
    </div>
  );
}
