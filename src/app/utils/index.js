module.exports = {
  replaceAll(str1, str2, ignore) {
    return this.replace(
      new RegExp(
        str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g, "\\$&"),
        ignore ? "gi" : "g"
      ),
      typeof str2 == "string" ? str2.replace(/\$/g, "$$$$") : str2
    );
  },

  isSafe(value, defaultValue) {
    try {
      return value();
    } catch (e) {
      return defaultValue;
    }
  }
};
