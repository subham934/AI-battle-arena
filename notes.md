at first 
- npm init -y
then 
- npm i -D typescript tsx
then
- npx tsc --init
- npm i express dotenv
- npm i -D @types/express @types/node

then inside tsconfig.json, make sure to apply this changes::
- "rootDir": ".",
- "outDir": "./dist",

inside package.json, add this script:
- "dev": "tsx watch server.ts",

create a file named app.ts in src folder

----------
src/app.ts
----------

import express from "express";

const app =  express();

app.get("/", (req, res) => {
    res.send("Hello world");
})

export default app;

create a file named server.ts


---------
server.ts
---------

import app from './src/app.js';


app.listen(3000, ()=>{
    console.log("Server is running on port 3000")
})

-> now , when we run npm run dev , the server will start and we can access it at http://localhost:3000
-> basic server setup is done.



in the AI battle, our problem statement will be given to two different AI models, both these model will produce different output. we have a third AI model which act as Judge. judge AI will check both the output and will score the output between 0 to 10. 

why use Langchain ?
- LLMs are not that smart to handle complex problems. 
- for solving complex problems, we need to breakdown those problems into smaller problems. 
- these smaller problems can be solved by calling LLMs multiple times. 
- these small problems can be solved sequentially or in parallel. 
- Langchain provides a framework to solve these small problems and combine their outputs to produce a final output.


- tAKE problem statement from user
- assign the problem to both the AI
- give both solution to the AI judge for comparison
- judge will provide score and feedback for both. 


why use Langgraph?
1. To Build Multi-Agent Systems Easily

When multiple AI agents need to work together, LangGraph provides a clean structure.

Example:

Research Agent → collects information
Coding Agent → writes code
Review Agent → checks code
Judge Agent → selects best answer

Without LangGraph, you'll manually manage agent communication.

2. To Create Loops and Retries

Real AI workflows often require repeating steps until a condition is satisfied.

Example:

Generate Code
Review Code
If errors found → Generate Again
Repeat until approved

LangChain chains are linear, while LangGraph supports loops naturally.

3. To Maintain Shared State

All agents can access and update the same state object.

Example State:

{
  question: "Build a Todo App",
  code: "...",
  feedback: "...",
  attempts: 3
}

Every node can read and modify this data.

4. To Support Conditional Routing

The next step can change based on the current result.

Example:

User Question
      ↓
Is it Coding?
   /      \
 Yes      No
  ↓        ↓
Coder   General LLM

Different outputs follow different paths.

5. To Add Human Approval

Sometimes AI should pause and wait for a human decision.

Example:

Generate Contract
       ↓
Human Review
       ↓
Approve?
       ↓
Continue

Useful for legal, medical, and financial applications.

6. To Save Progress with Checkpointing

Long-running workflows can be resumed after interruptions.

Example:

Research
   ↓
Writing
   ↓
Review

If the server crashes during Review:

Without LangGraph → Start from Research again
With LangGraph → Resume from Review
7. To Build Production-Grade AI Applications

Most real-world AI systems need:

Multiple agents
Memory
Retries
Error handling
State management

LangGraph provides all of these features.

8. To Visualize Workflow as a Graph

Instead of reading hundreds of lines of code, you can visualize the workflow.

Example:

START
  ↓
Research
  ↓
Coder
  ↓
Reviewer
  ↓
END

This makes debugging much easier.

//==========================================================

now we will install the below package::

npm i langchain @langchain/langgraph @langchain/google @langchain/mistralai @langchain/cohere
npm i @langchain/core



Nodes

In LangGraph, a Node is a unit of work that performs a specific task in the workflow. You can think of a node as a function that receives the current state, processes it, and returns an updated state. Each node has a single responsibility, such as generating an AI response, retrieving data from a database, validating information, or making a decision. When a graph runs, execution moves from one node to another, and each node contributes to solving a part of the overall problem. For example, in an AI Battle Arena, one node might generate a solution using GPT-5, another node might generate a solution using Gemini, and a third node might evaluate both answers to determine the winner.

Edges

An Edge defines the connection between nodes and controls the flow of execution through the graph. After a node finishes its work, the graph follows an edge to determine which node should execute next. Edges can be simple (always moving to a specific node) or conditional (choosing different paths based on some condition). They act like roads connecting cities, where the cities are nodes. For example, after an "Analyze Question" node completes its work, an edge may direct the graph to both "GPT Agent" and "Gemini Agent" nodes. Later, another edge may send the outputs of those agents to a "Judge Agent" node for evaluation. Without edges, nodes would exist independently and would not know where to send their results.

Relationship Between Nodes and Edges

