//==================================
// スクリプト プロパティ
//==================================
// 「プロジェクトの設定」→「スクリプト プロパティ」に以下のキーを登録してください
//
// SUZURI_ACCESS_TOKEN
// GEMINI_API_KEY
// CLOUD_NAME
// CLOUDINARY_API_KEY
// CLOUDINARY_API_SECRET
// BUFFER_TOKEN
// BUFFER_PROFILE_IDS   （例: id1,id2,id3 のようにカンマ区切り）

const PROPS = PropertiesService.getScriptProperties();

function getProp_(key) {

  return PROPS.getProperty(key) || "";

}

const CONFIG = {

  //=========================
  // SUZURI
  //=========================

  SUZURI_ACCESS_TOKEN:
    getProp_("SUZURI_ACCESS_TOKEN"),

  SUZURI_USER_NAME:
    "Rabbitflower",

  SUZURI_SHEET_NAME : "商品一覧",

  POSTS_PER_RUN:
    1,

  // 投稿モード
  // SALE
  // NEW
  // RANDOM
  // UNPOSTED
  POST_MODE:
    "AUTO",

  // 直近何デザインを除外するか
  RECENT_DESIGN_LIMIT: 7,

  //=========================
  // Gemini
  //=========================

  GEMINI_API_KEY:
    getProp_("GEMINI_API_KEY"),

  GEMINI_MODEL:
    "gemini-2.5-flash",

  //=========================
  // Cloudinary
  //=========================

  CLOUD_NAME:
    getProp_("CLOUD_NAME"),

  CLOUDINARY_API_KEY:
    getProp_("CLOUDINARY_API_KEY"),

  CLOUDINARY_API_SECRET:
    getProp_("CLOUDINARY_API_SECRET"),

  PRODUCT_IMAGE_WIDTH:
    850,

  PRODUCT_IMAGE_HEIGHT:
    850,

  //=========================
  // Background
  //=========================

  // 通常背景
  BACKGROUND_BASE:
    "background_base",

  // イベント背景
  // Cloudinary側の画像だけ手動変更
  BACKGROUND_EVENT:
    "background_event",

  // イベント期間
  EVENT_START:
    "2026-10-23",

  EVENT_END:
    "2026-10-27",

  // 告知開始日数
  // 4日前からイベント背景
  EVENT_EARLY_DAYS:
    0,

  //=========================
  // Buffer
  //=========================

  BUFFER_TOKEN:
    getProp_("BUFFER_TOKEN"),

  // スクリプトプロパティでは「id1,id2,id3」の形で保存
  BUFFER_PROFILE_IDS:
    getProp_("BUFFER_PROFILE_IDS")
      .split(",")
      .map(function (s) { return s.trim(); })
      .filter(Boolean),

  //=========================
  // Retry
  //=========================

  RETRY_COUNT:
    3,

  RETRY_WAIT:
    10000,

  //==================================
  //  投稿制御
  //==================================

  // Designを空ける日数
  DESIGN_DAYS:
    7,

  // Itemを空ける日数
  ITEM_DAYS:
    7,

  //=========================
  // Design
  //=========================

  // 直近何投稿まで
  DESIGN_POSTS: 7
};

//==================================
// セール対象商品
//==================================

const SALE_ITEMS = [

"スタンダードTシャツ",
"ワンポイントTシャツ",
"オーバーサイズTシャツ",
"ヘビーウェイトTシャツ",
"フルグラフィックTシャツ",
"ロングスリーブTシャツ",
"ビッグシルエットロングスリーブTシャツ",
"オーガニックコットンTシャツ",
"ドライTシャツ",
"ヘビーウェイトジップパーカー",
"Cross Stitch オープンエンドマックスウェイト メンズオーバーTシャツ",
"United Athle 4.1oz ドライアスレチックTシャツ",
"United Athle 9.1oz マグナムウェイトビッグシルエットTシャツ",
"United Athle 5.6oz ラグラン ロングスリーブTシャツ（1.6インチリブ）",
"Printstar 5.6oz ヘビーウェイトビッグシルエット長袖Tシャツ",
"トートバッグ",
"サーモタンブラー",
"缶バッジ",
"ノート",
"アクリルキーホルダー",
"アクリルスタンド",

];

//==================================
// CONFIG必須チェック
//==================================

function requireConfigValue_(key) {

  if (
    CONFIG[key] === undefined ||
    CONFIG[key] === null ||
    CONFIG[key] === "" ||
    (Array.isArray(CONFIG[key]) && CONFIG[key].length === 0)
  ) {

    throw new Error(
      "CONFIGの" + key + "が設定されていません。" +
      "スクリプト プロパティを確認してください。"
    );

  }

}

// スクリプト プロパティの登録漏れを一括確認（手動実行用）
function checkScriptProperties() {

  [
    "SUZURI_ACCESS_TOKEN",
    "GEMINI_API_KEY",
    "CLOUD_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET",
    "BUFFER_TOKEN",
    "BUFFER_PROFILE_IDS"
  ].forEach(requireConfigValue_);

  Logger.log("スクリプト プロパティはすべて登録されています。");

}

//==================================
// リトライ共通処理
//==================================

function retry_(fn) {

  let lastError;

  for (let i = 0; i < CONFIG.RETRY_COUNT; i++) {

    try {

      return fn();

    }

    catch (e) {

      lastError = e;

      Logger.log(
        "Retry " +
        (i + 1) + "/" + CONFIG.RETRY_COUNT +
        " : " +
        e.message
      );

      if (i < CONFIG.RETRY_COUNT - 1) {

        Utilities.sleep(CONFIG.RETRY_WAIT);

      }

    }

  }

  throw lastError;

}

//==================================
// JSONログ出力
//==================================

function logJson_(obj) {

  Logger.log(
    JSON.stringify(obj, null, 2)
  );

}