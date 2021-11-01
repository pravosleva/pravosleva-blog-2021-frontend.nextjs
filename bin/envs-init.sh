if [ $# -eq 1 ]
then
  case $1 in
    "nextjs")
      echo "REACT_APP_API_ENDPOINT=http://localhost:1337/api
REACT_APP_SOCKET_ENDPOINT=http://localhost:1337
REACT_APP_AUTH_COOKIE_EXPIRES_IN_DAYS=1
REACT_APP_LANG_COOKIE_EXPIRES_IN_DAYS=30
REACT_APP_THEME_COOKIE_EXPIRES_IN_DAYS=30
REACT_APP_CONFIRM_COOKIE_EXPIRES_IN_DAYS=14

GA_TRACKING_ID=UA-xxxxxxxxx-x
YANDEX_COUNTER_ID=xxxxxxxx
RECAPTCHAV3_CLIENT_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxx-xxxxxxxxxx
RECAPTCHAV3_VERIFY_URL=http://pravosleva.ru/express-helper/recaptcha-v3/verify" > .env.dev &&
      echo "REACT_APP_API_ENDPOINT=http://80.87.194.181/api
REACT_APP_SOCKET_ENDPOINT=http://80.87.194.181
REACT_APP_AUTH_COOKIE_EXPIRES_IN_DAYS=1
REACT_APP_LANG_COOKIE_EXPIRES_IN_DAYS=30
REACT_APP_THEME_COOKIE_EXPIRES_IN_DAYS=30
REACT_APP_CONFIRM_COOKIE_EXPIRES_IN_DAYS=14

GA_TRACKING_ID=UA-xxxxxxxxx-x
YANDEX_COUNTER_ID=xxxxxxxx
RECAPTCHAV3_CLIENT_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxx-xxxxxxxxxx
RECAPTCHAV3_VERIFY_URL=http://pravosleva.ru/express-helper/recaptcha-v3/verify" > .env.prod
    ;;
    *)
    echo "☠️ SCRIPT: envs-init.sh | Undefined param value" &&
    exit 1
  esac
  exit 0
else
  echo "☠️ SCRIPT: envs-init.sh | Param is required! gatsby|nextjs"
  exit 1
fi
