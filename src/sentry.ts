import { BrowserClient, defaultStackParser, getDefaultIntegrations, makeFetchTransport, Scope } from '@sentry/browser'

import { environmentConfig } from '@/utils/constant'

const integrations = getDefaultIntegrations({}).filter((defaultIntegration) => {
  return !['BrowserApiErrors', 'Breadcrumbs', 'GlobalHandlers'].includes(defaultIntegration.name)
})

const client = new BrowserClient({
  dsn: environmentConfig.sentryUrl,
  transport: makeFetchTransport,
  stackParser: defaultStackParser,
  integrations: integrations
})

const scope = new Scope()
scope.setClient(client)

client.init()
