import type { FC, ReactNode } from "react";

interface DriverLayoutProps {
  children: ReactNode;
}

const DriverLayout: FC<DriverLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen p-4 bg-gray-100">
      <header className="mb-4">Truck Driver Panel</header>
      <main>{children}</main>
    </div>
  );
};

export default DriverLayout;
