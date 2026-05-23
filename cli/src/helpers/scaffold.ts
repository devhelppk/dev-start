import path from "node:path";
import fs from "fs-extra";
import {
  resolveTemplateBaseDir,
  resolveTemplateExtraDir,
} from "./template-paths.js";

/**
 * Dotfiles that npm strips during publish.
 * Stored with a leading underscore in the template and restored on scaffold.
 */
export const DOTFILE_RENAMES: Record<string, string> = {
  _agents: ".agents",
  _claude: ".claude",
  _github: ".github",
  _gitignore: ".gitignore",
  _gitkeep: ".gitkeep",
  _husky: ".husky",
  "_env.schema": ".env.schema",
  "_env.development": ".env.development",
  "_env.staging": ".env.staging",
  "_env.production": ".env.production",
  "_oxlintrc.json": ".oxlintrc.json",
  "_oxfmtrc.json": ".oxfmtrc.json",
};

export async function restoreDotEntries(dir: string): Promise<void> {
  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const entryPath = path.join(dir, entry.name);
    const renamed = DOTFILE_RENAMES[entry.name];

    if (renamed) {
      const renamedPath = path.join(dir, renamed);
      await fs.rename(entryPath, renamedPath);

      if ((await fs.stat(renamedPath)).isDirectory()) {
        await restoreDotEntries(renamedPath);
      }

      continue;
    }

    if (entry.isDirectory()) {
      await restoreDotEntries(entryPath);
      continue;
    }
  }
}

export const SKIPPED_TEMPLATE_FILES = new Set(["bun.lock"]);

export type MergeHandler = (sourceDir: string, targetDir: string) => Promise<void>;

function shouldSkipTemplateFile(src: string): boolean {
  return SKIPPED_TEMPLATE_FILES.has(path.basename(src)) || path.basename(src) in MERGE_HANDLERS;
}

async function mergePackageJson(sourceDir: string, targetDir: string): Promise<void> {
  const sourcePath = path.join(sourceDir, "package.json");
  const targetPath = path.join(targetDir, "package.json");

  if (!(await fs.pathExists(sourcePath)) || !(await fs.pathExists(targetPath))) {
    return;
  }

  const sourcePkg = await fs.readJson(sourcePath);
  const targetPkg = await fs.readJson(targetPath);

  const mergeRecord = (key: string) => {
    if (!sourcePkg[key]) {
      return;
    }

    const targetRecord = targetPkg[key] || {};

    targetPkg[key] = {
      ...targetRecord,
      ...sourcePkg[key],
    };
  };

  mergeRecord("scripts");
  mergeRecord("dependencies");
  mergeRecord("devDependencies");
  mergeRecord("peerDependencies");
  mergeRecord("optionalDependencies");
  mergeRecord("lint-staged");
  mergeRecord("config");
  mergeRecord("overrides");

  await fs.writeJson(targetPath, targetPkg, { spaces: 2 });
}

interface MarkdownSection {
  heading: string;
  content: string;
}

function parseMarkdownSections(text: string): { preamble: string; sections: MarkdownSection[] } {
  const lines = text.split("\n");
  let preamble = "";
  const sections: MarkdownSection[] = [];
  let currentHeading = "";
  let currentLines: string[] = [];

  for (const line of lines) {
    if (line.startsWith("## ")) {
      if (currentHeading) {
        sections.push({ heading: currentHeading, content: currentLines.join("\n") });
      } else {
        preamble = currentLines.join("\n");
      }
      currentHeading = line;
      currentLines = [];
    } else {
      currentLines.push(line);
    }
  }

  if (currentHeading) {
    sections.push({ heading: currentHeading, content: currentLines.join("\n") });
  } else {
    preamble = currentLines.join("\n");
  }

  return { preamble, sections };
}

