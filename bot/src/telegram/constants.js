export default {
  newUserStartText: (name) => {
    return `Hi ${name},\nI'm a bot, I'll find and alert you about your fave products that fall within your prefered price range.\nAlso do select any of the available menu to interact & make use of me.`;
  },
  oldUserStartText: (name) => {
    return `Welcome back, ${name}.\nYou know the drill 😉. Please select any options and let's get rolling.`;
  },
  productInfoText: ({ name, price, url, info, imageUrl }) => {
    return `🛍 *${name.toUpperCase()}*\n    *${price}*\n\n_${info}_\n\n${imageUrl}\n${url}\n\n`;
  },
  productText: ({ name, price, url, tag }) => {
    return `*${name.toUpperCase()}*\n    *${price}*\n${tag.replace('/', '/tag_')}\n\n${url}\n\n`;
  },
  resultsText: (title, body) => {
    return `_${title}_\n\n${body}`;
  },
  helpText: 'Help is on the way',
};
