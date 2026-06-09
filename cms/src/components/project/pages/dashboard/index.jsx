import { useSelector } from "react-redux";
import withLayout from "../../../core/layout";
import { ElementContainer } from "../../../core/elements";
import { DashBox } from "../../../core/dashboard/dashbox";
import HighlightCards from "../../../core/dashboard/highlitecard";
import LineGraph from "../../../core/dashboard/linegraph";
import BarChart from "../../../core/dashboard/barchart";
import ComparisonLineChart from "../../../core/dashboard/comparisonlinechart";
import ComparisonBarChart from "../../../core/dashboard/comparisonbarchart";
import DashTable from "../../../core/dashboard/dashtable";
import LevelChart from "../../../core/dashboard/levelchart";
import PieChart from "../../../core/dashboard/piechart";
const Dashboard = (props) => {
  const themeColors = useSelector((state) => state.themeColors);
  // const dispatch = useDispatch();
  // const [initialized, setInitialized] = useState(false);
  // const dashboard = useSelector((state) =>
  //   state?.pages?.[`dashboard`]
  //     ? state?.pages?.[`dashboard`]
  //     : {
  //         data: null,
  //         isLoading: true,
  //         error: null,
  //       }
  // );
  // useEffect(() => {
  //   props.setLoaderBox(dashboard.isLoading);
  //   dashboard.isLoading && setInitialized(true);
  // }, [dashboard, props]);

  // useEffect(() => {
  //   if (initialized) {
  //     dispatch(addPageObject("dashboard", 0, {}));
  //   }
  // }, [initialized, dispatch]);

  // useEffect(() => {
  //   // console.log(dashboard);
  // }, [dashboard]);

  // return (
  //   <DashboardSection>
  //     {/* <h1>dasfasdfds</h1> */}
  //     {dashboard?.data?.length > 0 &&
  //       dashboard?.data?.map((item, index) => (
  //         <Tile key={index}>
  //           <TitleBox>
  //             <Count>{item.count}</Count>
  //             <Title>{item.title}</Title>
  //           </TitleBox>
  //           <IconWrapper
  //             style={{ background: item.background, color: item.color }}
  //           >
  //             <GetIcon icon={item.icon} />
  //           </IconWrapper>
  //         </Tile>
  //       ))}
  //   </DashboardSection>
  // );
  return (
    <ElementContainer className="dashboard">
      <DashBox key={1} width="60%">
        <HighlightCards title="Total Summery" description="A total summery of the key section."></HighlightCards>
      </DashBox>
      <DashBox width="40%">
        <LineGraph></LineGraph>
      </DashBox>
      <DashBox width="40%">
        <BarChart></BarChart>
      </DashBox>
      <DashBox width="30%">
        <ComparisonLineChart></ComparisonLineChart>
      </DashBox>
      <DashBox width="29%">
        <ComparisonBarChart></ComparisonBarChart>
      </DashBox>
      <DashBox width="40%">
        <DashTable themeColors={themeColors}></DashTable>
      </DashBox>
      <DashBox width="30%">
        <PieChart></PieChart>
      </DashBox>
      <DashBox width="29%">
        <LevelChart></LevelChart>
      </DashBox>
    </ElementContainer>
  );
};

export default withLayout(Dashboard);