function mergeMarkdownSections(target: string, source: string): string {
  const targetParsed = parseMarkdownSections(target);
  const sourceParsed = parseMarkdownSections(source);
  const merged = [...targetParsed.sections];

  for (const sourceSection of sourceParsed.sections) {
    const existingIndex = merged.findIndex((s) => s.heading === sourceSection.heading);

    if (existingIndex >= 0) {
      merged[existingIndex] = sourceSection;
    } else {
      merged.push(sourceSection);
    }
  }

  const parts: string[] = [];

  if (targetParsed.preamble.trim()) {
    parts.push(targetParsed.preamble);
  }

  for (const section of merged) {
    parts.push(`${section.heading}\n${section.content}`);
  }

  return `${parts.join("\n").replace(/\n{3,}/gu, "\n\n").trimEnd()}\n`;
}

async function mergeMarkdownFile(filename: string, sourceDir: string, targetDir: string): Promise<void> {
  const sourcePath = path.join(sourceDir, filename);
  const targetPath = path.join(targetDir, filename);

  if (!(await fs.pathExists(sourcePath))) {
    return;
  }

  if (!(await fs.pathExists(targetPath))) {
    await fs.copy(sourcePath, targetPath, { overwrite: false });
    return;
  }

  const targetContent = await fs.readFile(targetPath, "utf8");
  const sourceContent = await fs.readFile(sourcePath, "utf8");
  const merged = mergeMarkdownSections(targetContent, sourceContent);

  await fs.writeFile(targetPath, merged);
}

async function mergeClaudeMd(sourceDir: string, targetDir: string): Promise<void> {
  await mergeMarkdownFile("CLAUDE.md", sourceDir, targetDir);
}

async function mergeReadme(sourceDir: string, targetDir: string): Promise<void> {
  await mergeMarkdownFile("README.md", sourceDir, targetDir);
}

async function mergeGitignore(sourceDir: string, targetDir: string): Promise<void> {
  const sourcePath = path.join(sourceDir, "_gitignore");

  if (!(await fs.pathExists(sourcePath))) {
    return;
  }

  // After restoreDotEntries, _gitignore becomes .gitignore in the target.
  const underscorePath = path.join(targetDir, "_gitignore");
  const dotPath = path.join(targetDir, ".gitignore");
  const targetPath = (await fs.pathExists(underscorePath)) ? underscorePath : dotPath;

  if (!(await fs.pathExists(targetPath))) {
    await fs.copy(sourcePath, targetPath, { overwrite: false });
    return;
  }

  const targetLines = (await fs.readFile(targetPath, "utf8")).split("\n");
  const sourceLines = (await fs.readFile(sourcePath, "utf8")).split("\n");
  const seen = new Set<string>();
  const mergedLines: string[] = [];

  for (const line of [...targetLines, ...sourceLines]) {
    if (seen.has(line)) {
      continue;
    }

    seen.add(line);
    mergedLines.push(line);
  }

  await fs.writeFile(targetPath, `${mergedLines.join("\n").replace(/\n+$/u, "")}\n`);
}

function appendEnvFile(underscoreName: string): MergeHandler {
  const dotName = DOTFILE_RENAMES[underscoreName] ?? underscoreName;

  return async function mergeEnvFile(sourceDir: string, targetDir: string): Promise<void> {
    const sourcePath = path.join(sourceDir, underscoreName);

    if (!(await fs.pathExists(sourcePath))) {
      return;
    }

    // After restoreDotEntries, the underscore form has been renamed in the target.
    // Check both names to support sub-template application after dotfile renames.
    const underscorePath = path.join(targetDir, underscoreName);
    const dotPath = path.join(targetDir, dotName);
    const targetPath = (await fs.pathExists(underscorePath)) ? underscorePath : dotPath;

    if (!(await fs.pathExists(targetPath))) {
      await fs.copy(sourcePath, targetPath, { overwrite: false });
      return;
    }

    const targetContent = (await fs.readFile(targetPath, "utf8")).trimEnd();
    const sourceContent = (await fs.readFile(sourcePath, "utf8")).trimEnd();

    await fs.writeFile(targetPath, `${targetContent}\n\n${sourceContent}\n`);
  };
}

export const MERGE_HANDLERS: Record<string, MergeHandler> = {
  _gitignore: mergeGitignore,
  "_env.schema": appendEnvFile("_env.schema"),
  "_env.development": appendEnvFile("_env.development"),
  "_env.staging": appendEnvFile("_env.staging"),
  "_env.production": appendEnvFile("_env.production"),
  "CLAUDE.md": mergeClaudeMd,
  "README.md": mergeReadme,
  "package.json": mergePackageJson,
};

