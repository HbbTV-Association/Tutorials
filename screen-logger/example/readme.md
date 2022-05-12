# Basic Screen Logger - Sample App

This App showcases the features of the [Basic Screen Logger](../readme.md). If you have a recent version of Node.js installed on your machine you can serve the from that machine by running the following command from the repositories root directory:

```bash
npx http-server --mimetypes screen-logger/example/.types
```

The `--mimetypes` argument makes sure that `http-server` uses the mime type to file extension mapping specified in [.types](.types). This makes sure that the app's document is served with the mime type `application/vnd.hbbtv.xhtml+xml` as expected by HbbTV terminals.

The app will be served at [http://localhost:8081/screen-logger/example/](http://localhost:8081/screen-logger/example/).