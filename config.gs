const CONFIG = {

  //=========================
  // SUZURI
  //=========================

  SUZURI_ACCESS_TOKEN:
    "",

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
    "",

  GEMINI_MODEL:
    "gemini-2.5-flash",

  //=========================
  // Cloudinary
  //=========================

  CLOUD_NAME:
    "",

  CLOUDINARY_API_KEY:
    "",

  CLOUDINARY_API_SECRET:
    "",

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
  "2026-07-24",


EVENT_END:
  "2026-08-02",


// 告知開始日数
// 4日前からイベント背景
EVENT_EARLY_DAYS:
  0,




  //=========================
  // Buffer
  //=========================

  BUFFER_TOKEN:
    "",

  BUFFER_PROFILE_IDS: [

    "",

    "",

    ""

  ],

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
"ライトウェイトTシャツ",
"ワンポイントTシャツ",
"オーバーサイズTシャツ",
"ヘビーウェイトTシャツ",
"フルグラフィックTシャツ",
"ロングスリーブTシャツ",
"ビッグシルエットTシャツ",
"ビッグシルエットロングスリーブTシャツ",
"オーガニックコットンTシャツ",
"ドライTシャツ",
"United Athle 5.6oz ラグラン ロングスリーブTシャツ（1.6インチリブ）",
"Printstar 5.6oz ヘビーウェイトビッグシルエット長袖Tシャツ",
"United Athle 4.1oz ドライアスレチック ルーズフィット ラインリブTシャツ",
"American Apparel 6.0oz ヘビーウェイトコットン長袖Tシャツ",
"GLIMMER 4.4oz ドライ 長袖Tシャツ",
"Cross Stitch オープンエンドマックスウェイト メンズオーバーTシャツ",
"United Athle 4.1oz ドライアスレチックTシャツ",
"TRUSS 8.1oz USAコットンTシャツ",
"United Athle 9.1oz マグナムウェイトビッグシルエットTシャツ",
"SHAKA WEAR 7.5oz ヘビーウェイトTシャツ",
"SHAKA WEAR 7.5oz ドロップショルダーTシャツ"

];
