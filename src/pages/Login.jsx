import { Button, Card, Form, Input, Typography, message } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { cloudbase } from "@/utils/cloudbase";
import { setAccessToken } from "@/utils/token";

const { Title, Text } = Typography;

export default function Login() {
  const location = useLocation();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    const { username, password } = values;

    try {
      const auth = cloudbase.auth();
      const _res = await auth.signIn({
        username,
        password,
      });
      const storage = _res.cache.storage;
      // 凭证存储key：credentials_环境ID
      const credKey = Object.keys(storage).find((key) =>
        key.startsWith("credentials_"),
      );
      const { access_token } = JSON.parse(_res.cache.storage[credKey]);
      setAccessToken(access_token);
      message.success("登录成功");
      const to = location.state?.from || "/";
      navigate(to, { replace: true });
      return;
    } catch (err) {
      const msg = err?.error_description || "登录失败";
      message.error(msg);
    }
  };

  return (
    <div
      style={{
        minHeight: "100svh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
      }}
    >
      <Card style={{ width: 360 }}>
        <Title level={3} style={{ marginTop: 0 }}>
          登录
        </Title>
        <Text type="secondary">请输入账号密码登录</Text>

        <Form
          layout="vertical"
          style={{ marginTop: 16 }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="账号"
            name="username"
            rules={[{ required: true, message: "请输入账号" }]}
          >
            <Input placeholder="请输入账号" />
          </Form.Item>

          <Form.Item
            label="密码"
            name="password"
            rules={[{ required: true, message: "请输入密码" }]}
          >
            <Input.Password placeholder="请输入密码" />
          </Form.Item>

          <Button type="primary" htmlType="submit" block>
            登录
          </Button>
        </Form>
      </Card>
    </div>
  );
}
