export type PlanId = "video-only" | "video-email" | "zoom";

export interface PlanAccess {
  videos: boolean;
  materials: boolean;
  support: boolean;
  zoom: boolean;
  community: boolean;
  jobs: boolean;
}

export const PLAN_ACCESS: Record<PlanId, PlanAccess> = {
  "video-only": {
    videos: true,
    materials: true,
    support: false,
    zoom: false,
    community: false,
    jobs: false,
  },
  "video-email": {
    videos: true,
    materials: true,
    support: true,
    zoom: false,
    community: false,
    jobs: false,
  },
  zoom: {
    videos: true,
    materials: true,
    support: true,
    zoom: true,
    community: true,
    jobs: true,
  },
};

/** プラン未設定（＝未課金 / メール不一致）ユーザーは一切アクセス不可 */
export const NO_ACCESS: PlanAccess = {
  videos: false,
  materials: false,
  support: false,
  zoom: false,
  community: false,
  jobs: false,
};

export function hasPaidPlan(plan: string | null): boolean {
  return !!plan && plan in PLAN_ACCESS;
}

export function getPlanAccess(plan: string | null): PlanAccess {
  if (plan && plan in PLAN_ACCESS) {
    return PLAN_ACCESS[plan as PlanId];
  }
  return NO_ACCESS;
}

export function getPlanLabel(plan: string | null): string {
  switch (plan) {
    case "video-only":
      return "動画のみ";
    case "video-email":
      return "動画 + メールサポート";
    case "zoom":
      return "Zoom型（1期生）";
    default:
      return "未設定";
  }
}
