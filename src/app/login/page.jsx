"use client";
import { Button, Form, Input } from "antd";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (res.status === 404) {
        alert("This account does not exist. Please sign up.");
        router.push("/signin");
        return;
      }

      if (res.status === 401) {
        alert("Incorrect password. Please try again.");
        return;
      }

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      localStorage.setItem("user_name", data.user_name);
      window.dispatchEvent(new Event("storage"));

      alert(`Welcome, ${data.user_name}!`);
      router.push("/borrow");
    } catch (error) {
      alert(error instanceof Error ? error.message : "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-96">
        <h2 className="text-3xl font-bold text-center text-purple-700">KPOP Fantasy</h2>
        <p className="text-center text-gray-500 mb-6">Welcome to the dream world of KPOP!</p>

        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item label="Account" name="account" rules={[{ required: true, message: "Please enter your account" }]}>
            <Input placeholder="Enter your account" />
          </Form.Item>

          <Form.Item label="Password" name="password" rules={[{ required: true, message: "Please enter your password" }]}>
            <Input.Password placeholder="Enter your password" />
          </Form.Item>

          <Button type="primary" htmlType="submit" className="w-full bg-purple-600 hover:bg-purple-700" loading={loading}>
            Login
          </Button>

          <Button onClick={() => router.push("/signin")} className="w-full mt-4 bg-pink-500 hover:bg-pink-600 text-white">
            Sign In
          </Button>
        </Form>
      </div>
    </div>
  );
}
