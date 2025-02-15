'use client';
import { createClient } from "@supabase/supabase-js";
import { Button, Form, Input, message, Popconfirm, Space, Table } from "antd";
import { useForm } from "antd/es/form/Form";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function User() {
  const [filteredData, setFilteredData] = useState([]);
  const [form] = useForm();
  const router = useRouter();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    showSizeChanger: true,
    total: 0,
  });

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_KEY
  );

  const fetchData = async () => {
    console.log("Fetching data from Supabase...");

    const { data, error } = await supabase
      .from("kpop_fantasy_user")
      .select("*");

    console.log("Fetched data:", data);
    console.log("Fetch error:", error);

    if (error) {
      message.error("Failed to fetch data: " + error.message);
      return;
    }

    setFilteredData(data?.map((item, index) => ({
      key: String(index),
      account: item.account,
      username: item.user_name,
      status: item.status,
      createdAt: item.created_at,
    })) ?? []);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggleStatus = async (row) => {
    const newStatus = row.status === "normal" ? "disable" : "normal";

    const { error } = await supabase
      .from("kpop_fantasy_user")
      .update({ status: newStatus })
      .eq("account", row.account);

    if (error) {
      message.error("Failed to update status: " + error.message);
    } else {
      message.success(`Status updated to ${newStatus}`);
      fetchData();
    }
  };

  const handleEdit = (row) => {
    router.push(`/card/edit/${row.account}`);
  };

  const handleDelete = async (row) => {
    const { error } = await supabase
      .from("kpop_fantasy_user")
      .delete()
      .eq("account", row.account);

    if (error) {
      message.error("Failed to delete data: " + error.message);
    } else {
      message.success("Deleted successfully");
      fetchData();
    }
  };

  const handleTableChange = (pagination) => {
    setPagination(pagination);
  };

  const COLUMNS = [
    {
      title: 'Account',
      dataIndex: 'account',
      key: 'account',
      width: 300,
    },
    {
      title: 'User Name',
      dataIndex: 'username',
      key: 'username',
      width: 300,
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 500,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, row) => {
        return (
          <Space>
            <Popconfirm
              title="Are you sure to delete this user?"
              onConfirm={() => handleDelete(row)}
              okText="Yes"
              cancelText="No"
            >
              <Button type="link" danger>Delete</Button>
            </Popconfirm>
          </Space>
        );
      }
    }
  ];

  return (
    <>
      <Form
        name="search"
        form={form}
        layout="inline"
        onFinish={fetchData}
        initialValues={{ account: "", username: "" }}
        className="mb-6"
      >
        <Form.Item name="account" label="Account">
          <Input placeholder="Please Input" allowClear />
        </Form.Item>

        <Form.Item name="username" label="User Name">
          <Input placeholder="Please Input" allowClear />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              Search
            </Button>
            <Button htmlType="button" onClick={() => { form.resetFields(); fetchData(); }}>
              Clear
            </Button>
          </Space>
        </Form.Item>
      </Form>

      <div className="overflow-auto h-[calc(100vh-190px)]">
        <Table
          dataSource={filteredData}
          columns={COLUMNS}
          onChange={handleTableChange}
          pagination={pagination}
          className="items-center"
        />
      </div>
    </>
  );
}
