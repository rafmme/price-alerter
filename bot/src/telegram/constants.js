export default {
  newUserStartText: (name) => {
    return `Hi ${name},\nI'm a bot, I'll find and alert you about your fave products that fall within your prefered price range.\nAlso do select any of the available menu to interact & make use of me.`;
  },
  oldUserStartText: (name) => {
    return `Welcome back, ${name}.\nYou know the drill 😉. Please select any options and let's get rolling.`;
  },
  productInfoText: ({ name, price, url, info, imageUrl }) => {
    return `<b>${name.toUpperCase()}</b>\n\n<b><i>${price}</i></b>\n\n<i>${info}</i>\n\n${imageUrl}\n\n${url}\n\n`;
  },
  productText: ({ name, price, url, tag }) => {
    return `<b>${name.toUpperCase()}</b>\n\n<b><i>${price}</i></b>\n${tag.replace('/', '/tag_')}\n\n${url}\n\n`;
  },
  resultsText: (title, body) => {
    return `<i>${title}</i>\n\n${body}`;
  },
  helpText: 'Help is on the way',
};
