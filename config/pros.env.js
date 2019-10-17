module.exports = {
    NODE_ENV: '"production"',
    CAP_URL: '"https://login.effortlesslegal.com/admin/dashboard"',
    API_LOCATION: '"https://api.legistee.com/v1"',
    SPEECH_BASE_URL: JSON.stringify('https://speech-api.effortlesslegal.com'),
    SPEECH_SOCKET_IO_SERVER: '"https://stream-api.effortlesslegal.com"',
    WS_SPEECH_SOCKET_IO_SERVER: '"wss://stream-api.effortlesslegal.com"',
    TOKENWATCHDOG_INTERVAL: 10000,
    MAX_NUMBER_OF_ITEMS: 5000,
    // GRIDS_ROWS_PER_PAGE_ITEMS: '[25, 50, 75, { text: "All", value: 5000 }]',
    GRIDS_ROWS_PER_PAGE_ITEMS: '[25, 50, 75, 200]',
    AUTOCOMPLETE_MIN_CHARS: 3,
    AUTOCOMPLETE_MAX_CHARS: 250,
    AUTOCOMPLETE_URL: '"suggested-phrases"',
    AUTOCOMPLETE_RESULT_LIMIT: 5,
    AUTOCOMPLETE_HIT_EVERY_K_CHARS: 2,
    LOCAL_TOKEN_EXPIRATION_ANTICIPATION: 12, // in hours. This is a delta time against JWT token expiration (usually 24 hours),
    TRUNCATE_TEXT_AFTER: 100,
    USER_ROLES: {
      SUPERADMIN: '"super_admin"',
      ADMIN: '"account_admin"',
      TIMEKEEPER: '"time_keeper"',
      LOCAL_COUNSEL: '"local_counsel"'
    }
  }
  