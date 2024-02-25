exports.triggerError = (req, res, next) => {
  try {
    const obj = {};
    console.log(obj.prop.nonExistent);
  } catch (err) {
    next(err);
  }
};
