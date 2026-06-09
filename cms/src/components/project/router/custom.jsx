const CustomRoutes = () => [
  {
    _id: "1",
    label: "Event Page Landing Page",
    sequence: 1,
    icon: "event",
    status: true,
    isLink: false,
    path: "/landing-page/:id",
    element: "demo-landing",
    hideMenu: true,
    hideHeader: true,
    showInMenu: false,
    __v: 0,
    privilege: {
      status: true,
      add: false,
      update: false,
      delete: false,
      export: false,
      __v: 0,
    },
    submenus: [],
  },
];

export default CustomRoutes;
