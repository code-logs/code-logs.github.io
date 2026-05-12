import fs from 'fs'
import path from 'path'

interface PackageJson {
  name?: string
  version?: string
  license?: string
  licenses?: string | Array<string | { type?: string }>
  repository?: string | { type?: string; url?: string; directory?: string }
  dependencies?: Record<string, string>
  optionalDependencies?: Record<string, string>
}

interface LicenseInfo {
  licenses: string
  repository?: string
}

const ROOT_PATH = path.join(__dirname, '..')
const OUTPUT_PATH = path.join(ROOT_PATH, 'public/licenses.json')

const readJson = <T>(filePath: string): T => {
  return JSON.parse(fs.readFileSync(filePath, 'utf8')) as T
}

const resolveDependencyPath = (dependencyName: string, fromPath: string): string | null => {
  const dependencyPath = path.join(fromPath, 'node_modules', dependencyName)
  if (fs.existsSync(dependencyPath)) return fs.realpathSync(dependencyPath)

  const rootDependencyPath = path.join(ROOT_PATH, 'node_modules', dependencyName)
  if (fs.existsSync(rootDependencyPath)) return fs.realpathSync(rootDependencyPath)

  const pnpmHoistedDependencyPath = path.join(ROOT_PATH, 'node_modules/.pnpm/node_modules', dependencyName)
  if (fs.existsSync(pnpmHoistedDependencyPath)) return fs.realpathSync(pnpmHoistedDependencyPath)

  return null
}

const normalizeLicenses = (packageJson: PackageJson): string => {
  if (typeof packageJson.license === 'string') return packageJson.license
  if (typeof packageJson.licenses === 'string') return packageJson.licenses
  if (Array.isArray(packageJson.licenses)) {
    const licenses = packageJson.licenses
      .map((license) => (typeof license === 'string' ? license : license.type))
      .filter(Boolean)

    if (licenses.length) return licenses.join(', ')
  }

  return 'UNKNOWN'
}

const normalizeRepository = (repository: PackageJson['repository']): string | undefined => {
  let repositoryUrl = typeof repository === 'string' ? repository : repository?.url
  if (!repositoryUrl) return undefined

  repositoryUrl = repositoryUrl
    .replace(/^git\+/, '')
    .replace(/^git:\/\/github\.com\//, 'https://github.com/')
    .replace(/^github:/, 'https://github.com/')
    .replace(/^git@github\.com:/, 'https://github.com/')
    .replace(/\.git$/, '')

  if (/^[\w.-]+\/[\w.~-]+$/.test(repositoryUrl)) {
    return `https://github.com/${repositoryUrl}`
  }

  return repositoryUrl
}

const buildLicenseInfo = (packageJson: PackageJson): LicenseInfo => {
  const licenseInfo: LicenseInfo = {
    licenses: normalizeLicenses(packageJson),
  }
  const repository = normalizeRepository(packageJson.repository)

  if (repository) licenseInfo.repository = repository

  return licenseInfo
}

const generateLicenses = () => {
  const rootPackageJson = readJson<PackageJson>(path.join(ROOT_PATH, 'package.json'))
  const licenses: Record<string, LicenseInfo> = {}
  const visitedPackagePaths = new Set<string>()

  const visitDependency = (dependencyName: string, fromPath: string, optional = false) => {
    const dependencyPath = resolveDependencyPath(dependencyName, fromPath)
    if (!dependencyPath) {
      if (optional) return
      throw new Error(`Failed to resolve dependency "${dependencyName}" from ${fromPath}`)
    }
    if (visitedPackagePaths.has(dependencyPath)) return

    visitedPackagePaths.add(dependencyPath)

    const packageJson = readJson<PackageJson>(path.join(dependencyPath, 'package.json'))
    if (!packageJson.name || !packageJson.version) {
      throw new Error(`Missing package name or version in ${dependencyPath}`)
    }

    licenses[`${packageJson.name}@${packageJson.version}`] = buildLicenseInfo(packageJson)

    Object.keys(packageJson.dependencies ?? {}).forEach((nextDependencyName) => {
      visitDependency(nextDependencyName, dependencyPath)
    })
    Object.keys(packageJson.optionalDependencies ?? {}).forEach((nextDependencyName) => {
      visitDependency(nextDependencyName, dependencyPath, true)
    })
  }

  Object.keys(rootPackageJson.dependencies ?? {}).forEach((dependencyName) => {
    visitDependency(dependencyName, ROOT_PATH)
  })

  const sortedLicenses = Object.keys(licenses)
    .sort((a, b) => a.localeCompare(b))
    .reduce<Record<string, LicenseInfo>>((acc, dependencyName) => {
      acc[dependencyName] = licenses[dependencyName]
      return acc
    }, {})

  fs.writeFileSync(OUTPUT_PATH, `${JSON.stringify(sortedLicenses, null, 2)}\n`, 'utf8')
}

generateLicenses()
