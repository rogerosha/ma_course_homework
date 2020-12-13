function closeProgram(warning) {
  console.warn(warning);
  process.exit(1);
}

module.exports = {
  closeProgram,
};
