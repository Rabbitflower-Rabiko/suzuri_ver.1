//==================================
// 商品一覧取得（中断・再開対応）
//
// トリガーで実行した場合、実行時間の上限(6分)に
// 近づいたら安全に処理を打ち切り、次回実行時に
// 続きのoffsetから再開します。
// これにより「投稿処理」とは別に、この関数だけを
// GASの設定画面で単独のトリガーとして登録できます。
//==================================

function getAllSuzuriProducts() {

  // ここで安全マージンを取って打ち切る（実行上限6分の前で止める）
  const MAX_RUNTIME_MS = 5 * 60 * 1000; // 5分
  const startTime = Date.now();

  const props =
    PropertiesService.getScriptProperties();

  const OFFSET_KEY = "SUZURI_SYNC_OFFSET";

  Logger.log(CONFIG.SUZURI_ACCESS_TOKEN);

  const API_KEY =
    "ovEtu-yf-ctXGZokfKRULElHgb22mVUTt2DzR-xoIlU";
  const USER_NAME = "Rabbitflower";

  const sheet =
    SpreadsheetApp
      .getActiveSpreadsheet()
      .getSheetByName("商品一覧");

  let offset =
    Number(props.getProperty(OFFSET_KEY) || 0);

  // 最初から実行する時だけシートをクリアしてヘッダーを書く
  if (offset === 0) {

    sheet.clear();

    sheet.appendRow([
      "商品ID",
      "商品名",
      "DesignID",
      "商品URL",
      "画像URL",
      "商品種類",
      "商品種類ID",
      "価格",
      "税込価格",
      "セール価格",
      "公開",
      "シークレット",
      "公開日",
      "更新日",
      "投稿"
    ]);

  } else {

    Logger.log(
      "前回の続きから再開します : offset=" +
      offset
    );

  }


  while (true) {

    //---------------------------------
    // 実行時間チェック
    //---------------------------------

    if (Date.now() - startTime > MAX_RUNTIME_MS) {

      props.setProperty(OFFSET_KEY, String(offset));

      Logger.log(
        "時間切れのため中断しました。offset=" +
        offset +
        " ← 次回実行時にこの続きから再開します。"
      );

      return;

    }

    const url =
      "https://suzuri.jp/api/v1/products" +
      "?userName=" + USER_NAME +
      "&limit=50" +
      "&offset=" + offset;

    const response =
      UrlFetchApp.fetch(url, {

        headers: {
          Authorization:
            "Bearer " + API_KEY
        },

        muteHttpExceptions: true

      });

    const json =
      JSON.parse(response.getContentText());

    const products =
      json.products || [];

    if (products.length == 0) {

      break;

    }

    const rows = [];

    products.forEach(function(product){

      const designId =
        (
          (product.sampleUrl || "")
          .match(/\/(\d+)\//)
          || [null, product.id]
        )[1];

      rows.push([

        product.id,

        product.title,

        designId,

        product.sampleUrl,

        product.sampleImageUrl,

        product.item.humanizeName,

        product.item.id,

        product.price,

        product.priceWithTax,

        product.discountedPriceWithTax,

        product.published,

        product.secret,  

        product.publishedAt,

        product.updatedAt,



        ""

      ]);

    });

    sheet.getRange(

      sheet.getLastRow()+1,

      1,

      rows.length,

      rows[0].length

    ).setValues(rows);

    Logger.log(
      "取得：" +
      (offset + products.length) +
      "件"
    );

    if(products.length < 50){

      break;

    }

    offset += 50;

    Utilities.sleep(500);

  }

  // 完走できたら再開位置をリセット
  props.deleteProperty(OFFSET_KEY);

  Logger.log("完了");

}

//==================================
// 商品一覧の再開位置を手動でリセット
// （途中で商品一覧を作り直したい時に手動実行）
//==================================

function resetSuzuriSyncOffset_() {

  PropertiesService
    .getScriptProperties()
    .deleteProperty("SUZURI_SYNC_OFFSET");

  Logger.log("再開位置をリセットしました。次回は最初から取得します。");

}