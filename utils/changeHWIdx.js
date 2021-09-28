const UserLoado = require("../models/UserLoado");

// 순서를 1,2,3 이렇게 sequential 하게 변경해줘야 함... 이러지 않으면 순서변경 기능에 버그가 발생
const changeHWIdx = async (userId) => {
  const userHomeworks = await UserLoado.find({ user: userId });
  userHomeworks.map(async (item, idx) => {
    item.idx = idx + 1;
    await item.save();
  });
  return userHomeworks.length;
};

module.exports = changeHWIdx;
