import Oidc from "oidc-client";
import React from "react";
import CircularProgress from '@mui/material/CircularProgress';

class Home extends React.Component
{   
    constructor(props) {
        super(props);
        this.state={
            username:'',
            email:'',
            empid:'',
        };
        Oidc.Log.logger = console;
        Oidc.Log.level = Oidc.Log.DEBUG;
        console.log("Using oidc-client version: ", Oidc.Version);

        var url = window.location.origin;

        // var settings = {
        //   authority: 'https://ping-sso-uat.schneider-electric.com/',
        //   client_id: 'CustomAppsProcodeDev',
        //   redirect_uri: 'http://d12xt3m2ds6e9p.cloudfront.net/oidc-callback',
        //   response_type: 'code',
        //   scope: 'openid profile email',
        //   automaticSilentRenew:false,
        //   validateSubOnSilentRenew: true,
        //   monitorAnonymousSession : true,
        //   filterProtocolClaims: true,
        //   loadUserInfo: false,
        //   revokeAccessTokenOnSignout : true,
        //   metadata: {"revocation_endpoint" : "https://2yb7totcb0-vpce-09be63e6f1f2d3917.execute-api.eu-west-1.amazonaws.com/dev/ping-auth/logout","issuer":"https://ping-sso-uat.schneider-electric.com","authorization_endpoint": "https://ping-sso-uat.schneider-electric.com/as/authorization.oauth2","token_endpoint": "https://2yb7totcb0-vpce-09be63e6f1f2d3917.execute-api.eu-west-1.amazonaws.com/dev/ping-auth","userinfo_endpoint":"https://2yb7totcb0-vpce-09be63e6f1f2d3917.execute-api.eu-west-1.amazonaws.com/dev/ping-userinfo", "authority": "https://ping-sso-uat.schneider-electric.com/", "clientId": "CustomAppsProcodeDev", "clientSecret": "R3GAnSBYhurJXtCX7rb5NbozKzI5Nk554RNZ4nIiChvw6diFLyoauzfhlrNyU1Nv", "redirectUri": "http://d12xt3m2ds6e9p.cloudfront.net/oidc-callback", "popupRedirectUri": "http://d12xt3m2ds6e9p.cloudfront.net/oidc-callback", "responseType": "code", "loadUserInfo":false,"scope": "openid profile email", "automaticSilentRenew": false, "silentRedirectUri": "http://d12xt3m2ds6e9p.cloudfront.net/oidc-callback"}
        // };
        // this.mgr = new Oidc.UserManager(settings);
    }

    // componentDidMount() {
    //     console.log("Ashwathi: Home.js componentdidmount");
    //     var someState = {message:Date.now() + "_Ashwathi"};
    //     this.mgr.signinRedirect({state:someState, useReplaceToNavigate:true}).then(function() {
    //         console.log("Ashwathi: signinRedirect done" + someState);
    //     }).catch(function(err) {
    //         console.log(err);
    //     });
    // }

    loginRedirect= () => {

        var settings = {
            authority: 'https://ping-sso-uat.schneider-electric.com/',
            client_id: 'CustomAppsProcodeDev',
            redirect_uri: 'http://d12xt3m2ds6e9p.cloudfront.net/oidc-callback',
            response_type: 'code',
            scope: 'openid profile email',
            automaticSilentRenew:false,
            validateSubOnSilentRenew: true,
            monitorAnonymousSession : true,
            filterProtocolClaims: true,
            loadUserInfo: false,
            revokeAccessTokenOnSignout : true,
            metadata: {"revocation_endpoint" : "https://2yb7totcb0-vpce-09be63e6f1f2d3917.execute-api.eu-west-1.amazonaws.com/dev/ping-auth/logout","issuer":"https://ping-sso-uat.schneider-electric.com","authorization_endpoint": "https://ping-sso-uat.schneider-electric.com/as/authorization.oauth2","token_endpoint": "https://2yb7totcb0-vpce-09be63e6f1f2d3917.execute-api.eu-west-1.amazonaws.com/dev/ping-auth","userinfo_endpoint":"https://2yb7totcb0-vpce-09be63e6f1f2d3917.execute-api.eu-west-1.amazonaws.com/dev/ping-userinfo", "authority": "https://ping-sso-uat.schneider-electric.com/", "clientId": "CustomAppsProcodeDev", "clientSecret": "R3GAnSBYhurJXtCX7rb5NbozKzI5Nk554RNZ4nIiChvw6diFLyoauzfhlrNyU1Nv", "redirectUri": "http://d12xt3m2ds6e9p.cloudfront.net/oidc-callback", "popupRedirectUri": "http://d12xt3m2ds6e9p.cloudfront.net/oidc-callback", "responseType": "code", "loadUserInfo":false,"scope": "openid profile email", "automaticSilentRenew": false, "silentRedirectUri": "http://d12xt3m2ds6e9p.cloudfront.net/oidc-callback"}
          };
        
          //this.mgr = new Oidc.UserManager(settings);

        console.log("Ashwathi: Home.js loginRedirect");
        var someState = {message:Date.now() + "_Ashwathi"};
        new Oidc.UserManager(settings).signinRedirect({state:someState, useReplaceToNavigate:true}).then(function() {
            console.log("Ashwathi: signinRedirect done" + someState);
        }).catch(function(err) {
            console.log(err);
        });
    }

    render(){
        return (
            <div>
                {/* <CircularProgress /> */}
                <button onClick={this.loginRedirect}>Login</button>
            </div>
            
        );
    }  

}
  
export default Home;