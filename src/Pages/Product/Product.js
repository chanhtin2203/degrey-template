/* eslint-disable react-hooks/exhaustive-deps */
import { Breadcrumb, Col, Image, Row, Skeleton } from "antd";
import classNames from "classnames/bind";
import React, { useEffect, useState } from "react";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import { Link, useNavigate, useParams } from "react-router-dom";
import io from "socket.io-client";
import Footer from "../../Components/Footer/Footer";
import Header from "../../Components/Header/Header";
import styles from "./Product.module.scss";
import Slider from "react-slick";
import { getDetailProduct } from "../../redux/slice/productsSlice";
import { useDispatch, useSelector } from "react-redux";
import { addProduct } from "../../redux/slice/cartSlice";
import {
  addViewedsProducts,
  removeViewedsProducts,
} from "../../redux/slice/viewedProducts";
import CommentProducts from "../../Components/CommentProducts/CommentProducts";
import FormInput from "../../Components/CommentProducts/FormInput/FormInput";
import { getListComments } from "../../redux/slice/commentsSlice";
import useConnectSocket from "../../Hooks/useConnectSocket";

const cx = classNames.bind(styles);
const Product = ({ currentSlide, slideCount, ...props }) => {
  const { id } = useParams();
  const [size, setSize] = useState("");
  const [comments, setComments] = useState([]);
  const [breadcrumb, setBreadcrumb] = useState("");
  const [category, setCategory] = useState("");
  const [clicked, setClicked] = useState(true);
  const [clickedService, setClickedService] = useState(false);
  const [clickedShowCart, setClickedShowCart] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch();
  const product = useSelector((state) => state.products.product);
  const loading = useSelector((state) => state.products.isLoading);
  const viewedProducts = useSelector((state) => state.views.products);
  const navigate = useNavigate();
  const socket = useConnectSocket(io);

  useEffect(() => {
    const getDetail = async () => {
      const res = await dispatch(getDetailProduct(id));
      if (res.payload === undefined || res.payload === null) {
        await dispatch(removeViewedsProducts(id));
        navigate(-1);
      } else {
        const { category, size } = res.payload;
        setSize(size[0]);
        setCategory(category);
        setBreadcrumb(
          category === "tee" || category === "jacket" || category === "madmonks"
            ? "??o"
            : category === "pants"
            ? "Qu???n"
            : "Ph??? ki???n"
        );
      }
    };
    getDetail();
  }, [dispatch, id, navigate]);

  useEffect(() => {
    (async () => {
      const res = await dispatch(getListComments({ id }));
      setComments(res.payload);
    })();
  }, [id, dispatch]);

  // realtime
  // join room

  useEffect(() => {
    if (socket) {
      socket.emit("joinRoom", id);
    }
  }, [socket, id]);

  useEffect(() => {
    if (socket) {
      socket.on("sendCommentToClient", (msg) => {
        setComments([msg, ...comments]);
      });
      return () => socket.off("sendCommentToClient");
    }
  }, [socket, comments]);

  // send reply comments
  useEffect(() => {
    if (socket) {
      socket.on("sendReplyCommentToClient", (msg) => {
        setComments((prev) =>
          prev.map((item) => {
            if (item._id === msg._id) {
              item = msg;
            }
            return item;
          })
        );
      });
      return () => socket.off("sendReplyCommentToClient");
    }
  }, [socket, comments]);
  const SlickArrowLeft = ({ currentSlide, slideCount, ...props }) => (
    <GrFormPrevious
      {...props}
      className={
        "slick-prev slick-arrow" + (currentSlide === 0 ? " slick-disabled" : "")
      }
      aria-hidden="true"
      aria-disabled={currentSlide === 0 ? true : false}
    >
      Previous
    </GrFormPrevious>
  );
  const SlickArrowRight = ({ currentSlide, slideCount, ...props }) => {
    return (
      <GrFormNext
        {...props}
        className={
          "slick-next slick-arrow" +
          (currentSlide === slideCount - 5 ? " slick-disabled" : "")
        }
        aria-hidden="true"
        aria-disabled={currentSlide === slideCount - 5 ? true : false}
      >
        Next
      </GrFormNext>
    );
  };
  const settings = {
    slidesToShow: 5,
    slidesToScroll: 1,
    prevArrow: <SlickArrowLeft />,
    nextArrow: <SlickArrowRight />,
    infinite: false,
    rows: 1,
    responsive: [
      {
        breakpoint: 1198,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          rows: 1,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          rows: 1,
        },
      },
    ],
  };

  const handleQuantity = (type) => {
    if (type === "dec") {
      quantity > 1 && setQuantity(quantity - 1);
    } else {
      setQuantity(quantity + 1);
    }
  };

  const handleAddCart = (e) => {
    e.preventDefault();
    dispatch(addProduct({ ...product, quantity, size }));
    setClickedShowCart(true);
  };

  useEffect(() => {
    product?._id !== undefined && dispatch(addViewedsProducts(product));
  }, [product]);

  return (
    <div>
      <Header showCart={clickedShowCart} setShowCart={setClickedShowCart} />
      <main className="minHeightBody">
        <Skeleton loading={loading}>
          <div className={cx("layoutDetailProducts")}>
            <div className={cx("breadcrumbShop")}>
              <div className="container">
                <div className={cx("breadcrumbList")}>
                  <Breadcrumb>
                    <Breadcrumb.Item>
                      <Link to={"/"}>Trang ch???</Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                      <Link to={`/collections/${category}`}>{breadcrumb}</Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                      <span>{product?.title}</span>
                    </Breadcrumb.Item>
                  </Breadcrumb>
                </div>
              </div>
            </div>
            <section className={cx("productInfomation")}>
              <div className="container">
                <Row gutter={30}>
                  <Col
                    md={12}
                    sm={24}
                    xs={24}
                    className={cx("productDetailGallery")}
                  >
                    <div className={cx("productContainergallery")}>
                      <div className={cx("verticalSlide")}>
                        <div>
                          <Image src={product?.image} alt={product?.title} />
                        </div>
                      </div>
                    </div>
                  </Col>
                  <Col md={12} sm={24} xs={24}>
                    <div className={cx("productDetailContent")}>
                      <div className={cx("productDetailContainer")}>
                        <div className={cx("productDetailOrder")}>
                          <div className={cx("product-variants")}>
                            <form>
                              <div className={cx("select")}></div>
                              <div className={cx("select-swatch")}>
                                {product?.size?.length > 0 && product?.inStock && (
                                  <div className={cx("swatch")}>
                                    <div className={cx("titleSwap")}>
                                      SIZE:{" "}
                                    </div>
                                    <div className={cx("selectSwap")}>
                                      {product?.size.map((item, index) => (
                                        <div
                                          className={cx("swatchElement")}
                                          key={item}
                                        >
                                          <input
                                            id={item}
                                            type="radio"
                                            value={item}
                                            checked={size === item}
                                            onChange={(e) =>
                                              setSize(e.target.value)
                                            }
                                          />
                                          <label
                                            htmlFor={item}
                                            className={
                                              size === item ? cx("sd") : ""
                                            }
                                          >
                                            <span>{item}</span>
                                          </label>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                              <div className={cx("select-actions")}>
                                <div className={cx("quantityArea")}>
                                  <input
                                    type="button"
                                    value="-"
                                    className={cx("qtyBtn")}
                                    onClick={() => handleQuantity("dec")}
                                  />
                                  <input
                                    type="text"
                                    value={quantity}
                                    onChange={(e) =>
                                      setQuantity(e.target.value)
                                    }
                                    className={cx("quantityInput")}
                                  />
                                  <input
                                    type="button"
                                    value="+"
                                    className={cx("qtyBtn")}
                                    onClick={() => handleQuantity("inc")}
                                  />
                                </div>
                                <div className={cx("addCartArea")}>
                                  {product?.inStock ? (
                                    <button
                                      onClick={handleAddCart}
                                      className={cx("button", "btnAddToCart")}
                                    >
                                      <span>Th??m v??o gi???</span>
                                    </button>
                                  ) : (
                                    <button
                                      onClick={(e) => e.preventDefault()}
                                      className={cx("button", "btnAddToCart")}
                                    >
                                      <span>T???m h???t h??ng</span>
                                    </button>
                                  )}
                                </div>
                              </div>
                            </form>
                          </div>
                          <div className={cx("product-heading")}>
                            <h1>{product?.title}</h1>
                          </div>
                          <div className={cx("product-price")}>
                            <span className={cx("proPrice")}>
                              {new Intl.NumberFormat("vi-VN", {
                                style: "currency",
                                currency: "VND",
                              }).format(product?.price)}
                            </span>
                          </div>
                        </div>
                        <div className={cx("product-coutdown")} />
                        <div className={cx("product-policy-detail")}>
                          <div className={cx("itemPolicyDetail")}>
                            Freeship ????n h??ng gi?? tr??? tr??n 1 tri???u ?????ng
                          </div>
                          <div className={cx("itemPolicyDetail")}>
                            ?????i h??ng ch??a qua s??? d???ng trong v??ng 30 ng??y
                          </div>
                        </div>
                        <div className={cx("product-description")}>
                          <div
                            className={
                              clicked
                                ? cx("panelGroup", "opened")
                                : cx("panelGroup")
                            }
                          >
                            <div className={cx("panelTitle")}>
                              <h2>
                                TH??ng tin s???n ph???m
                                {clicked ? (
                                  <AiOutlineMinus
                                    onClick={() => setClicked(!clicked)}
                                  />
                                ) : (
                                  <AiOutlinePlus
                                    onClick={() => setClicked(!clicked)}
                                  />
                                )}
                              </h2>
                            </div>
                            <div
                              className={cx("panelDescription")}
                              style={
                                clicked
                                  ? { display: "block" }
                                  : { display: "none" }
                              }
                            >
                              <div
                                className={cx(
                                  "descProductDetail",
                                  "typeList-style"
                                )}
                              >
                                <p
                                  dangerouslySetInnerHTML={{
                                    __html: product?.description,
                                  }}
                                />
                                <p>&nbsp;</p>
                                <p>+ H?????NG D???N B???O QU???N S???N PH???M DEGREY:</p>
                                <p>
                                  - Gi???t ??? nhi???t ????? b??nh th?????ng, v???i ????? c?? m??u
                                  t????ng t???.
                                </p>
                                <p>- Kh??ng d??ng h??a ch???t t???y l??n s???n ph???m</p>
                                <p>
                                  - B???n n??n gi???t tay v?? L???N NG?????C ??O tr?????c khi
                                  gi???t.
                                </p>
                                <p>- Kh??ng ???i tr???c ti???p l??n h??nh in.</p>
                                <p>
                                  - H???n ch??? s??? d???ng m??y s???y v?? ???i (n???u c??) ch???
                                  n??n ???i l??n v???i ho???c s??? d???ng b??n ???i h??i n?????c ???
                                  nhi???t ????? th??ch h???p.
                                </p>
                                <p>&nbsp;</p>
                                <p>+ CH??NH S??CH ?????I S???N PH???M:</p>
                                <p>1.??i???u ki???n ?????i h??ng</p>
                                <p>
                                  - B???n l??u ?? gi??? l???i ho?? ????n ????? ?????i h??ng trong
                                  v??ng 30 ng??y.
                                </p>
                                <p>
                                  - ?????i v???i m???t h??ng gi???m gi??, ph??? ki???n c?? nh??n
                                  (??o l??t, kh???u trang, v??? ...) kh??ng nh???n ?????i
                                  h??ng.
                                </p>
                                <p>
                                  - T???t c??? s???n ph???m ???? mua s??? kh??ng ???????c ?????i tr???
                                  l???i b???ng ti???n m???t.
                                </p>
                                <p>
                                  - B???n c?? th??? ?????i size ho???c s???n ph???m kh??c trong
                                  30 ng??y (L??u ??: s???n ph???m ch??a qua s??? d???ng, c??n
                                  tag nh??n v?? h??a ????n mua h??ng.)
                                </p>
                                <p>
                                  - B???n vui l??ng g???i cho ch??ng m??nh clip ????ng
                                  g??i v?? h??nh ???nh c???a ????n h??ng ?????i tr??? c???a b???n,
                                  nh??n vi??n t?? v???n s??? x??c nh???n v?? ti???n h??nh l??n
                                  ????n ?????i tr??? cho b???n.
                                </p>
                                <p>&nbsp;</p>
                                <p>2. Tr?????ng h???p khi???u n???i</p>
                                <p>- B???n ph???i c?? video unbox h??ng</p>
                                <p>- Quay video r?? n??t 6 m???t c???a g??i h??ng</p>
                                <p>
                                  - Quay r??: T??n ng?????i nh???n, m?? ????n, ?????a ch???, s???
                                  ??i???n tho???i.
                                </p>
                                <p>- Clip kh??ng c???t gh??p, ch???nh s???a</p>
                                <p>
                                  - Degrey xin kh??ng ti???p nh???n gi???i quy???t c??c
                                  tr?????ng h???p kh??ng th???a c??c ??i???u ki???n tr??n.
                                </p>
                              </div>
                            </div>
                          </div>
                          <div
                            className={
                              clickedService
                                ? cx("panelGroup")
                                : cx("panelGroup", "opened")
                            }
                          >
                            <div className={cx("panelTitle")}>
                              <h2>
                                D???ch v??? giao h??ng
                                {clickedService ? (
                                  <AiOutlineMinus
                                    onClick={() =>
                                      setClickedService(!clickedService)
                                    }
                                  />
                                ) : (
                                  <AiOutlinePlus
                                    onClick={() =>
                                      setClickedService(!clickedService)
                                    }
                                  />
                                )}
                              </h2>
                            </div>
                            <div
                              className={cx("panelDescription")}
                              style={
                                clickedService
                                  ? { display: "block" }
                                  : { display: "none" }
                              }
                            >
                              <div className={cx("productDeliverly")}>
                                <ul className={cx("infoListDeliverly")}>
                                  <li>
                                    <span>
                                      <img
                                        data-src="https://file.hstatic.net/1000397797/file/delivery-ico1_f26631929e1b41dab022d9960006297c.svg"
                                        src="https://file.hstatic.net/1000397797/file/delivery-ico1_f26631929e1b41dab022d9960006297c.svg"
                                        alt="Cam k???t 100% ch??nh h??ng Degrey"
                                      />
                                    </span>
                                    Cam k???t 100% ch??nh h??ng Degrey
                                  </li>
                                  <li>
                                    <span>
                                      <img
                                        data-src="https://file.hstatic.net/1000397797/file/delivery-ico2_5ea2de2f279b4dbfa10fcb9b9c448b4d.svg"
                                        src="https://file.hstatic.net/1000397797/file/delivery-ico2_5ea2de2f279b4dbfa10fcb9b9c448b4d.svg"
                                        alt="Giao h??ng d??? ki???n: Th??? 2 - Th??? 7 t??? 9h00 - 17h00"
                                      />
                                    </span>
                                    Giao h??ng d??? ki???n: <br />
                                    <strong>
                                      Th??? 2 - Th??? 7 t??? 9h00 - 17h00
                                    </strong>
                                  </li>
                                  <li>
                                    <span>
                                      <img
                                        data-src="https://file.hstatic.net/1000397797/file/delivery-ico3_dd589d9c49584441a9ef0c2f9300649f.svg"
                                        src="https://file.hstatic.net/1000397797/file/delivery-ico3_dd589d9c49584441a9ef0c2f9300649f.svg"
                                        alt="H??? tr??? 24/7 V???i c??c k??nh chat, email &amp; phone"
                                      />
                                    </span>
                                    H??? tr??? 24/7
                                    <br />
                                    V???i c??c k??nh chat, email &amp; phone
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
            </section>
            {/* Comment product */}
            <section className={cx("productDetailListProd")}>
              <div className="container">
                <div className={cx("listprodTitle")}>
                  <h2>????nh gi?? s???n ph???m</h2>
                </div>
                <div className={cx("listprodContent")}>
                  <FormInput id={id} socket={socket} />
                  <div className={cx("comments_list")}>
                    <CommentProducts comment={comments} socket={socket} />
                  </div>
                </div>
              </div>
            </section>
            {/* Product viewed */}
            <section className={cx("productDetailListProd")}>
              <div className="container">
                <div className={cx("listprodTitle")}>
                  <h2>S???n ph???m ???? xem</h2>
                </div>
                <div className={cx("listprodContent")}>
                  <Slider {...settings}>
                    {viewedProducts.map((item, index) => (
                      <div className={cx("listProductView")} key={item._id}>
                        <div className={cx("productLoop")}>
                          <div
                            className={cx("productInner")}
                            style={{ height: "313px" }}
                          >
                            <div className={cx("productsImage")}>
                              <div
                                className={cx("productsListImage")}
                                style={{ height: "220px" }}
                              >
                                <div className={cx("productImageInner")}>
                                  <Link to={`/products/${item._id}`}>
                                    <div className={cx("image")}>
                                      <picture>
                                        <img
                                          src={item.image}
                                          alt={item.title}
                                        />
                                      </picture>
                                    </div>
                                  </Link>
                                </div>
                              </div>
                            </div>
                            <div className={cx("productsDetail")}>
                              <h3>
                                <Link to={`/products/${item._id}`}>
                                  {item.title}
                                </Link>
                              </h3>
                              <p className={cx("productPrice")}>
                                <span className={cx("price")}>
                                  {new Intl.NumberFormat("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                  }).format(item.price)}
                                </span>
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </Slider>
                </div>
              </div>
            </section>
          </div>
        </Skeleton>
      </main>
      <Footer />
    </div>
  );
};

export default Product;
