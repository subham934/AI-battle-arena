import express from 'express';
import runGraph from './ai/graph.ai.js';

const app = express();

app.get('/', async (req, res) => {
  try {
    const result = await runGraph('write a code for factorial function in JS');
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(503).json({
      error: 'AI model is temporarily unavailable. Please try again later.',
    });
  }
});
export default app;
