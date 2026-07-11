import { GoogleLogin } from "@react-oauth/google";
import { loginWithGoogle } from "../api/auth.api";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const GoogleLoginButton = () => {
  const navigate = useNavigate();
  const { fetchCurrentUser } = useAuth();

  const handleSuccess = async (credentialResponse) => {
    try {
      const res = await loginWithGoogle(credentialResponse.credential);
      localStorage.setItem("token", res.data.token);

      await fetchCurrentUser();
      navigate("/dashboard");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex justify-center [&>div]:w-auto!">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => console.log("Login Failed")}
        theme="outline"
        shape="pill"
        size="medium"
        text="signin_with"
      />
    </div>
  );
};

export default GoogleLoginButton;