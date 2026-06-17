# Day 137 — AI Battle Arena with Express, LangChain & LangGraph

---

## 1. Project Setup (Express + TypeScript)

### Initialize the project

```bash
npm init -y
npm i -D typescript tsx
npx tsc --init
npm i express dotenv
npm i -D @types/express @types/node
```

### Configure `tsconfig.json`

Make sure these two fields are set:

```json
{
  "compilerOptions": {
    "rootDir": ".",
    "outDir": "./dist"
  }
}
```

### Add dev script to `package.json`

```json
{
  "scripts": {
    "dev": "tsx watch server.ts"
  }
}
```

---

### `src/app.ts`

```ts
import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("Hello world");
});

export default app;
```

### `server.ts`

```ts
import app from './src/app.js';

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
```

Run with `npm run dev` → server accessible at `http://localhost:3000`.

---

## 2. What Are We Building?

An **AI Battle Arena**:

1. A **problem statement** is taken from the user.
2. Two different AI models each attempt to solve the problem independently.
3. A **third AI model acts as a Judge** — it receives both solutions, scores each from 0–10, and provides reasoning for its scores.

---

## 3. Why LangChain?

- LLMs alone struggle with complex, multi-step problems.
- LangChain helps **break down complex problems** into smaller tasks.
- These smaller tasks can be solved by calling LLMs **sequentially or in parallel**.
- LangChain provides the framework to **orchestrate** these calls and combine their outputs.

---

## 4. Why LangGraph?

LangGraph is built on top of LangChain and adds a **graph-based execution model** for building multi-agent systems. Here's why it's useful:

| Reason | Explanation |
|---|---|
| **Multi-Agent Systems** | Multiple AI agents (Research, Code, Review, Judge) can work together with a clean structure. |
| **Loops & Retries** | Unlike linear LangChain chains, LangGraph natively supports cycles (e.g., generate → review → retry if errors found). |
| **Shared State** | All agents share a single state object (`problem`, `solution_1`, `solution_2`, `judge`, etc.) that each node can read and update. |
| **Conditional Routing** | The next node executed can depend on the current result (e.g., route to "Coder" vs "General LLM" based on question type). |
| **Human-in-the-Loop** | Workflows can pause and wait for human approval before continuing (useful in legal, medical, financial contexts). |
| **Checkpointing** | Long-running graphs can save progress so they can resume after a crash, rather than starting over. |
| **Production-Ready** | Handles memory, retries, error handling, and state management needed for real-world AI apps. |
| **Visualizable** | The workflow can be represented as a graph (START → Research → Coder → Reviewer → END), making debugging easy. |

---

## 5. Install LangGraph & AI Packages

```bash
npm i langchain @langchain/langgraph @langchain/google-genai @langchain/mistralai @langchain/cohere
npm i @langchain/core
```

> ⚠️ **Correction from original notes:** The Google package is `@langchain/google-genai`, not `@langchain/google`. The class used is `ChatGoogleGenerativeAI`.

---

## 6. Nodes & Edges in LangGraph

### Nodes

A **Node** is a unit of work — a function that:
- Receives the **current state**
- Processes it (e.g., calls an AI model)
- Returns an **updated state**

Each node has a single responsibility. Examples:
- `solutionNode` → generates solutions using Mistral and Cohere
- `judgeNode` → evaluates both solutions using Gemini

### Edges

An **Edge** connects nodes and determines the **execution flow**. They can be:
- **Simple**: always move to a specific next node
- **Conditional**: choose a different path based on some condition

### How They Work Together

| Concept | Analogy |
|---|---|
| Nodes | Workers in a company |
| Edges | Instructions telling each worker who gets the task next |

The graph starts at `START`, flows through nodes via edges, and terminates at `END`.

---

## 7. Config File

### `src/config/config.ts`

```ts
import dotenv from "dotenv";

dotenv.config();

const config = {
  GOOGLE_API_KEY: process.env.GOOGLE_API_KEY || "",
  COHERE_API_KEY: process.env.COHERE_API_KEY || "",
  MISTRAL_API_KEY: process.env.MISTRAL_API_KEY || "",
};

export default config;
```

