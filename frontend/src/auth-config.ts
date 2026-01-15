import { AuthProviderProps } from "react-oidc-context";

const authConfig: AuthProviderProps = {
  authority: "http://localhost:8080/realms/mental-health-realm",
  client_id: "assessment-app",
  redirect_uri: "http://localhost:3000",
  post_logout_redirect_uri: "http://localhost:3000",
  response_type: "code",
  scope: "openid profile email",
  automaticSilentRenew: true,
};

export default authConfig;
