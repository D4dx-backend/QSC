const User = require("../models/user");
const Appointment = require("../models/appointment");
const moment = require("moment");
const { default: mongoose } = require("mongoose");

// @desc      GET COUNTS FOR DASHBOARED
// @route     GET /api/v1/dashboard
// @access    protect
exports.count = async (req, res) => {
  try {
    if (req.user.userType.role === "Dietician") {
      const pipeline = [
        {
          $match: {
            dietician: new mongoose.Types.ObjectId(req.user._id),
          },
        },
        {
          $group: {
            _id: null,
            patients: { $sum: 1 },
            admittedPatients: {
              $sum: {
                $cond: [{ $ne: ["$admissionDate", null] }, 1, 0],
              },
            },
          },
        },
      ];

      const result = await Appointment.aggregate(pipeline);

      const { patients, admittedPatients } = result[0];

      res.status(200).json([
        {
          count: admittedPatients,
          title: "Admitted Patients",
          icon: "patient",
          background: "#fbe2f0",
          color: "rgb(252 121 127)",
        },
        {
          count: patients,
          title: "Patients",
          icon: "patient",
          background: "#ebf1fb",
          color: "#5753cd",
        },
      ]);
    } else if (req.user.userType.role === "Admin") {
      const [dieticianCount, patientCount, deliveryManCount] =
        await Promise.all([
          User.countDocuments({ userType: "6471b34d9fb2b29fe0458878" }),
          User.countDocuments({ userType: "6471b3849fb2b29fe045887b" }),
          User.countDocuments({ userType: "64815bde89e0a44fc31c53b0" }),
        ]);

      const targetDate = new Date();
      const startOfDay = moment(targetDate).startOf("day").toDate();
      const endOfDay = moment(targetDate).endOf("day").toDate();
      const existingBookingCount = await Appointment.countDocuments({
        bookingDate: {
          $gte: startOfDay,
          $lt: endOfDay,
        },
      });

      res.status(200).json([
        {
          count: dieticianCount,
          title: "Dietitians",
          icon: "dietitian",
          background: "#fbe2f0",
          color: "rgb(252 121 127)",
        },
        {
          count: patientCount,
          title: "Patients",
          icon: "patient",
          background: "#ebf1fb",
          color: "#5753cd",
        },
        {
          count: deliveryManCount,
          title: "Delivery Man",
          icon: "deliveryMan",
          background: "#ebf1fb",
          color: "#5753cd",
        },
        {
          count: existingBookingCount,
          title: "Booking Count",
          icon: "booking",
          background: "#ebf1fb",
          color: "#5753cd",
        },
        // {
        //   count: dieticianCount,
        //   title: "Dieticians",
        //   icon: "dietician",
        //   background: "#fbe2f0",
        //   color: "rgb(252 121 127)",
        // },
        // {
        //   count: patientCount,
        //   title: "Patients",
        //   icon: "patient",
        //   background: "#ebf1fb",
        //   color: "#5753cd",
        // },
        // {
        //   count: deliveryManCount,
        //   title: "Delivery Man",
        //   icon: "deliveryMan",
        //   background: "#ebf1fb",
        //   color: "#5753cd",
        // },
        // {
        //   count: existingBookingCount,
        //   title: "Booking Count",
        //   icon: "booking",
        //   background: "#ebf1fb",
        //   color: "#5753cd",
        // },
      ]);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

// @desc      GET PATIENT COUNTS FOR DASHBOARED
// @route     GET /api/v1/dashboard/dietitian
// @access    protect
exports.patientCount = async (req, res) => {
  try {
    const pipeline = [
      {
        $match: {
          dietician: new mongoose.Types.ObjectId(req.query.dietitian),
        },
      },
      {
        $group: {
          _id: null,
          patients: { $sum: 1 },
          admittedPatients: {
            $sum: {
              $cond: [{ $ne: ["$admissionDate", null] }, 1, 0],
            },
          },
        },
      },
    ];

    const result = await Appointment.aggregate(pipeline);

    const { patients, admittedPatients } = result[0];

    res.status(200).json({
      patients,
      admittedPatients,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
