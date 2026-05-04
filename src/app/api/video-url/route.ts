import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * GET /api/video-url?path=<storage_path>
 *
 * 認証済み会員にだけ Supabase Storage の signed URL を返す。
 * - 期限: 1時間
 * - signed URL を発行することで anon key の直接露出を防ぐ
 * - 動画ファイルは bucket "videos" を参照
 */
export async function GET(request: NextRequest) {
  const filePath = request.nextUrl.searchParams.get("path");

  if (!filePath) {
    return NextResponse.json(
      { error: "パスが指定されていません" },
      { status: 400 }
    );
  }

  // パストラバーサル対策
  const normalized = filePath.replace(/\\/g, "/");
  if (normalized.includes("..") || normalized.startsWith("/")) {
    return NextResponse.json({ error: "不正なパスです" }, { status: 400 });
  }

  const supabaseResponse = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // 認証チェック
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
  }

  // ユーザーのプラン取得（plan_required との照合用）
  const { data: profile } = await supabase
    .from("users")
    .select("plan")
    .eq("email", user.email)
    .single();

  if (!profile?.plan) {
    return NextResponse.json(
      { error: "有効なプランがありません" },
      { status: 403 }
    );
  }

  // 動画レコードを取得して plan_required を確認
  const { data: video } = await supabase
    .from("videos")
    .select("plan_required, unlocked_at")
    .eq("storage_path", filePath)
    .single();

  if (video?.unlocked_at && new Date(video.unlocked_at) > new Date()) {
    return NextResponse.json(
      { error: "この動画はまだ公開されていません" },
      { status: 403 }
    );
  }

  if (video?.plan_required) {
    const hierarchy = ["video-only", "video-email", "zoom"];
    const userIdx = hierarchy.indexOf(profile.plan);
    const requiredIdx = hierarchy.indexOf(video.plan_required);
    if (userIdx < requiredIdx) {
      return NextResponse.json(
        { error: "このプランでは視聴できません" },
        { status: 403 }
      );
    }
  }

  // signed URL 発行 (1時間有効)
  const { data, error } = await supabase.storage
    .from("videos")
    .createSignedUrl(filePath, 60 * 60);

  if (error || !data?.signedUrl) {
    return NextResponse.json(
      { error: "動画ファイルが見つかりません" },
      { status: 404 }
    );
  }

  return NextResponse.json({ url: data.signedUrl });
}
