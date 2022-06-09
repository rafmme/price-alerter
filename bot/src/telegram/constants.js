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
    return `<b>${name.toUpperCase()}</b>\n<b><i>- ${price} -</i></b>\n\n<a href="${linkTag}">${linkTag}</a>\n\n${url}\n\n\n`;
  },
  productAlertText: ({ name, price, url }) => {
    return `<b>${name.toUpperCase()}</b>\n${url}\n<b><i>- ${price} -</i></b>\n\n`;
  },
  resultsText: (title, body) => {
    return `<b><i>${title}</i></b>\n\n${body}`;
  },
  helpText: `I'm a bot that scrapes the two major e-commerce websites in Nigeria (Konga, Jumia) to find specific products (deals) that fall within a given price range & notifies users with the link to the product on the e-commerce website.\n\nTo search for a product/item, send the item name. For example: <b><i>Iphone 12</i></b>\n\nTo specify price range for the search, send <b><i>'Item Name@start_price-end_price'</i></b>\nFor example: <b><i>Iphone 12@120,000-300,000</i></b>\n\nAlso,do choose from the menu list for other bot commands to perform other operations like setting a price alert etc.`,
  alertText: ({ id, term, isOn }) => {
    const isActive = isOn ? 'ON' : 'OFF';
    return `<b>Alert ID: <i>${id}</i></b>\n<b>Status: <i>${isActive}</i></b>\n<b>Term: <i>${term}</i></b>\n\n`;
  },
};
