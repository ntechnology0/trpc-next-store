import Layout from "@components/layouts/Layout";
import { requireAuthentication } from "@components/layouts/ProtectRoute";
import type { NextPage } from "next";

import dynamic from "next/dynamic";
import styled from "styled-components";

const Header = dynamic(() => import("@components/shared/Header"));
const Menu = dynamic(() => import("@components/shared/Menu"));
const Button = dynamic(() => import("@components/shared/Button"));
const TodayChart = dynamic(() => import("@components/dashboard/TodayChart"), {
  ssr: false,
});

const DashboardStyled = styled.div``;

export const getServerSideProps = requireAuthentication(async (ctx) => {
  return { props: {} };
});

const Dashboard: NextPage = () => {
  return (
    <Layout title="Parawell.ma | Panneau administrateur">
      <div className="w-screen flex min-h-screen flex-col justify-start items-start">
        <Header />
        <Menu />
        <DashboardStyled className="container height__row flex flex-row justify-start items-start space-x-0 lg:space-x-4 py-2">
          <div className="w-full lg:w-[160px] flex flex-col justify-start items-start"></div>
          <div className="w-full flex flex-col justify-start items-start py-2">
            <div className="w-full border-b border-slate-200 pb-3.5 flex flex-row justify-between items-center">
              <h1 className="font-semibold fonts__inter_regular text-xl">
                Aujourd'hui
              </h1>
            </div>
            <div className="w-full grid grid-cols-1 lg:grid-cols-12 h-full">
              <div className="col-span-12 lg:col-span-9 flex flex-col justify-center items-start h-full border-b border-slate-200">
                <div className="w-full flex flex-row justify-start items-start">
                  <div className="flex flex-col justify-start items-start">
                    <h1 className="fonts__inter_regular font-medium text-xs text-slate-500">
                      Volume brut
                    </h1>
                    <h4 className="fonts__poppins_regular text-black text-lg flex flex-row space-x-1">
                      <span className="">{"10,000"}</span>
                      <span>د.م.</span>
                    </h4>
                  </div>
                </div>
                <TodayChart />
              </div>
              <div className="col-span-12 lg:col-span-3 flex flex-col justify-start items-start border-l border-slate-200">
                <div className="w-full flex flex-col border-b border-slate-200 justify-start items-start py-4 px-4 space-y-0.5">
                  <div className="w-full flex flex-row justify-between items-center">
                    <h3 className="fonts__inter_regular font-medium text-slate-700 text-xs">
                      Compte courant
                    </h3>
                    <Button
                      type="neutral"
                      className="text-xs text-slate-600 h-6 fonts__inter_regular"
                    >
                      <span className="text-xs font-medium">Voir plus</span>
                    </Button>
                  </div>
                  <p className="text-md fonts__poppins_regular space-x-1">
                    <span className="">{"10,000"}</span>
                    <span>د.م.</span>
                  </p>
                  <span className="text-xs text-slate-400">
                    Paiements futurs estimés
                  </span>
                </div>
                <div className="w-full flex flex-col border-b   border-slate-200 justify-start items-start py-4 px-4 space-y-0.5">
                  <div className="w-full flex flex-row justify-between items-center">
                    <h3 className="fonts__inter_regular font-medium text-slate-700 text-xs">
                      Compte courant
                    </h3>
                    <Button
                      type="neutral"
                      className="text-xs text-slate-600 h-6 fonts__inter_regular"
                    >
                      <span className="text-xs font-medium">Voir plus</span>
                    </Button>
                  </div>
                  <p className="text-md fonts__poppins_regular space-x-1">
                    <span className="">{"10,000"}</span>
                    <span>د.م.</span>
                  </p>
                  <span className="text-xs text-slate-400">
                    Paiements futurs estimés
                  </span>
                </div>
              </div>
            </div>
          </div>
        </DashboardStyled>
      </div>
    </Layout>
  );
};

export default Dashboard;
