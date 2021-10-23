const UserLoado = require('../models/UserLoado');
const LoadoLogs = require('../models/LoadoLogs');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const changeHWIdx = require('../utils/changeHWIdx');
var moment = require('moment');
require('moment-timezone');

//flymogi.tistory.com/30 [하늘을 난 모기]

// @desc        Get all homeworks
// @route       GET /loado/api/homeworks
// @access      Private
exports.getHomeworks = asyncHandler(async (req, res, next) => {
  const userHomeworks = await UserLoado.find().sort('idx');
  //   const result = userHomeworks.skip(skip).limit(limit);

  res.status(200).json({
    success: true,
    dataLength: userHomeworks.length,
    data: userHomeworks,
  });
});

exports.getAllUserHomeworks = asyncHandler(async (req, res, next) => {
  const allUserHomeworks = await UserLoado.find({ user: req.user._id }).sort(
    'idx'
  );

  res.status(200).json({
    success: true,
    dataLength: allUserHomeworks.length,
    data: allUserHomeworks,
  });
});

exports.getOneHomework = asyncHandler(async (req, res, next) => {
  const userHomework = await UserLoado.findById(req.params.id);
  if (!userHomework) {
    return next(new ErrorResponse(`해당 레코드가 존재하지 않습니다`, 404));
  }
  res.status(200).json({
    success: true,
    data: userHomework,
  });
});

// @desc        Get all homeworks
// @route       GET /loado/api/homeworks/:id
// @access      Private
exports.getUserHomeworks = asyncHandler(async (req, res, next) => {
  // let queryStr = JSON.stringify(req.query);
  // queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
  // query = UserLoado.find(JSON.parse(queryStr));
  // const homeworks = await query;

  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 8;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await UserLoado.find({ user: req.user._id }).countDocuments();

  const userHomeworks = await UserLoado.find({ user: req.user._id })
    .skip(startIndex)
    .limit(limit)
    .sort('idx')
    .populate('user');
  if (userHomeworks.length === 0) {
    return res.status(200).json({
      success: true,
      dataLength: 0,
      data: [],
    });
  }
  res.status(200).json({
    success: true,
    dataLength: userHomeworks.length,
    totalLength: total,
    data: userHomeworks,
  });

  // // improperly formatted object id
  // // we don't even want to write this, just use next(err) => change error.js
  // next(
  //   new ErrorResponse(
  //     `User homework not found with id of ${req.params.id}`,
  //     404
  //   )
  // );

  //   next(err); // not needed because of asyncHandler
});

// @desc        Create new homework
// @route       POST /loado/api/homeworks
// @access      Private
exports.createHomework = asyncHandler(async (req, res, next) => {
  //   console.log(req.body); // if you just use it, this will return undefined so you have to use middleware [// Body parser in server.js]
  // console.log("req.user is ", req.user); // got from auth.js middleware protect

  const userHomeworks = await UserLoado.find({ user: req.user._id });

  if (userHomeworks.length === 24) {
    return next(
      new ErrorResponse(`추가할 수 있는 개수는 24개로 제한되어 있습니다`, 405)
    );
  }

  if (userHomeworks.length === 0) {
    req.body.idx = 1;
    req.body.abyssDungeonWeekly = false;
    req.body.rehearsalAndDejavu = [];
  } else {
    const nextIdx = (await changeHWIdx(req.user._id)) + 1;
    // let nextIdx =
    //   Math.max.apply(
    //     Math,
    //     userHomeworks.map(function (anObject) {
    //       return anObject.idx;
    //     })
    //   ) + 1;

    req.body.idx = nextIdx;
    req.body.abyssDungeonWeekly = userHomeworks[0].abyssDungeonWeekly;
    req.body.rehearsalAndDejavu = userHomeworks[0].rehearsalAndDejavu;
  }
  req.body.user = req.user._id;
  const userLoado = await UserLoado.create(req.body);

  await LoadoLogs.create({
    user: req.user._id,
    activity: 'createHomework',
    stringParam: JSON.stringify(req.body),
  });

  res.status(201).json({
    success: true,
    data: userLoado,
    totalLength: userHomeworks.length + 1,
  });
});

