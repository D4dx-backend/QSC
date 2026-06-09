const { default: mongoose } = require("mongoose");
const User = require("../models/user");
const userTypes = require("../models/userTypes");

// @desc      ADD USER TYPE
// @route     POST /api/user
// @access    public
exports.addUser = async (req, res) => {
  try {
    const response = await User.create(req.body);
    res.status(200).json({
      success: true,
      message: `succefully added user ${response.user}`,
      response,
    });
  } catch (err) {
    console.log(err);
    res.status(204).json({
      success: false,
      message: err,
    });
  }
};

// @desc      GET SPECIFIC USER
// @route     GET /api/user/user
// @access    protect
exports.getUser = async (req, res) => {
  try {
    const { id, skip, limit, searchkey } = req.query;

    if (id && mongoose.isValidObjectId(id)) {
      const response = await User.findById(id).populate("franchise");
      return res.status(200).json({
        success: true,
        message: "Retrieved specific User",
        response,
      });
    }

    req.filter.franchise = req.filter.franchise ?? req.user.franchise._id;
    console.log(req.franchise);

    const query = {
      ...req.filter,
      ...(searchkey && {
        $or: [
          { role: { $regex: searchkey, $options: "i" } },
          { roleDisplayName: { $regex: searchkey, $options: "i" } },
        ],
      }),
      uid: { $exists: true }, // Check for the existence of the "uid" field
    };

    const filterCount =
      skip && parseInt(skip) === 0 ? await User.countDocuments(query) : 0;
    const totalCount =
      skip && parseInt(skip) === 0 ? await User.countDocuments() : 0;

    const data = await User.find(query)
      .populate("franchise")
      .skip(parseInt(skip) || 0)
      .limit(parseInt(limit) || 10);

    res.status(200).json({
      success: true,
      message: `Retrieved all Users`,
      response: id ? data[0] : data,
      count: data.length,
      totalCount: totalCount || 0,
      filterCount: filterCount || 0,
    });
  } catch (err) {
    console.log(err);
    res.status(204).json({
      success: false,
      message: err,
    });
  }
};

exports.getFranchiseAdmin = async (req, res) => {
  try {
    const { id, skip, limit, searchkey, franchise } = req.query;

    if (id && mongoose.isValidObjectId(id)) {
      const response = await User.findById(id);
      return res.status(200).json({
        success: true,
        message: "Retrieved specific User",
        response,
      });
    }

    const query = {
      ...req.filter,
      ...(searchkey && {
        $or: [
          { role: { $regex: searchkey, $options: "i" } },
          { roleDisplayName: { $regex: searchkey, $options: "i" } },
        ],
      }),
      uid: { $exists: false }, // Check for the existence of the "uid" field
    };

    const filterCount =
      skip && parseInt(skip) === 0 ? await User.countDocuments(query) : 0;
    const totalCount =
      skip && parseInt(skip) === 0 ? await User.countDocuments() : 0;

    const data = await User.find(query)
      .populate("franchise")
      .skip(parseInt(skip) || 0)
      .limit(parseInt(limit) || 10);

    res.status(200).json({
      success: true,
      message: `Retrieved all Users`,
      response: id ? data[0] : data,
      count: data.length,
      totalCount: totalCount || 0,
      filterCount: filterCount || 0,
    });
  } catch (err) {
    console.log(err);
    res.status(204).json({
      success: false,
      message: err,
    });
  }
};

// @desc      UPDATE SPECIFIC USER
// @route     PUT /api/user/user
// @access    public
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.body;
    const response = await User.findByIdAndUpdate(id, req.body);
    res.status(200).json({
      success: true,
      message: `updated specific user `,
      response,
    });
  } catch (err) {
    console.log(err);
    res.status(204).json({
      success: false,
      message: err,
    });
  }
};

// @desc      DELETE SPECIFIC USER
// @route     DELETE /api/user/user
// @access    public
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.query;
    const response = await User.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: `deleted specific user `,
      response,
    });
  } catch (err) {
    console.log(err);
    res.status(204).json({
      success: false,
      message: err,
    });
  }
};

// @desc      GET USER'S
// @route     DELETE /api/v1/user/select
// @access    protect
exports.select = async (req, res) => {
  try {
    // const role = req.query?.userType?.replace(/\?$/, "") || "";
    const idPattern = /^[a-zA-Z0-9]+/;
    const role = req.query?.userType.match(idPattern)?.[0] || "";
    let query = {};
    query.status = "Active";

    if (req.user?.userType?.role === "Dietician") {
      query.dietician = req.user?._id;
      query.franchise = new mongoose.Types.ObjectId(req.user?.franchise);
      query.userType = role;
    } else if (req.user?.userType?.role === "Admin") {
      query.userType = role;
    } else {
      query.franchise = new mongoose.Types.ObjectId(req.user?.franchise);
      query.userType = role;
    }

    const items = await User.find(query, {
      _id: 0,
      id: "$_id",
      value: "$userDisplayName",
      Name: "$username",
      CprNumber: "$cprNumber",
      Email: "$email",
    });
    return res.status(200).send(items);
  } catch (err) {
    console.log(err);
    errorLog(req, err);
    res.status(400).json({
      success: false,
      message: err.toString(),
    });
  }
};