Nodes and edges work together to create a workflow. Nodes perform the actual computation, while edges determine the order in which those computations occur. If nodes are considered the workers in a company, edges are the instructions telling each worker who should receive the task next. This combination allows LangGraph to build complex AI systems with branching logic, loops, retries, and multi-agent collaboration. A graph starts at a designated start node, follows edges between nodes, and eventually reaches an end node where the workflow is completed.


//==========================================================
now we will create a config file.

--------------------
src/config/config.ts
--------------------


import dotenv from "dotenv";

dotenv.config();

const config = {
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY || "",
    COHERE_API_KEY: process.env.COHERE_API_KEY || "",
    MISTRAL_API_KEY: process.env.MISTRAL_API_KEY || "",
}


export default config;



//==========================================================

after the config file is creted we will import this inside src/ai/model.ai.ts

--------------------
src/ai/model.ai.ts
--------------------


import { ChatGoogle } from "@langchain/google";
import { ChatCohere } from "@langchain/cohere";
import { ChatMistralAI } from "@langchain/mistralai";

import config from "../config/config.js";


export const geminiModel = new ChatGoogle({
    apiKey: config.GOOGLE_API_KEY,
    model: "gemini-flash-latest",
});

export const cohereModel = new ChatCohere({
    apiKey: config.COHERE_API_KEY,
    model: "command-a-03-2025",
});

export const mistralAIModel = new ChatMistralAI({
    apiKey: config.MISTRAL_API_KEY,
    model: "mistral-medium-latest",
});


//==========================================================

we will create one more file graph.ai.ts

stateSchema defines structure of the state in the graph.
when we create a graph , it has multiple nodes, these nodes join together to perform one task and in sequence or in parallel. if we wish to send data from one Node to another , we use proper format, that format is defined by stateSchema.

=> we need to install zod, Zod is used to validate and enforce the structure of data in JavaScript and TypeScript applications. In real-world applications, data can come from many sources such as user forms, APIs, databases, or AI model responses, and you cannot always trust that the data will have the correct format. Zod allows you to define a schema that describes exactly what your data should look like, and then it checks whether the incoming data matches that schema. If the data is valid, Zod returns it with proper TypeScript types; if not, it provides detailed error messages explaining what is wrong. This helps prevent bugs, improves application reliability, and ensures that your code works with predictable data. For example, if a user registration form requires a name (string), age (number), and email (valid email format), Zod can verify all these conditions before the data is processed or stored. In AI applications using LangGraph or LangChain, Zod is often used to ensure that an LLM's output follows a specific structure, such as returning a JSON object with required fields instead of random text, making the AI workflow more reliable and easier to manage.

npm install zod


--------------------
src/ai/graph.ai.ts
--------------------

import { END, START, StateGraph, StateSchema, type GraphNode , type CompiledStateGraph } from '@langchain/langgraph';
import z from 'zod';
import { geminiModel, cohereModel, mistralAIModel } from './model.ai.js';
import { HumanMessage } from 'langchain';
import { createAgent, providerStrategy } from 'langchain';

const state = new StateSchema({
  problem: z.string().default(''),
  solution_1: z.string().default(''),
  solution_2: z.string().default(''),
  judge: z.object({
    solution_1_score: z.number().default(0),
    solution_2_score: z.number().default(0),
    solution_1_reasoning: z.string().default(''),
    solution_2_reasoning: z.string().default(''),
  }),
});

const solutionNode: GraphNode<typeof state> = async (state) => {
  const [mistralResponse, cohereResponse] = await Promise.all([
    mistralAIModel.invoke(state.problem),
    cohereModel.invoke(state.problem),
  ]);

  return {
    solution_1: mistralResponse.text,
    solution_2: cohereResponse.text,
  };
};

/**
 * 

// here, i am using promise.all to invoke both the models in parallel. solutionNode ask for user's problem in the state, and then it will invoke both the models in parallel and return the solution.

// user will provide input in the form of state , state is an object which have problem, solution_1, solution_2, judge. Inside judge , we have solution_1_score, solution_2_score, solution_1_reasoning, solution_2_reasoning. initially our state looks like as below::

// const state = new StateSchema({
    //     problem: z.string().default(""),
    //     solution_1: z.string().default(""),
    //     solution_2: z.string().default(""),
    //     judge:z.object({
        //         solution_1_score: z.number().default(0),
        //         solution_2_score: z.number().default(0),
        //         solution_1_reasoning: z.string().default(""),
        //         solution_2_reasoning: z.string().default(""),
        //     })
        // })
        
        // user will provide the problem inside state as
        // state.problem = "Write a factorial code in JS";
// so, apart from problem property of state, all other properties are empty.
// this state will be passed to the solutionNode
// the typeof solutionNode is GraphNode<typeof state> , this GraphNode expects an argument of type typeof state
// so when we call
// solutionNode(state)
// in solutionNode , we pass the state.problem to mistralAIModel and cohereModel
// thess models works on our problem statement
// it will return the updated state. now in this updated state,
// the solution_1 and solution_2 properties will be filled with the solutions generated by the mistralAIModel and cohereModel respectively.
// apart from solution_1 and solution_2, all other properties will remain same as they were before.

// now this updated state will be passed to the judgeNode.
// the judge will have problem, solution_1 & solution_2 and it will provide solition-1-score, solition-2-score, solution-1-reasoning, solution-2-reasoning.
// it will return updated state.
*/

