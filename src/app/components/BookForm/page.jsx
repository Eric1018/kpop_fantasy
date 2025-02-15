'use client'
import { createClient } from '@supabase/supabase-js';
import { Button, Form, Input, message, Select } from 'antd';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_KEY
);

const BookForm = () => {
  const router = useRouter();
  const [preview, setPreview] = useState("");
  const [form] = Form.useForm();
  const [photo, setPhoto] = useState(""); 

  const handleFinish = async (values) => {
    console.log("提交的資料:", values);

    const { error } = await supabase.from("kpop_fantasy").insert([values]);

    if (error) {
      message.error("提交失敗：" + error.message);
      console.error(error);
    } else {
      window.alert("The new record has been successfully created!");
      router.push("/card");
      form.resetFields();
      setPhoto("");
      setPreview("");
    }
  };

  return (
    <>
      <div className="flex-1 justify-center items-center ml-[90px] overflow-y-auto max-h-[calc(100vh-150px)]">
        <Form
          className='mt-[32px] w-[85%]'
          form={form}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
          layout="horizontal"
          onFinish={handleFinish}
        >
          <Form.Item 
            label="Name" 
            name="name"
            rules={[{ required: true, message: "Please enter the name" }]}
          >
            <Input placeholder="Please Input" />
          </Form.Item>

          <Form.Item label="Photo" name="photo" rules={[{ required: true, message: "Please enter the photo" }]}>
            <Input.Group compact>
              <Input
                allowClear
                placeholder="Please Input Photo Link(rectangular, vertical)"
                style={{ width: "calc(100% - 79px)" }}
                value={photo}
                onChange={(e) => {
                  const value = e.target.value;
                  setPhoto(value);
                  form.setFieldValue("photo", value);
                }}
              />
              <Button
                type="primary"
                onClick={() => {
                  setPreview(form.getFieldValue("photo"));
                }}
              >
                Preview
              </Button>
            </Input.Group>
          </Form.Item>

          <Form.Item label=" " colon={false}>
            {preview && (<img src={preview} alt="" width="200" height="200" />)}
          </Form.Item>

          <Form.Item 
            label="Group" 
            name="group"
            rules={[{ required: true, message: "Please enter the group" }]}
          >
            <Input placeholder="Please Input" />
          </Form.Item>

          <Form.Item 
            label="Debut Year" 
            name="debutyear"
            rules={[{ required: true, message: "Please enter the debut year" }]}
          >
            <Input placeholder="Please Input" />
          </Form.Item>

          <Form.Item 
            label="Position" 
            name="position"
            rules={[{ required: true, message: "Please select a position" }]}
          >
            <Select placeholder="Please Select">
              <Select.Option value="Main vocal">Main vocal</Select.Option>
              <Select.Option value="Lead vocal">Lead vocal</Select.Option>
              <Select.Option value="Sub vocal">Sub vocal</Select.Option>
              <Select.Option value="Main dancer">Main dancer</Select.Option>
              <Select.Option value="Lead dancer">Lead dancer</Select.Option>
              <Select.Option value="Main rapper">Main rapper</Select.Option>
              <Select.Option value="Lead raper">Lead raper</Select.Option>
              <Select.Option value="Sub rapper">Sub rapper</Select.Option>
              <Select.Option value="Visual">Visual</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item 
            label="MBTI" 
            name="mbti"
            rules={[{ required: true, message: "Please enter the MBTI type" }]}
          >
            <Input placeholder="Please Input" />
          </Form.Item>

          <Form.Item 
            label="Price" 
            name="price"
            rules={[{ required: true, message: "Please enter the price" }]}
          >
            <Input placeholder="Please Input" />
          </Form.Item>

          <Form.Item className="ml-[140px] text-center mt-10">
            <Button size='large' type="primary" htmlType="submit">Create</Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default BookForm;
