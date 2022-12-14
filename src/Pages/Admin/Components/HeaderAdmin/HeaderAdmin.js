/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Layout, Menu } from "antd";
import "antd/dist/antd.css";
import "antd/lib/modal/style/index.css";
import React, { useEffect, useState } from "react";
import {
  FcBarChart,
  FcBusinessman,
  FcInTransit,
  FcPaid,
  FcTrademark,
  FcOnlineSupport,
} from "react-icons/fc";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { loginSuccess, updateAdmin } from "../../../../redux/slice/authSlice";
import { getUser } from "../../../../redux/slice/userSlice";
import { createAxios } from "../../../../Utils/createInstance";
import Profile from "../../Components/Profile/Profile";
import "./Admin.scss";

const { Header, Sider, Content } = Layout;

const HeaderAdmin = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selected, setSelected] = useState("");
  const location = useLocation();
  const dispatch = useDispatch();
  const selectorUser = useSelector((state) => state.auth.login);
  let axiosJWT = createAxios(selectorUser, dispatch, loginSuccess);

  function getItem(label, key, icon, children, theme) {
    return {
      key,
      icon,
      children,
      label,
      theme,
    };
  }

  const items = [
    getItem(
      <NavLink to={"/admin/dashboard"}>Bảng điều khiển</NavLink>,
      "dashboard",
      <FcBarChart />
    ),
    getItem(
      <NavLink to={"/admin/users"}>Quản lý tài khoản</NavLink>,
      "users",
      <FcBusinessman />
    ),
    getItem(
      <NavLink to={"/admin/products"}>Quản lý sản phẩm</NavLink>,
      "products",
      <FcInTransit />
    ),
    getItem(
      <NavLink to={"/admin/orders"}>Quản lý đơn hàng</NavLink>,
      "orders",
      <FcPaid />
    ),
    getItem(
      <NavLink to={"/admin/chat"}>Hỗ trợ người dùng</NavLink>,
      "chats",
      <FcOnlineSupport />
    ),
    getItem(
      <a href="https://sandbox.vnpayment.vn/merchantv2/" target="_blank">
        Quản lý thanh toán
      </a>,
      "payment",
      <FcTrademark />
    ),
  ];

  const handleOnClick = (e) => {
    setSelected(e.key);
  };

  useEffect(() => {
    document.title = "VAGABOND - ADMIN";
    setSelected(
      location.pathname.split("/").length > 3
        ? location.pathname.split("/")[3]
        : location.pathname.split("/")[2]
    );
  }, [location]);

  useEffect(() => {
    (async () => {
      const res = await dispatch(
        getUser({
          id: selectorUser?._id,
          accessToken: selectorUser?.accessToken,
          axiosJWT,
        })
      );
      if (res.payload === undefined) {
        await dispatch(loginSuccess(null));
      } else {
        await dispatch(updateAdmin(res.payload));
      }
    })();
  }, [location]);

  return (
    <Layout>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        theme="light"
        width={200}
      >
        <div className="logoAdmin">
          <Link to={"/"} className="logo-link">
            <img
              src="https://pngroyale.com/wp-content/uploads/2022/04/Letter-V-PNG-Image-Background-.png"
              alt="img"
            />
            {collapsed === false && (
              <h1 style={{ transitionDelay: "1s", transitionDuration: "1s" }}>
                agabond
              </h1>
            )}
          </Link>
        </div>
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[selected]}
          onClick={handleOnClick}
          items={items}
        />
      </Sider>
      <Layout className="site-layout">
        <Header
          className="site-layout-background"
          style={{
            padding: 0,
            paddingRight: 10,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {React.createElement(
            collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
            {
              className: "trigger",
              onClick: () => setCollapsed(!collapsed),
            }
          )}
          <div
            style={{
              padding: "0 12px",
            }}
          >
            <Profile />
          </div>
        </Header>
        <Content
          className="site-layout-background"
          style={{
            margin: "24px",
            minHeight: "600px",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default HeaderAdmin;