async function applyExtras(
  template: string,
  targetDir: string,
  extras: string[],
  excludeSubDirs?: Record<string, string[]>,
): Promise<void> {
  for (const extra of extras) {
    const extraDir = await resolveTemplateExtraDir(template, extra);

    if (!(await fs.pathExists(extraDir))) {
      throw new Error(`Template extra "${template}/${extra}" not found at ${extraDir}`);
    }

    const excluded = excludeSubDirs?.[extra] ?? [];
    const excludedPaths = excluded.map((sub) => path.join(extraDir, sub));

    await fs.copy(extraDir, targetDir, {
      overwrite: true,
      filter: (src) => {
        if (shouldSkipTemplateFile(src)) return false;
        for (const ep of excludedPaths) {
          if (src === ep || src.startsWith(`${ep}/`) || src.startsWith(`${ep}\\`)) return false;
        }
        return true;
      },
    });

    for (const [filename, handler] of Object.entries(MERGE_HANDLERS)) {
      if (!(await fs.pathExists(path.join(extraDir, filename)))) {
        continue;
      }

      await handler(extraDir, targetDir);
    }
  }
}

async function ensureExecutableFiles(dir: string): Promise<void> {
  if (!(await fs.pathExists(dir))) {
    return;
  }

  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isFile()) {
      continue;
    }

    await fs.chmod(path.join(dir, entry.name), 0o755);
  }
}

async function ensureExecutableWorkflowScripts(targetDir: string): Promise<void> {
  const scriptsDir = path.join(targetDir, ".claude", "scripts");

  await ensureExecutableFiles(scriptsDir);
}

async function ensureExecutableHuskyHooks(targetDir: string): Promise<void> {
  const huskyDir = path.join(targetDir, ".husky");
  await ensureExecutableFiles(huskyDir);
}

async function createAgentsSkillsSymlink(targetDir: string): Promise<void> {
  const claudeSkillsDir = path.join(targetDir, ".claude", "skills");

  if (!(await fs.pathExists(claudeSkillsDir))) {
    return;
  }

  const agentsDir = path.join(targetDir, ".agents");
  await fs.ensureDir(agentsDir);

  const symlinkPath = path.join(agentsDir, "skills");

  if (await fs.pathExists(symlinkPath)) {
    return;
  }

  await fs.symlink(path.join("..", ".claude", "skills"), symlinkPath);
}

export async function applyExtraSubTemplate(
  template: string,
  targetDir: string,
  extra: string,
  subDir: string,
): Promise<void> {
  const extraDir = await resolveTemplateExtraDir(template, extra);
  const subTemplateDir = path.join(extraDir, subDir);

  if (!(await fs.pathExists(subTemplateDir))) {
    throw new Error(`Sub-template "${template}/${extra}/${subDir}" not found at ${subTemplateDir}`);
  }

  await fs.copy(subTemplateDir, targetDir, {
    overwrite: true,
    filter: (src) => !shouldSkipTemplateFile(src),
  });

  for (const [filename, handler] of Object.entries(MERGE_HANDLERS)) {
    if (!(await fs.pathExists(path.join(subTemplateDir, filename)))) {
      continue;
    }

    await handler(subTemplateDir, targetDir);
  }
}

export async function scaffold(
  template: string,
  targetDir: string,
  extras: string[] = [],
  excludeSubDirs?: Record<string, string[]>,
): Promise<void> {
  const templateDir = await resolveTemplateBaseDir(template);

  if (!(await fs.pathExists(templateDir))) {
    throw new Error(`Template "${template}" not found at ${templateDir}`);
  }

  // Copy entire base template
  await fs.copy(templateDir, targetDir, { overwrite: false });

  await applyExtras(template, targetDir, extras, excludeSubDirs);

  // Restore dotfiles stripped from the published package.
  await restoreDotEntries(targetDir);
  await ensureExecutableWorkflowScripts(targetDir);
  await ensureExecutableHuskyHooks(targetDir);
  await createAgentsSkillsSymlink(targetDir);
}
