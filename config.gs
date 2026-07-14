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
// Event Background
//=========================

// 通常背景
BACKGROUND_BASE:
  "background_base",

// イベント一覧
EVENT_BACKGROUNDS: [

  // 例：SUZURIセール
  {

    start:
      "2026-10-24",

    end:
      "2026-11-02",

    earlyDays:
      4,

    background:
      "background_event"

  }

],

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
