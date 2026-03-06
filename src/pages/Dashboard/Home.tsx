
import PageMeta from "../../components/common/PageMeta";

// New Dashboard Components
import TodaysSales from "../../components/ecommerce/TodaysSales";
import VisitorInsights from "../../components/ecommerce/VisitorInsights";
import TotalRevenue from "../../components/ecommerce/TotalRevenue";
import CustomerSatisfaction from "../../components/ecommerce/CustomerSatisfaction";
import TargetVsReality from "../../components/ecommerce/TargetVsReality";
import TopProducts from "../../components/ecommerce/TopProducts";
import SalesMappingByCountry from "../../components/ecommerce/SalesMappingByCountry";
import VolumeVsServiceLevel from "../../components/ecommerce/VolumeVsServiceLevel";

export default function Home() {
  return (
    <>
      <PageMeta
        title="Dashboard | IPixit"
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6">

        {/* ROW 1 */}
        <div className="col-span-12 xl:col-span-7">
          <TodaysSales />
        </div>
        <div className="col-span-12 xl:col-span-5">
          <VisitorInsights />
        </div>

        {/* ROW 2 */}
        <div className="col-span-12 lg:col-span-5">
          <TotalRevenue />
        </div>
        <div className="col-span-12 md:col-span-6 lg:col-span-4">
          <CustomerSatisfaction />
        </div>
        <div className="col-span-12 md:col-span-6 lg:col-span-3">
          <TargetVsReality />
        </div>

        {/* ROW 3 */}
        <div className="col-span-12 lg:col-span-5">
          <TopProducts />
        </div>
        <div className="col-span-12 md:col-span-6 lg:col-span-4">
          <SalesMappingByCountry />
        </div>
        <div className="col-span-12 md:col-span-6 lg:col-span-3">
          <VolumeVsServiceLevel />
        </div>

      </div>
    </>
  );
}

