const fs = require('fs');

// 1. Update MetaDeepIntelligenceConsole.tsx
const consolePath = 'd:/GAME/remix-remix-earthui-designer/src/components/MetaDeepIntelligenceConsole.tsx';
let c = fs.readFileSync(consolePath, 'utf8');

c = c.replace(
  "selectedMetaModel = 'muse-spark-1.3',",
  "selectedMetaModel = 'tri-agent-swarm',"
);

const isImageAuthTarget = `        const isImageAuth = (qLower.includes('true') || qLower.includes('real') || qLower.includes('fake') || qLower.includes('actual') || qLower.includes('authentic') || qLower.includes('generated') || qLower.includes('ai')) && (qLower.includes('image') || qLower.includes('iamge') || qLower.includes('photo') || qLower.includes('pic') || qLower.includes('picture'));
        if (isImageAuth) {
          replyText = "Yes, this is an authentic, real-world true-color satellite observation captured by NASA's MODIS sensor on the Terra satellite. It is real earth observation imagery from NASA GIBS, not an AI-generated image.";`;

const isImageAuthRepl = `        const isModelQuery = (qLower.includes('model') || qLower.includes('mdoel') || qLower.includes('which ai') || qLower.includes('what ai') || qLower.includes('what model') || qLower.includes('which model') || qLower.includes('only one') || qLower.includes('single model') || qLower.includes('muse spark') || qLower.includes('swarm'));
        const isImageAuth = (qLower.includes('true') || qLower.includes('real') || qLower.includes('fake') || qLower.includes('actual') || qLower.includes('authentic') || qLower.includes('generated') || qLower.includes('ai')) && (qLower.includes('image') || qLower.includes('iamge') || qLower.includes('photo') || qLower.includes('pic') || qLower.includes('picture'));
        if (isModelQuery) {
          replyText = "SATA Sentinel operates exclusively as an **Autonomous Multi-Agent Consensus Swarm powered by Meta AI**. Every single observation response is synthesized in parallel consensus across all specialized Meta AI models:\\n\\n" +
            "- **Meta Muse Spark 1.3 (Geospatial Lock):** Computes submeter orbital coordinates, digital elevation models, and nadir camera geometry.\\n" +
            "- **Meta Muse Wonder 1.0 (Atmospheric & Planetary Physics):** Solves multi-spectral radiance, wind velocity vectors, precipitation rates, and thermal signatures.\\n" +
            "- **Meta Muse Spark 1.2 / Llama 4 (Orbital Tactical Protocol):** Synthesizes live satellite telemetry downlinks, constellation tasking, and emergency ground action.\\n\\n" +
            "No single model acts in isolation — every response runs as an autonomous multi-agent swarm in parallel consensus.";
        } else if (isImageAuth) {
          replyText = "Yes, this is an authentic, real-world true-color satellite observation captured by NASA's MODIS sensor on the Terra satellite. It is real earth observation imagery from NASA GIBS, not an AI-generated image.";`;

c = c.replace(isImageAuthTarget.replace(/\r\n/g, '\n'), isImageAuthRepl);
c = c.replace(isImageAuthTarget.replace(/\n/g, '\r\n'), isImageAuthRepl.replace(/\n/g, '\r\n'));

fs.writeFileSync(consolePath, c, 'utf8');
console.log('Successfully updated MetaDeepIntelligenceConsole.tsx!');

// 2. Update src/services/metaLlamaService.ts
const servicePath = 'd:/GAME/src/services/metaLlamaService.ts';
let s = fs.readFileSync(servicePath, 'utf8');

const promptTacticalTarget = `  // 3. Task C: Aerospace Intelligence Briefing & Tactical Action Protocol (Assigned to Muse Spark 1.2)
  const promptTactical = \`You are Meta Muse Spark 1.2, the Aerospace Intelligence Briefing & Tactical Response Specialist for SATA Sentinel.
Synthesize a comprehensive, in-depth, professional observation intelligence briefing and actionable strategic recommendations for the user query.
The briefing MUST thoroughly answer the user's inquiry with verified scientific, geographical, climatic, and satellite sensor deductions (3-5 comprehensive, detailed sentences).
Focus strictly on the actual inquiry.
- If the user asks a simple or conversational question (e.g. "is it true image?", "is this real?", "hi"), answer directly, naturally, and concisely in 1-2 clear sentences. Do NOT output long paragraphs or robotic jargon.
- If asked whether the satellite image is real or true, reply directly: "Yes, this is an authentic true-color satellite observation from NASA MODIS Terra. It is real satellite imagery from NASA GIBS, not an AI-generated image."`;

const promptTacticalRepl = `  // 3. Task C: Aerospace Intelligence Briefing & Tactical Action Protocol (Multi-Agent Swarm Consensus)
  const promptTactical = \`You are the Meta AI Multi-Agent Consensus Swarm for SATA Sentinel, orchestrating Meta Muse Spark 1.3 (Geospatial Lock), Meta Muse Wonder 1.0 (Atmospheric & Planetary Physics), and Meta Muse Spark 1.2 / Llama 4 (Orbital Tactical Synthesis) running simultaneously in parallel consensus.
Synthesize a comprehensive, in-depth, professional observation intelligence briefing and actionable strategic recommendations for the user query.
The briefing MUST thoroughly answer the user's inquiry with verified scientific, geographical, climatic, and satellite sensor deductions (3-5 comprehensive, detailed sentences).
Focus strictly on the actual inquiry.
- If asked what model or AI is running, state clearly that SATA Sentinel is powered by the Meta AI Autonomous Tri-Agent Swarm running all three Meta models simultaneously in parallel consensus (Meta Muse Spark 1.3 for geospatial coordinates, Meta Muse Wonder 1.0 for atmospheric physics, and Meta Muse Spark 1.2 / Llama 4 for tactical synthesis). Every single response is powered by the combined multi-agent consensus of all models.
- If the user asks a simple or conversational question (e.g. "is it true image?", "is this real?", "hi"), answer directly, naturally, and concisely in 1-2 clear sentences. Do NOT output long paragraphs or robotic jargon.
- If asked whether the satellite image is real or true, reply directly: "Yes, this is an authentic true-color satellite observation from NASA MODIS Terra. It is real satellite imagery from NASA GIBS, not an AI-generated image."`;

s = s.replace(promptTacticalTarget.replace(/\r\n/g, '\n'), promptTacticalRepl);
s = s.replace(promptTacticalTarget.replace(/\n/g, '\r\n'), promptTacticalRepl.replace(/\n/g, '\r\n'));

fs.writeFileSync(servicePath, s, 'utf8');
console.log('Successfully updated metaLlamaService.ts!');
