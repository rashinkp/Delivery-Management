import type { FC } from "react";
import { Outlet } from "react-router-dom";

const DriverLayout: FC = () => {
  return (
    <div className="min-h-screen p-4 bg-gray-100">
      <header className="mb-4 font-bold text-xl">Truck Driver Panel</header>
      <main>
        <Outlet /> 
      </main>
    </div>
  );
};

export default DriverLayout;
