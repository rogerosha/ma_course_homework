module.exports = {
  closeProgram: (message) => {
    console.error(message);
    process.exit(1);
  },
};
