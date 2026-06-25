"use client";

import Profile from "./components/profile/profile";
import Programs from "./components/programs";
import Leaderboard from "./components/leaderboard";

function YapperPage() {

  return (
    <div className="w-full h-full grid grid-cols-12 grid-rows-12 overflow-hidden">
      <div className="relative z-50 col-span-8 row-span-12">
        <Profile />
      </div>
      <div className="col-start-9 col-span-4 row-start-1 row-end-7 [@media(max-height:1000px)]:row-end-6">
        <Programs />
      </div>
      <div className="col-start-9 col-span-4 row-start-7 row-end-13 [@media(max-height:1000px)]:row-start-6">
        <Leaderboard />
      </div>
    </div>
  );
}

export default YapperPage;
