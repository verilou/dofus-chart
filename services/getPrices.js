import { connect } from "puppeteer-real-browser";
import db from "../models/index.js";
import { getAttributePriceInt } from "../services/getAttribute.js";
const { Item, NewPrice } = db;

export const getPrices = () => {
  connect({
    headless: true,
    fingerprint: true, // Injects a unique fingerprint ID into the page
    turnstile: true, // Automatically clicks on Captchas
    tf: true, // Use targ
  }).then(async (response) => {
    const { page, browser, setTarget } = response;
    try {
      page.goto("https://www.vulbis.com/", {
        waitUntil: "domcontentloaded",
      });

      setTarget({ status: false });

      let page2 = await browser.newPage();

      setTarget({ status: true });

      await page2.goto(
        "https://www.vulbis.com/?server=Draconiros&gids=&percent=150&craftableonly=true&select-type=1&sellchoice=false&buyqty=1&sellqty=1&percentsell=0",
        {
          waitUntil: "domcontentloaded",
        },
      );
      await page2.exposeFunction("getAttributePriceInt", getAttributePriceInt);
      await page2.waitForSelector(".odd");
      await page2.waitForSelector(".even");
      const listOfItem = await page2.$$("#scanTable .odd, #scanTable .even");
      const itemAnkamaPrices = await Promise.all(
        listOfItem.map(async (itemRow) => {
          const { id, name } = await itemRow.$eval("p", (p) => {
            const onClickAttribute = p.getAttribute("onclick").substring(22);
            const id = parseInt(
              onClickAttribute.substring(0, onClickAttribute.length - 9),
            );
            const name = p.innerText;
            return { id, name };
          });

          const price = await itemRow.$eval(
            "td:nth-child(6)",
            getAttributePriceInt,
          );

          const priceBySetOfTen = await itemRow.$eval(
            "td:nth-child(7)",
            getAttributePriceInt,
          );
          const priceBySetOfHundred = await itemRow.$eval(
            "td:nth-child(8)",
            getAttributePriceInt,
          );

          const capitalGain = await itemRow.$eval(
            "td:nth-child(11)",
            getAttributePriceInt,
          );
          return {
            id,
            name,
            price,
            priceBySetOfTen,
            priceBySetOfHundred,
            capitalGain,
          };
        }),
      );

      const itemIdsAndNames = itemAnkamaPrices.map(({ id, name }) => ({
        id,
        name,
      }));
      const items = await Promise.all(
        itemIdsAndNames.map(async (itemId) => {
          return (
            await Item.findOrCreate({
              where: { ankamId: itemId.id },
              defaults: { ankamId: itemId.id, name: itemId.name },
            })
          )[0];
        }),
      );

      const insertedPrices = itemAnkamaPrices.map((itemAnkamaPrice) => {
        const item = items.find((item) => {
          return item.ankamId === itemAnkamaPrice.id;
        });
        itemAnkamaPrice.ankamaId = itemAnkamaPrice.id;
        delete itemAnkamaPrice.id;
        itemAnkamaPrice.itemId = item.id;
        NewPrice.create(itemAnkamaPrice);
        return itemAnkamaPrice;
      });
      console.log("prices inserted")
      await browser.close();
    } catch (error) {
      console.log(error);
      await browser.close();
    }
  });
};
