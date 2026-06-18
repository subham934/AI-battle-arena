/**
 * Battle Service
 *
 * Simulates calling an AI battle API.
 * Returns mock battle data based on the user's problem.
 * Replace `fetchBattleResponse` with a real API call when ready.
 */

const SAMPLE_DATA = {
  "problem": "write a code for factorial function in JS",
  "solution_1": "Here's a simple JavaScript function to calculate the factorial of a number:\n\n```javascript\n// Recursive approach\nfunction factorial(n) {\n    if (n === 0 || n === 1) {\n        return 1;\n    }\n    return n * factorial(n - 1);\n}\n\n// Iterative approach\nfunction factorialIterative(n) {\n    let result = 1;\n    for (let i = 2; i <= n; i++) {\n        result *= i;\n    }\n    return result;\n}\n\n// Example usage\nconsole.log(factorial(5));      // Output: 120\nconsole.log(factorialIterative(5)); // Output: 120\n```\n\n### With input validation:\n```javascript\nfunction factorial(n) {\n    if (n < 0 || !Number.isInteger(n)) {\n        throw new Error(\"Factorial is only defined for non-negative integers.\");\n    }\n    return n <= 1 ? 1 : n * factorial(n - 1);\n}\n```",
  "solution_2": "Certainly! Below is a simple implementation of a factorial function in JavaScript.\n\n```javascript\nfunction factorial(n) {\n    if (n < 0) {\n        return \"Factorial is not defined for negative numbers.\";\n    }\n    if (n === 0 || n === 1) {\n        return 1;\n    }\n    let result = 1;\n    for (let i = 2; i <= n; i++) {\n        result *= i;\n    }\n    return result;\n}\n\n// Example usage:\nconsole.log(factorial(5)); // Output: 120\nconsole.log(factorial(0)); // Output: 1\nconsole.log(factorial(-1)); // Output: \"Factorial is not defined for negative numbers.\"\n```",
  "judge": {
    "solution_1_score": 10,
    "solution_2_score": 8,
    "solution_1_reasoning": "Solution 1 is excellent. It provides both recursive and iterative approaches, demonstrating a comprehensive understanding of the problem. It correctly implements both methods, handles base cases, and provides clear explanations regarding efficiency and potential stack overflow issues for the recursive approach. Crucially, it also includes robust input validation, throwing an actual error for invalid input (negative numbers or non-integers), which is best practice in JavaScript. The code is well-commented with examples and notes.",
    "solution_2_reasoning": "Solution 2 provides a correct and efficient iterative solution for the factorial function. It handles base cases (0 and 1) and negative inputs correctly. The explanation is clear and concise. However, it returns a string message for negative inputs instead of throwing an error, which is generally less ideal for error handling in JavaScript programs. It also does not include validation for non-integer inputs. While a good solution, it is not as comprehensive or robust in its error handling as Solution 1."
  }
};

// Problem-specific variations to make it feel dynamic
const generateVariant = (problem) => {
  const lowerProblem = problem.toLowerCase();

  if (lowerProblem.includes('sort') || lowerProblem.includes('sorting')) {
    return {
      problem,
      solution_1: "```javascript\n// Quick Sort (Divide and Conquer)\nfunction quickSort(arr) {\n    if (arr.length <= 1) return arr;\n    const pivot = arr[Math.floor(arr.length / 2)];\n    const left = arr.filter(x => x < pivot);\n    const middle = arr.filter(x => x === pivot);\n    const right = arr.filter(x => x > pivot);\n    return [...quickSort(left), ...middle, ...quickSort(right)];\n}\n\n// With validation\nfunction safeSort(arr) {\n    if (!Array.isArray(arr)) throw new Error('Input must be an array');\n    return quickSort([...arr]);\n}\n\nconsole.log(safeSort([3, 1, 4, 1, 5, 9, 2, 6])); // [1,1,2,3,4,5,6,9]\n```",
      solution_2: "```javascript\n// Bubble Sort (Simple iterative)\nfunction bubbleSort(arr) {\n    if (!Array.isArray(arr)) {\n        return 'Input must be an array';\n    }\n    const result = [...arr];\n    const n = result.length;\n    for (let i = 0; i < n - 1; i++) {\n        for (let j = 0; j < n - i - 1; j++) {\n            if (result[j] > result[j + 1]) {\n                [result[j], result[j + 1]] = [result[j + 1], result[j]];\n            }\n        }\n    }\n    return result;\n}\n\nconsole.log(bubbleSort([64, 34, 25, 12])); // [12,25,34,64]\n```",
      judge: {
        solution_1_score: 9,
        solution_2_score: 7,
        solution_1_reasoning: "Solution 1 uses Quick Sort which has O(n log n) average complexity, far superior to Bubble Sort. It properly handles edge cases, avoids mutating the input array, and includes error validation by throwing an Error. The recursive approach is clean and idiomatic.",
        solution_2_reasoning: "Solution 2 uses Bubble Sort with O(n²) complexity, which is inefficient for large datasets. It returns a string for errors rather than throwing, which is poor practice. However, it's simple to understand and correctly handles the basic case."
      }
    };
  }

  if (lowerProblem.includes('fibonacci') || lowerProblem.includes('fib')) {
    return {
      problem,
      solution_1: "```javascript\n// Memoized Fibonacci (optimal recursive)\nfunction fibonacci(n, memo = {}) {\n    if (n < 0 || !Number.isInteger(n)) {\n        throw new Error('Input must be a non-negative integer');\n    }\n    if (n <= 1) return n;\n    if (memo[n]) return memo[n];\n    memo[n] = fibonacci(n - 1, memo) + fibonacci(n - 2, memo);\n    return memo[n];\n}\n\nconsole.log(fibonacci(10)); // 55\nconsole.log(fibonacci(50)); // 12586269025\n```",
      solution_2: "```javascript\n// Iterative Fibonacci\nfunction fibonacci(n) {\n    if (n < 0) return 'Input must be non-negative';\n    if (n === 0) return 0;\n    if (n === 1) return 1;\n    let a = 0, b = 1;\n    for (let i = 2; i <= n; i++) {\n        let temp = a + b;\n        a = b;\n        b = temp;\n    }\n    return b;\n}\n\nconsole.log(fibonacci(10)); // 55\n```",
      judge: {
        solution_1_score: 10,
        solution_2_score: 8,
        solution_1_reasoning: "Solution 1 uses memoization to achieve O(n) time with recursive elegance. It properly validates input by throwing errors, handles edge cases well, and efficiently caches results to avoid redundant calculations. This is the most versatile approach.",
        solution_2_reasoning: "Solution 2 is iterative with O(n) time and O(1) space—very memory efficient. However, it uses a string return for errors instead of throwing, and lacks validation for non-integer inputs. Still a solid, practical solution for large n values."
      }
    };
  }

  // Default: return the sample data with the user's problem
  return { ...SAMPLE_DATA, problem };
};

/**
 * Simulates an AI battle API call with a 2-3 second delay.
 * @param {string} problem - The user's coding problem
 * @returns {Promise<Object>} Battle data with solutions and judge verdict
 */
export const fetchBattleResponse = async (problem) => {
  // Simulate network delay (2-3 seconds)
  const delay = 2000 + Math.random() * 1000;
  await new Promise(resolve => setTimeout(resolve, delay));

  // Return problem-specific or default data
  return generateVariant(problem);
};
