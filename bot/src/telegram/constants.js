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
    const linkTag = tag.replace('/', '/tag_');
    return `<b>${name.toUpperCase()}</b>\n<b><i>[ ${price} ]</i></b>\n\n<a href="${linkTag}">${linkTag}</a>\n\n${url}\n\n\n`;
  },
  resultsText: (title, body) => {
    return `<b><i>${title}</i></b>\n\n${body}`;
  },
  helpText: 'Help is on the way',
  alertText: ({ id, term, isOn }) => {
    const isActive = isOn ? 'ON' : 'OFF';
    return `<b>Alert ID: <i>${id}</i></b>\n<b>Term: <i>${term}</i></b>\n<b>Status: <i>${isActive}</i></b>\n\n`;
  },
};