// @desc        Update a homework
// @route       PUT /loado/api/homeworks/:homeworkId
// @access      Private
exports.updateHomework = asyncHandler(async (req, res, next) => {
  let userHomework = await UserLoado.findById(req.params.id);

  const bodyData = { ...req.body.data };

  await LoadoLogs.create({
    user: req.user._id,
    activity: 'updateHomework',
    stringParam: JSON.stringify(bodyData),
  });

  if (!userHomework) {
    return next(new ErrorResponse(`해당 레코드가 존재하지 않습니다`, 404));
  }

  if (userHomework.user.toString() !== req.user.id) {
    return next(new ErrorResponse(`수정하기에 올바른 사용자가 아닙니다`, 401));
  }

  // [원정대 공유] 주간던전용 (어비스던전, 쿠크세이튼)
  if (bodyData.weeklyAttributeChanged) {
    let weeklyWork = await UserLoado.find({ user: req.user._id }); // req.user from auth middleware
    weeklyWork.map(async (item, idx) => {
      const saveWork = await UserLoado.findById(item._id); // .find does not have method save(); so use findById or findOne
      saveWork.abyssDungeonWeekly = bodyData.abyssDungeonWeekly;
      saveWork.rehearsalAndDejavu = bodyData.rehearsalAndDejavu;
      saveWork.weeklyAttributeChanged = false;
      saveWork.save();
    });
    res.status(200).json({ success: true });
    return;
  }

  // 카오스던전 횟수에 따른 휴식게이지 차감

  const chaosMinus = userHomework.chaosDone - bodyData.chaosDone;
  for (let i1 = 0; i1 < Math.abs(chaosMinus); i1++) {
    if (chaosMinus < 0) {
      if (bodyData.chaosRestValue - 20 < 0) {
        break;
      } else {
        bodyData.chaosRestValue -= 20;
      }
    } else if (chaosMinus > 0) {
      if (bodyData.chaosRestValue + 20 > 100) {
        break;
      } else {
        bodyData.chaosRestValue += 20;
      }
    }
  }

  // 가디언토벌 횟수에 따른 휴식게이지 차감
  const guardianMinus = userHomework.guardianDone - bodyData.guardianDone;
  for (let i2 = 0; i2 < Math.abs(guardianMinus); i2++) {
    if (guardianMinus < 0) {
      if (bodyData.guardianRestValue - 20 < 0) {
        break;
      } else {
        bodyData.guardianRestValue -= 20;
      }
    } else if (guardianMinus > 0) {
      if (bodyData.guardianRestValue + 20 > 100) {
        break;
      } else {
        bodyData.guardianRestValue += 20;
      }
    }
  }

  // 에포나 횟수에 따른 휴식게이지 차감
  const eponaMinus = userHomework.eponaDone - bodyData.eponaDone;
  for (let i3 = 0; i3 < Math.abs(eponaMinus); i3++) {
    if (eponaMinus < 0) {
      if (bodyData.eponaRestValue - 20 < 0) {
        break;
      } else {
        bodyData.eponaRestValue -= 20;
      }
    } else if (eponaMinus > 0) {
      if (bodyData.eponaRestValue + 20 > 100) {
        break;
      } else {
        bodyData.eponaRestValue += 20;
      }
    }
  }

  // 변경속성 초기화
  bodyData.attributeChanged = false;

  userHomework = await UserLoado.findByIdAndUpdate(req.params.id, bodyData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: userHomework });
});

exports.updateDailyHomework = asyncHandler(async (req, res, next) => {
  if (process.env.UPDATE_KEY !== req.query.key) {
    res.status(403).json({ success: false });
    return;
  }

  await LoadoLogs.create({
    activity: 'updateDailyHomework',
  });

  moment.tz.setDefault('Asia/Seoul');
  let m_date = moment();
  let date = m_date.format('YYYY-MM-DD HH:mm:ss dddd');
  const what_day = m_date.day();
  const what_hour = m_date.hours();
  const what_minute = m_date.minutes();

  // 매일 오전 5시 50분 부터 오전 6시 10분 사이
  if (
    // (what_hour === 5 && what_minute > 50) ||
    // (what_hour === 6 && what_minute < 10)
    1 === 1
  ) {
    const totalHomeworks = await UserLoado.find();

    if (totalHomeworks.length < 2) {
      await asyncUpdate(what_day, totalHomeworks);
      return res.status(200).json({ success: true });
    }

    // 반으로 나눠서 비동기로 처리
    const chunkHomeworks = totalHomeworks.splice(
      0,
      Math.floor(totalHomeworks.length / 2)
    );
    const remainingHomeworks = totalHomeworks;

    // 비동기 처리가 되는지 확인하기 위해 await sleep(Math.random()*1000) 써도 됨
    const chunkRun = asyncUpdate(what_day, chunkHomeworks);
    const remainingRun = asyncUpdate(what_day, remainingHomeworks);

    // 그냥 await 써도 됨
    const chunkAwait = await chunkRun;
    const remainingAwait = await remainingRun;
  }
  res.status(200).json({ success: true });
  // console.log(totalHomeworks);
});

