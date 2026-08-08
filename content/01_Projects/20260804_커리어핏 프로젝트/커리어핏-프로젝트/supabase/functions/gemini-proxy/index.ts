// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// PII 마스킹 함수 (이름, 전화번호, 이메일 등 제거)
function maskPII(text: string): string {
  if (!text) return "";
  return text
    .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, "[이메일]")
    .replace(/01[016789][-.\s]?\d{3,4}[-.\s]?\d{4}/g, "[연락처]")
    .replace(/\d{6}[-~]?\d{7}/g, "[주민등록번호]")
    .replace(/https?:\/\/[^\s]+/g, "[외부링크]");
}

serve(async (req) => {
  // CORS Preflight 요청 처리
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { prompt, resumeText, jdText } = await req.json();

    // Supabase Secrets에 저장한 GEMINI_API_KEY 불러오기
    const apiKey = Deno.env.get("GEMINI_API_KEY");
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY가 설정되지 않았습니다.");
    }

    // 전송받은 이력서 데이터 마스킹 처리
    const safeResume = maskPII(resumeText || "");
    const safePrompt = `${prompt}\n\n[구직자 이력서 정보]:\n${safeResume}\n\n[채용 공고]:\n${jdText || ""}`;

    // Gemini 2.5 Flash API 호출
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    
    const response = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: safePrompt }] }]
      }),
    });

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});