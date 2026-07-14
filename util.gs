//==================================
// Retry
//==================================

function retry_(func) {

  let lastError;

  for (
    let i = 0;
    i < CONFIG.RETRY_COUNT;
    i++
  ) {

    try {

      return func();

    }

    catch (e) {

      lastError = e;

      Logger.log(

        "Retry " +

        (i + 1) +

        "/" +

        CONFIG.RETRY_COUNT +

        "\n" +

        e

      );

      if (
        i <
        CONFIG.RETRY_COUNT - 1
      ) {

        Utilities.sleep(

          CONFIG.RETRY_WAIT

        );

      }

    }

  }

  throw lastError;

}



//==================================
// Config Check
//==================================

function requireConfigValue_(key) {

  if (

    CONFIG[key] === undefined ||

    CONFIG[key] === null ||

    CONFIG[key] === ""

  ) {

    throw new Error(

      "CONFIG." +

      key +

      " が設定されていません。"

    );

  }

}



//==================================
// Base64
//==================================

function base64UrlSafe_(text) {

  return Utilities

    .base64EncodeWebSafe(text)

    .replace(/=+$/, "");

}



//==================================
// Time
//==================================

function nowString_() {

  return Utilities.formatDate(

    new Date(),

    Session.getScriptTimeZone(),

    "yyyy-MM-dd HH:mm:ss"

  );

}



//==================================
// JSON Log
//==================================

function logJson_(obj) {

  Logger.log(

    JSON.stringify(

      obj,

      null,

      2

    )

  );

}
