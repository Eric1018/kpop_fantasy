'use client'
import { createClient } from "@supabase/supabase-js";
import { Button, Form, Input, message, Popconfirm, Select, Space, Table } from "antd";
import { useForm } from "antd/es/form/Form";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Card() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_KEY
  );

  const [dataSource, setDataSource] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [balance, setBalance] = useState(10000);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [form] = useForm();
  const router = useRouter();
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, showSizeChanger: true });
  const [userName, setUserName] = useState(null);
  const [selectedImage, setSelectedImage] = useState()

  useEffect(() => {
    const storedUserName = localStorage.getItem("user_name");
    if (storedUserName) {
      setUserName(storedUserName);
    }
  }, []);

  const fetchBalance = async () => {
    if (!userName) return;

    try {
      const res = await fetch(`${API_URL}/api/purchase/balance/${userName}`);
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

  const fetchData = async () => {
    try {
      const res = await fetch(`${API_URL}/api/CardData`);
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      const data = await res.json();
      setDataSource(data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  useEffect(() => {
    if (userName) {
      fetchBalance();
    }
    fetchData();
  }, [userName]);

  useEffect(() => {
    setFilteredData(dataSource);
  }, [dataSource]);

  const handlePurchase = async (row) => {
    if (isPurchasing) return;

    if (!userName) {
      window.alert("Please log in first!");
      return;
    }

    setIsPurchasing(true);

    try {
      const res = await fetch(`${API_URL}/api/purchase`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_name: userName,
          name: row.name,
          photo: row.photo,
          group: row.group,
          debutyear: row.debutyear,
          position: row.position,
          mbti: row.mbti,
          price: row.price,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Purchase failed!");

      setBalance(data.balance);
      window.alert(`🎉 Purchase successful! Your new balance: ${data.balance}`);
    } catch (error) {
      let errorMessage = "❌ Purchase failed!";
      if (error instanceof Error) errorMessage += ` ${error.message}`;

      if (errorMessage.includes("Insufficient balance")) {
        window.alert("⚠️ Insufficient balance! Please check your funds.");
      } else {
        window.alert(errorMessage);
      }
    } finally {
      setTimeout(() => setIsPurchasing(false), 1000);
    }
  };

  const handleDelete = async (row) => {
    try {
      const res = await fetch(`${API_URL}/api/CardData/${row.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`Failed to delete: ${res.statusText}`);

      message.success("Deleted successfully");
      setDataSource(prev => prev.filter(item => item.id !== row.id));
      setFilteredData(prev => prev.filter(item => item.id !== row.id));
    } catch (error) {
      message.error("Failed to delete data");
    }
  };

  const handleSearchFinish = async (values) => {
    let query = supabase.from("kpop_fantasy").select("name, photo, group, debutyear, position, mbti, price");
    if (values.name) query = query.ilike("name", `%${values.name}%`);
    if (values.group) query = query.ilike("group", `%${values.group}%`);
    if (values.position) query = query.eq("position", values.position);

    const { data, error } = await query;
    if (error) console.error("Error fetching filtered data:", error.message);
    else setFilteredData(data.map((item, index) => ({ key: String(index), ...item })));
  };

  const handleSearchReset = () => {
    form.resetFields();
    setFilteredData(dataSource);
  };

  const handleEdit = (row) => {
    router.push(`/card/edit/${row.id}`);
  };

  const handleTableChange = (pagination) => {
    setPagination(pagination);
  };

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name', width: 180 },
    { title: 'Photo', dataIndex: 'photo', key: 'photo', width: 120, render: (text) => text ? <img width={50} height={50} alt="" className="cursor-pointer" onClick={() => setSelectedImage(text)} onError={(e) => (e.currentTarget.style.display = "none")}  src={text} /> : null },
    { title: 'Group', dataIndex: 'group', key: 'group', width: 150 },
    { title: 'Debut Year', dataIndex: 'debutyear', key: 'debutyear', width: 150 },
    { title: 'Position', dataIndex: 'position', key: 'position', width: 150 },
    { title: 'MBTI', dataIndex: 'mbti', key: 'mbti', width: 150 },
    { title: 'Price', dataIndex: 'price', key: 'price', width: 120 },
    {
      title: 'Purchase',
      key: 'purchase',
      render: (_, row) => (
        <Button type="link" onClick={() => handlePurchase(row)} disabled={isPurchasing}>
          {isPurchasing ? "Processing..." : "Purchase"}
        </Button>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, row) => (
        <div>
          <Button type="link" onClick={() => handleEdit(row)}>Edit</Button>
          <Popconfirm title="Are you sure to delete this card?" onConfirm={() => handleDelete(row)} okText="Yes" cancelText="No">
            <Button type="link" danger>Delete</Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="flex justify-between items-center mb-6">
 {/* 🔍 搜尋表單 */}
        <Form
          name="search"
          form={form}
          layout="inline"
          onFinish={handleSearchFinish}
          initialValues={{ name: "", group: "", position: null }}
        >
          <Form.Item name="name" label="Name">
            <Input
              placeholder="Please Input"
              allowClear
              onChange={(e) => {
                if (!e.target.value) {
                  form.setFieldsValue({ name: "" }); // 清空搜尋條件
                  handleSearchFinish(form.getFieldsValue()); // 重新執行搜尋
                }
              }}
            />
          </Form.Item>

          <Form.Item name="group" label="Group">
            <Input
              placeholder="Please Input"
              allowClear
              onChange={(e) => {
                if (!e.target.value) {
                  form.setFieldsValue({ group: "" });
                  handleSearchFinish(form.getFieldsValue());
                }
              }}
            />
          </Form.Item>

          <Form.Item name="position" label="Position">
            <Select
              allowClear
              showSearch
              placeholder="Please Select"
              options={[
                { value: 'Main vocal', label: "Main vocal" },
                { value: 'Lead vocal', label: "Lead vocal" },
                { value: 'Sub vocal', label: "Sub vocal" },
                { value: 'Main dancer', label: "Main dancer" },
                { value: 'Lead dancer', label: "Lead dancer" },
                { value: 'Main rapper', label: "Main rapper" },
                { value: 'Lead rapper', label: "Lead rapper" },
                { value: 'Sub rapper', label: "Sub rapper" },
                { value: 'Visual', label: "Visual" },
              ]}
              onChange={(value) => {
                if (!value) {
                  form.setFieldsValue({ position: null });
                  handleSearchFinish(form.getFieldsValue());
                }
              }}
            />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Search
              </Button>
              <Button htmlType="button" onClick={handleSearchReset}>
                Clear / Resort
              </Button>
            </Space>
          </Form.Item>
        </Form>
        <div className="text-black font-bold text-lg">Balance: ${balance}</div>
      </div>
      <Table className='overflow-auto h-[calc(100vh-190px)]' 
      dataSource={filteredData.length > 0 ? filteredData : dataSource} columns={columns} onChange={handleTableChange} />
      {/* 📸 放大圖片的 Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md z-50"
          onClick={() => setSelectedImage(null)} // 點擊背景關閉
        >
          <img src={selectedImage} alt="Preview" width={300} height={400} className="object-cover rounded-lg" />
        </div>
      )}
    </>
  );
}
