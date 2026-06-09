import React, { useEffect, useState } from "react";
import Layout from "../../../core/layout";
import ListTable from "../../../core/list/list";
import { Container } from "../../../core/layout/styels";
//src/components/styles/page/index.js
//if you want to write custom style wirte in above file
const Franchise = (props) => {
  //to update the page title
  useEffect(() => {
    document.title = `Franchise - QSC Automation`;
  }, []);

  const [attributes] = useState([
    {
      type: "text",
      placeholder: "Franchise Name",
      name: "name",
      validation: "",
      default: "",
      label: "Franchise Name",
      required: true,
      view: false,
      add: true,
      update: true,
    },
    {
      type: "text",
      placeholder: "Location",
      name: "location",
      validation: "",
      default: "",
      tag: true,
      label: "Location",
      required: true,
      view: true,
      add: true,
      update: true,
    },
    {
      type: "text",
      placeholder: "Email",
      name: "email",
      validation: "",
      default: "",
      tag: true,
      label: "Email",
      required: false,
      view: true,
      add: true,
      update: true,
    },
    {
      type: "text",
      placeholder: "Phone",
      name: "phone",
      validation: "",
      default: "",
      tag: true,
      label: "Phone",
      required: true,
      view: true,
      add: true,
      update: true,
    },
    {
      type: "number",
      placeholder: "Franchise Code",
      name: "franchiseCode",
      validation: "",
      default: "",
      tag: true,
      label: "Franchise Code",
      required: true,
      view: true,
      add: true,
      update: true,
    },
    {
      type: "image",
      placeholder: "Logo",
      name: "logo",
      validation: "",
      default: "",
      tag: true,
      label: "Logo",
      required: true,
      view: true,
      add: true,
      update: true,
    },
  ]);

  const [franchiseAdmin] = useState([
    {
      type: "text",
      placeholder: "User Name",
      name: "name",
      validation: "",
      default: "",
      tag: true,
      label: "User Name",
      required: true,
      view: true,
      add: true,
      update: true,
    },
    {
      type: "text",
      placeholder: "Name",
      name: "name",
      validation: "",
      default: "",
      tag: true,
      label: "Name",
      required: true,
      view: true,
      add: true,
      update: true,
    },
    {
      type: "email",
      placeholder: "E-Mail",
      name: "email",
      validation: "",
      default: "",
      tag: true,
      label: "E-Mail",
      required: false,
      view: true,
      add: true,
      update: true,
    },
    {
      type: "text",
      placeholder: "Mobile",
      name: "mobile",
      validation: "",
      default: "",
      tag: true,
      label: "Mobile",
      required: false,
      view: true,
      add: true,
      update: true,
    },
    {
      type: "text",
      placeholder: "District",
      name: "district",
      validation: "",
      default: "",
      tag: true,
      label: "District",
      required: false,
      view: true,
      add: true,
      update: true,
    },
    {
      type: "password",
      placeholder: "Password",
      name: "password",
      validation: "",
      default: "",
      // tag: true,
      label: "Password",
      required: false,
      view: true,
      add: true,
      update: false,
    },
    {
      type: "image",
      placeholder: "Image",
      name: "image",
      validation: "",
      default: "",
      tag: true,
      label: "Image",
      required: false,
      view: true,
      add: true,
      update: true,
    },
  ]);

  const [actions] = useState([
    {
      element: "button",
      type: "subList",
      id: "user/franchiseAdmin",
      itemTitle: {
          name: "title",
          type: "text",
          collection: "",
      },
      exportPrivilege: true,
      title: "Franchise Admin",
      attributes: franchiseAdmin,
      params: {
          api: `user/franchiseAdmin`,
          parentReference: "franchise",
          itemTitle: {
              name: "title",
              type: "text",
              collection: "",
          },
          shortName: "Franchise Admin",
          addPrivilege: true,
          delPrivilege: true,
          updatePrivilege: true,
          customClass: "medium",
          formMode: "double",
          exportPrivilege: true,
      },
  },
  ]);

  return (
    <Container className="noshadow">
      <ListTable
        actions={actions}
        api={`franchise`}
        // itemTitle={`label`}
        itemTitle={{
          name: "name",
          type: "text",
          collection: "",
        }}
        shortName={`Franchise`}
        formMode={`double`}
        surfaceTheme={"district"}
        attributes={attributes}
        {...props}
      ></ListTable>
    </Container>
  );
};

export default Layout(Franchise);