const judgeNode: GraphNode<typeof state> = async (state) => {
  const { problem, solution_1, solution_2 } = state;

  /**
   * judgeNode has access to problem, solution_1, solution_2 from state
   * we need to compare solution_1 & solution_2 with another AI agent
   *
   * from judge , we need the response in a perticular format as below:
   * {
   * solution_1_score:number(1-10),
   * solution_2_score:number(1-10),
   * solution_1_reasoning:string,
   * solution_2_reasoning:string
   * } if we dont get the response like this , then its quite pointless.
   *
   * so, jab mujhe AI se data proper format main chahiye hota hai, tab mujhe ak agent create karna padta hai aur wo agent mujhe data ak format main deta hain.
   *
   * to create an agent we write as
   * import { createAgent , providerStrategy} from 'langchain';
   *
   * providerStrategy is a function which is used to provide the response format to the agent.
   *
   * NOTE: to create an agent , if we dont use geminiModel but some other model eg: mistal, cohere, gpt, etc. then providerStrategy will not be used. instead we have to use toolStrategy
   */

  const judge = createAgent({
    model: geminiModel,
    responseFormat: providerStrategy(
      z.object({
        solution_1_score: z.number().min(0).max(10),
        solution_2_score: z.number().min(0).max(10),
        solution_1_reasoning: z.string(),
        solution_2_reasoning: z.string(),
      })
    ),
    systemPrompt: `You are a judge tasked with evaluating two solutions generated by different AI models. Please provide a score out of 10 for each solution, along with your reasoning for the scores.`,
  });

  /**
   * in the above "judge" we have given system instruction on what to do and how to do. we have told judge on how to generate response:::
   * 
   *   responseFormat: providerStrategy(
      z.object({
        solution_1_score: z.number().min(0).max(10),
        solution_2_score: z.number().min(0).max(10),
        solution_1_reasoning: z.string(),
        solution_2_reasoning: z.string(),
      })
    ),

    
    /**
     * now we are invoking the judge agent with the problem statement and the solutions generated by the mistralAIModel and cohereModel.
     * the judge agent will provide the response in the format specified by the providerStrategy.
     * the response will be in the form of an object with the following properties:
     * solution_1_score:number(1-10),
     * solution_2_score:number(1-10),
     * solution_1_reasoning:string,
     * solution_2_reasoning:string
     * 
     *  
   */

  const judgeResponse = await judge.invoke({
    messages: [
      new HumanMessage(`
                Problem: ${problem}
                Solution 1: ${solution_1}
                Solution 2: ${solution_2}
                Please evaluate the solutions and provide scores and reasoning.
                `),
    ],
  });

  /**
   * since we are telling to return a response , we will get the response in the form of object with keys solution_1_score, solution_2_score, solution_1_reasoning, solution_2_reasoning
   * this response will only provided in structuredResponse property of judgeResponse
   *
   */
  const {
    solution_1_score,
    solution_2_score,
    solution_1_reasoning,
    solution_2_reasoning,
  } = judgeResponse.structuredResponse;

  return {
    judge: {
      solution_1_score,
      solution_2_score,
      solution_1_reasoning,
      solution_2_reasoning,
    },
  };
};

/**
 * in langGraph , bydefault there are two nodes, START & END. START node is used to start the graph. END node is used to end the graph.
 * now lets create a graph.
 * 
 */

const graph = new StateGraph(state)
    .addNode("solution", solutionNode)
    .addNode("judge_node", judgeNode)
    .addEdge(START, "solution")
    .addEdge("solution", "judge_node")
    .addEdge("judge_node", END)
    .compile()


export default async function (problem: string) {
    const result =  await graph.invoke({
        problem: problem
    })

    /**
     * here, our solution node expects a problem from state , we are just invoking the graph with the problem statement. so the START node will only have problem that will so to solutionNode . solutionNode will generate solution_1 , solution_2 . so , along with problem, solution_1 , solution_2 , the entire state will reach the judgeNode. judge will do the needful and end it the final state will come to invoke function as result and we return it.        
     */
    return result;
}



//==========================================================

now , i'll just make small changes in app.ts


----------
src/app.ts
----------

import express from 'express';
import runGraph from './ai/graph.ai.js';

const app = express();

app.get('/', async (req, res) => {
  const result = await runGraph('write a code for factorial function in JS');
  res.json(result);
});

export default app;