---

## 8. AI Model Initialization

### `src/ai/model.ai.ts`

```ts
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatCohere } from "@langchain/cohere";
import { ChatMistralAI } from "@langchain/mistralai";

import config from "../config/config.js";

export const geminiModel = new ChatGoogleGenerativeAI({
  apiKey: config.GOOGLE_API_KEY,
  model: "gemini-1.5-flash-latest",
});

export const cohereModel = new ChatCohere({
  apiKey: config.COHERE_API_KEY,
  model: "command-a-03-2025",
});

export const mistralAIModel = new ChatMistralAI({
  apiKey: config.MISTRAL_API_KEY,
  model: "mistral-medium-latest",
});
```

> ⚠️ **Corrections from original notes:**
> - Use `ChatGoogleGenerativeAI` from `@langchain/google-genai` (not `ChatGoogle` from `@langchain/google`).
> - Cohere model name should be `"command-a-03-2025"` (not `"cohere-command-a-03-2025"`).

---

## 9. Zod — Why Do We Need It?

Install:

```bash
npm install zod
```

**Zod** is a schema validation library for TypeScript. In real applications, data comes from many untrusted sources (user forms, APIs, AI responses). Zod lets you:

- Define **exactly** what shape your data should have
- **Validate** incoming data against that schema
- Get proper **TypeScript types** automatically
- Get **detailed error messages** if data doesn't match

In LangGraph/LangChain, Zod is especially useful for ensuring that an LLM returns a structured JSON object with required fields — instead of unpredictable free-form text.

**Example:** If you need a judge AI to always return `solution_1_score`, `solution_2_score`, `solution_1_reasoning`, `solution_2_reasoning`, Zod enforces this contract.

---

## 10. State in LangGraph

The **state** is a shared object that all nodes in the graph can read from and write to. It flows through the graph, getting updated at each step.

In LangGraph (modern API), state is defined using `Annotation`:

```ts
import { Annotation } from "@langchain/langgraph";

const StateAnnotation = Annotation.Root({
  problem: Annotation<string>({ default: () => "" }),
  solution_1: Annotation<string>({ default: () => "" }),
  solution_2: Annotation<string>({ default: () => "" }),
  judge: Annotation<{
    solution_1_score: number;
    solution_2_score: number;
    solution_1_reasoning: string;
    solution_2_reasoning: string;
  }>({
    default: () => ({
      solution_1_score: 0,
      solution_2_score: 0,
      solution_1_reasoning: "",
      solution_2_reasoning: "",
    }),
  }),
});
```

> ⚠️ **Correction from original notes:** LangGraph uses `Annotation.Root()` to define state — not `new StateSchema()` with Zod. Zod is used separately to define the **output schema** for structured LLM responses. The `GraphNode` type mentioned in the original notes also does not exist in LangGraph's public API.

---

## 11. The Graph

### `src/ai/graph.ai.ts`

