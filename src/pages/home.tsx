import React, { useEffect, useState, useMemo } from 'react';
import { useTgUser } from '../hooks/use-tg-user';
import { useQuery } from 'convex/react';
import { Link } from "react-router-dom";
import { Toaster } from "sonner";
import './home.css';
import { binanceLogo, dailyCipher, dailyCombo, dailyReward, dollarCoin, mainCharacter } from './images';
import Info from './icons/Info';
import Settings from './icons/Settings';
import { useSaveGameResult } from '../hooks/use-save-game-result';
import { api } from '../../convex/_generated/api';

const App: React.FC = () => {
  const currentTgUser = useTgUser();
  const user = useQuery(api.queries.userByTelegramId, {
    tgUserId: currentTgUser?.id,
  });

  const [points, setPoints] = useState<number>(user?.points || 0);

  const levelNames = useMemo(() => [
    'Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Epic',
    'Legendary', 'Master', 'GrandMaster', 'Lord'
  ], []);

  const levelMinPoints = useMemo(() => [
    0, 5000, 25000, 100000, 1000000, 2000000,
    10000000, 50000000, 100000000, 1000000000
  ], []);

  const [levelIndex, setLevelIndex] = useState<number>(1);
  const [clicks, setClicks] = useState<{ id: number, x: number, y: number }[]>([]);
  const pointsToAdd = 1;
  const profitPerHour = 1000;

  const now = new Date();
  const targetHour = 0;
  const target = new Date(now);
  target.setUTCHours(targetHour, 0, 0, 0);

  if (now.getUTCHours() >= targetHour) {
    target.setUTCDate(target.getUTCDate() + 1);
  }


  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    card.style.transform = `perspective(1000px) rotateX(${-y / 10}deg) rotateY(${x / 10}deg)`;
    setTimeout(() => {
      card.style.transform = '';
    }, 100);

    setClicks([...clicks, { id: Date.now(), x: e.pageX, y: e.pageY }]);

    setPoints((prevPoints: number) => prevPoints + pointsToAdd);
  };

  useEffect(() => {
    const pointsPerSecond = Math.floor(profitPerHour / 3600);
    const interval = setInterval(() => {
      setPoints((prevPoints: number) => prevPoints + pointsPerSecond);
    }, 1000);
    return () => clearInterval(interval);
  }, [profitPerHour]);

  const handleAnimationEnd = (id: number) => {
    setClicks((prevClicks) => prevClicks.filter(click => click.id !== id));
  };

  const calculateProgress = (): number => {
    if (levelIndex >= levelNames.length - 1) {
      return 100;
    }
    const currentLevelMin = levelMinPoints[levelIndex];
    const nextLevelMin = levelMinPoints[levelIndex + 1];
    const progress = ((points - currentLevelMin) / (nextLevelMin - currentLevelMin)) * 100;
    return Math.min(progress, 100);
  };

  useEffect(() => {
    const currentLevelMin = levelMinPoints[levelIndex];
    const nextLevelMin = levelMinPoints[levelIndex + 1];
    if (points >= nextLevelMin && levelIndex < levelNames.length - 1) {
      setLevelIndex(levelIndex + 1);
    } else if (points < currentLevelMin && levelIndex > 0) {
      setLevelIndex(levelIndex - 1);
    }
  }, [points, levelIndex, levelMinPoints, levelNames.length]);

  useSaveGameResult(points);

  const formatProfitPerHour = (profit: number): string => {
    if (profit >= 1000000000) return `+${(profit / 1000000000).toFixed(2)}B`;
    if (profit >= 1000000) return `+${(profit / 1000000).toFixed(2)}M`;
    if (profit >= 1000) return `+${(profit / 1000).toFixed(2)}K`;
    return `+${profit}`;
  };

  return (
    <div className="bg-black flex justify-center">
      <Toaster position="top-center" duration={3000} />
      <div className="w-full bg-black text-white h-screen font-bold flex flex-col max-w-xl">
        <div className="px-4 z-10">
          <div className="flex items-center space-x-2 pt-4">
            <div>
              <p className="text-sm">{user?.firstName} {user?.lastName}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between space-x-4 mt-1">
          <div className="px-4 z-10">
            <div className="flex items-center w-1/3">
              <div className="w-full">
                <div className="flex justify-between">
                  <p className="text-sm">{levelNames[levelIndex]}</p>
                  <p className="text-sm">{levelIndex + 1} <span className="text-[#95908a]">/ {levelNames.length}</span></p>
                </div>
                <div className="flex items-center mt-1 border-2 border-[#43433b] rounded-full">
                  <div className="w-full h-2 bg-[#43433b]/[0.6] rounded-full">
                    <div className="progress-gradient h-2 rounded-full" style={{ width: `${calculateProgress()}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center w-2/3 border-2 border-[#43433b] rounded-full px-4 py-[2px] bg-[#43433b]/[0.6] max-w-64">
              <img src={binanceLogo} alt="Exchange" className="w-8 h-8" />
              <div className="h-[32px] w-[2px] bg-[#43433b] mx-2"></div>
              <div className="flex-1 text-center">
                <p className="text-xs text-[#85827d] font-medium">Profit per hour</p>
                <div className="flex items-center justify-center space-x-1">
                  <img src={dollarCoin} alt="Dollar Coin" className="w-[18px] h-[18px]" />
                  <p className="text-sm">{formatProfitPerHour(profitPerHour)}</p>
                  <Info size={20} className="text-[#43433b]" />
                </div>
              </div>
              <div className="h-[32px] w-[2px] bg-[#43433b] mx-2"></div>
              <Settings className="text-white" />
            </div>
          </div>
        </div>
        <div className="flex-grow mt-4 bg-[#f3ba2f] rounded-t-[48px] relative top-glow z-0">
          <div className="absolute top-[2px] left-0 right-0 bottom-0 bg-[#1d2025] rounded-t-[46px]">
            <div className="px-4 mt-6 flex justify-between gap-2">
              <div className="bg-[#272a2f] rounded-lg px-4 py-2 w-full relative">
                <div className="dot"></div>
                <Link to="#">
                  <img src={dailyReward} alt="Daily Reward" className="mx-auto w-12 h-12" />
                </Link>
                <p className="text-[10px] text-center text-white mt-1">Daily reward</p>
              </div>
              <div className="bg-[#272a2f] rounded-lg px-4 py-2 w-full relative">
                <div className="dot"></div>
                <Link to="/leaderboard">
                  <img src={dailyCipher} alt="Daily Cipher" className="mx-auto w-12 h-12" />
                </Link>
                <p className="text-[10px] text-center text-white mt-1">Rank</p>
              </div>
              <div className="bg-[#272a2f] rounded-lg px-4 py-2 w-full relative">
                <div className="dot"></div>
                <Link to="#">
                  <img src={dailyCombo} alt="Daily Combo" className="mx-auto w-12 h-12" />
                </Link>
                <p className="text-[10px] text-center text-white mt-1">Daily combo</p>
              </div>
            </div>

            <div className="px-4 mt-4 flex justify-center">

              <div className="px-4 py-2 flex items-center space-x-2">

                <img src={dollarCoin} alt="Dollar Coin" className="w-10 h-10" />

                <p className="text-4xl text-white">{user?.points || 0}</p>

              </div>

            </div>

            <div className="px-4 mt-4 flex justify-center">
              <div
                className="w-80 h-80 p-4 rounded-full circle-outer"
                onClick={handleCardClick}
              >
                <div className="w-full h-full rounded-full circle-inner">
                  <img src={mainCharacter} alt="Main Character" className="w-full h-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>    

      {clicks.map((click) => (
        <div
          key={click.id}
          className="absolute text-5xl font-bold opacity-0 text-white pointer-events-none"
          style={{
            top: `${click.y - 42}px`,
            left: `${click.x - 28}px`,
            animation: `float 1s ease-out`
          }}
          onAnimationEnd={() => handleAnimationEnd(click.id)}
        >
          {pointsToAdd}
        </div>
      ))}
    </div>
  );
};

export default App;