// 비동기 처리함수
const asyncUpdate = async (req_day, hwList) => {
  hwList.map(async (item, idx) => {
    // 휴식게이지 고정이 아닌 경우만
    if (!item.dontChange) {
      const chaosRestAdd =
        (2 - item.chaosDone) * 10 + item.chaosRestValue > 100
          ? 100
          : (2 - item.chaosDone) * 10 + item.chaosRestValue;
      const guardianRestAdd =
        (2 - item.guardianDone) * 10 + item.guardianRestValue > 100
          ? 100
          : (2 - item.guardianDone) * 10 + item.guardianRestValue;
      const eponaRestAdd =
        (3 - item.eponaDone) * 10 + item.eponaRestValue > 100
          ? 100
          : (3 - item.eponaDone) * 10 + item.eponaRestValue;
      item.chaosRestValue = chaosRestAdd;
      item.guardianRestValue = guardianRestAdd;
      item.eponaRestValue = eponaRestAdd;
    }
    item.chaosDone = 0;
    item.guardianDone = 0;
    item.eponaDone = 0;

    // 주간 컨탠츠 초기화 (수요일 5시 50분 부터 수요일 6시 10분 사이)
    if (req_day === 3) {
      item.rehearsalAndDejavu = [];
      item.abyssDungeonWeekly = false;
      item.abyssDungeon2 = false;
      item.guardianWeeklyDone = 0;
      item.argos = false;
      item.baltan = false;
      item.biakiss = false;
      item.kukuseitn = false;
      item.abrel = false;
    }

    await UserLoado.findByIdAndUpdate(item._id, item, {
      new: true,
      runValidators: true,
    });
  });
};

exports.updatePersonalHomework = asyncHandler(async (req, res, next) => {
  await LoadoLogs.create({
    activity: 'updatePersonalHomework',
    user: req.user._id,
  });
  let userHomework = await UserLoado.find({ user: req.user._id });
  moment.tz.setDefault('Asia/Seoul');
  let m_date = moment();
  let date = m_date.format('YYYY-MM-DD HH:mm:ss dddd');
  const what_day = m_date.day();
  const what_hour = m_date.hours();
  const what_minute = m_date.minutes();
  await asyncUpdate(what_day, userHomework);

  res.status(200).json({ success: true });
});

// @desc        Delete a homework
// @route       Delete /loado/api/homeworks/:homeworkId
// @access      Private
exports.deleteHomework = asyncHandler(async (req, res, next) => {
  const homework = await UserLoado.findById(req.params.id);

  if (!homework) {
    return next(new ErrorResponse(`해당 레코드가 존재하지 않습니다`, 404));
  }

  if (homework.user.toString() !== req.user.id) {
    return next(new ErrorResponse(`수정하기에 올바른 사용자가 아닙니다`, 401));
  }

  await LoadoLogs.create({
    activity: 'deleteHomework',
    user: req.user._id,
    stringParam: req.params.id,
  });

  await homework.remove();

  const totalLength = await changeHWIdx(req.user._id);

  res.status(200).json({ success: true, totalLength });
});

exports.cronTest = asyncHandler(async (req, res, next) => {
  return res.status(200).json({ success: true, data: new Date() });
});

// function sleep(ms) {
//   return new Promise((resolve) => {
//     setTimeout(resolve, ms);
//   });
// }

// exports.getUserHomeworks = async (req, res, next) => {
//   try {
//     const userHomeworks = await UserLoado.find({ user: req.params.id });
//     if (userHomeworks.length === 0) {
//       // properly formatted object id
//       return next(
//         new ErrorResponse(
//           `User homework not found with id of ${req.params.id}`,
//           404
//         )
//       );
//     }
//     res.status(200).json({
//       success: true,
//       data: userHomeworks,
//       dataLength: userHomeworks.length,
//     });
//   } catch (err) {
//     // // improperly formatted object id
//     // // we don't even want to write this, just use next(err) => change error.js
//     // next(
//     //   new ErrorResponse(
//     //     `User homework not found with id of ${req.params.id}`,
//     //     404
//     //   )
//     // );
//     next(err);
//   }
// };
