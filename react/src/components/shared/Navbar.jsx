import React, { useEffect, useState } from "react";
import LanguageSwitcher from "./LanguageSwitcher";
import MainNav from "./MainNav";
import UserAccountMenu from "./UserAccountMenu";

export default function Navbar() {
  return (
    <header className="bg-white shadow sticky top-0 z-50">
      <div className="bg-black text-white text-center py-6 text-sm md:text-lg px-4">
        Don&apos;t invest unless you&apos;re prepared to lose all the money you
        invest. This is a high-risk investment, and you are unlikely to be
        protected if something goes wrong.
      </div>

      <div className="container mx-auto flex justify-between items-center py-4 px-4">
        <div className="flex items-center space-x-4">
          <a href="/" className="text-xl font-bold">
            <img src="/logo.png" alt="Logo" className="h-6" />
          </a>
        </div>

        <div className="flex items-center space-x-6">
          <LanguageSwitcher />
          <MainNav />
          <UserAccountMenu />
        </div>
      </div>
    </header>
  );
}
