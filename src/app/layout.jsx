'use client';

import { DownOutlined } from "@ant-design/icons";
import { Dropdown, Layout, Menu, message, Space } from "antd";
import Head from "next/head";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import "./globals.css";

const { Header, Content, Sider } = Layout;

export default function LayoutComponent({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [userName, setUserName] = useState(null);

  // 🚀 Ensure localStorage is only used in the client-side environment
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const updateUserName = () => {
        setUserName(localStorage.getItem("user_name"));
      };

      updateUserName();
      window.addEventListener("storage", updateUserName);

      return () => {
        window.removeEventListener("storage", updateUserName);
      };
    }
  }, []);

  const USER_ITEMS = [
    {
      key: "1",
      label: (
        <span
          onClick={() => {
            if (typeof window !== 'undefined') {
              localStorage.removeItem("user_name");
              setUserName(null);
              message.success("Successful logout");
              router.push("/login");
            }
          }}
        >
          Log Out
        </span>
      ),
    },
  ];

  const handleMenuClick = ({ key }) => {
    router.push(key);
  };

  const ITEMS = [
    {
      label: "Team Management",
      key: "team",
      children: [
        { label: "My Team", key: "/borrow" },
        { label: "My Idol", key: "/myidol" },
      ],
    },
    {
      label: "Card Management",
      key: "card",
      children: [
        { label: "Idol Shop", key: "/card" },
        ...(userName === "admin109306086" ? [{ label: "Add Card", key: "/card/add" }] : []),
      ],
    },
    ...(userName === "admin109306086"
      ? [
          {
            label: "User Management",
            key: "user",
            children: [{ label: "User List", key: "/User" }],
          },
        ]
      : []),
    {
      label: "How To Play",
      key: "/howtoplay",
    },
  ];

  return (
    <html lang="en">
      <Head>
        <title>KPOP FANTASY - Organize Your Dream KPOP Group</title>
        <meta name="description" content="Organize Your Dream KPOP Group" />
      </Head>
      <body className="bg-[#f9f6ff]">
        {pathname === "/" || pathname === "/login" || pathname === "/signin" ? (
          <>{children}</>
        ) : (
          <Layout className="h-screen">
            <Header className="bg-gradient-to-r from-purple-400 via-indigo-400 to-blue-400 text-white flex items-center px-6 shadow-md">
              <Image className="mr-3" src="/kpop.png" width={30} height={30} alt="logo" />
              <div className="text-white font-extrabold text-[22px] font-serif flex w-full">
                KPOP FANTASY
                <div className="ml-auto flex items-center space-x-4">
                  <span className="text-lg">Hi, {userName || "Guest"}!</span>
                  <Dropdown menu={{ items: USER_ITEMS }}>
                    <a onClick={(e) => e.preventDefault()} className="flex items-center text-[16px]">
                      <Space>
                        <DownOutlined />
                      </Space>
                    </a>
                  </Dropdown>
                </div>
              </div>
            </Header>

            <Layout>
              <Sider width={220} className="h-[calc(100vh-64px)] bg-[#8b5fbf]">
                <Menu
                  mode="inline"
                  selectedKeys={[pathname]}
                  defaultOpenKeys={["team", "card", "user"]}
                  style={{ height: "100%", borderRight: 0 }}
                  items={ITEMS}
                  onClick={handleMenuClick}
                  className="text-[#fff]"
                />
              </Sider>

              <Layout className="p-[20px]">
                <Content className="bg-white rounded-[16px] p-[24px] shadow-md">
                  {children}
                </Content>
              </Layout>
            </Layout>
          </Layout>
        )}
      </body>
    </html>
  );
}
