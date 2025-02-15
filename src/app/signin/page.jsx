"use client";
import { Button, Form, Input } from "antd";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Signin() {
  const router = useRouter();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [usernameError, setUsernameError] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    setUsernameError(false);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (res.status === 400 && data.error === "Username already exists") {
        setUsernameError(true);
        form.setFieldsValue({ user_name: "" });
        return;
      }

      if (!res.ok) {
        throw new Error(data.error || "Sign-up failed");
      }

      alert("Registration successful!");
      router.push("/login");
    } catch (error) {
      alert(error.message || "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-96">
        <h2 className="text-3xl font-bold text-center text-purple-700">Sign Up</h2>
        <p className="text-center text-gray-500 mb-6">Create your account</p>

        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item label="Account" name="account" rules={[{ required: true, message: "Please enter your account" }]}>
            <Input placeholder="Enter your account" />
          </Form.Item>

          <Form.Item label="Password" name="password" rules={[{ required: true, message: "Please enter your password" }]}>
            <Input.Password placeholder="Enter your password" />
          </Form.Item>

          <Form.Item
            label="Username"
            name="user_name"
            validateStatus={usernameError ? "error" : ""}
            help={usernameError ? "Username already exists" : ""}
            rules={[{ required: true, message: "Please enter your username" }]}
          >
            <Input placeholder="Enter your username" />
          </Form.Item>

          <Button type="primary" htmlType="submit" className="w-full bg-purple-600 hover:bg-purple-700" loading={loading}>
            Sign Up
          </Button>

          <Button onClick={() => router.push("/login")} className="w-full mt-4 bg-pink-500 hover:bg-pink-600 text-white">
            Back to Login
          </Button>
        </Form>
      </div>
    </div>
  );
}
