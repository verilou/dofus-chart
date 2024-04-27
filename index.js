import { connect } from "puppeteer-real-browser";

connect({
  headless: false,
  fingerprint: true, // Injects a unique fingerprint ID into the page
  turnstile: true, // Automatically clicks on Captchas
  tf: true, // Use targ
}).then(async (response) => {
  const { page, browser, setTarget } = response;

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

  await page2.waitForSelector(".odd");
  await page2.waitForSelector(".even");
  const listOfItem = await page2.$$("#scanTable .odd, #scanTable .even");

  console.log(
    await Promise.all(
      listOfItem.map(async (itemRow) => {
        const id = await itemRow.$eval("p", (p) => {
          const onClickAttribute = p.getAttribute("onclick").substring(22);
          return parseInt(
            onClickAttribute.substring(0, onClickAttribute.length - 9),
          );
        });

        const price = await itemRow.$eval("td:nth-child(6)", (td) =>
          parseInt(td.getAttribute("data-order")),
        );

        const priceBySetOfTen = await itemRow.$eval("td:nth-child(7)", (td) =>
          parseInt(td.getAttribute("data-order")),
        );
        const priceBySetOfHundred = await itemRow.$eval(
          "td:nth-child(8)",
          (td) => parseInt(td.getAttribute("data-order")),
        );

        const capitalGain = await itemRow.$eval("td:nth-child(11)", (td) =>
          parseInt(td.getAttribute("data-order")),
        );
        return {
          id,
          price,
          priceBySetOfTen,
          priceBySetOfHundred,
          capitalGain,
        };
      }),
    ),
  );

  // browser.close();
});
