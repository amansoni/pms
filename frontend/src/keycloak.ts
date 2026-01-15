import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  url: 'http://localhost:8080',
  realm: 'mental-health-realm',
  clientId: 'assessment-app',
});

export default keycloak;
