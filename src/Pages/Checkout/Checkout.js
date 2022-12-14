/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  Breadcrumb,
  Button,
  Divider,
  Form,
  Input,
  message,
  Result,
} from "antd";
import classNames from "classnames/bind";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { createAxios } from "../../Utils/createInstance";
import { loginSuccess } from "../../redux/slice/authSlice";
import { getUser } from "../../redux/slice/userSlice";
import { deleteAllCart } from "../../redux/slice/cartSlice";
import { createNewOrder } from "../../redux/slice/orderSlice";
import styles from "./Checkout.module.scss";
import { BASE_URL } from "../../Utils/BaseUrl";

const cx = classNames.bind(styles);
const Checkout = () => {
  const [result, setResult] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.login);
  const cart = useSelector((state) => state.carts.products);
  const total = useSelector((state) => state.carts.total);
  let axiosJWT = createAxios(user, dispatch, loginSuccess);

  const onFinish = async (values) => {
    const dataOrders = {
      ...values,
      userId: user._id,
      products: cart.map((item) => ({
        productId: item._id,
        quantity: item.quantity,
        size: item.size,
      })),
      amount: total,
    };
    if (location.pathname.includes("/checkoutPayment")) {
      const { data } = await axiosJWT.post(
        `${BASE_URL}/payment/create`,
        dataOrders,
        {
          headers: { token: `Beaer ${user?.accessToken}` },
        }
      );

      if (data.code === "00") {
        document.location = data.data;
      }
    } else {
      const res = await dispatch(
        createNewOrder({
          id: user._id,
          dataOrders,
          accessToken: user?.accessToken,
          axiosJWT,
        })
      );
      if (res.payload !== undefined) {
        setResult(true);
        dispatch(deleteAllCart());
      } else {
        setResult(false);
        message.error("???? x???y ra l???i khi mua h??ng", 1.5);
      }
    }
  };
  useEffect(() => {
    if (cart.length === 0) navigate("/");
    (async () => {
      const res = await dispatch(
        getUser({ id: user._id, accessToken: user?.accessToken, axiosJWT })
      );
      form.setFieldsValue({
        ...res.payload,
      });
    })();
  }, []);

  return (
    <>
      {result === false ? (
        <div className={cx("content")}>
          <div className={cx("wrap")}>
            <div className={cx("sidebar")}>
              <div className={cx("orderSumary")}>
                <div className={cx("orderSumarySections")}>
                  <div className={cx("orderSumarySection")}>
                    <table>
                      <thead>
                        <tr>
                          <th scope="col">
                            <span className={cx("visually-hidden")}>
                              H??nh ???nh
                            </span>
                          </th>
                          <th scope="col">
                            <span className={cx("visually-hidden")}>M?? t???</span>
                          </th>
                          <th scope="col">
                            <span className={cx("visually-hidden")}>
                              S??? l?????ng
                            </span>
                          </th>
                          <th scope="col">
                            <span className={cx("visually-hidden")}>Gi??</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {cart.map((item, index) => (
                          <tr className={cx("product")} key={index}>
                            <td className={cx("productImage")}>
                              <div className={cx("productThumbnail")}>
                                <div className={cx("productThumbnailWrapper")}>
                                  <img
                                    className={cx("productThumbnailImage")}
                                    alt={item.title}
                                    src={item.image}
                                  />
                                </div>
                                <span
                                  className={cx("productThumbnailQuantity")}
                                >
                                  {item.quantity}
                                </span>
                              </div>
                            </td>
                            <td className={cx("productDescription")}>
                              <span
                                className={cx(
                                  "productDescriptionName",
                                  "orderSummaryEmphasis"
                                )}
                              >
                                {item.title}
                              </span>
                              <span
                                className={cx(
                                  "productDescriptionVariant",
                                  "orderSummarySmallText"
                                )}
                              >
                                {item.size}
                              </span>
                            </td>
                            <td
                              className={cx(
                                "productQuantity",
                                "visuallyHidden"
                              )}
                            ></td>
                            <td className={cx("productPrice")}>
                              <span className={cx("orderSummaryEmphasis")}>
                                {new Intl.NumberFormat("vi-VN", {
                                  style: "currency",
                                  currency: "VND",
                                }).format(item.price)}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className={cx("orderSumarySection", "paymentLines")}>
                    <table>
                      <thead>
                        <tr>
                          <th scope="col">
                            <span className={cx("visually-hidden")}>M?? t???</span>
                          </th>
                          <th scope="col">
                            <span className={cx("visually-hidden")}>Gi??</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className={cx("totalLine")}>
                          <td className={cx("totalLineName")}>T???m t??nh</td>
                          <td className={cx("totalLinePrice")}>
                            <span className={cx("orderSummaryEmphasis")}>
                              {new Intl.NumberFormat("vi-VN", {
                                style: "currency",
                                currency: "VND",
                              }).format(total)}
                            </span>
                          </td>
                        </tr>
                        <tr className={cx("totalLine")}>
                          <td className={cx("totalLineName")}>
                            Ph?? v???n chuy???n
                          </td>
                          <td className={cx("totalLinePrice")}>
                            <span className={cx("orderSummaryEmphasis")}>
                              ???
                            </span>
                          </td>
                        </tr>
                      </tbody>
                      <tfoot className={cx("totalLineTableFooter")}>
                        <tr className={cx("totalLine")}>
                          <td>
                            <span className={cx("paymentDueLabelTotal")}>
                              T???ng c???ng
                            </span>
                          </td>
                          <td>
                            <span className={cx("paymentDueCurrency")}>
                              VND
                            </span>
                            <span className={cx("paymentDuePrice")}>
                              {new Intl.NumberFormat("vi-VN", {
                                style: "currency",
                                currency: "VND",
                              }).format(total)}
                            </span>
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            {/* main */}
            <div className={cx("main")}>
              <div className={cx("mainHeader")}>
                <a className={cx("logo")}>
                  <h1 className={cx("logoText")}>Vagabond VietNam</h1>
                </a>
                <Breadcrumb separator=">">
                  <Breadcrumb.Item href="/cart">Gi??? h??ng</Breadcrumb.Item>
                  <Breadcrumb.Item>Th??ng tin giao h??ng</Breadcrumb.Item>
                  <Breadcrumb.Item>Ph????ng th???c thanh to??n</Breadcrumb.Item>
                </Breadcrumb>
              </div>
              <div className={cx("mainContent")}>
                <div className={cx("step")}>
                  <div className={cx("stepActions")}>
                    <div className={cx("section")}>
                      <div className={cx("sectionHeader")}>
                        <h2 className={cx("sectionTitle")}>
                          Th??ng tin giao h??ng
                        </h2>
                      </div>
                      <div className={cx("sectionContent")}>
                        <Form
                          form={form}
                          name="checkout"
                          initialValues={{}}
                          layout="inline"
                          onFinish={onFinish}
                          autoComplete="off"
                        >
                          <Form.Item
                            name="fullname"
                            wrapperCol={{ sm: 24 }}
                            style={{
                              width: "100%",
                              height: 70,
                              marginBottom: 0,
                              marginRight: 0,
                            }}
                            rules={[
                              {
                                required: true,
                                message: "H??? v?? t??n kh??ng ???????c ????? tr???ng!",
                              },
                            ]}
                          >
                            <Input
                              style={{ borderRadius: "4px", padding: 10 }}
                              placeholder="H??? v?? t??n"
                            />
                          </Form.Item>

                          <Form.Item
                            name="email"
                            wrapperCol={{ sm: 24 }}
                            style={{
                              width: "60%",
                              height: 70,
                              marginBottom: 0,
                              marginRight: 0,
                            }}
                            rules={[
                              {
                                required: true,
                                message: "Email kh??ng ???????c ????? tr???ng!",
                              },
                            ]}
                          >
                            <Input
                              style={{ borderRadius: "4px", padding: 10 }}
                              placeholder="Email"
                            />
                          </Form.Item>

                          <Form.Item
                            name="phone"
                            wrapperCol={{ sm: 24 }}
                            style={{
                              width: "40%",
                              height: 70,
                              paddingLeft: 10,
                              marginBottom: 0,
                              marginRight: 0,
                            }}
                            rules={[
                              {
                                required: true,
                                message: "S??? ??i???n tho???i kh??ng ???????c ????? tr???ng!",
                              },
                              {
                                pattern: new RegExp(
                                  /((09|03|07|08|05)+([0-9]{8})\b)/g
                                ),
                                message: "Kh??ng ph???i l?? s??? ??i???n tho???i",
                              },
                            ]}
                          >
                            <Input
                              style={{
                                borderRadius: "4px",
                                padding: "10px",
                              }}
                              placeholder="S??? ??i???n tho???i"
                            />
                          </Form.Item>

                          <Form.Item
                            name="address"
                            wrapperCol={{ sm: 24 }}
                            style={{
                              width: "100%",
                              height: 70,
                              marginBottom: 0,
                              marginRight: 0,
                            }}
                            rules={[
                              {
                                required: true,
                                message: "?????a ch??? kh??ng ???????c ????? tr???ng!",
                              },
                            ]}
                          >
                            <Input
                              style={{ borderRadius: "4px", padding: 10 }}
                              placeholder="?????a ch???"
                            />
                          </Form.Item>
                          <Form.Item
                            name="note"
                            wrapperCol={{ sm: 24 }}
                            style={{
                              width: "100%",
                              height: 70,
                              marginBottom: 0,
                              marginRight: 0,
                            }}
                          >
                            <Input.TextArea
                              allowClear
                              showCount
                              autoSize={{ minRows: 3, maxRows: 3 }}
                              placeholder="Ghi ch??"
                            />
                          </Form.Item>
                          <Divider />
                          <Form.Item style={{ width: "100%" }}>
                            <div className={cx("buttonWrapper")}>
                              <Link to={"/cart"}>Quay v??? gi??? h??ng</Link>
                              <Button
                                type="primary"
                                htmlType="submit"
                                size="large"
                              >
                                {location.pathname.includes("/checkoutPayment")
                                  ? "Ti???n h??nh thanh to??n th??? t??n d???ng"
                                  : "Ho??n th??nh thanh to??n"}
                              </Button>
                            </div>
                          </Form.Item>
                        </Form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Result
          status="success"
          title="B???n ???? thanh to??n th??nh c??ng"
          subTitle="M?? ????n h??ng c???a b???n ???? ???????c b??n mua ti???p nh???n th??nh c??ng, b???n vui l??ng ch??? b??n admin x??c nh???n ????n h??ng, xin c???m ??n qu?? kh??ch ???? l???a ch???n c???a h??ng Vagabond"
          extra={[
            <Button
              type="primary"
              key="orders"
              onClick={() => {
                return navigate("/orders") && setResult(false);
              }}
            >
              Xem s???n ph???m ???? ?????t
            </Button>,
            <Button
              key={"buyAgain"}
              onClick={() => {
                return navigate("/") && setResult(false);
              }}
            >
              Mua ti???p s???n ph???m
            </Button>,
          ]}
        />
      )}
    </>
  );
};
export default Checkout;
