import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const scenariosDirectory = path.join(process.cwd(), 'content/scenarios');

// ENSURE THE NAME MATCHES: getAllScenarios
export function getAllScenarios() {
  // Create folder if it doesn't exist to prevent crash
  if (!fs.existsSync(scenariosDirectory)) {
    fs.mkdirSync(scenariosDirectory, { recursive: true });
    return [];
  }

  const fileNames = fs.readdirSync(scenariosDirectory);
  
  return fileNames
    .filter(fileName => fileName.endsWith('.mdx'))
    .map((fileName) => {
      const id = fileName.replace(/\.mdx$/, '');
      const fullPath = path.join(scenariosDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data } = matter(fileContents);

      return {
        id,
        ...data,
      };
    });
}

export async function getScenarioById(id: string) {
  const fullPath = path.join(scenariosDirectory, `${id}.mdx`);
  
  if (!fs.existsSync(fullPath)) {
    throw new Error("File not found");
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    metadata: data,
    content,
  };
}