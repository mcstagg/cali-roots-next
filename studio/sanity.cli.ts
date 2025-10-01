import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: '7qliv8my',
    dataset: 'production'
  },
  studioHost: 'caliroots-clone',
  /**
   * Enable auto-updates for studios.
   * Learn more at https://www.sanity.io/docs/cli#auto-updates
   */
  deployment: {
    autoUpdates: true // was: autoUpdates: true
  },
  vite: {
    preview: { port: 3334, host: '127.0.0.1' }
  }
})
