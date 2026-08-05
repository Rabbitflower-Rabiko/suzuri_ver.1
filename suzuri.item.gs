
  function getAllSuzuriProducts() {

    Logger.log(CONFIG.SUZURI_API_KEY);

  const API_KEY =
"ovEtu-yf-ctXGZokfKRULElHgb22mVUTt2DzR-xoIlU";
  const USER_NAME = "Rabbitflower";

  const sheet =
    SpreadsheetApp
      .getActiveSpreadsheet()
      .getSheetByName("商品一覧");

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
    "公開日",
    "更新日",
    "投稿"
  ]);

  let offset = 0;

  while (true) {

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
        }

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

  Logger.log("完了");

}
