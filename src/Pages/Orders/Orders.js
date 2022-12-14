/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import {
  Badge,
  Breadcrumb,
  Card,
  Col,
  Divider,
  Drawer,
  Empty,
  Row,
  Tag,
  Tooltip,
} from "antd";
import classNames from "classnames/bind";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../../Components/Footer/Footer";
import Header from "../../Components/Header/Header";
import { loginSuccess } from "../../redux/slice/authSlice";
import { getAllOrdersUser } from "../../redux/slice/orderSlice";
import { getAllProducts } from "../../redux/slice/productsSlice";
import { createAxios } from "../../Utils/createInstance";
import styles from "./Orders.module.scss";

const cx = classNames.bind(styles);
const DescriptionItem = ({ title, content }) => (
  <div className={cx("site-description-item-profile-wrapper")}>
    <p className={cx("site-description-item-profile-p-label")}>{title}:</p>
    <strong>{content}</strong>
  </div>
);
const Orders = () => {
  const [open, setOpen] = useState(false);
  const [detailOrder, setDetailOrder] = useState({});
  const orders = useSelector((state) => state.orders.orders);
  const user = useSelector((state) => state.auth.login);
  const products = useSelector((state) => state.products.products);
  const navigate = useNavigate();

  const dispatch = useDispatch();

  useEffect(() => {
    if (user === null) navigate("/");
    dispatch(getAllProducts());
  }, []);

  const showDrawer = (record) => {
    orders?.filter((item) => item._id === record && setDetailOrder(item));
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    let axiosJWT = createAxios(user, dispatch, loginSuccess);
    (async () => {
      await dispatch(
        getAllOrdersUser({
          id: user?._id,
          accessToken: user?.accessToken,
          axiosJWT,
        })
      );
    })();
  }, []);

  return (
    <>
      <Header />
      <main className="minHeightBody">
        <div className="container">
          <Breadcrumb>
            <Breadcrumb.Item>
              <Link to={"/"}>Trang ch???</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>????n h??ng</Breadcrumb.Item>
          </Breadcrumb>

          <div className={cx("pageOrders")}>
            <div className={cx("headingPageOrders")}>
              <h1>????n h??ng c???a b???n</h1>
            </div>
            <div className={cx("contentPageOrders")}>
              <div className="site-card-wrapper">
                {orders.length === 0 ? (
                  <Empty
                    imageStyle={{
                      height: 100,
                    }}
                    style={{ marginTop: 100 }}
                    description={
                      <span style={{ color: "#000" }}>
                        Gi??? h??ng c???a b???n ??ang tr???ng...
                      </span>
                    }
                  ></Empty>
                ) : (
                  <Row gutter={16}>
                    {orders.map((item) => (
                      <Col span={8} key={item._id}>
                        <Card
                          onClick={() => showDrawer(item._id)}
                          hoverable
                          cover={
                            <div style={{ padding: 10 }}>
                              <p>
                                M?? ????n: <strong>{item._id}</strong>
                              </p>
                              <p>
                                T??n kh??ch h??ng: <strong>{item.fullname}</strong>
                              </p>
                              <p>
                                Thanh to??n:{" "}
                                <strong>
                                  {item.payment ? (
                                    <Tag color="orange">
                                      Thanh to??n b???ng th???
                                    </Tag>
                                  ) : (
                                    <Tag color="blue">
                                      Thanh to??n b???ng ti???n m???t
                                    </Tag>
                                  )}
                                </strong>
                              </p>
                              <p>
                                Tr???ng th??i:{" "}
                                <strong>
                                  {item.status === "success" ? (
                                    <Tag color="green">
                                      ????n h??ng x??c nh???n th??nh c??ng
                                    </Tag>
                                  ) : item.status === "pending" ? (
                                    <Tag color="volcano">
                                      ????n h??ng ch??? x??c nh???n
                                    </Tag>
                                  ) : (
                                    <Tag color="red">????n h??ng ???? h???y</Tag>
                                  )}
                                </strong>
                              </p>
                              <p>
                                Ng??y mua: <strong>{item.payDate}</strong>
                              </p>
                            </div>
                          }
                        >
                          <Card.Meta
                            title={
                              <a style={{ color: "blue" }}>
                                Xem chi ti???t ????n h??ng
                              </a>
                            }
                          />
                        </Card>
                        <Divider />
                      </Col>
                    ))}
                  </Row>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Drawer
        size="large"
        placement="right"
        closable={false}
        onClose={onClose}
        open={open}
      >
        <h3
          className="site-description-item-profile-p"
          style={{
            marginBottom: 24,
          }}
        >
          Chi ti???t ????n h??ng
        </h3>

        <Divider />
        <h4 className="site-description-item-profile-p">Th??ng tin ????n h??ng</h4>
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
            <DescriptionItem
              title="S??? ??i???n tho???i"
              content={detailOrder.phone}
            />
          </Col>
          <Col span={12}>
            <DescriptionItem title="Ghi ch??" content={detailOrder.note} />
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <DescriptionItem title="?????a ch???" content={detailOrder.address} />
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
        {detailOrder.vnpCode !== "" && (
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
        )}

        <br />
        <Row gutter={16}>
          {detailOrder.products?.map((dt) =>
            products.map(
              (item) =>
                item._id === dt.productId && (
                  <Col span={8} key={item._id}>
                    <Badge.Ribbon text={dt.quantity} color="black">
                      <Tooltip title={item.title} color={"black"}>
                        <Card
                          hoverable
                          bordered={true}
                          cover={<img alt={item.title} src={item.image} />}
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
                      </Tooltip>
                    </Badge.Ribbon>
                  </Col>
                )
            )
          )}
        </Row>
      </Drawer>
      <Footer />
    </>
  );
};

export default Orders;
