import { NavLink } from "react-router-dom";
import { useActivePath } from "../hooks/use-active-path";
import binanceLogo from "./imgs/binanceLogo";
import { Mine, Friends, Coins } from "./icons";
import hamsterCoin from "./imgs/hamsterCoin";

export const Menu = () => {
  return (
    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-[calc(100%-2rem)] max-w-xl bg-[#272a2f] flex justify-around items-center z-50 rounded-3xl text-xs">
      <NavLink
        to="/"
        className="text-center text-[#85827d] w-1/5 bg-[#1c1f24] m-1 p-2 rounded-2xl"
        activeClassName="text-white" // Optional: add styles for active link
      >
        <img src={binanceLogo} alt="Exchange" className="w-8 h-8 mx-auto" />
        <p className="mt-1">Home</p>
      </NavLink>
      <NavLink
        to="/mine"
        className="text-center text-[#85827d] w-1/5"
        activeClassName="text-white" // Optional: add styles for active link
      >
        <Mine className="w-8 h-8 mx-auto" />
        <p className="mt-1">Mine</p>
      </NavLink>
      <NavLink
        to="/friends"
        className="text-center text-[#85827d] w-1/5"
        activeClassName="text-white" // Optional: add styles for active link
      >
        <Friends className="w-8 h-8 mx-auto" />
        <p className="mt-1">Friends</p>
      </NavLink>
      <NavLink
        to="/earn"
        className="text-center text-[#85827d] w-1/5"
        activeClassName="text-white" // Optional: add styles for active link
      >
        <Coins className="w-8 h-8 mx-auto" />
        <p className="mt-1">Earn</p>
      </NavLink>
      <NavLink
        to="/airdrop"
        className="text-center text-[#85827d] w-1/5"
        activeClassName="text-white" // Optional: add styles for active link
      >
        <img src={hamsterCoin} alt="Airdrop" className="w-8 h-8 mx-auto" />
        <p className="mt-1">Airdrop</p>
      </NavLink>
    </div>
  );
};
