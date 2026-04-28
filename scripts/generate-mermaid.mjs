import { readFileSync, writeFileSync, readdirSync, statSync, existsSync, mkdirSync } from 'fs'
import { join, extname } from 'path'
import { execSync } from 'child_process'
import crypto from 'crypto'

const CONTENT_DIR = join(process.cwd(), 'content')
const PUBLIC_DIR = join(process.cwd(), 'public', 'mermaid')
const CACHE_FILE = join(process.cwd(), 'mermaid-cache.json')

if (!existsSync(PUBLIC_DIR)) {
  mkdirSync(PUBLIC_DIR, { recursive: true })
}

let cache = {}
if (existsSync(CACHE_FILE)) {
  try {
    cache = JSON.parse(readFileSync(CACHE_FILE, 'utf8'))
  } catch (e) {
    console.error('Failed to parse cache file, starting fresh.')
  }
}

function getFiles(dir) {
  const files = []
  for (const file of readdirSync(dir)) {
    const fullPath = join(dir, file)
    if (statSync(fullPath).isDirectory()) {
      files.push(...getFiles(fullPath))
    } else if (extname(fullPath) === '.md') {
      files.push(fullPath)
    }
  }
  return files
}

const files = getFiles(CONTENT_DIR)
console.log(`Scanning ${files.length} markdown files...`)

// Match ::mermaid{name="my-name"} ... ::
// Using regex to capture name and the code body. Must start at beginning of line.
const mdcRegex = /^::mermaid\s*\{[^}]*name="([^"]+)"[^}]*\}\s*\n([\s\S]*?)\n::/gm

for (const file of files) {
  let content = readFileSync(file, 'utf8')
  
  let match;
  while ((match = mdcRegex.exec(content)) !== null) {
    const name = match[1]
    const code = match[2].trim()
    
    if (!code) continue;
    
    const hash = crypto.createHash('sha256').update(code).digest('hex')
    const fileName = `${name}.svg`
    const filePath = join(PUBLIC_DIR, fileName)
    
    // Check if we need to generate
    if (cache[name] === hash && existsSync(filePath)) {
      console.log(`Skipping ${name} in ${file} (no changes)`)
      continue;
    }
    
    console.log(`Generating image for diagram ${name} in ${file}`)
    const tmpFile = join(process.cwd(), 'tmp', `${hash}.mmd`)
    if (!existsSync(join(process.cwd(), 'tmp'))) mkdirSync(join(process.cwd(), 'tmp'))
    writeFileSync(tmpFile, code)
    
    try {
      execSync(`npx mmdc -i "${tmpFile}" -o "${filePath}" -b transparent`, { stdio: 'inherit' })
      cache[name] = hash
    } catch (e) {
      console.error(`Failed to generate ${fileName}:`, e.message)
    }
  }
}

writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2))
console.log('Mermaid image generation complete.')