```ts
import { END, START, StateGraph, Annotation } from "@langchain/langgraph";
import { HumanMessage } from "@langchain/core/messages";
import { geminiModel, cohereModel, mistralAIModel } from "./model.ai.js";
import z from "zod";

// --- State Definition ---
const StateAnnotation = Annotation.Root({
  problem: Annotation<string>({ default: () => "" }),
  solution_1: Annotation<string>({ default: () => "" }),
  solution_2: Annotation<string>({ default: () => "" }),
  judge: Annotation<{
    solution_1_score: number;
    solution_2_score: number;
    solution_1_reasoning: string;
    solution_2_reasoning: string;
  }>({
    default: () => ({
      solution_1_score: 0,
      solution_2_score: 0,
      solution_1_reasoning: "",
      solution_2_reasoning: "",
    }),
  }),
});

// --- Solution Node ---
// Runs both AI models in parallel; fills solution_1 and solution_2 in state.
const solutionNode = async (state: typeof StateAnnotation.State) => {
  const [mistralResponse, cohereResponse] = await Promise.all([
    mistralAIModel.invoke(state.problem),
    cohereModel.invoke(state.problem),
  ]);

  return {
    solution_1: mistralResponse.content as string,
    solution_2: cohereResponse.content as string,
  };
};

// --- Judge Node ---
// Uses Gemini with structured output to score and reason about both solutions.
const judgeSchema = z.object({
  solution_1_score: z.number().min(0).max(10),
  solution_2_score: z.number().min(0).max(10),
  solution_1_reasoning: z.string(),
  solution_2_reasoning: z.string(),
});

const judgeNode = async (state: typeof StateAnnotation.State) => {
  const { problem, solution_1, solution_2 } = state;

  // withStructuredOutput forces the model to return data matching the Zod schema
  const structuredJudge = geminiModel.withStructuredOutput(judgeSchema);

  const judgeResponse = await structuredJudge.invoke([
    new HumanMessage(`
      You are a judge evaluating two AI-generated solutions.
      
      Problem: ${problem}
      Solution 1: ${solution_1}
      Solution 2: ${solution_2}
      
      Score each solution from 0 to 10 and provide your reasoning.
    `),
  ]);

  return { judge: judgeResponse };
};

// --- Build the Graph ---
const graph = new StateGraph(StateAnnotation)
  .addNode("solution", solutionNode)
  .addNode("judge_node", judgeNode)
  .addEdge(START, "solution")
  .addEdge("solution", "judge_node")
  .addEdge("judge_node", END)
  .compile();

// --- Export runner function ---
export default async function runGraph(problem: string) {
  const result = await graph.invoke({ problem });
  return result;
}
```

> ⚠️ **Corrections from original notes:**
> - `HumanMessage` is imported from `@langchain/core/messages`, not from `'langchain'`.
> - `createAgent` and `providerStrategy` do **not exist** in LangChain. The correct way to get structured output from a model is `model.withStructuredOutput(zodSchema)`, which is natively supported.
> - `judgeResponse.structuredResponse` does not exist — `.withStructuredOutput()` returns the structured object directly.

---

## 12. Wiring It Up in `app.ts`

### `src/app.ts` (final)

```ts
import express from 'express';
import runGraph from './ai/graph.ai.js';

const app = express();

app.get('/', async (req, res) => {
  const result = await runGraph('write a code for factorial function in JS');
  res.json(result);
});

export default app;
```

---

## 13. How the Full Flow Works

```
User hits GET /
       ↓
runGraph("write factorial function in JS")
       ↓
graph.invoke({ problem }) → START node
       ↓
solutionNode
  ├── mistralAIModel.invoke(problem)  ─┐
  └── cohereModel.invoke(problem)    ─┘  (parallel)
  → returns { solution_1, solution_2 }
       ↓
judgeNode
  └── geminiModel.withStructuredOutput(schema).invoke(...)
  → returns { judge: { solution_1_score, solution_2_score, ... } }
       ↓
END → result returned to Express → res.json(result)
```

**State evolution through the graph:**

| Stage | `problem` | `solution_1` | `solution_2` | `judge` |
|---|---|---|---|---|
| After START | ✅ | ❌ | ❌ | ❌ |
| After solutionNode | ✅ | ✅ | ✅ | ❌ |
| After judgeNode | ✅ | ✅ | ✅ | ✅ |

---

## 14. Summary of Key Corrections

| Original Notes | Correct Version |
|---|---|
| `import { HumanMessage } from 'langchain'` | `import { HumanMessage } from '@langchain/core/messages'` |
| `import { createAgent, providerStrategy } from 'langchain'` | These don't exist. Use `model.withStructuredOutput(zodSchema)` |
| `ChatGoogle` from `@langchain/google` | `ChatGoogleGenerativeAI` from `@langchain/google-genai` |
| `new StateSchema({...})` with Zod | `Annotation.Root({...})` from `@langchain/langgraph` |
| `GraphNode<typeof state>` type | Use `(state: typeof StateAnnotation.State) => Promise<Partial<...>>` |
| `judgeResponse.structuredResponse` | `.withStructuredOutput()` returns the object directly |
| `mistralResponse.text` / `cohereResponse.text` | `.content` (typed as `string`) |
| `"cohere-command-a-03-2025"` model string | `"command-a-03-2025"` |
