const CONFIG = {

  //=========================
  // SUZURI
  //=========================

  SUZURI_ACCESS_TOKEN:
    "",

  SUZURI_USER_NAME:
    "",

  POSTS_PER_RUN:
    1,

  // 投稿モード
  // SALE
  // NEW
  // RANDOM
  // UNPOSTED
  POST_MODE:
    "AUTO",

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
  "2026-07-20",


EVENT_END:
  "2026-07-27",


// 告知開始日数
// 4日前からイベント背景
EVENT_EARLY_DAYS:
  4,


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
    10000

};
