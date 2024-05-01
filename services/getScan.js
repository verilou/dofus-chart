import axios from "axios";

export default (cf_clearance) =>
  axios.post(
    "https://www.vulbis.com/scan.php",
    new URLSearchParams({
      server: "Draconiros",
      gids: "",
      percent: "100",
      type: "-1",
      buyqty: "1",
      sellqty: "1",
      percentsell: "0",
    }),
    {
      headers: {
        accept: "*/*",
        "accept-language": "fr-FR,fr;q=0.5",
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        cookie: `SERVER_CHOICE=Draconiros; BUY_QTY=1; SELL_QTY=1; PERCENT_SELL_CHOICE=0; TYPE=-1; EnutrosorServer=Orukam; EcaflipusServer=Orukam; X\xC3\xA9loriumServer=Orukam; SrambadServer=Orukam; cf_clearance=${cf_clearance.value}; PERCENT_CHOICE=100`,
        origin: "https://www.vulbis.com",
        priority: "u=1, i",
        referer:
          "https://www.vulbis.com/?server=Draconiros&gids=&percent=100&craftableonly=false&select-type=-1&sellchoice=false&buyqty=1&sellqty=1&percentsell=0",
        "sec-ch-ua":
          '"Chromium";v="124", "Brave";v="124", "Not-A.Brand";v="99"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-model": '""',
        "sec-ch-ua-platform": '"macOS"',
        "sec-ch-ua-platform-version": '"14.4.1"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "sec-gpc": "1",
        "user-agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "x-requested-with": "XMLHttpRequest",
      },
    },
  );
