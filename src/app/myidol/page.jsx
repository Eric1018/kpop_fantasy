'use client';
import { Button, Popconfirm, Table } from "antd";
import { useEffect, useState } from "react";

export default function UserTable() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const [user_name, setUserName] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [dataSource, setDataSource] = useState([]);
  const [balance, setBalance] = useState(0);

  // 🚀 Ensure localStorage is only used in the client-side environment
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUserName = localStorage.getItem("user_name");
      setUserName(storedUserName);
    }
  }, []);

  // 🚀 Get user card data
  const fetchData = async () => {
    if (!user_name) return;

    try {
      const res = await fetch(`${API_URL}/api/userCards/${user_name}`);
      if (!res.ok) throw new Error("Failed to fetch data");
      const data = await res.json();
      setDataSource(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // 🚀 Get current balance
  const fetchBalance = async () => {
    if (!user_name) return;

    try {
      const res = await fetch(`${API_URL}/api/purchase/balance/${user_name}`);
      const data = await res.json();
      if (res.ok) {
        setBalance(data.balance);
      } else {
        console.error("Failed to fetch balance:", data.error);
      }
    } catch (error) {
      console.error("Balance fetch error:", error);
    }
  };

  useEffect(() => {
    if (user_name) {
      fetchBalance();
      fetchData();
    }
  }, [user_name]);

  // 🗑️ Sell card (delete and update balance)
  const handleSell = async (id, price) => {
    try {
      // 1️⃣ Calculate new balance
      const newBalance = balance + price;

      // 2️⃣ Delete the card
      const deleteRes = await fetch(`${API_URL}/api/userCards/${id}`, {
        method: "DELETE",
      });

      if (!deleteRes.ok) throw new Error("Failed to delete card");

      // 3️⃣ Update balance
      const updateRes = await fetch(`${API_URL}/api/purchase/updateBalance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_name, newBalance }),
      });

      if (!updateRes.ok) throw new Error("Failed to update balance");

      // 4️⃣ Update frontend display
      setBalance(newBalance);
      setDataSource((prev) => prev.filter((card) => card.id !== id));

      window.alert(`🎉 Successfully sold! New balance: ${newBalance}`);
    } catch (error) {
      console.error("Error selling card:", error);
      window.alert("Failed to sell the card ❌");
    }
  };

  const COLUMNS = [
    { title: 'Name', dataIndex: 'name', key: 'name', width: 180 },
    { 
      title: 'Photo', dataIndex: 'photo', key: 'photo', width: 120, 
      render: (text) => (
        text ? (
          <img width={50} height={50} alt="" src={text} className="cursor-pointer"
            onClick={() => setSelectedImage(text)}
            onError={(e) => (e.currentTarget.style.display = "none")} />
        ) : null
      )   
    },
    { title: 'Group', dataIndex: 'group', key: 'group', width: 150 },
    { title: 'Debut Year', dataIndex: 'debutyear', key: 'debutyear', width: 150 },
    { title: 'Position', dataIndex: 'position', key: 'position', width: 150 },
    { title: 'MBTI', dataIndex: 'mbti', key: 'mbti', width: 150 },
    { title: 'Price', dataIndex: 'price', key: 'price', width: 120 },
  ];

  const columns = [
    ...COLUMNS,
    {
      title: 'Action',
      key: 'action',
      render: (_, row) => (
        <Popconfirm
          title={<div className="text-center">Are you sure to sell this idol? 🥹</div>}
          okText="Cold-Blooded"
          cancelText="Think Again"
          onConfirm={() => handleSell(row.id, row.price)}
        >
          <Button type="primary" style={{ backgroundColor: '#7A5DC7', borderColor: '#7A5DC7' }}>
            Sold
          </Button>
        </Popconfirm>
      )
    }
  ];

  return (
    <div className="overflow-auto h-[calc(100vh-190px)]">
      <div className="text-black font-bold text-lg mb-4">Balance: ${balance}</div>
      <Table dataSource={dataSource} columns={columns.map(col => ({ ...col, align: "center" }))} className="items-center" />
      
      {selectedImage && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md z-50"
          onClick={() => setSelectedImage(null)}>
          <img src={selectedImage} alt="Preview" width={300} height={400} className="object-cover rounded-lg" />
        </div>
      )}
    </div>
  );
}
