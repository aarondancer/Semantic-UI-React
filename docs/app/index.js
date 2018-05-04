import React from 'react'
import ReactDOM from 'react-dom'

// TODO make themes a monorepo of packages
import { siteVariables, normalize } from 'semantic-ui-react/themes/teams'
import { Provider } from 'semantic-ui-react'

import Router from './routes'

// ----------------------------------------
// Rendering
// ----------------------------------------

const mountNode = document.createElement('div')
document.body.appendChild(mountNode)

const render = NewApp =>
  ReactDOM.render(
    <Provider
      siteVariables={siteVariables}
      staticStyles={[
        normalize,
        {
          html: {
            fontSize: siteVariables.rem,
          },
          body: {
            padding: siteVariables.bodyPadding,
            margin: siteVariables.bodyMargin,
            fontFamily: siteVariables.bodyFontFamily,
            fontSize: siteVariables.bodyFontSize,
            lineHeight: siteVariables.lineHeightBase,
          },
        },
      ]}
    >
      <NewApp />
    </Provider>,
    mountNode,
  )

// ----------------------------------------
// HMR
// ----------------------------------------

if (__DEV__) {
  // When the application source code changes, re-render the whole thing.
  if (module.hot) {
    module.hot.accept('./routes', () => {
      // restore scroll
      const { scrollLeft, scrollTop } = document.scrollingElement
      ReactDOM.unmountComponentAtNode(mountNode)

      try {
        render(require('./routes').default)
        document.scrollingElement.scrollTop = scrollTop
        document.scrollingElement.scrollLeft = scrollLeft
      } catch (e) {
        console.error(e) // eslint-disable-line no-console
      }
    })
  }
}

// ----------------------------------------
// Start the app
// ----------------------------------------

render(Router)
