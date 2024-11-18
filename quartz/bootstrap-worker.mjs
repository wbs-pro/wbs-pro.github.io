#!/usr/bin/env node
process.removeAllListeners('warning')
process.on('warning', (warning) => {
  if (warning.name === 'DeprecationWarning' && warning.code === 'DEP0040') {
    return
  }
  console.warn(warning.name)
  console.warn(warning.message)
  console.warn(warning.stack)
})
import workerpool from "workerpool"
const cacheFile = "./.quartz-cache/transpiled-worker.mjs"
const { parseFiles } = await import(cacheFile)
workerpool.worker({
  parseFiles,
})
