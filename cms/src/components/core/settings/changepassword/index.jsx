import React from "react";
import { postData } from "../../../../backend/api";
import AutoForm from "../../autoform/AutoForm";
import { PageHeader } from "../../input/heading";
import { ElementContainer } from "../../elements";

const ChangePassword = (props) => {
  const submitChange = async (post) => {
    const response = await postData(post, "user/update-password");
    if (response.status === 200) {
    }
  };
  return (
    <ElementContainer className=" column">
      <PageHeader title="Reset Your Password" />
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
        css={"plain embed head-hide"}
        formInput={[
          {
            type: "password",
            placeholder: "Old Password",
            name: "oldPassword",
            validation: "",
            info: "At least one uppercase letter (A-Z) \n At least one lowercase letter (a-z) \n At least one digit (0-9) \n At least one special character (@, $, !, %, *, ?, &) \n Minimum length of 8 characters",
            default: "",
            label: "Old Password",
            minimum: 0,
            maximum: 16,
            required: true,
            add: true,
          },
          {
            type: "password",
            placeholder: "New Passoword",
            name: "newPassword",
            validation: "password-match",
            info: "At least one uppercase letter (A-Z) \n At least one lowercase letter (a-z) \n At least one digit (0-9) \n At least one special character (@, $, !, %, *, ?, &) \n Minimum length of 8 characters",
            default: "",
            label: "New Passoword",
            minimum: 0,
            maximum: 16,
            required: true,
            add: true,
          },
          {
            type: "password",
            placeholder: "Confirm Passoword",
            name: "confirmPassword",
            validation: "password-match",
            info: "At least one uppercase letter (A-Z) \n At least one lowercase letter (a-z) \n At least one digit (0-9) \n At least one special character (@, $, !, %, *, ?, &) \n Minimum length of 8 characters",
            default: "",
            label: "Confirm Passoword",
            minimum: 0,
            maximum: 16,
            required: true,
            add: true,
          },
        ]}
        submitHandler={submitChange}
        button={"Reset Password"}
        isOpenHandler={(value) => {}}
        isOpen={true}
        plainForm={false}
      ></AutoForm>
    </ElementContainer>
  );
};
export default ChangePassword;
