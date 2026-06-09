const { default: mongoose } = require("mongoose");
const MenuItem = require("../models/menuItem");

exports.addMenuItem = async (req, res) => {
  try {
    // Extract values from the request body
    const { role, actions, menuItem, subMenuType } = req.body;

    if (menuItem) {
      const response = await MenuItem.findById({ _id: menuItem });
      const permissions = [
        {
          role: new mongoose.Types.ObjectId(role),
          menuItem: new mongoose.Types.ObjectId(menuItem),
          actions: actions,
        },
      ];
      const existingMenuItem = await MenuItem.updateOne(
        { _id: menuItem },
        { permissions: permissions }
      );
      res.status(200).json({
        success: true,
        message: `Successfully updated menu item`,
        response,
      });
    }

    // Create the permissions array
    const permissions = [
      {
        role: new mongoose.Types.ObjectId(role),
        menuItem: new mongoose.Types.ObjectId(menuItem),
        actions: actions,
      },
    ];

    // Create the new menu item, including the permissions array
    const newMenuItem = {
      permissions: permissions ? permissions : null,
    };
    if (subMenuType === "subMenu") {
      const response = await MenuItem.create({
        permissions: null,
        parentId: menuItem,
        title: req.body.title,
        subMenuType: subMenuType,
      });
      res.status(200).json({
        success: true,
        message: `Successfully added submenu item`,
        response,
      });
    }
    if (subMenuType === "itemMenu") {
      const response = await MenuItem.create({
        title: req.body.title,
        subMenuType: subMenuType,
        order: req.body.order,
        icon: req.body.icon,
        isActive: req.body.isActive,
      });
      res.status(200).json({
        success: true,
        message: `Successfully added menu item`,
        response,
      });
    }

    if (!menuItem) {
      const response = await MenuItem.create(newMenuItem);
      res.status(200).json({
        success: true,
        message: `Successfully added menu item`,
        response,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Error saving menu item",
      error: err.message, // Provide the error message for debugging
    });
  }
};

// @desc      GET ALL MENU ITEM & GET SPECIFIC MENU ITEM
// @route     GET /api/v1/menu-item
// @access    public
exports.getMenuItem = async (req, res) => {
  try {
    const { id, skip, limit, searchkey } = req.query;
    if (id && mongoose.isValidObjectId(id)) {
      const response = await MenuItem.findById(id);
      return res.status(200).json({
        success: true,
        message: "Retrieved specific menu item",
        response,
      });
    }

    const query = searchkey
      ? {
          ...req.filter,
          title: { $regex: searchkey, $options: "i" },
          subMenuType: "itemMenu",
        }
      : {
          ...req.filter,
          subMenuType: "itemMenu",
        };

    const [totalCount, filterCount, data] = await Promise.all([
      parseInt(skip) === 0 && MenuItem.countDocuments(),
      parseInt(skip) === 0 && MenuItem.countDocuments(query),
      MenuItem.find(query)
        .populate("parentId")
        .skip(parseInt(skip) || 0)
        .limit(parseInt(limit) || 50),
    ]);
    res.status(200).json({
      success: true,
      message: "Retrieved all menu item",
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

// @desc      UPDATE SPECIFIC MENU ITEM
// @route     PUT /api/v1/menu-item
// @access    public
exports.updateMenuItem = async (req, res) => {
  try {
    const { id } = req.body;
    const response = await MenuItem.findByIdAndUpdate(id, req.body);
    res.status(200).json({
      success: true,
      message: `Updated specific menu item`,
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

// @desc      DELETE SPECIFIC MENU ITEM
// @route     DELETE /api/v1/menu-item
// @access    public
exports.deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.query;
    const response = await MenuItem.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: `Deleted specific menu item`,
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

// @desc      GET MENU ITEM'S
// @route     GET /api/menu-item/select
// @access    protect
exports.select = async (req, res) => {
  try {
    const items = await MenuItem.find(
      {},
      { _id: 0, id: "$_id", value: "$title" }
    );
    return res.status(200).send(items);
  } catch (err) {
    console.log(err);
    res.status(204).json({
      success: false,
      message: err,
    });
  }
};

exports.getMenuItemPermission = async (req, res) => {
  try {
    const { id, skip, limit, searchkey, menuItem } = req.query;
    // Check if a specific menuItem is requested
    if (menuItem && mongoose.isValidObjectId(menuItem)) {
      const response = await MenuItem.find({ _id: menuItem })
        .populate("permissions.role")
        .select("permissions"); // Only fetch the permissions array

      // Flatten the permissions array and check for response to avoid null reference
      const permissions = response.length > 0 ? response[0].permissions : [];

      return res.status(200).json({
        success: true,
        message: "Retrieved specific menu item permissions",
        response: permissions,
      });
    }

    // Build the query for searching and filtering
    const query = searchkey
      ? {
          ...req.filter,
          title: { $regex: searchkey, $options: "i" },
        }
      : {
          ...req.filter,
        };

    const [totalCount, filterCount, data] = await Promise.all([
      parseInt(skip) === 0 && MenuItem.countDocuments(),
      parseInt(skip) === 0 && MenuItem.countDocuments(query),
      MenuItem.find(query)
        .populate("parentId")
        .populate("permissions.role")
        .skip(parseInt(skip) || 0)
        .limit(parseInt(limit) || 50)
        .select("permissions"),
    ]);

    // Flatten the permissions array from each item in data
    const permissions = data.map((item) => item.permissions).flat();

    // Send the response with the flattened permissions
    res.status(200).json({
      success: true,
      message: "Retrieved all menu item permissions",
      response: permissions,
      count: permissions.length,
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

exports.updateMenuItemPermission = async (req, res) => {
  try {
    const { role, actions, menuItem, id } = req.body; // Include menuItem in the request body

    // Check if an id is provided for updating
    if (id) {
      // Update the existing permission
      const existingMenuItem = await MenuItem.findOne({
        "permissions._id": id,
      });

      if (existingMenuItem) {
        // Update the existing permission
        const updatedMenuItem = await MenuItem.updateOne(
          { "permissions._id": id }, // Target the specific permission using its _id
          {
            $set: {
              "permissions.$.role": new mongoose.Types.ObjectId(role),
              "permissions.$.actions": actions,
            },
          } // Update the role and actions
        );

        if (updatedMenuItem.nModified === 0) {
          return res.status(404).json({
            success: false,
            message: "Permission not found, or no changes made.",
          });
        }

        return res.status(200).json({
          success: true,
          message: "Successfully updated existing permission.",
        });
      } else {
        // If no existing permission, respond with an error
        return res.status(404).json({
          success: false,
          message: "Permission ID not found.",
        });
      }
    } else {
      // If no id is provided, proceed to add a new permission
      if (!menuItem) {
        return res.status(400).json({
          success: false,
          message: "MenuItem ID is required to add a permission.",
        });
      }

      const newPermission = {
        role: new mongoose.Types.ObjectId(role),
        actions: actions,
      };

      const updatedMenuItem = await MenuItem.updateOne(
        { _id: menuItem }, // Find the MenuItem by its ID
        {
          $push: {
            permissions: newPermission,
          },
        }
      );

      if (updatedMenuItem.nModified === 0) {
        return res.status(404).json({
          success: false,
          message: "MenuItem not found or no permission added.",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Successfully added new permission to the menu item.",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: err.message || "An error occurred while updating permissions.",
    });
  }
};

// @desc      DELETE SPECIFIC MENU ITEM PERMISSION
// @route     DELETE /api/v1/menu-item/menuitem-permission
// @access    public
exports.deleteMenuItemPermission = async (req, res) => {
  try {
    const { id } = req.query; // Permission ID

    // Check if id is provided
    if (!id || !mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Valid permission Id is required for deletion.",
      });
    }

    // Find the menu item containing the permission and remove it
    const response = await MenuItem.updateOne(
      { "permissions._id": id },
      { $pull: { permissions: { _id: id } } }
    );

    if (response.nModified === 0) {
      return res.status(404).json({
        success: false,
        message: "Permission not found, or already deleted.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Successfully deleted menu item permission.",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message:
        err.message || "An error occurred while deleting menu item permission.",
    });
  }
};

exports.getSubMenuItem = async (req, res) => {
  try {
    const { id, skip, limit, searchkey, menuItem } = req.query;
    console.log(req.query, "req.query");
    if (id && mongoose.isValidObjectId(id)) {
      const response = await MenuItem.findById(id);
      return res.status(200).json({
        success: true,
        message: "Retrieved specific menu item",
        response,
      });
    }
    if (menuItem && mongoose.isValidObjectId(menuItem)) {
      const response = await MenuItem.find({ parentId: menuItem });
      return res.status(200).json({
        success: true,
        message: "Retrieved specific menu item",
        response,
      });
    }
    const query = searchkey
      ? {
          ...req.filter,
          title: { $regex: searchkey, $options: "i" },
          subMenuType: "itemMenu",
        }
      : {
          ...req.filter,
          subMenuType: "itemMenu",
        };

    const [totalCount, filterCount, data] = await Promise.all([
      parseInt(skip) === 0 && MenuItem.countDocuments(),
      parseInt(skip) === 0 && MenuItem.countDocuments(query),
      MenuItem.find(query)
        .populate("parentId")
        .skip(parseInt(skip) || 0)
        .limit(parseInt(limit) || 50),
    ]);

    res.status(200).json({
      success: true,
      message: "Retrieved all menu item",
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

exports.updateSubMenuItem = async (req, res) => {
  try {
    const { id } = req.body;
    const response = await MenuItem.findByIdAndUpdate(id, req.body);
    res.status(200).json({
      success: true,
      message: `updated specific menu item`,
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

// @desc      DELETE SPECIFIC SUBMENU ITEM
// @route     DELETE /api/v1/menu-item/submenu-item
// @access    public
exports.deleteSubMenuItem = async (req, res) => {
  try {
    const { id } = req.query;

    // Check if id is provided and is a valid ObjectId
    if (!id || !mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Valid submenu item Id is required for deletion.",
      });
    }

    // Find and delete the submenu item by its ID
    const response = await MenuItem.findByIdAndDelete(id);

    if (!response) {
      return res.status(404).json({
        success: false,
        message: "Submenu item not found or already deleted.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Successfully deleted submenu item.",
      response,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: err.message || "An error occurred while deleting submenu item.",
    });
  }
};

exports.getSubMenuItemPermission = async (req, res) => {
  try {
    const { id, skip, limit, searchkey, menuItem } = req.query;
    console.log(req.query, "req.query");

    // Check if a specific menuItem is requested
    if (menuItem && mongoose.isValidObjectId(menuItem)) {
      const response = await MenuItem.find({ _id: menuItem })
        .populate("permissions.role")
        .select("permissions"); // Only fetch the permissions array
      console.log(response, "RESPONSE");

      // Flatten the permissions array and check for response to avoid null reference
      const permissions = response.length > 0 ? response[0].permissions : [];

      return res.status(200).json({
        success: true,
        message: "Retrieved specific menu item permissions",
        response: permissions,
      });
    }

    // Build the query for searching and filtering
    const query = searchkey
      ? {
          ...req.filter,
          title: { $regex: searchkey, $options: "i" },
        }
      : {
          ...req.filter,
        };

    // Execute the query
    const [totalCount, filterCount, data] = await Promise.all([
      parseInt(skip) === 0 && MenuItem.countDocuments(),
      parseInt(skip) === 0 && MenuItem.countDocuments(query),
      MenuItem.find(query)
        .populate("parentId")
        .populate("permissions.role")
        .skip(parseInt(skip) || 0)
        .limit(parseInt(limit) || 50)
        .select("permissions"), // Only fetch the permissions array
    ]);

    // Flatten the permissions array from each item in data
    const permissions = data.map((item) => item.permissions).flat();

    // Send the response with the flattened permissions
    res.status(200).json({
      success: true,
      message: "Retrieved all menu item permissions",
      response: permissions,
      count: permissions.length,
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

exports.updateSubMenuItemPermission = async (req, res) => {
  try {
    const { role, actions, menuItem, id } = req.body; // Include menuItem in the request body

    // Check if an id is provided for updating
    if (id) {
      // Update the existing permission
      const existingMenuItem = await MenuItem.findOne({
        "permissions._id": id,
      });

      if (existingMenuItem) {
        // Update the existing permission
        const updatedMenuItem = await MenuItem.updateOne(
          { "permissions._id": id }, // Target the specific permission using its _id
          {
            $set: {
              "permissions.$.role": new mongoose.Types.ObjectId(role),
              "permissions.$.actions": actions,
            },
          } // Update the role and actions
        );

        if (updatedMenuItem.nModified === 0) {
          return res.status(404).json({
            success: false,
            message: "Permission not found, or no changes made.",
          });
        }

        return res.status(200).json({
          success: true,
          message: "Successfully updated existing permission.",
        });
      } else {
        // If no existing permission, respond with an error
        return res.status(404).json({
          success: false,
          message: "Permission ID not found.",
        });
      }
    } else {
      // If no id is provided, proceed to add a new permission
      if (!menuItem) {
        return res.status(400).json({
          success: false,
          message: "MenuItem ID is required to add a permission.",
        });
      }

      const newPermission = {
        role: new mongoose.Types.ObjectId(role),
        actions: actions,
      };

      const updatedMenuItem = await MenuItem.updateOne(
        { _id: menuItem }, // Find the MenuItem by its ID
        {
          $push: {
            permissions: newPermission,
          },
        }
      );

      if (updatedMenuItem.nModified === 0) {
        // Check if the MenuItem exists but no permission was added
        const menuItemExists = await MenuItem.findById(menuItem);
        if (!menuItemExists) {
          return res.status(404).json({
            success: false,
            message: "MenuItem not found.",
          });
        } else {
          return res.status(500).json({
            success: false,
            message: "Permission not added. Unknown error.",
          });
        }
      }

      return res.status(200).json({
        success: true,
        message: "Successfully added new permission to the menu item.",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: err.message || "An error occurred while updating permissions.",
    });
  }
};

// @desc      DELETE SPECIFIC SUBMENU ITEM PERMISSION
// @route     DELETE /api/v1/menu-item/submenuitem-permission
// @access    public
exports.deleteSubMenuItemPermission = async (req, res) => {
  try {
    const { id } = req.query; // Permission ID

    // Check if id is provided
    if (!id || !mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Valid permission Id is required for deletion.",
      });
    }

    // Find the menu item containing the permission and remove it
    const response = await MenuItem.updateOne(
      { "permissions._id": id },
      { $pull: { permissions: { _id: id } } }
    );

    if (response.nModified === 0) {
      return res.status(404).json({
        success: false,
        message: "Permission not found, or already deleted.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Successfully deleted menu item permission.",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message:
        err.message || "An error occurred while deleting menu item permission.",
    });
  }
};
