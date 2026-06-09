import { DataView, ElementContainer } from "../../core/elements";
import { PageHeader } from "../../core/input/heading";
const customSettings = (userData) => [
  {
    name: `a-unique-name-for-tab-1`,
    title: "Profile",
    content: (
      <ElementContainer className="column">
        <PageHeader title="Personal Details"></PageHeader>
        <DataView title={"Name"} value={userData.fullName ?? "Not Found"}></DataView>
        <DataView title={"Email"} value={userData.email ?? "No Found"}></DataView>
        <DataView title={"Franchise"} value={userData.franchise ?? "No Found"}></DataView>
        <DataView title={"Your Role"} value={userData.userType.role ?? "No Found"}></DataView>
      </ElementContainer>
    ),
    icon: "user",
  },
];
export default customSettings;
