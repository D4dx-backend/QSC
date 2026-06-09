import React, { useEffect, useState } from "react";
import Layout from "../../../core/layout";
import ListTable from "../../../core/list/list";
import { Container } from "../../../core/layout/styels";
import PopupView from "../../../core/popupview";
import AutoForm from "../../../core/autoform/AutoForm";
import { postData } from "../../../../backend/api";
//src/components/styles/page/index.js
//if you want to write custom style wirte in above file
const DistrictAdmin = (props) => {
  //to update the page title
  useEffect(() => {
    document.title = `District Admin - QSC Automation`;
  }, []);

  const [showTerms, setShowTerms] = useState(false);
  const [user, setUser] = useState("");

  const submitChange = async (post) => {
    // Combine the post data with the user state
    const postDataWithUser = {
      ...post,
      user,
    };

    const response = await postData(postDataWithUser, "auth/update-passoword");
    if (response.status === 200) {
      setShowTerms(false);
      props.setMessage({
        type: 1,
        content: "success",
        proceed: "Okay",
      });
    }
  };

  const [attributes] = useState([
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
      type: "select",
      apiType: "API",
      selectApi: "district/select",
      placeholder: "District",
      name: "districts",
      validation: "",
      Collection: "district",
      showItem: "district",
      default: "",
      label: "District",
      tag: true,
      required: false,
      view: true,
      add: true,
      update: true,
      filter: true,
    },
  ]);

  const [actions] = useState([
    {
      element: "button",
      type: "callback",
      callback: (item, data, refreshView) => {
        // Set the data for the clicked item and open the SetupMenu popup
        setShowTerms(true);
        setUser(data._id);
      },
      itemTitle: {
        name: "user",
        type: "text",
        collection: "",
      },
      icon: "checked",
      title: "Reset Password",
      params: {
        api: ``,
        parentReference: "",
        itemTitle: {
          name: "user",
          type: "text",
          collection: "",
        },
        shortName: "Reset Password",
        addPrivilege: true,
        delPrivilege: true,
        updatePrivilege: true,
        customClass: "medium",
      },
    },
  ]);

  return (
    <Container className="noshadow">
      <ListTable
        actions={actions}
        api={`user/districtAdmin`}
        // itemTitle={`label`}
        itemTitle={{
          name: "name",
          type: "text",
          collection: "",
        }}
        shortName={`District Admin`}
        formMode={`single`}
        attributes={attributes}
        surfaceTheme={"district"}
        {...props}
      ></ListTable>
      {showTerms && (
        <PopupView
          // Popup data is a JSX element which is binding to the Popup Data Area like HOC
          popupData={
            <AutoForm
              useCaptcha={false}
              useCheckbox={false}
              customClass={""}
              description={""}
              formValues={{}}
              formMode={""}
              key={"change-password"}
              formType={"post"}
              header={"Reset Your Password"}
              css={"plain"}
              formInput={[
                {
                  type: "password",
                  placeholder: "New Password",
                  name: "newPassword",
                  validation: "password",
                  info: "At least one uppercase letter (A-Z) \n At least one lowercase letter (a-z) \n At least one digit (0-9) \n At least one special character (@, $, !, %, *, ?, &) \n Minimum length of 8 characters",
                  default: "",
                  label: "New Password",
                  tag: true,
                  required: true,
                  view: true,
                  add: true,
                  update: true,
                },
              ]}
              submitHandler={submitChange}
              button={"Submit"}
              isOpenHandler={(value) => {}}
              isOpen={true}
              plainForm={false}
            ></AutoForm>
          }
          closeModal={(e) => {
            setShowTerms(false);
          }}
          itemTitle={{ name: "title", type: "text", collection: "" }}
          openData={{
            data: { _id: "", title: "Update your Password" },
          }} // Pass selected item data to the popup for setting the time and taking menu id and other required data from the list item
          customClass={"small iframe"}
        ></PopupView>
      )}
    </Container>
  );
};

export default Layout(DistrictAdmin);
