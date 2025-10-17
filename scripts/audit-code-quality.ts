import { glob } from "glob"
import { readFileSync } from "fs"
import path from "path"

interface Issue {
  file: string
  line: number
  type: string
  message: string
}

const patterns = {
  anyTypes: /:\s*any\b/g,
  functionDecls: /^\s*function\s+\w+/gm,
  varDecls: /^\s*var\s+/gm,
  consoleLog: /console\.(log|warn|error|debug)/g,
  todoComments: /\/\/\s*(TODO|FIXME|HACK|XXX)/gi,
  noReturnType: /^\s*(export\s+)?(const|let)\s+\w+\s*=\s*\([^)]*\)\s*=>/gm,
  unusedImports: /^import\s+.*from/gm,
  inlineStyles: /style=\{\{/g,
  magicNumbers: /\b(3600|86400|1000|60)\b/g,
  longLines: /.{120,}/g,
}

const auditCodeQuality = async () => {
  console.log("🔍 Starting code quality audit...\n")

  const files = await glob("**/*.{ts,tsx}", {
    ignore: [
      "node_modules/**",
      ".next/**",
      "dist/**",
      "build/**",
      "coverage/**",
      "scripts/**",
      "*.config.*",
      "*.test.*",
      "*.spec.*",
    ],
  })

  const issues: Issue[] = []
  const stats = {
    totalFiles: files.length,
    filesWithIssues: 0,
    anyTypes: 0,
    functionDecls: 0,
    varDecls: 0,
    consoleLogs: 0,
    todoComments: 0,
    noReturnTypes: 0,
    inlineStyles: 0,
    magicNumbers: 0,
    longLines: 0,
  }

  for (const file of files) {
    const content = readFileSync(file, "utf-8")
    const lines = content.split("\n")
    let hasIssues = false

    // Check for 'any' types
    const anyMatches = Array.from(content.matchAll(patterns.anyTypes))
    for (const match of anyMatches) {
      const lineNum = content.substring(0, match.index).split("\n").length
      issues.push({
        file,
        line: lineNum,
        type: "any-type",
        message: "Found 'any' type - use specific types instead",
      })
      stats.anyTypes++
      hasIssues = true
    }

    // Check for function declarations
    const functionMatches = Array.from(content.matchAll(patterns.functionDecls))
    for (const match of functionMatches) {
      const lineNum = content.substring(0, match.index).split("\n").length
      // Skip if it's a React component or interface method
      if (!match[0].includes("export default function") &&
          !match[0].includes("interface")) {
        issues.push({
          file,
          line: lineNum,
          type: "function-declaration",
          message: "Use arrow functions for consistency",
        })
        stats.functionDecls++
        hasIssues = true
      }
    }

    // Check for var declarations
    const varMatches = Array.from(content.matchAll(patterns.varDecls))
    for (const match of varMatches) {
      const lineNum = content.substring(0, match.index).split("\n").length
      issues.push({
        file,
        line: lineNum,
        type: "var-declaration",
        message: "Use 'const' or 'let' instead of 'var'",
      })
      stats.varDecls++
      hasIssues = true
    }

    // Check for console statements
    if (!file.includes(".test.") && !file.includes(".spec.")) {
      const consoleMatches = Array.from(content.matchAll(patterns.consoleLog))
      for (const match of consoleMatches) {
        const lineNum = content.substring(0, match.index).split("\n").length
        issues.push({
          file,
          line: lineNum,
          type: "console-statement",
          message: "Remove console statements - use proper logging",
        })
        stats.consoleLogs++
        hasIssues = true
      }
    }

    // Check for TODO comments
    const todoMatches = Array.from(content.matchAll(patterns.todoComments))
    for (const match of todoMatches) {
      const lineNum = content.substring(0, match.index).split("\n").length
      issues.push({
        file,
        line: lineNum,
        type: "todo-comment",
        message: `Found ${match[1]} comment - track in issue tracker instead`,
      })
      stats.todoComments++
      hasIssues = true
    }

    // Check for inline styles in TSX files
    if (file.endsWith(".tsx")) {
      const styleMatches = Array.from(content.matchAll(patterns.inlineStyles))
      for (const match of styleMatches) {
        const lineNum = content.substring(0, match.index).split("\n").length
        issues.push({
          file,
          line: lineNum,
          type: "inline-style",
          message: "Avoid inline styles - use CSS classes or styled components",
        })
        stats.inlineStyles++
        hasIssues = true
      }
    }

    // Check for magic numbers
    const magicMatches = Array.from(content.matchAll(patterns.magicNumbers))
    for (const match of magicMatches) {
      const lineNum = content.substring(0, match.index).split("\n").length
      const line = lines[lineNum - 1]
      // Skip if it's in a constant declaration or import
      if (!line?.includes("const") && !line?.includes("import")) {
        issues.push({
          file,
          line: lineNum,
          type: "magic-number",
          message: `Magic number '${match[0]}' - extract to named constant`,
        })
        stats.magicNumbers++
        hasIssues = true
      }
    }

    // Check for long lines
    lines.forEach((line, index) => {
      if (line.length > 120) {
        issues.push({
          file,
          line: index + 1,
          type: "long-line",
          message: `Line exceeds 120 characters (${line.length} chars)`,
        })
        stats.longLines++
        hasIssues = true
      }
    })

    if (hasIssues) {
      stats.filesWithIssues++
    }
  }

  // Sort issues by file and line number
  issues.sort((a, b) => {
    if (a.file !== b.file) {
      return a.file.localeCompare(b.file)
    }
    return a.line - b.line
  })

  // Print summary
  console.log("📊 Code Quality Audit Summary")
  console.log("─".repeat(50))
  console.log(`Total files scanned: ${stats.totalFiles}`)
  console.log(`Files with issues: ${stats.filesWithIssues}`)
  console.log(`Total issues found: ${issues.length}`)
  console.log("")

  if (issues.length > 0) {
    console.log("📋 Issue Breakdown:")
    console.log(`  • 'any' types: ${stats.anyTypes}`)
    console.log(`  • Function declarations: ${stats.functionDecls}`)
    console.log(`  • 'var' declarations: ${stats.varDecls}`)
    console.log(`  • Console statements: ${stats.consoleLogs}`)
    console.log(`  • TODO comments: ${stats.todoComments}`)
    console.log(`  • Inline styles: ${stats.inlineStyles}`)
    console.log(`  • Magic numbers: ${stats.magicNumbers}`)
    console.log(`  • Long lines: ${stats.longLines}`)
    console.log("")

    // Group issues by file
    const issuesByFile = issues.reduce((acc, issue) => {
      if (!acc[issue.file]) {
        acc[issue.file] = []
      }
      acc[issue.file].push(issue)
      return acc
    }, {} as Record<string, Issue[]>)

    console.log("🔍 Detailed Issues (top 10 files):")
    console.log("─".repeat(50))

    const topFiles = Object.entries(issuesByFile)
      .sort((a, b) => b[1].length - a[1].length)
      .slice(0, 10)

    for (const [file, fileIssues] of topFiles) {
      const relativePath = path.relative(process.cwd(), file)
      console.log(`\n📄 ${relativePath} (${fileIssues.length} issues)`)

      // Show first 5 issues for each file
      fileIssues.slice(0, 5).forEach((issue) => {
        console.log(`  L${issue.line}: [${issue.type}] ${issue.message}`)
      })

      if (fileIssues.length > 5) {
        console.log(`  ... and ${fileIssues.length - 5} more issues`)
      }
    }

    // Generate fix suggestions
    console.log("\n\n✨ Quick Fix Suggestions:")
    console.log("─".repeat(50))

    if (stats.anyTypes > 0) {
      console.log("• Replace 'any' types:")
      console.log("  - Use specific interfaces or types")
      console.log("  - Use 'unknown' if type is truly unknown")
      console.log("  - Use generics for flexible but type-safe code")
    }

    if (stats.functionDecls > 0) {
      console.log("• Convert to arrow functions:")
      console.log("  - const functionName = () => { ... }")
      console.log("  - const functionName = async () => { ... }")
    }

    if (stats.consoleLogs > 0) {
      console.log("• Replace console statements:")
      console.log("  - Use the error-logger utility")
      console.log("  - import { logError, logMessage } from '@/lib/error-logger'")
    }

    if (stats.inlineStyles > 0) {
      console.log("• Replace inline styles:")
      console.log("  - Use Tailwind CSS classes")
      console.log("  - Create CSS modules for complex styles")
    }

    // Exit with error code if issues found
    if (issues.length > 0) {
      console.log("\n\n❌ Code quality check failed")
      console.log("Run 'pnpm lint --fix' to auto-fix some issues")
      process.exit(1)
    }
  } else {
    console.log("\n✅ No code quality issues found!")
  }
}

// Run the audit
auditCodeQuality().catch((error) => {
  console.error("Error running audit:", error)
  process.exit(1)
})