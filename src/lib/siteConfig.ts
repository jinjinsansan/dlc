export const siteConfig = {
  recruitment: {
    cohort: 1,
    label: "1期生",
    maxSlots: 20,
    remainingSlots: 10,
    deadline: "2026-05-31",
    // 申し込み受付の開閉スイッチ。リリース前は false（準備中）。
    // 公開時に true にすると、申込ボタン・/apply・決済APIが一斉に有効化される。
    isOpen: false,
  },
} as const;

/** 申し込み受付中かどうか（単一の真実の源） */
export const enrollmentOpen: boolean = siteConfig.recruitment.isOpen;
