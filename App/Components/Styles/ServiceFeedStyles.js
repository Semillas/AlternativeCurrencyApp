// @flow

import { Metrics, Colors } from '../../Themes'

export default {
  container: {
    flex: 1,
    marginTop: 0,
    marginBottom: 0,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 38,
    backgroundColor: 'transparent'
  },
  button: {
    marginRight: 10
  },
  image: {
    marginTop: Metrics.smallMargin,
    width: Metrics.screenWidth-3*Metrics.doubleBaseMargin,
    height: 220
  },
}
