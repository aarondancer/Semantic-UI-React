import { createRenderer } from 'fela'
import felaPluginFallbackValue from 'fela-plugin-fallback-value'
import felaPluginPlaceholderPrefixer from 'fela-plugin-placeholder-prefixer'
import felaPluginPrefixer from 'fela-plugin-prefixer'
import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'
import { Provider as RendererProvider, ThemeProvider } from 'react-fela'

class Provider extends React.Component {
  static propTypes = {
    staticStyles: PropTypes.arrayOf(
      PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.func]),
    ),
    normalize: PropTypes.string,
    siteVariables: PropTypes.object,
    children: PropTypes.node,
  }

  get renderer() {
    if (!this._renderer) {
      this._renderer = createRenderer({
        plugins: [],
        middleware: [
          felaPluginPlaceholderPrefixer(),
          felaPluginPrefixer(),
          // Heads up!
          // This is required after fela-plugin-prefixer to resolve the array of fallback values prefixer produces.
          felaPluginFallbackValue(),
        ],
        enhancers: [],
      })
    }

    return this._renderer
  }

  renderStaticStyles = () => {
    const { siteVariables, staticStyles } = this.props

    if (!staticStyles) return

    staticStyles.forEach((staticStyle) => {
      if (_.isString(staticStyle)) {
        this.renderer.renderStatic(staticStyle)
      } else if (_.isPlainObject(staticStyle)) {
        _.forEach(staticStyle, (style, selector) => {
          this.renderer.renderStatic(style, selector)
        })
      } else if (_.isFunction(staticStyle)) {
        _.forEach(staticStyle, (rule) => {
          this.renderer.renderStatic(rule(siteVariables))
        })
      } else {
        throw new Error(
          `staticStyles array must contain CSS strings, style objects, or rule functions, got: ${typeof staticStyle}`,
        )
      }
    })
  }

  componentDidMount() {
    // this.renderer.renderFont('Segoe UI', ['public/fonts/segoe-ui-regular.woff2'], { fontWeight: 400 })
    // this.renderer.renderFont('Segoe UI', ['public/fonts/segoe-ui-semibold.woff2'], { fontWeight: 600 })
    // this.renderer.renderFont('Segoe UI', ['public/fonts/segoe-ui-bold.woff2'], { fontWeight: 700 })

    this.renderStaticStyles()
  }

  render() {
    const { siteVariables, children } = this.props

    return (
      <RendererProvider renderer={this.renderer}>
        <ThemeProvider theme={siteVariables}>{children}</ThemeProvider>
      </RendererProvider>
    )
  }
}

export default Provider
