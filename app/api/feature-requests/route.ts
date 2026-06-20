import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

async function createSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Server configuration error");
  }

  return createClient(supabaseUrl, supabaseKey);
}

export async function GET() {
  try {
    const supabase = await createSupabaseClient();
    const { data, error } = await supabase
      .from("feature_requests")
      .select("id, title, description, status, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to fetch feature requests" },
        { status: 500 }
      );
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, description } = await request.json();

    // Validate input
    if (!title || !description) {
      return NextResponse.json(
        { error: "Title and description are required" },
        { status: 400 }
      );
    }

    if (typeof description !== "string" || description.trim().length === 0) {
      return NextResponse.json(
        { error: "Description cannot be empty" },
        { status: 400 }
      );
    }

    const supabase = await createSupabaseClient();

    // Insert feature request
    const { data, error } = await supabase
      .from("feature_requests")
      .insert([
        {
          title,
          description: description.trim(),
        },
      ])
      .select();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to save feature request" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, data },
      { status: 201 }
    );
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
