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
import { UploadOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useHistory } from "react-router-dom"; // Import useHistory hook

const { Title } = Typography;

function Courses() {
  const [documents, setDocuments] = useState([]);
  const history = useHistory();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  useEffect(() => {
    const userAdmin = localStorage.getItem("user_admin");
    if (!userAdmin) {
      history.push("/signin");
    } else {
      fetchDocuments();
    }
  }, [history]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [deletingCourse, setDeletingCourse] = useState(null);

  const [fileList, setFileList] = useState([]); // Để lưu trữ danh sách file đã chọn

  const fetchDocuments = async () => {
    try {
      const response = await axios.get(
        "https://math-be.onrender.com/api/v1/course/all-course"
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

  useEffect(() => {
    fetchDocuments(); // Fetch tài liệu khi component load
  }, []);

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
      title: "Mô tả khóa học",
      dataIndex: "description",
      key: "description",
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
      title: "Ảnh khóa học",
      dataIndex: "imageUrl",
      key: "imageUrl",
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
    {
      title: "Danh sách bài học",
      key: "lessonList",
      render: (text, record) => {
        const history = useHistory();

        const handleClick = () => {
          localStorage.setItem("courseId", record._id);
          localStorage.setItem("name_course", record.title);// record.id là _id của khóa học
          history.push("/admin/lesson");
        };

        return <Button onClick={handleClick} style={{backgroundColor:'blue', color:'white'}}>Xem chi tiết</Button>;
      },
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (text, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleModalOpen(record)} />
          <Button icon={<DeleteOutlined />} danger onClick={() => showDeleteModal(record)} />
        </Space>
      ),
    },
  ];

  const handleModalOpen = (course = null) => {
    setIsEditMode(!!course);
    setEditingCourse(course);
    form.setFieldsValue(course || {});

    if (course?.imageUrl) {
      setFileList([
        {
          uid: "-1",
          name: course.imageUrl.split("/").pop(),
          status: "done",
          url: course.imageUrl,
        },
      ]);
    } else {
      setFileList([]);
    }

    setIsModalVisible(true);
  };
  const handleModalClose = () => {
    setIsModalVisible(false);
    form.resetFields();
    setFileList([]);
  };

  const handleFileChange = ({ fileList: newFileList }) => {
    setFileList(newFileList); // Cập nhật file list khi có thay đổi
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const formData = new FormData();

      if (fileList.length > 0 && fileList[0]?.originFileObj) {
        formData.append("file", fileList[0].originFileObj);
      } else if (isEditMode && editingCourse?.imageUrl) {
        formData.append("file", editingCourse.imageUrl);
      }

      formData.append("title", values.title);
      formData.append("description", values.description);

      if (isEditMode) {
        await axios.put(
          `https://math-be.onrender.com/api/v1/course/${editingCourse._id}`,
          formData
        );
        message.success("Khóa học đã được cập nhật!");
      } else {
        await axios.post("https://math-be.onrender.com/api/v1/course/create", formData);
        message.success("Khóa học đã được thêm mới!");
      }

      fetchDocuments();
      handleModalClose();
    } catch (error) {
      message.error("Lỗi khi lưu khóa học!");
    }
  };
  const showDeleteModal = (course) => {
    setDeletingCourse(course);
    setIsDeleteModalVisible(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`https://math-be.onrender.com/api/v1/course/${deletingCourse._id}`);
      message.success("Khóa học đã bị xóa!");
      fetchDocuments();
    } catch (error) {
      message.error("Xóa khóa học thất bại!");
    }
    setIsDeleteModalVisible(false);
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
        Danh sách khóa học
        <Button type="primary" onClick={() => handleModalOpen()}>
          Thêm khóa học
        </Button>
      </Title>

      <Modal
        title={isEditMode ? "Chỉnh sửa khóa học" : "Thêm khóa học mới"}
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
            name="description"
            label="Mô tả"
            rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="file"
            label="Chọn file"
            rules={[{ required: true, message: "Vui lòng chọn file!" }]}
          >
            <Upload
              accept="image/*"
              fileList={fileList}
              onChange={handleFileChange}
              showUploadList={true}
              beforeUpload={() => false}
            >
              <Button icon={<UploadOutlined />}>Chọn file</Button>
            </Upload>
          </Form.Item>

          <Form.Item>
            <Button type="primary" onClick={handleSubmit} style={{ width: "100%" }}>
              {isEditMode ? "Cập nhật" : "Tải lên"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Xác nhận xóa"
        visible={isDeleteModalVisible}
        onOk={handleDelete}
        onCancel={() => setIsDeleteModalVisible(false)}
        okText="Xóa"
        okType="danger"
        cancelText="Hủy"
      >
        <p>Bạn có chắc muốn xóa khóa học "{deletingCourse?.title}"? Hành động này không thể hoàn tác.</p>
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

export default Courses;
