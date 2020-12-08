function failedToLogIn(warning) {
  console.warn(warning);
  process.exit(1);
}

module.exports = {
  failedToLogIn,
};
