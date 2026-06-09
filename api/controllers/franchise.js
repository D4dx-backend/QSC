const { default: mongoose } = require("mongoose");
const Franchise = require("../models/franchise.js");

// @desc      CREATE NEW franchise
// @route     POST /api/v1/franchise
// @access    protect

exports.createFranchise = async (req, res) => {
  try {
    const newFranchise = await Franchise.create(req.body);
    res.status(200).json({ success: true, message: "Franchise created successfully", data: newFranchise });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, message: err.toString() });
  }
};

// @desc      GET ALL FRANCHISE
// @route     GET /api/v1/franchise
// @access    public
exports.getFranchise = async (req, res) => {
  try {
    const { id, skip, limit, searchkey } = req.query;

    const query = searchkey ? { ...req.filter, name: { $regex: searchkey, $options: "i" } } : req.filter;

    if (id && mongoose.isValidObjectId(id)) {
      const franchise = await Franchise.findById(id);
      return res.status(200).json({ success: true, message: "Retrieved specific Franchise", response: franchise });
    }

    if (req.user.userType.role === "Franchise Admin") {
      const franchiseId = req.user.franchise;
      const franchise = await Franchise.find({ _id: franchiseId });

      res.status(200).json({ success: true, message: "Retrieved franchise data for Franchise Admin", response: franchise, count: 1, totalCount: 1, filterCount: 1 });
    } else {
      // If the user is not a Franchise Admin, proceed with regular data retrieval
      const [totalCount, filterCount, data] = await Promise.all([
        parseInt(skip) === 0 && Franchise.countDocuments(),
        parseInt(skip) === 0 && Franchise.countDocuments(query),
        Franchise.find(query)
          .skip(parseInt(skip) || 0)
          .limit(parseInt(limit) || 50)
          .sort({ _id: -1 }),
      ]);

      res.status(200).json({ success: true, message: "Retrieved all franchise ", response: data, count: data.length, totalCount: totalCount || 0, filterCount: filterCount || 0 });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, message: err.toString() });
  }
};

// @desc      UPDATE SPECIFIC FRANCHISE
// @route     PUT /api/v1/franchise/:id
// @access    protect
exports.updateFranchise = async (req, res) => {
  try {
    const franchise = await Franchise.findByIdAndUpdate(req.body.id, req.body, {
      new: true,
    });

    if (!franchise) {
      return res.status(404).json({ success: false, message: " Franchise not found" });
    }

    res.status(200).json({ success: true, message: "Franchise updated successfully", data: franchise });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, message: err.toString() });
  }
};

// @desc      DELETE SPECIFIC FRANCHISE
// @route     DELETE /api/v1/franchise/:id
// @access    protect
exports.deleteFranchise = async (req, res) => {
  try {
    const franchise = await Franchise.findByIdAndDelete(req.query.id);

    if (!franchise) {
      return res.status(404).json({ success: false, message: "Franchise not found" });
    }

    res.status(200).json({ success: true, message: "Franchise deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, message: err.toString() });
  }
};

// @desc      GET CUSTOMER TYPE
// @route     GET /api/v1/customer-type/select
// @access    public
exports.select = async (req, res) => {
  try {
    const items = await Franchise.find({}, { _id: 0, id: "$_id", value: "$name" });
    return res.status(200).send(items);
  } catch (err) {
    console.log(err);
    errorLog(req, err);
    res.status(400).json({ success: false, message: err.toString() });
  }
};

// ........ mobile ........ //

// @desc      GET ALL FRANCHISE
// @route     GET /api/v1/franchise/getFranchise
// @access    public
exports.getFranchiseMobile = async (req, res) => {
  try {
    const { id, skip, limit, searchkey, code } = req.query;

    const query = searchkey ? { ...req.filter, name: { $regex: searchkey, $options: "i" } } : req.filter;

    if (code) {
      const franchise = await Franchise.findOne({ franchiseCode: code });
      return res.status(200).json({ success: true, message: "Retrieved specific Franchise", response: franchise });
    }

    if (id && mongoose.isValidObjectId(id)) {
      const franchise = await Franchise.findById(id);
      return res.status(200).json({ success: true, message: "Retrieved specific Franchise", response: franchise });
    }

    const [totalCount, filterCount, data] = await Promise.all([
      parseInt(skip) === 0 && Franchise.countDocuments(),
      parseInt(skip) === 0 && Franchise.countDocuments(query),
      Franchise.find(query)
        .skip(parseInt(skip) || 0)
        .limit(parseInt(limit) || 50)
        .sort({ _id: -1 }),
    ]);

    res.status(200).json({ success: true, message: "Retrieved all franchise ", response: data, count: data.length, totalCount: totalCount || 0, filterCount: filterCount || 0 });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, message: err.toString() });
  }
};
