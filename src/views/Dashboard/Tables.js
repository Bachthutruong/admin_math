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
import {
  UploadOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { useHistory } from "react-router-dom"; // Import useHistory hook

const { Title } = Typography;

function Tables() {
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
  const [editingDocument, setEditingDocument] = useState(null);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [deletingDocument, setDeletingDocument] = useState(null);
  const [fileList, setFileList] = useState([]); // Để lưu trữ danh sách file đã chọn

  // Hàm để fetch lại danh sách tài liệu
  const fetchDocuments = async () => {
    try {
      const response = await axios.get("https://math-be.onrender.com/api/documents");
      const data = response.data;
      setDocuments(data);
      setPagination({
        ...pagination,
        total: data.length,
      });
    } catch (error) {
      console.error("Đã có lỗi khi lấy dữ liệu tài liệu!", error);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);
  const showDeleteModal = (document) => {
    setDeletingDocument(document);
    setIsDeleteModalVisible(true);
  };
  const handleDelete = async () => {
    try {
      await axios.delete(
        `https://math-be.onrender.com/api/documents/${deletingDocument._id}`
      );
      message.success("Tài liệu đã bị xóa!");
      fetchDocuments();
    } catch (error) {
      message.error("Xóa thất bại!");
    }
    setIsDeleteModalVisible(false);
  };

  const columns = [
    {
      title: "STT",
      render: (text, record, index) =>
        (pagination.current - 1) * pagination.pageSize + index + 1,
      width: 60,
    },
    {
      title: "Title",
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
      title: "Description",
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
      title: "Class",
      dataIndex: "class",
      key: "class",
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
        <div style={{ padding: 8 }}>
          <Input
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            placeholder="Search Class"
            style={{ marginBottom: 8, display: "block" }}
          />
          <Space>
            <button onClick={() => confirm()}>Search</button>
            <button onClick={() => setSelectedKeys([])}>Reset</button>
          </Space>
        </div>
      ),
      onFilter: (value, record) =>
        record.class.toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: "Loại tài liệu",
      dataIndex: "type",
      key: "type",
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
        <div style={{ padding: 8 }}>
          <Input
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            placeholder="Search Type"
            style={{ marginBottom: 8, display: "block" }}
          />
          <Space>
            <button onClick={() => confirm()}>Search</button>
            <button onClick={() => setSelectedKeys([])}>Reset</button>
          </Space>
        </div>
      ),
      onFilter: (value, record) =>
        record.type.toLowerCase().includes(value.toLowerCase()),
      render: (type) => {
        const typeMapping = {
          Book: "Vở học sinh",
          Exam: "Đề kiểm tra",
          Document: "Phiếu bài tập",
        };
        return typeMapping[type] || type; // Hiển thị nhãn tiếng Việt nhưng giữ nguyên giá trị lọc
      },
    },
    {
      title: "File URL",
      dataIndex: "fileUrl",
      key: "fileUrl",
      render: (text) => (
        <a href={text} target="_blank" rel="noopener noreferrer">
          {text}
        </a>
      ),
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
      title: "Thao tác",
      render: (text, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleModalOpen(record)}
          />
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => showDeleteModal(record)}
          />
        </Space>
      ),
    },
  ];

  const handleModalOpen = (document = null) => {
  setIsEditMode(!!document);
  setEditingDocument(document);
  form.setFieldsValue(document || {});

  if (document?.fileUrl) {
    setFileList([
      {
        uid: '-1', // ID tạm để hiển thị trong danh sách
        name: document.fileUrl.split('/').pop(), // Lấy tên file từ URL
        status: 'done', // Đánh dấu đã tải lên
        url: document.fileUrl, // Đường dẫn file
      },
    ]);
  } else {
    setFileList([]); // Reset nếu không có fileUrl
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
      // Nếu có file mới, tải file mới lên
      formData.append("file", fileList[0].originFileObj);
    } else if (isEditMode && editingDocument?.fileUrl) {
      // Nếu không có file mới và đang edit, giữ file cũ
      formData.append("file", editingDocument.fileUrl);
    } // Lấy file đầu tiên trong file list
      formData.append("title", values.title);
      formData.append("description", values.description);
      formData.append("class", values.class);
      formData.append("type", values.type);

      // if (fileList[0]) {
      //   formData.append('file', fileList[0].originFileObj);
      // }

      if (isEditMode) {
        await axios.put(
          `https://math-be.onrender.com/api/documents/${editingDocument._id}`,
          formData
        );
        message.success("Tài liệu đã được cập nhật!");
      } else {
        await axios.post("https://math-be.onrender.com/api/upload", formData);
        message.success("Tài liệu đã được thêm mới!");
      }
      fetchDocuments();
      handleModalClose();
    } catch (error) {
      message.error("Đã có lỗi khi upload tài liệu!");
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
        Danh sách tài liệu
        <Button type="primary" onClick={() => handleModalOpen()}>
          Thêm tài liệu
        </Button>
      </Title>

      <Modal
        title={isEditMode ? "Chỉnh sửa tài liệu" : "Thêm tài liệu mới"}
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
            name="class"
            label="Lớp"
            rules={[{ required: true, message: "Vui lòng nhập lớp!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="type"
            label="Loại tài liệu"
            rules={[
              { required: true, message: "Vui lòng chọn loại tài liệu!" },
            ]}
          >
            <Select placeholder="Chọn loại tài liệu">
              <Select.Option value="Book">Vở học sinh</Select.Option>
              <Select.Option value="Exam">Đề kiểm tra</Select.Option>
              <Select.Option value="Document">Phiếu bài tập</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="file"
            label="Chọn file"
            rules={[{ required: !isEditMode, message: "Vui lòng chọn file!" }]}
          >
            <Upload
              accept="application/pdf"
              fileList={fileList} // Hiển thị các file đã chọn
              onChange={handleFileChange} // Cập nhật danh sách file khi có thay đổi
              showUploadList={true} // Hiển thị danh sách file đã chọn
              beforeUpload={() => false}
            >
              <Button icon={<UploadOutlined />}>Chọn file</Button>
            </Upload>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              onClick={handleSubmit}
              style={{ width: "100%" }}
            >
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
        <p>
          Bạn có chắc muốn xóa tài liệu này? Hành động này không thể hoàn tác.
        </p>
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

export default Tables;
