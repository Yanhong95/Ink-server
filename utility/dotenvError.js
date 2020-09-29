
exports.dotenvError = (result) => {
  if (result.error) {
    if (process.env.NODE_ENV === "production" && result.error.code === "ENOENT") {
      console.info("expected this error because we are in production without a .env file")
    } else {
      throw result.error
    }
  }
}
