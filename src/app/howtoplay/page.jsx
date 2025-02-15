'use client'
import { Button } from "antd";
import { useRouter } from "next/navigation";

const TutorialPage = () => {
  const router = useRouter();

  return (
    <div className="p-6 mx-auto space-y-6 overflow-auto max-w-3xl">
      <h1 className="text-2xl font-bold text-center">新手指南：打造你的夢幻偶像團隊</h1>
      
      <div className="p-4 space-y-3 text-left">
        <p>歡迎來到 <strong>Kpop Fantasy</strong>！你將扮演經紀人，運用 <strong>$10,000</strong> 組建你的偶像隊伍，並帶領他們迎向巔峰！</p>
      </div>

      <div className="p-4 space-y-3 text-left">
        <h2 className="text-xl font-semibold">📌 遊戲步驟</h2>
        <ol className="list-decimal pl-5 space-y-2">
          <li>
            <strong>購買偶像卡片</strong>
            <p>➡ 前往 <strong>Idol Shop</strong>，挑選並購買你喜愛的偶像卡片，打造你的夢幻陣容。</p>
          </li>
          <li>
            <strong>管理你的隊伍</strong>
            <p>➡ 在 <strong>My Team</strong> 檢視你的隊伍，並透過 <strong>拖曳卡片</strong> 調整偶像的站位與定位，打造最強組合。</p>
          </li>
          <li>
            <strong>確認隊伍組成</strong>
            <p>➡ 按下 <strong>Confirm</strong> 按鈕，系統將評估你的隊伍實力，並預測未來的發展及可能發生的 <strong>關鍵事件</strong>。</p>
          </li>
          <li>
            <strong>全螢幕模式觀察隊伍</strong>
            <p>➡ 點擊 <strong>Full Screen</strong>，更清楚地查看你的偶像隊伍，確保每位成員的最佳配置。</p>
          </li>
          <li>
            <strong>出售偶像卡片</strong>
            <p>➡ 如果想調整隊伍陣容，可前往 <strong>My Idol</strong> 售出不需要的卡片，獲取額外資金。</p>
          </li>
          <li>
            <strong>開始你的偶像之旅！</strong>
            <p>➡ 準備好了嗎？立即開始組建你的夢幻隊伍，帶領他們走向巔峰！</p>
          </li>
        </ol>
      </div>

      <div className="flex justify-center">
        <Button 
          className="px-6 py-2 text-lg" 
          type="primary" 
          onClick={() => router.push("/card")}
        >
          開始組隊
        </Button>
      </div>
    </div>
  );
};

export default TutorialPage;
