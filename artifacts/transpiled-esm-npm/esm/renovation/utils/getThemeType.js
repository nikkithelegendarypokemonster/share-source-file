import { isMaterialBased, isFluent, isMaterial, isCompact, current } from '../../ui/themes';
const getThemeType = () => {
  const theme = current();
  return {
    isCompact: isCompact(theme),
    isMaterial: isMaterial(theme),
    isFluent: isFluent(theme),
    isMaterialBased: isMaterialBased(theme)
  };
};
export default getThemeType;