import React, { useEffect, useState } from "react";
import Layout from "../../../core/layout";
import ListTable from "../../../core/list/list";
import { Container } from "../../../core/layout/styels";
//src/components/styles/page/index.js
//if you want to write custom style wirte in above file
const Settings = (props) => {
  //to update the page title
  useEffect(() => {
    document.title = `Settings - QSC Automation`;
  }, []);

  const [attributes] = useState([
    {
      type: "title",
      title: "Whatsapp Configuration",
      name: "sm",
      add: true,
      update: true,
    },
    {
      type: "text",
      placeholder: "Whatsapp Url",
      name: "whatsappUrl",
      validation: "",
      default: "",
      label: "Whatsapp Url",
      tag: true,
      view: true,
      add: true,
      update: true,
    },
    {
      type: "text",
      placeholder: "Whatsapp Access Token",
      name: "whatsappAccessToken",
      validation: "",
      default: "",
      label: "Whatsapp Access Token",
      tag: true,
      view: true,
      add: true,
      update: true,
    },
    {
      type: "text",
      placeholder: "Whatsapp Account",
      name: "whatsappAccount",
      validation: "",
      default: "",
      label: "Whatsapp Account",
      tag: true,
      view: true,
      add: true,
      update: true,
    },

    {
      type: "title",
      title: "Email Configuration",
      name: "sm",
      add: true,
      update: true,
    },
    {
      type: "text",
      placeholder: "SMTP HOST",
      name: "smtpHost",
      validation: "",
      default: "",
      label: "SMTP HOST",
      tag: true,
      view: true,
      add: true,
      update: true,
    },
    {
      type: "text",
      placeholder: "SMTP PORT",
      name: "smtpPort",
      validation: "",
      default: "",
      label: "SMTP PORT",
      tag: true,
      view: true,
      add: true,
      update: true,
    },
    {
      type: "text",
      placeholder: "SMTP USERNAME",
      name: "smtpUsername",
      validation: "",
      default: "",
      label: "SMTP USERNAME",
      tag: true,
      view: true,
      add: true,
      update: true,
    },
    {
      type: "text",
      placeholder: "SMTP PASSWORD",
      name: "smtpPassword",
      validation: "",
      default: "",
      label: "SMTP PASSWORD",
      tag: true,
      view: true,
      add: true,
      update: true,
    },
    {
      type: "text",
      placeholder: "SMTP FROM EMAIL",
      name: "smtpFromEmail",
      validation: "",
      default: "",
      label: "SMTP FROM EMAIL",
      tag: true,
      view: true,
      add: true,
      update: true,
    },
  ]);

  return (
    <Container className="noshadow">
      <ListTable
        // actions={actions}
        api={`settings`}
        itemTitle={{ name: "title", type: "text", collection: "" }}
        shortName={`Settings`}
        formMode={`single`}
        surfaceTheme={"district"}
        {...props}
        attributes={attributes}
      ></ListTable>
    </Container>
  );
};
// exporting the page with parent container layout..
export default Layout(Settings);
