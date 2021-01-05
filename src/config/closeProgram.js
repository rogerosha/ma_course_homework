module.exports = {
  closeProgram: (message, err) => {
    console.error(message);
    console.error(err);
    process.exit(1);
  },
};
