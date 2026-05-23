// Custom code parser/checker for Task Parse
//
// HOW IT WORKS (easy explanation for viva):
//   1. Every assignment has a list of "required_keywords" (saved as comma-separated text).
//   2. When a student submits code, we read each required keyword.
//   3. We check if the keyword is present in the submitted code (case-insensitive).
//   4. We also do a few language-specific checks like:
//        - Required function exists (e.g. "main" in C++/C/Java)
//        - Required synchronization directive (e.g. "synchronized" in Java)
//        - Detect obviously empty or very short code
//   5. We collect all messages (pass/fail) and return them.
//
// This is not a real compiler. It is a simple string-based checker, which is
// enough for a university project demo.

export function checkCode(code, assignment) {
  const messages = [];
  let passed = true;

  // 1. Basic checks
  const cleanCode = (code || "").trim();
  if (cleanCode.length === 0) {
    return {
      passed: false,
      messages: ["Code is empty. Please write your solution before submitting."],
    };
  }
  if (cleanCode.length < 10) {
    messages.push("Warning: Code looks too short.");
    passed = false;
  }

  // 2. Required keywords check (set by instructor when creating the assignment)
  const lowerCode = cleanCode.toLowerCase();
  const requiredKeywords = (assignment.required_keywords || "")
    .split(",")
    .map((k) => k.trim())
    .filter((k) => k.length > 0);

  for (const keyword of requiredKeywords) {
    if (lowerCode.includes(keyword.toLowerCase())) {
      messages.push(`OK: Found required keyword "${keyword}".`);
    } else {
      messages.push(`Missing: Required keyword "${keyword}" not found.`);
      passed = false;
    }
  }

  // 3. Language-specific checks
  // We do small per-language rules. Easy to extend later.
  const lang = (assignment.language || "").toLowerCase();

  if (lang === "c++" || lang === "c") {
    if (!/main\s*\(/.test(cleanCode)) {
      messages.push("Missing: A 'main' function is required.");
      passed = false;
    }
    if (!cleanCode.includes("#include")) {
      messages.push("Missing: At least one '#include' statement is required.");
      passed = false;
    }
  }

  if (lang === "java") {
    if (!/class\s+\w+/.test(cleanCode)) {
      messages.push("Missing: A class declaration is required in Java.");
      passed = false;
    }
    if (!/public\s+static\s+void\s+main/.test(cleanCode)) {
      messages.push("Missing: Java entry point 'public static void main' not found.");
      passed = false;
    }
    // Synchronization directive check (only flagged if instructor required it)
    if (
      requiredKeywords.includes("synchronized") &&
      !/synchronized/.test(cleanCode)
    ) {
      messages.push("Missing: 'synchronized' keyword expected for this assignment.");
      passed = false;
    }
  }

  if (lang === "python") {
    if (!/def\s+\w+\s*\(/.test(cleanCode)) {
      messages.push("Missing: At least one Python function (def) is required.");
      passed = false;
    }
  }

  if (lang === "javascript") {
    if (!/(function\s+\w+|=>)/.test(cleanCode)) {
      messages.push("Missing: At least one JavaScript function is required.");
      passed = false;
    }
  }

  if (lang === "html") {
    if (!/<html[\s>]/i.test(cleanCode)) {
      messages.push("Missing: <html> tag not found.");
      passed = false;
    }
    if (!/<body[\s>]/i.test(cleanCode)) {
      messages.push("Missing: <body> tag not found.");
      passed = false;
    }
  }

  if (lang === "css" || lang === "tailwind css") {
    // For CSS we just check that braces exist (very basic)
    if (!cleanCode.includes("{") || !cleanCode.includes("}")) {
      messages.push("Missing: CSS rule blocks { ... } not found.");
      passed = false;
    }
  }

  // 4. Final message
  if (passed) {
    messages.push("All checks passed. You can submit confidently.");
  } else {
    messages.push("Some checks failed. Please fix the issues above.");
  }

  return { passed, messages };
}
