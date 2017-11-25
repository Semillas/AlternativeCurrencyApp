// @flow

import { Metrics, Colors, Fonts } from '../../Themes'

export default {
  text: {
    ...Fonts.style.h5,
    color: Colors.cta,
    marginHorizontal: Metrics.baseMargin
  },
  button: {
    flexDirection: 'row',
    marginVertical: Metrics.baseMargin
  }
}
