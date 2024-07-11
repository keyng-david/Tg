import { NavLink } from "react-router-dom";
import Info from './icons/Info';
import Settings from './icons/Settings';
import Mine from './icons/Mine';
import Friends from './icons/Friends';
import Coins from './icons/Coins';
import { binanceLogo, hamsterCoin } from './images'; // Ensure these are correctly imported

export const Menu = () => {
  return (
    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-[calc(100%-2rem)] max-w-xl bg-[#272a2f] flex justify-around items-center z-50 rounded-3xl text-xs">

      <NavLink to="/" className="w-1/5">
        <div className="text-center text-[#85827d] bg-[#1c1f24] m-1 p-2 rounded-2xl">
          <img src={binanceLogo} alt="Exchange" className="w-8 h-8 mx-auto" />
          <p className="mt-1">Home</p>
        </div>
      </NavLink>

      <NavLink to="#" className="w-1/5">
        <div className="text-center text-[#85827d]">
          <Mine className="w-8 h-8 mx-auto" />
          <p className="mt-1">Mine</p>
        </div>
      </NavLink>

      <NavLink to="/game" className="w-1/5">
        <div className="text-center text-[#85827d]">
          <Friends className="w-8 h-8 mx-auto" />
          <p className="mt-1">Play</p>
        </div>
      </NavLink>

      <NavLink to="#" className="w-1/5">
        <div className="text-center text-[#85827d]">
          <Coins className="w-8 h-8 mx-auto" />
          <p className="mt-1">Earn</p>
        </div>
      </NavLink>

      <NavLink to="#" className="w-1/5">
        <div className="text-center text-[#85827d]">
          <img src={hamsterCoin} alt="Airdrop" className="w-8 h-8 mx-auto" />
          <p className="mt-1">Airdrop</p>
        </div>
      </NavLink>
    </div>
  );
};