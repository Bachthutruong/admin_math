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
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
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
    } else {
      fetchDocuments();
    }
  }, [history]); // Chạy lại khi courseId thay đổi

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);
  const [deletingLesson, setDeletingLesson] = useState(null); // Để lưu trữ danh sách file đã chọn

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
      title: "Link video",
      key: "videoUrl",
      render: (text, record) => {
        // Hiển thị danh sách các video trong mỗi bài học
        return (
          <div>
            {record.videos && record.videos.length > 0 ? (
              record.videos.map((video, index) => (
                <div key={index} className="mt-2">
                  <a
                    href={video?.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {video?.title || `Video ${index + 1}`}
                  </a>
                </div>
              ))
            ) : (
              <span>Chưa có video</span>
            )}
          </div>
        );
      },
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
        <div style={{ padding: 8 }}>
          <Input
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            placeholder="Search Video URL"
            style={{ marginBottom: 8, display: "block" }}
          />
          <Space>
            <button onClick={() => confirm()}>Search</button>
            <button onClick={() => setSelectedKeys([])}>Reset</button>
          </Space>
        </div>
      ),
      onFilter: (value, record) =>
        record.videos.some((video) =>
          video.videoUrl.toLowerCase().includes(value.toLowerCase())
        ),
    },
    {
      title: "Thao tác",
      key: "actions",
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

  const handleModalOpen = (lesson = null) => {
    setIsEditMode(!!lesson);
    setEditingLesson(lesson);

    const initialVideos = lesson ? lesson.videos : [];

    form.setFieldsValue({
      ...lesson,
      videos: initialVideos,
    });

    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    form.resetFields();
  };
  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleSubmit = async () => {
    const values = await form.validateFields();

    const lessonData = {
      title: values.title,
      content: values.content,
      videos: values.videos,
      courseId: storedId,
    };

    if (isEditMode) {
      await axios.put(
        `https://math-be.onrender.com/api/v1/course/${storedId}/lessons/${editingLesson._id}`,
        lessonData
      );
      form.resetFields();
      message.success("Bài học đã được cập nhật!");
    } else {
      await axios.post(
        "https://math-be.onrender.com/api/v1/lesson/create/lesson",
        lessonData
      );
      form.resetFields();
      message.success("Thêm bài học thành công!");
    }

    fetchDocuments();
    handleModalClose(); // Đóng modal sau khi thành công
  };
  const showDeleteModal = (lesson) => {
    setDeletingLesson(lesson);
    setIsDeleteModalVisible(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(
        `https://math-be.onrender.com/api/v1/course/${storedId}/lessons/${deletingLesson._id}`
      );
      message.success("Bài học đã bị xóa!");
      form.resetFields();
      fetchDocuments();
      setIsDeleteModalVisible(false); // Đóng modal sau khi xóa thành công
    } catch (error) {
      message.error("Xóa bài học thất bại!");
    }
  };

  const pageSizeOptions = [5, 10, 15, 20];
  const currentData = React.useMemo(() => {
    return documents.slice(
      (pagination.current - 1) * pagination.pageSize,
      pagination.current * pagination.pageSize
    );
  }, [documents, pagination.current, pagination.pageSize]);

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
        <Button type="primary" onClick={() => handleModalOpen()}>
          Thêm bài học
        </Button>
      </Title>

      <Modal
        title={isEditMode ? "Chỉnh sửa bài học" : "Thêm bài học mới"}
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
          <Form.List
            name="videos"
            initialValue={editingLesson?.videos || []}
            rules={[
              {
                validator: async (_, videos) => {
                  if (!videos || videos.length < 1) {
                    return Promise.reject(
                      new Error("Vui lòng thêm ít nhất một video!")
                    );
                  }
                },
              },
            ]}
          >
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, fieldKey, formItemField }) => (
                  <Space
                    key={key}
                    style={{
                      display: "flex",
                      marginBottom: 8,
                      alignItems: "center",
                      width: "100%",
                    }}
                    align="baseline"
                  >
                    <Form.Item
                      {...formItemField}
                      name={[fieldKey, "title"]}
                      label="Tiêu đề video"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập tiêu đề video!",
                        },
                      ]}
                      style={{ marginRight: 8 }} // Giảm khoảng cách giữa các phần tử
                    >
                      <Input placeholder="Tiêu đề video" />
                    </Form.Item>

                    <Form.Item
                      {...formItemField}
                      name={[fieldKey, "videoUrl"]}
                      label="Link video"
                      rules={[
                        { required: true, message: "Vui lòng nhập URL video!" },
                      ]}
                      style={{ marginRight: 8 }} // Giảm khoảng cách giữa các phần tử
                    >
                      <Input placeholder="Link video" />
                    </Form.Item>

                    <Button
                      type="danger"
                      icon={<DeleteOutlined />}
                      onClick={() => remove(key)}
                      style={{ marginLeft: 8 }} // Tạo khoảng cách giữa Button và Form.Item
                    >
                      Xóa
                    </Button>
                  </Space>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    icon={<PlusOutlined />}
                    onClick={() => add()}
                    block
                  >
                    Thêm video
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
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
          Bạn có chắc muốn xóa bài học "{deletingLesson?.title}"? Hành động này
          không thể hoàn tác.
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

export default CourseDetail;
