import SpatialNavigation from 'spatial-navigation-js'

export default class SpatialNav {
  static init() {
    SpatialNavigation.init()
    SpatialNavigation.add({
      selector: 'a, button, input, .focusable'
    })
  }

  static refresh(autoFocus = false) {
    SpatialNavigation.makeFocusable()
    if (autoFocus) {
      SpatialNavigation.focus('.focusable')
    }
  }
}
