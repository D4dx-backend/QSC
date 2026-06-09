const { default: mongoose } = require("mongoose");
const Menu = require("../models/menu");
const MenuItem = require("../models/menuItem");

//@desc ADD MENU
//@route POST/api/v1/menu
//@access public
exports.addMenu = async (req, res) => {
  try {
    const response = await Menu.create(req.body);
    res.status(200).json({
      success: true,
      message: `successfully added menu `,
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

// @desc      GET ALL MENU & GET SPECIFIC MENU
// @route     GET /api/v1/menu
// @access    public
exports.getMenu = async (req, res) => {
  try {
    const { id, skip, limit, searchkey } = req.query;

    if (id && mongoose.isValidObjectId(id)) {
      const response = await Menu.findById(id);
      return res.status(200).json({
        success: true,
        message: "Retrieved specific menu",
        response,
      });
    }

    const query = searchkey ? { ...req.filter, label: { $regex: searchkey, $options: "i" } } : req.filter;

    const [totalCount, filterCount, data] = await Promise.all([
      parseInt(skip) === 0 && Menu.countDocuments(),
      parseInt(skip) === 0 && Menu.countDocuments(query),
      Menu.find(query)
        .skip(parseInt(skip) || 0)
        .limit(parseInt(limit) || 50),
    ]);

    res.status(200).json({
      success: true,
      message: "Retrieved all menu",
      response: data,
      count: data.length,
      totalCount: totalCount || 0,
      filterCount: filterCount || 0,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err.toString(),
    });
  }
};

// @desc      UPDATE SPECIFIC MENU
// @route     PUT /api/v1/menu
// @access    public
exports.updateMenu = async (req, res) => {
  try {
    const { id } = req.body;
    const response = await Menu.findByIdAndUpdate(id, req.body);
    res.status(200).json({
      success: true,
      message: `updated specific menu`,
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

// @desc      DELETE SPECIFIC MENU
// @route     DELETE /api/v1/menu
// @access    public
exports.deleteMenu = async (req, res) => {
  try {
    const { id } = req.query;
    const response = await Menu.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: `deleted specific menu`,
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
exports.getHierarchicalMenu = async (req, res) => {
  try {
    const { project } = req.query;

    // Validate projectId if it's provided
    if (project && !mongoose.isValidObjectId(project)) {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID.",
      });
    }

    // Fetch all menu items (active only)
    const menuItems = project ? await MenuItem.find({ project: project, isActive: true }).lean() : await MenuItem.find({ isActive: true }).lean();

    // Create a map to hold menu items by their ID for easy access
    const menuMap = {};
    menuItems.forEach((item) => {
      menuMap[item._id] = { ...item, children: [] }; // Initialize children array
    });

    // Build the tree structure
    const hierarchicalMenu = [];
    menuItems.forEach((item) => {
      if (item.parentId) {
        // If the item has a parentId, add it to its parent's children array
        const parent = menuMap[item.parentId];
        if (parent) {
          parent.children.push(menuMap[item._id]);
        }
      } else {
        // If the item has no parentId, it is a top-level menu item
        hierarchicalMenu.push(menuMap[item._id]);
      }
    });

    res.status(200).json({
      success: true,
      message: "Retrieved hierarchical menu",
      response: hierarchicalMenu,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err.toString(),
    });
  }
};

// @desc      GET MENU
// @route     GET /api/v1/menu/select
// @access    protect
exports.select = async (req, res) => {
  try {
    const items = await Menu.find({}, { _id: 0, id: "$_id", value: "$label" });
    console.log(items);
    return res.status(200).send(items);
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err.toString(),
    });
  }
};
