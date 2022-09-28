import React from "react";
import { Carousel, message } from "antd";
import classNames from "classnames/bind";
import Footer from "../../Components/Footer/Footer";
import Header from "../../Components/Header/Header";
import styles from "./Home.module.scss";
import { Link } from "react-router-dom";
import Collection from "../../Components/Collection/Collection";

const cx = classNames.bind(styles);

const Home = () => {
  const handleClick = () => {
    message.warning("Chức năng sẽ có trong tương lai !!!");
  };

  return (
    <div>
      <Header />
      <main className="minHeightBody">
        <section className={cx("sectionSlide")}>
          <div className="container">
            <Carousel>
              <Link to={"/all-products"}>
                <img
                  src="https://file.hstatic.net/1000281824/file/z3605342700333_e0573e4fd541ce01b187bfed5792184e_d6f9b4c3708148738c2199dd25fcaf6f.jpg"
                  alt=""
                />
              </Link>
            </Carousel>
          </div>
        </section>
        <section className={cx("promotion")}>
          <div className="container">
            <div className={cx("promotionBgroundWhite")}>
              <h2>ĐẶC QUYỀN CHO BẠN HÔM NAY!</h2>
              <div className={cx("listPromotion")}>
                <div className={cx("itemPromotion")}>
                  <div className={cx("itemInnerPromotion")}>
                    <div title="Giao hàng cứ để Xoài lo">
                      <span className={cx("title")}>
                        Giao hàng cứ để Xoài lo
                      </span>
                      <span className={cx("content")}>
                        Freeship cho hoá đơn mua hàng 1 triệu (không áp dụng với
                        các khuyến mãi khác)
                      </span>
                    </div>
                    <div className={cx("copycode")}>
                      <button
                        onClick={handleClick}
                        className={cx("buttonCopy")}
                      >
                        Sao chép mã
                      </button>
                    </div>
                  </div>
                </div>
                <div className={cx("itemPromotion")}>
                  <div className={cx("itemInnerPromotion")}>
                    <div title="Giao hàng cứ để Xoài lo">
                      <span className={cx("title")}>
                        Degrey giao hoả tốc tại Sài Gòn
                      </span>
                      <span className={cx("content")}>
                        Xoài bếu tặng ngay mã giảm giá phí ship. Áp dụng cho hoá
                        đơn 500.000 VNĐ
                      </span>
                    </div>
                    <div className={cx("copycode")}>
                      <button
                        onClick={handleClick}
                        className={cx("buttonCopy")}
                      >
                        Sao chép mã
                      </button>
                    </div>
                  </div>
                </div>
                <div className={cx("itemPromotion")}>
                  <div className={cx("itemInnerPromotion")}>
                    <div title="Giao hàng cứ để Xoài lo">
                      <span className={cx("title")}>Tặng 125.000đ</span>
                      <span className={cx("content")}>
                        Áp dụng đặc biệt cho đơn hàng từ 2,5 triệu đồng.
                      </span>
                    </div>
                    <div className={cx("copycode")}>
                      <button
                        onClick={handleClick}
                        className={cx("buttonCopy")}
                      >
                        Sao chép mã
                      </button>
                    </div>
                  </div>
                </div>
                <div className={cx("itemPromotion")}>
                  <div className={cx("itemInnerPromotion")}>
                    <div title="Giao hàng cứ để Xoài lo">
                      <span className={cx("title")}>Khuyến mãi đến 10%</span>
                      <span className={cx("content")}>
                        Mã giảm 10% cho hoá đơn mua hàng trên 5 triệu đồng
                      </span>
                    </div>
                    <div className={cx("copycode")}>
                      <button
                        onClick={handleClick}
                        className={cx("buttonCopy")}
                      >
                        Sao chép mã
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <Collection title={"BACKPACKS | BALO"} />
      </main>
      <Footer />
    </div>
  );
};

export default Home;