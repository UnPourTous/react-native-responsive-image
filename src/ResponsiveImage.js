import React from 'react'
import {
  Image,
  View
} from 'react-native'
import PropTypes from 'prop-types'

const ResponsiveType = Object.freeze({
  NONE: 'none',
  HEIGHT: 'height',
  WIDTH: 'width'
})

export default class ResponsiveImage extends React.Component {
  static propTypes = {
    // if only set width prop, then height will responsive by image ratio
    // if only set height prop, then width will responsive by image ratio
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

    // maxWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    // maxHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

    // for Image
    source: PropTypes.any.isRequired,

    // for View, not Image
    style: PropTypes.any
  }

  constructor (props) {
    super(props)
    this.state = {
      responsiveType: undefined,
      boxWidth: undefined,
      boxHeight: undefined,
      imageRatio: undefined
    }
  }

  componentDidMount () {
    this._update(null)
  }

  componentDidUpdate (prevProps) {
    this._update(prevProps)
  }

  _update (prevProps) {
    const {
      width,
      height,
      source
    } = this.props

    console.log(this.props)

    if (
      prevProps &&
      width === prevProps.width &&
      height === prevProps.height &&
      source === prevProps.source
    ) {
      return
    }

    if (width !== undefined && height !== undefined) {
      this.setState({
        responsiveType: ResponsiveType.NONE
      })
      return
    }

    if (height === undefined) {
      this.setState({
        responsiveType: ResponsiveType.HEIGHT
      })
    } else if (width === undefined) {
      this.setState({
        responsiveType: ResponsiveType.WIDTH
      })
    }

    const parsedSource = Image.resolveAssetSource(source)
    Image.getSize(parsedSource.uri, (imageWidth, imageHeight) => {
      console.log('size', imageWidth, imageHeight)
      this.setState({
        imageRatio: imageWidth / imageHeight
      })
    })
  }

  _updateBox = ({nativeEvent: {layout: {width, height}}}) => {
    this.setState({
      boxWidth: width,
      boxHeight: height
    })
  }

  render () {
    const {
      width,
      height,
      style,
      source,
      ...imageProps
    } = this.props
    const {
      responsiveType,
      imageRatio,
      boxWidth,
      boxHeight
    } = this.state

    if (responsiveType === undefined) {
      return null
    }

    let boxStyle
    if (responsiveType === ResponsiveType.HEIGHT) {
      boxStyle = {
        width: width
      }
      if (imageRatio !== undefined && boxWidth !== undefined) {
        boxStyle.height = boxWidth / imageRatio
      }
    } else if (responsiveType === ResponsiveType.WIDTH) {
      boxStyle = {
        height: height
      }
      if (imageRatio !== undefined && boxHeight !== undefined) {
        boxStyle.width = boxHeight * imageRatio
      }
    } else {
      boxStyle = {
        width: width,
        height: height
      }
    }

    console.log(boxStyle)

    return (
      <View
        style={[style, boxStyle]}
        onLayout={this._updateBox}>
        <Image
          {...imageProps}
          source={source}
          style={{width: '100%', height: '100%', resizeMode: 'contain'}}
        />
      </View>
    )
  }
}
