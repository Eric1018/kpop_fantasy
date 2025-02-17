'use client';
import { createClient } from '@supabase/supabase-js';
import { Button, Form, Input, message, Modal, Select } from 'antd';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_KEY
);

const EditForm = () => {
  const { id } = useParams();
  const router = useRouter();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState('');
  const [preview, setPreview] = useState('');
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [password, setPassword] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      const numId = Number(id);

      const { data, error } = await supabase
        .from('kpop_fantasy')
        .select('*')
        .eq('id', numId)
        .single();

      if (error) {
        console.error('Failed to fetch data:', error.message);
        message.error('Failed to fetch data: ' + error.message);
      } else {
        form.setFieldsValue(data);
        setPhoto(data.photo);
        setPreview(data.photo);
      }
    };

    fetchData();
  }, [id]);

  const handleUpdateClick = () => {
    setIsPasswordModalVisible(true);
  };

  const handlePasswordConfirm = async () => {
    if (password !== "109306086") {
      message.error("Incorrect password! Update canceled.");
      window.alert("Incorrect password! Update canceled.")
      setPassword('');
      return;
    }

    setIsPasswordModalVisible(false);
    setLoading(true);

    const values = form.getFieldsValue();
    const { error } = await supabase
      .from('kpop_fantasy')
      .update(values)
      .eq('id', Number(id));

    if (error) {
      message.error('Update failed: ' + error.message);
      window.alert('Update failed: ' + error.message)
    } else {
      message.success('Record updated successfully!');
      window.alert("Record updated successfully!")
      router.push('/card');
    }
    setLoading(false);
    setPassword('');
  };

  return (
    <>
      <div className="flex-1 justify-center items-center ml-[90px] overflow-y-auto max-h-[calc(100vh-150px)]">
        <Form
          className="mt-[32px] w-[85%]"
          form={form}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
          layout="horizontal"
        >
          <Form.Item label="Name" name="name">
            <Input />
          </Form.Item>
          <Form.Item label="Photo" name="photo">
            <Input.Group compact>
              <Input
                allowClear
                style={{ width: 'calc(100% - 79px)' }}
                value={photo}
                onChange={(e) => {
                  const value = e.target.value;
                  setPhoto(value);
                  form.setFieldValue('photo', value);
                }}
              />
              <Button type="primary" onClick={() => setPreview(photo)}>
                Preview
              </Button>
            </Input.Group>
          </Form.Item>
          <Form.Item label=" ">
            {preview && <img src={preview} alt="Preview" width="200" height="200" />}
          </Form.Item>
          <Form.Item label="Group" name="group">
            <Input />
          </Form.Item>
          <Form.Item label="Debut Year" name="debutyear">
            <Input />
          </Form.Item>
          <Form.Item label="Position" name="position">
            <Select>
              <Select.Option value="Main vocal">Main vocal</Select.Option>
              <Select.Option value="Lead vocal">Lead vocal</Select.Option>
              <Select.Option value="Sub vocal">Sub vocal</Select.Option>
              <Select.Option value="Main dancer">Main dancer</Select.Option>
              <Select.Option value="Lead dancer">Lead dancer</Select.Option>
              <Select.Option value="Main rapper">Main rapper</Select.Option>
              <Select.Option value="Lead rapper">Lead rapper</Select.Option>
              <Select.Option value="Sub rapper">Sub rapper</Select.Option>
              <Select.Option value="Visual">Visual</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="MBTI" name="mbti">
            <Input />
          </Form.Item>
          <Form.Item label="Price" name="price">
            <Input />
          </Form.Item>
          <Form.Item className="ml-[198px] text-center mt-10">
            <Button size="large" type="primary" onClick={handleUpdateClick} loading={loading}>
              Update
            </Button>
            <Button size="large" className="ml-4" onClick={() => router.push('/card')}>
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </div>

      {/* 密碼輸入 Modal */}
      <Modal
        title="Enter Password"
        visible={isPasswordModalVisible}
        onOk={handlePasswordConfirm}
        onCancel={() => setIsPasswordModalVisible(false)}
      >
        <Input.Password
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </Modal>
    </>
  );
};

export default EditForm;
