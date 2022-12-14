/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/anchor-has-content */
import { Breadcrumb, Col, Radio, Row } from "antd";
import classNames from "classnames/bind";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../../Components/Footer/Footer";
import Header from "../../Components/Header/Header";
import Portal from "../../Components/Portal/Portal";
import {
  decreaseProduct,
  deleteProduct,
  increaseProduct,
} from "../../redux/slice/cartSlice";
import styles from "./Cart.module.scss";

const cx = classNames.bind(styles);
const Cart = () => {
  const [showModalRemove, setShowModalRemove] = useState(false);
  const [payment, setPayment] = useState("COD");
  const [productRemove, setProductRemove] = useState([]);
  const cart = useSelector((state) => state.carts.products);
  const total = useSelector((state) => state.carts.total);
  const user = useSelector((state) => state.auth.login);
  const quantity = cart.map((item) => item.quantity).reduce((a, b) => a + b, 0);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleClick = (e, value, type) => {
    e.preventDefault();
    if (type === "Dec") {
      value.quantity > 1 && dispatch(decreaseProduct(value));
    } else dispatch(increaseProduct(value));
  };

  const handleDeleteCart = () => {
    dispatch(deleteProduct(productRemove));
    setShowModalRemove(false);
  };

  const handleRemoveCart = (item) => {
    setProductRemove(item);
    setShowModalRemove(true);
  };

  const handleChangePayment = (e) => {
    setPayment(e.target.value);
  };

  const handleClickPayment = (values) => {
    if (values) {
      navigate("/cart");
    } else {
      if (payment === "COD") navigate("/checkouts");
      else navigate("/checkoutPayment");
    }
  };

  const handleClickLogin = (values) => {
    if (values) {
      navigate("/cart");
    } else {
      navigate("/login");
    }
  };

  return (
    <div>
      <Header />
      <main className="minHeightBody">
        <div className={cx("layoutCart")}>
          <div className={cx("breadcrumbShop")}>
            <div className="container">
              <div className={cx("breadcrumbList")}>
                <Breadcrumb>
                  <Breadcrumb.Item>
                    <Link to={"/"}>Trang ch???</Link>
                  </Breadcrumb.Item>
                  <Breadcrumb.Item>
                    <span>
                      <strong style={{ fontWeight: 400 }}>
                        Gi??? h??ng ({quantity})
                      </strong>
                    </span>
                  </Breadcrumb.Item>
                </Breadcrumb>
              </div>
            </div>
          </div>
          <div className={cx("wrapperMainCart")}>
            <div className={cx("contentBodyCart")}>
              <div className="container">
                <Row gutter={30}>
                  <Col
                    md={16}
                    sm={24}
                    xs={24}
                    className={cx("contentCartDetail")}
                  >
                    <div className={cx("mainCartDetail")}>
                      <div className={cx("headingCart")}>
                        <h1>Gi??? h??ng c???a b???n</h1>
                      </div>
                      {/* Empty cart */}
                      {cart.length === 0 && (
                        <div className={cx("expandedMessage")}>
                          Gi??? h??ng c???a b???n ??ang tr???ng
                        </div>
                      )}
                      {cart.length > 0 && (
                        <div className={cx("listCart")}>
                          <form>
                            <div className={cx("cartRow")}>
                              <p className={cx("titleNumberCart")}>
                                B???n ??ang c??
                                <strong className="count-cart">
                                  {" "}
                                  {quantity} s???n ph???m{" "}
                                </strong>
                                trong gi??? h??ng
                              </p>
                              <div className={cx("tableCart")}>
                                {cart.map((item, index) => (
                                  <div
                                    className={cx("mediaLineItem")}
                                    key={index}
                                  >
                                    <div className={cx("mediaLeft")}>
                                      <div className={cx("item-img")}>
                                        <img
                                          src={item.image}
                                          alt={item.title}
                                        />
                                      </div>
                                      <div className={cx("itemRemove")}>
                                        <a
                                          onClick={() => handleRemoveCart(item)}
                                        >
                                          X??a
                                        </a>
                                      </div>
                                    </div>
                                    <div className={cx("mediaRight")}>
                                      <div className={cx("itemInfo")}>
                                        <h3 className={cx("itemTitle")}>
                                          <Link to={`/products/${item._id}`}>
                                            {item.title}
                                          </Link>
                                          <div className={cx("itemVariant")}>
                                            <span>{item.size}</span>
                                          </div>
                                        </h3>
                                      </div>
                                      <div className={cx("itemPrice")}>
                                        <p>
                                          <span>
                                            {new Intl.NumberFormat("vi-VN", {
                                              style: "currency",
                                              currency: "VND",
                                            }).format(item.price)}
                                          </span>
                                        </p>
                                      </div>
                                    </div>
                                    <div className={cx("mediaTotal")}>
                                      <div className={cx("itemTotalPrice")}>
                                        <span className={cx("lineItemTotal")}>
                                          {new Intl.NumberFormat("vi-VN", {
                                            style: "currency",
                                            currency: "VND",
                                          }).format(item.price * item.quantity)}
                                        </span>
                                      </div>
                                      <div className={cx("itemQty")}>
                                        <div className={cx("quantityPartent")}>
                                          <button
                                            className={cx("qtyBtn")}
                                            onClick={(e) =>
                                              handleClick(e, item, "Dec")
                                            }
                                          >
                                            -
                                          </button>
                                          <input
                                            type="text"
                                            value={item.quantity}
                                            readOnly
                                            className={cx("itemQuantity")}
                                          />
                                          <button
                                            className={cx("qtyBtn")}
                                            onClick={(e) =>
                                              handleClick(e, item, "Inc")
                                            }
                                          >
                                            +
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </form>
                        </div>
                      )}
                    </div>
                  </Col>
                  <Col
                    md={8}
                    sm={24}
                    xs={24}
                    className={cx("sidebarCartSticky")}
                  >
                    <div className={cx("mainCartSideBar")}>
                      <div className={cx("orderSummaryBlock")}>
                        <h2 className={cx("summaryTitle")}>
                          Th??ng tin ????n h??ng
                        </h2>
                        <div className={cx("sumaryTotal")}>
                          <p>
                            T???ng ti???n:
                            <span>
                              {" "}
                              {new Intl.NumberFormat("vi-VN", {
                                style: "currency",
                                currency: "VND",
                              }).format(total)}
                            </span>
                          </p>
                        </div>
                        <div className={cx("sumaryAction")}>
                          <p>Ph?? v???n chuy???n s??? ???????c t??nh ??? trang thanh to??n.</p>
                          <p>
                            B???n c??ng c?? th??? nh???p m?? gi???m gi?? ??? trang thanh to??n.
                          </p>
                          {cart.length === 0 && (
                            <div
                              className={cx(
                                "sumaryAlert",
                                "alertDanger",
                                "alert"
                              )}
                            >
                              Gi??? h??ng c???a b???n hi???n ch??a ?????t m???c t???i thi???u ?????
                              thanh to??n.
                            </div>
                          )}
                          <div className={cx("payment")}>
                            <Radio.Group
                              onChange={handleChangePayment}
                              value={payment}
                            >
                              <Radio value={"COD"}>Ship COD</Radio>
                              <Radio value={"payment"}>
                                Thanh to??n b???ng th???
                              </Radio>
                            </Radio.Group>
                          </div>
                          {user !== null ? (
                            <div className={cx("sumaryButton")}>
                              <a
                                className={cx(
                                  "checkoutBtn",
                                  "btnRed",
                                  cart.length === 0 && "disabled"
                                )}
                                onClick={() =>
                                  handleClickPayment(
                                    cart.length === 0 && "disabled"
                                  )
                                }
                              >
                                THANH TO??N
                              </a>
                            </div>
                          ) : (
                            <div className={cx("sumaryButton")}>
                              <a
                                className={cx(
                                  "checkoutBtn",
                                  "btnRed",
                                  cart.length === 0 && "disabled"
                                )}
                                onClick={() =>
                                  handleClickLogin(
                                    cart.length === 0 && "disabled"
                                  )
                                }
                              >
                                ????ng nh???p ????? thanh to??n
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                      <div
                        className={cx(
                          "orderSummaryBlock",
                          "orderSummaryNotify"
                        )}
                      >
                        <div className={cx("sumaryWarning")}>
                          <div className={cx("textmr")}>
                            <strong>Ch??nh s??ch giao h??ng</strong>
                            <p>
                              Hi???n ch??ng t??i ch??? ??p d???ng thanh to??n v???i ????n h??ng
                              c?? gi?? tr??? t???i thi???u <strong>150.000??? </strong>{" "}
                              tr??? l??n.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      {showModalRemove && (
        <Portal>
          <div className={cx("showModal", "modalOverlay")}>
            <div className={cx("swalModal", "swalCartRemove")}>
              <div className={cx("swalText")}>
                B???n ch???c ch???n mu???n b??? s???n ph???m n??y ra kh???i gi??? h??ng?
              </div>
              <div className={cx("swalFooter")}>
                <div className={cx("swalButtonContainer")}>
                  <button
                    className={cx("swalButton", "swalButtonCancel")}
                    onClick={() => setShowModalRemove(false)}
                  >
                    H???y
                  </button>
                </div>
                <div className={cx("swalButtonContainer")}>
                  <button
                    className={cx("swalButton", "swalButtonConfirm")}
                    onClick={handleDeleteCart}
                  >
                    ?????ng ??
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
};

export default Cart;