// FRANCHISE ADMIN
exports.addFranchiseAdmin = async (req, res) => {
  try {
    const franchiseType = await UserType.findOne({ role: "Franchise Admin" });
    // console.log(franchiseType._id.toString());
    const response = await User.create({
      ...req.body,
      userType: franchiseType._id.toString(),
    });
    res.status(200).json({
      success: true,
      message: `succefully added user ${response.user}`,
      response,
    });
  } catch (err) {
    console.log(err);
    res.status(204).json({
      success: false,
      message: err,
    });
  }
};

// ADD EVENT ADMIN
exports.addEventAdmin = async (req, res) => {
  try {
    const eventType = await UserType.findOne({ role: "Event Admin" });
    // console.log(eventType._id.toString());
    const response = await User.create({
      franchise: req.user.franchise,
      ...req.body,
      userType: eventType._id.toString(),
    });
    res.status(200).json({
      success: true,
      message: `succefully added user ${response.user}`,
      response,
    });
  } catch (err) {
    console.log(err);
    res.status(204).json({
      success: false,
      message: err,
    });
  }
};

// GET EVENT ADMIN
exports.getEventAdmin = async (req, res) => {
  try {
    const { id, skip, limit, searchkey, franchise, event } = req.query;
    console.log(req.query);

    if (id && mongoose.isValidObjectId(id)) {
      const response = await User.findById(id);
      return res.status(200).json({
        success: true,
        message: "Retrieved specific event admin",
        response,
      });
    }

    const query = {
      ...req.filter,
      ...(searchkey && {
        $or: [
          { role: { $regex: searchkey, $options: "i" } },
          { roleDisplayName: { $regex: searchkey, $options: "i" } },
        ],
      }),
      uid: { $exists: false }, // Check for the existence of the "uid" field
    };

    const filterCount =
      skip && parseInt(skip) === 0 ? await User.countDocuments(query) : 0;
    const totalCount =
      skip && parseInt(skip) === 0 ? await User.countDocuments() : 0;

    const data = await User.find(query)
      .populate("event")
      .populate("franchise")
      .skip(parseInt(skip) || 0)
      .limit(parseInt(limit) || 10);

    res.status(200).json({
      success: true,
      message: `Retrieved all event admin's`,
      response: id ? data[0] : data,
      count: data.length,
      totalCount: totalCount || 0,
      filterCount: filterCount || 0,
    });
  } catch (err) {
    console.log(err);
    res.status(204).json({
      success: false,
      message: err,
    });
  }
};

// ADD DISTRICT ADMIN
exports.addDistrictAdmin = async (req, res) => {
  try {
    const districtType = await userTypes.findOne({ role: "District Admin" });
    const response = await User.create({
      ...req.body,
      userType: districtType._id,
    });
    res.status(200).json({
      success: true,
      message: `succefully added user ${response.user}`,
      response,
    });
  } catch (err) {
    console.log(err);
    res.status(204).json({
      success: false,
      message: err,
    });
  }
};

// GET DISTRICT ADMIN
exports.getDistrictAdmin = async (req, res) => {
  try {
    const { id, skip, limit, searchkey } = req.query;

    const userType = await userTypes.findOne({ role: "District Admin" });
    if (id && mongoose.isValidObjectId(id)) {
      const response = await User.findById(id);
      return res.status(200).json({
        success: true,
        message: "Retrieved specific User",
        response,
      });
    }

    const query = {
      ...req.filter,
      userType: userType._id,
      ...(searchkey && {
        $or: [
          { role: { $regex: searchkey, $options: "i" } },
          { roleDisplayName: { $regex: searchkey, $options: "i" } },
        ],
      }),
      uid: { $exists: false }, // Check for the existence of the "uid" field
    };

    const filterCount =
      skip && parseInt(skip) === 0 ? await User.countDocuments(query) : 0;
    const totalCount =
      skip && parseInt(skip) === 0 ? await User.countDocuments() : 0;

    const data = await User.find(query)
      .populate("districts")
      .skip(parseInt(skip) || 0)
      .limit(parseInt(limit) || 10)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: `Retrieved all Users`,
      response: id ? data[0] : data,
      count: data.length,
      totalCount: totalCount || 0,
      filterCount: filterCount || 0,
    });
  } catch (err) {
    console.log(err);
    res.status(204).json({
      success: false,
      message: err,
    });
  }
};
