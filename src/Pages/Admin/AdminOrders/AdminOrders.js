/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import Icon from "@ant-design/icons";
import {
  Badge,
  Breadcrumb,
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Drawer,
  Form,
  Input,
  message,
  Popconfirm,
  Row,
  Space,
  Table,
  Tabs,
  Tag,
  Tooltip,
} from "antd";
import classNames from "classnames/bind";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { BsBagCheck, BsBagX } from "react-icons/bs";
import { MdOutlineModeEdit } from "react-icons/md";
import { AiOutlineDelete } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { loginSuccess } from "../../../redux/slice/authSlice";
import {
  deleteOrders,
  getAllOrders,
  getDetailOrders,
  updateOrders,
} from "../../../redux/slice/orderSlice";
import { getAllProducts } from "../../../redux/slice/productsSlice";
import { createAxios } from "../../../Utils/createInstance";
import styles from "./AdminOrders.module.scss";

const dateFormatList = ["DD/MM/YYYY", "DD/MM/YY"];

const cx = classNames.bind(styles);

const DescriptionItem = ({ title, content }) => (
  <div className={cx("site-description-item-profile-wrapper")}>
    <p className={cx("site-description-item-profile-p-label")}>{title}:</p>
    <strong>{content}</strong>
  </div>
);
const AdminOrders = () => {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [update, setUpdate] = useState(false);
  const [tabsValue, setTabsValue] = useState("all");
  const dispatch = useDispatch();
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 10,
  });
  const user = useSelector((state) => state.auth.login);
  const detailOrder = useSelector((state) => state.orders.order);
  const allOrders = useSelector((state) => state.orders.allOrders);
  const isLoading = useSelector((state) => state.orders.loading);
  const allProducts = useSelector((state) => state.products.products);
  let axiosJWT = createAxios(user, dispatch, loginSuccess);

  useEffect(() => {
    (async () => {
      await dispatch(
        getAllOrders({
          search: search,
          key: tabsValue,
          accessToken: user.accessToken,
          axiosJWT,
        })
      );
    })();
  }, [tabsValue, dispatch]);

  useEffect(() => {
    (async () => {
      await dispatch(getAllProducts());
    })();
  }, []);

  const onSearch = async (value) => {
    setSearch(value);
    await dispatch(
      getAllOrders({
        search: value,
        key: tabsValue,
        accessToken: user.accessToken,
        axiosJWT,
      })
    );
  };

  const showDrawer = async (id) => {
    const res = await dispatch(
      getDetailOrders({ id, accessToken: user.accessToken, axiosJWT })
    );
    form.setFieldsValue({
      ...res.payload,
    });
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "_id",
      render: (_, record, index) => {
        const pageIndex = pagination.pageIndex;
        return <div>{index + 10 * (pageIndex - 1) + 1}</div>;
      },
      align: "center",
      width: 80,
    },
    {
      title: "M?? ????n",
      dataIndex: "_id",
      key: "_id",
      align: "center",
      render: (record) => <Tag color="green">{record}</Tag>,
    },
    {
      title: "T??n kh??ch h??ng",
      key: "fullname",
      dataIndex: "fullname",
      align: "center",
    },
    {
      title: "Ng??y",
      dataIndex: "payDate",
      key: "payDate",
      align: "center",
    },
    {
      title: "Tr???ng th??i",
      key: "status",
      dataIndex: "status",
      align: "center",
      render: (record) => {
        let text = "";
        let color = "";
        switch (record) {
          case "pending":
            text = "??ang ch??? x??c nh???n ????n h??ng";
            color = "orange";
            break;
          case "reject":
            text = "H???y ????n h??ng";
            color = "magenta";
            break;
          case "success":
            text = "X??c nh???n ????n h??ng th??nh c??ng";
            color = "green";
            break;
          default:
            break;
        }
        return (
          <Tag color={color} key={record}>
            {text}
          </Tag>
        );
      },
    },
    {
      title: "Chi ti???t",
      key: "detailOrder",
      align: "center",
      render: (_, record) => (
        <a
          style={{ color: "blue", textDecoration: "underline" }}
          onClick={() => showDrawer(record._id)}
        >
          Chi ti???t h??a ????n
        </a>
      ),
    },
  ];

  const onFinish = async (values) => {
    const res = await dispatch(
      updateOrders({
        id: detailOrder._id,
        values: { ...detailOrder, ...values },
        accessToken: user.accessToken,
        axiosJWT,
      })
    );
    if (res.type.includes("fulfilled")) {
      message.success("S???a th??ng tin ????n h??ng th??nh c??ng");
      setUpdate(false);
    } else {
      message.error("S???a th??ng tin ????n h??ng th???t b???i");
      setUpdate(true);
    }
  };

  const handleChangePagination = (page) => {
    setPagination({
      ...pagination,
      pageIndex: page.current,
      pageSize: page.pageSize,
    });
  };

  const onChangeTabs = async (key) => {
    setTabsValue(key);
  };

  const handleChangeStatus = async (status) => {
    await dispatch(
      updateOrders({
        id: detailOrder._id,
        values: { ...detailOrder, status },
        accessToken: user.accessToken,
        axiosJWT,
      })
    );
    setUpdate(false);
  };

  const handleUpdateOrder = () => {
    setUpdate(!update);
  };

  const handleDeleteOrder = async () => {
    await dispatch(
      deleteOrders({
        id: detailOrder._id,
        accessToken: user.accessToken,
        axiosJWT,
      })
    );
    setOpen(false);
  };

  return (
    <div>
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to={"/admin/dashboard"}>Trang ch???</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Qu???n l?? ????n h??ng</Breadcrumb.Item>
      </Breadcrumb>
      <Divider>T??m ki???m ????n h??ng</Divider>
      <Row>
        <Col xs={12}>
          <Input.Search
            placeholder="T??m ki???m t??n kh??ch h??ng"
            allowClear
            size="large"
            enterButton
            onSearch={onSearch}
          />
        </Col>
        <Col xs={12}>
          <DatePicker
            style={{ float: "right" }}
            size="large"
            defaultValue={moment(new Date(), dateFormatList[0])}
            format={dateFormatList}
          />
        </Col>
      </Row>
      <Divider>B???ng th??ng tin</Divider>
      <div className="tableUser">
        <Tabs
          onChange={onChangeTabs}
          items={[
            { key: "all", label: "T???t c???" },
            { key: "pending", label: "????n h??ng ch??? x??c nh???n" },
            { key: "success", label: "????n h??ng x??c nh???n th??nh c??ng" },
            { key: "reject", label: "????n h??ng ???? h???y" },
          ]}
        />
        <Table
          columns={columns}
          dataSource={allOrders}
          loading={isLoading}
          rowKey="_id"
          scroll={{ y: 500 }}
          pagination={{
            current: pagination.pageIndex,
            total: allOrders?.length,
            pageSize: pagination.pageSize,
          }}
          onChange={handleChangePagination}
          bordered
        />
      </div>
      <Drawer
        size="large"
        placement="right"
        closable={false}
        onClose={onClose}
        open={open}
      >
        <h4
          className="site-description-item-profile-p"
          style={{
            marginBottom: 24,
          }}
        >
          Chi ti???t ????n h??ng
        </h4>
        {detailOrder.status === "success" || detailOrder.status === "reject" ? (
          ""
        ) : (
          <Space>
            <Popconfirm
              title="B???n c?? ch???c ch???n x??c nh???n ????n h??ng?"
              onConfirm={() => handleChangeStatus("success")}
              okText="?????ng ??"
              cancelText="Kh??ng"
              placement="bottom"
            >
              <Button
                icon={<Icon component={BsBagCheck} />}
                style={{
                  background: "green",
                  borderColor: "green",
                  color: "#fff",
                }}
              >
                X??c nh???n ????n h??ng
              </Button>
            </Popconfirm>
            <Popconfirm
              title="B???n c?? ch???c ch???n h???y ????n h??ng?"
              onConfirm={() => handleChangeStatus("reject")}
              okText="?????ng ??"
              cancelText="Kh??ng"
              placement="bottom"
            >
              <Button
                icon={<Icon component={BsBagX} />}
                style={{
                  background: "#CF0A0A",
                  borderColor: "#CF0A0A",
                  color: "#fff",
                }}
              >
                H???y ????n h??ng
              </Button>
            </Popconfirm>
            <Button
              icon={<Icon component={MdOutlineModeEdit} />}
              style={{
                background: "#000",
                borderColor: "#000",
                color: "#fff",
              }}
              onClick={handleUpdateOrder}
            >
              S???a ????n h??ng
            </Button>
          </Space>
        )}
        {detailOrder.status === "reject" && (
          <Space>
            <Popconfirm
              title="B???n c?? ch???c ch???n x??a ????n h??ng?"
              onConfirm={handleDeleteOrder}
              okText="?????ng ??"
              cancelText="Kh??ng"
              placement="bottom"
            >
              <Button
                icon={<Icon component={AiOutlineDelete} />}
                style={{
                  background: "#E14D2A",
                  borderColor: "#E14D2A",
                  color: "#fff",
                }}
              >
                X??a ????n h??ng
              </Button>
            </Popconfirm>
          </Space>
        )}

        <Divider />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h3 className="site-description-item-profile-p">
            Th??ng tin ????n h??ng
          </h3>
          {update && (
            <Button type="primary" htmlType="submit" form="orders">
              S???a
            </Button>
          )}
        </div>

        <Form
          form={form}
          name="orders"
          initialValues={{}}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Row>
            <Col span={12}>
              <DescriptionItem
                title="T??n kh??ch h??ng"
                content={detailOrder.fullname}
              />
            </Col>
            <Col span={12}>
              <DescriptionItem
                title="T???ng ti???n"
                content={new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(detailOrder.amount)}
              />
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              {update ? (
                <Form.Item
                  name="phone"
                  label="S??? ??i???n tho???i"
                  rules={[
                    {
                      pattern: new RegExp(/((09|03|07|08|05)+([0-9]{8})\b)/g),
                      message: "Kh??ng ph???i l?? s??? ??i???n tho???i",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              ) : (
                <DescriptionItem
                  title="S??? ??i???n tho???i"
                  content={detailOrder.phone}
                />
              )}
            </Col>
            <Col span={12}>
              {update ? (
                <Form.Item name="note" label="Ghi ch??">
                  <Input.TextArea />
                </Form.Item>
              ) : (
                <DescriptionItem title="Ghi ch??" content={detailOrder.note} />
              )}
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              {update ? (
                <Form.Item name="address" label="?????a ch???">
                  <Input.TextArea />
                </Form.Item>
              ) : (
                <DescriptionItem
                  title="?????a ch???"
                  content={detailOrder.address}
                />
              )}
            </Col>
            <Col span={12}>
              <DescriptionItem
                title="Tr???ng th??i"
                content={
                  detailOrder.status === "success"
                    ? "X??c nh???n th??nh c??ng"
                    : detailOrder.status === "reject"
                    ? "H???y ????n h??ng"
                    : "??ang ch??? x??c nh???n"
                }
              />
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <DescriptionItem
                title="Thanh to??n"
                content={
                  detailOrder.payment ? "Thanh to??n th???" : "Thanh to??n ti???n m???t"
                }
              />
            </Col>
            <Col span={12}>
              <DescriptionItem
                title="Ng??y thanh to??n"
                content={detailOrder.payDate}
              />
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <DescriptionItem title="VNP Code" content={detailOrder.vnpCode} />
            </Col>
            <Col span={12}>
              <DescriptionItem
                title="Bank Code"
                content={detailOrder.bankCode}
              />
            </Col>
          </Row>
          <Row gutter={16}>
            {detailOrder.products?.map((dt) =>
              allProducts.map(
                (item) =>
                  item._id === dt.productId && (
                    <Col span={8} key={item._id}>
                      <Badge.Ribbon text={dt.quantity} color="black">
                        <Card
                          hoverable
                          bordered={true}
                          cover={
                            <Tooltip
                              title={`T??n: ${item.title}`}
                              color={"black"}
                            >
                              <img alt={item.title} src={item.image} />
                            </Tooltip>
                          }
                        >
                          <Card.Meta
                            title={item.title}
                            description={
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                }}
                              >
                                <span style={{ color: "red" }}>
                                  {new Intl.NumberFormat("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                  }).format(item.price)}
                                </span>
                                <strong>{dt.size}</strong>
                              </div>
                            }
                          />
                        </Card>
                      </Badge.Ribbon>
                    </Col>
                  )
              )
            )}
          </Row>
        </Form>
      </Drawer>
    </div>
  );
};

export default AdminOrders;
