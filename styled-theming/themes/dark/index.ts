import * as colors from './colors';
import * as utils from '../../utils';
import components from './components';

const theme = {
  /* essential */
  colors: { ...colors },
  components: components(colors),
  utils: { ...utils },
  /* optional */
  borderRadius: '3px',
  fontSize: '14px',
  fontSizeLg: '1rem',
  fontSizeSm: '12px',
  zIndex: {
    overlay: 20,
    above: 10,
    bump: 1,
    below: -1
  }
};

export { colors, utils };
export default theme;
