#!/usr/bin/env node
import {
  exists as existsCb,
  readFile as readFileCb,
  writeFile as writeFileCb
} from 'fs'
import { promisify } from 'util'
const exists = promisify(existsCb)
const readFile = promisify(readFileCb)
const writeFile = promisify(writeFileCb)
import { resolve as resolvePath, relative as relativePath } from 'path'

import { Repository } from 'nodegit'
import {
  resolveConfig as resolvePrettierConfig,
  Options as PrettierConfig,
  format as prettier
} from 'prettier'
import { grey, yellow } from 'colors'

const main = async () => {
  const repositoryPath = await safeDiscoverRepositoryPath()
  if (repositoryPath && exists(repositoryPath)) {
    const repository = await Repository.open(repositoryPath)
    const filepathsToRewrite = await getTangibleStagedFilepaths(repository)
    await Promise.all(filepathsToRewrite.map(formatAndRewrite))
    const index = await repository.refreshIndex()
    await index.updateAll(filepathsToRewrite)
    await index.write()
  } else {
    console.error(
      'fatal: not a git repository (or any of the parent directories): .git'
    )
  }
}

const safeDiscoverRepositoryPath = async () => {
  const cwd = resolvePath('.')
  try {
    Repository.open(cwd)
    return cwd
  } catch (error) {}
  try {
    return (await Repository.discover(cwd, 0, resolvePath('/'))).ptr
  } catch (error) {
    return null
  }
}

const getTangibleStagedFilepaths = async (repository: Repository) => {
  const statuses = await repository.getStatus()
  return statuses
    .filter(
      fileStatus =>
        fileStatus.inIndex() &&
        !fileStatus.isDeleted() &&
        !fileStatus.isTypechange() &&
        (fileStatus.isNew() ||
          fileStatus.isModified() ||
          fileStatus.isRenamed())
    )
    .map(fileStatus => fileStatus.path())
}

const formatAndRewrite = async (filepath: string) => {
  const startTime = new Date().getTime()
  const original = await readFile(filepath, { encoding: 'utf8' })
  const config = await resolvePrettierConfig(filepath, { editorconfig: true })
  const rewritten = await safeFormat(config, original, filepath)
  if (rewritten !== original) {
    await writeFile(filepath, rewritten)
    const endTime = new Date().getTime()
    console.info(`${grey(relativePath('', filepath))} ${endTime - startTime}ms`)
  }
}

const safeFormat = async (
  config: PrettierConfig | null,
  original: string,
  filepath: string
) => {
  try {
    return prettier(original, { ...config, filepath: filepath })
  } catch (error) {
    console.warn(`[${yellow('warn')}] ${error}`)
    return original
  }
}

main()
