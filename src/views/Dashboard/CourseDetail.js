import React, { useEffect, useState } from "react";
import {
  Table,
  Typography,
  Input,
  Space,
  Select,
  Button,
  Modal,
  Form,
  Upload,
  message,
} from "antd";
import axios from "axios";
import { UploadOutlined } from "@ant-design/icons";
import { useHistory } from "react-router-dom"; // Import useHistory hook

const { Title } = Typography;

function CourseDetail() {
  const [documents, setDocuments] = useState([]);
  const history = useHistory();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const storedId = localStorage.getItem("courseId");
  const nameCourse = localStorage.getItem("name_course");

  // Fetch dữ liệu tài liệu khi courseId thay đổi
  useEffect(() => {
    const userAdmin = localStorage.getItem("user_admin");
    if (!userAdmin) {
      history.push("/signin");
    }
  }, [history]); // Chạy lại khi courseId thay đổi

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]); // Để lưu trữ danh sách file đã chọn

  // Hàm fetch tài liệu
  const fetchDocuments = async () => {
    try {
      const response = await axios.get(
        `https://math-be.onrender.com/api/v1/course/${storedId}/lessons`
      );
      const data = response.data;
      setDocuments(data);
      setPagination({
        ...pagination,
        total: data.length,
      });
    } catch (error) {
      console.error("Đã có lỗi khi lấy dữ liệu khóa học!", error);
    }
  };

  const columns = [
    {
      title: "STT",
      render: (text, record, index) =>
        (pagination.current - 1) * pagination.pageSize + index + 1,
      width: 60,
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
        <div style={{ padding: 8 }}>
          <Input
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            placeholder="Search Title"
            style={{ marginBottom: 8, display: "block" }}
          />
          <Space>
            <button onClick={() => confirm()}>Search</button>
            <button onClick={() => setSelectedKeys([])}>Reset</button>
          </Space>
        </div>
      ),
      onFilter: (value, record) =>
        record.title.toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: "Mô tả bài học",
      dataIndex: "content",
      key: "content",
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
        <div style={{ padding: 8 }}>
          <Input
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            placeholder="Search Description"
            style={{ marginBottom: 8, display: "block" }}
          />
          <Space>
            <button onClick={() => confirm()}>Search</button>
            <button onClick={() => setSelectedKeys([])}>Reset</button>
          </Space>
        </div>
      ),
      onFilter: (value, record) =>
        record.description.toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: "Link bài học",
      dataIndex: "videoUrl",
      key: "videoUrl",
      render: (text) => {
        const maxLength = 60;
        const displayText =
          text?.length > maxLength
            ? `${text.substring(0, maxLength)}...`
            : text;

        return (
          <a href={text} target="_blank" rel="noopener noreferrer">
            {displayText}
          </a>
        );
      },
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
        <div style={{ padding: 8 }}>
          <Input
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            placeholder="Search File URL"
            style={{ marginBottom: 8, display: "block" }}
          />
          <Space>
            <button onClick={() => confirm()}>Search</button>
            <button onClick={() => setSelectedKeys([])}>Reset</button>
          </Space>
        </div>
      ),
      onFilter: (value, record) =>
        record.fileUrl.toLowerCase().includes(value.toLowerCase()),
    },
  ];

  const handleModalOpen = () => {
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    form.resetFields();
    setFileList([]); // Reset file list khi đóng modal
  };

  const handleFileChange = ({ fileList: newFileList }) => {
    setFileList(newFileList); // Cập nhật file list khi có thay đổi
  };

  const handleUpload = async () => {
  try {
    const values = await form.validateFields();

    const lessonData = {
      title: values.title,
      content: values.content,
      videoUrl: values.videoUrl,
      courseId: storedId
    };

    const response = await axios.post(
      "https://math-be.onrender.com/api/v1/lesson/create/lesson",
      lessonData,
      {
        headers: {
          "Content-Type": "application/json", 
        },
      }
    );

    message.success(response.data.message); // Hiển thị thông báo thành công
    handleModalClose(); // Đóng modal sau khi upload thành công
    fetchDocuments(); // Refetch lại danh sách tài liệu sau khi upload thành công
  } catch (error) {
    message.error("Đã có lỗi khi upload tài liệu!"); // Thông báo lỗi nếu có
  }
};


  const pageSizeOptions = [5, 10, 15, 20];
  const currentData = documents.slice(
    (pagination.current - 1) * pagination.pageSize,
    pagination.current * pagination.pageSize
  );

  return (
    <div style={{ padding: "20px" }}>
      <Title
        level={3}
        style={{
          color: "#fff",
          marginTop: "50px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        Danh sách bài học của khóa học: {nameCourse}
        <Button type="primary" onClick={handleModalOpen}>
          Thêm bài học
        </Button>
      </Title>

      <Modal
        title="Thêm bài học mới"
        visible={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="Tiêu đề"
            rules={[{ required: true, message: "Vui lòng nhập tiêu đề!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="content"
            label="Mô tả"
            rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="videoUrl"
            label="Link bài học"
            rules={[{ required: true, message: "Vui lòng nhập link bài học" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              onClick={handleUpload}
              style={{ width: "100%" }}
            >
              Upload
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <div style={{ marginBottom: 16 }}>
        <Select
          defaultValue={pagination.pageSize}
          style={{ width: 120 }}
          onChange={(value) => {
            setPagination({
              ...pagination,
              pageSize: value,
              current: 1,
            });
          }}
        >
          {pageSizeOptions.map((size) => (
            <Select.Option key={size} value={size}>
              {size} dòng/trang
            </Select.Option>
          ))}
        </Select>
      </div>

      {/* Bảng tài liệu */}
      <Table
        columns={columns}
        dataSource={currentData}
        rowKey="_id"
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showTotal: (total) => `Tổng cộng: ${total} tài liệu`,
          onChange: (page, pageSize) => {
            setPagination({
              ...pagination,
              current: page,
              pageSize: pageSize,
            });
          },
        }}
      />
    </div>
  );
}

export default CourseDetail;
