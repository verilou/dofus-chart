import { parse } from "node-html-parser";
import { connect } from "puppeteer-real-browser";
import db from "../models/index.js";
const { Item, NewPrice } = db;

export const getPrices = () => {
  connect({
    headless: "auto",
    fingerprint: true, // Injects a unique fingerprint ID into the page
    turnstile: true, // Automatically clicks on Captchas
    tf: true, // Use targ
  }).then(async (response) => {
    const { page, browser } = response;
    try {
      await page._client().send("Network.enable", {
        maxResourceBufferSize: 1024 * 1204 * 50,
        maxTotalBufferSize: 1024 * 1204 * 100,
      });
      await page.goto(
        "https://www.vulbis.com/?server=Draconiros&gids=&percent=0&craftableonly=false&select-type=-1&sellchoice=false&buyqty=1&sellqty=1&percentsell=0",
        {
          waitUntil: "domcontentloaded",
        },
      );

      await page.setRequestInterception(true);
      page.on("request", (request) => {
        if (request.resourceType() === "image") {
          request.abort();
        } else {
          request.continue();
        }
      });

      const getScanResponse = () =>
        new Promise((resolve, reject) => {
          page.on("response", (interceptedResponse) => {
            if (interceptedResponse.url().includes("scan.php")) {
              resolve(interceptedResponse);
            }
          });
        });

      const scan = await getScanResponse();

      const root = parse(await scan.text());
      await browser.close();

      const itemAnkamaPrices = (
        await Promise.all(
          root.querySelectorAll("tbody > tr").map(async (row) => {
            const onClickAttribute = row
              .querySelector("p")
              .getAttribute("onclick");

            const onClickAttributeSliced = onClickAttribute.substring(22);
            const id = parseInt(
              onClickAttributeSliced.substring(
                0,
                onClickAttributeSliced.length - 9,
              ),
            );
            const lastPriceInDb = await NewPrice.findOne({
              include: {
                model: Item,
                where: { ankamId: id },
                required: true,
              },
              order: [["id", "DESC"]],
              attributes: ["createdAt"],
            });
            const name = row.querySelector("p").text;
            const lastVulbisUpdate = parseInt(
              row.querySelector("td:nth-child(4)").getAttribute("data-order"),
            );
            const price = parseInt(
              row.querySelector("td:nth-child(6)").getAttribute("data-order"),
            );

            const priceBySetOfTen = parseInt(
              row.querySelector("td:nth-child(7)").getAttribute("data-order"),
            );
            const priceBySetOfHundred = parseInt(
              row.querySelector("td:nth-child(8)").getAttribute("data-order"),
            );
            const capitalGain = parseInt(
              row.querySelector("td:nth-child(11)").getAttribute("data-order"),
            );
            return {
              id,
              name,
              price,
              priceBySetOfTen,
              priceBySetOfHundred,
              capitalGain,
              lastVulbisUpdate,
              lastPriceInDb: lastPriceInDb?.createdAt,
            };
          }),
        )
      ).filter(({ lastPriceInDb, lastVulbisUpdate }) => {
        if (lastPriceInDb === undefined) {
          return true;
        }

        return (
          parseInt(lastVulbisUpdate) >
          parseInt((lastPriceInDb?.getTime() / 1000).toFixed(0))
        );
      });

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
      let count = 0;
      itemAnkamaPrices.map((itemAnkamaPrice) => {
        const item = items.find((item) => {
          return item.ankamId === itemAnkamaPrice.id;
        });
        delete itemAnkamaPrice.id;
        itemAnkamaPrice.itemId = item.id;
        // console.log(
        //   `[NewPrice created] ${item.name} with a new price of ${itemAnkamaPrice.price}`,
        // );
        NewPrice.create(itemAnkamaPrice);
        count++;
        return itemAnkamaPrice;
      });
      console.log(`prices inserted ${count}`);
    } catch (error) {
      console.log(error);
    }
  });
};
