import React, { Suspense, useEffect, useState} from 'react';
import { connect } from 'react-redux';
import {
  HashRouter as Router,
  Route,
  Switch,
  Redirect
} from 'react-router-dom';
import { useAccount, useNetwork, useDisconnect } from 'wagmi'
import { Login, Logout, loginPending } from 'redux/actions';
import { IntlProvider } from 'react-intl';
import { filterTime } from 'views/TP-pages/TP-helpers/useTimeStamp';
import AppLocale from './lang';
import ColorSwitcher from './components/common/ColorSwitcher';
import { NotificationContainer } from './components/common/react-notifications';
import { isMultiColorActive } from './constants/defaultValues';
import { getDirection } from './helpers/Utils';

const OWNER_ID = process.env.REACT_APP_OWNER_ADDRESS.split(/, /)

const ViewOwnerPages = React.lazy(() =>
  import( './views/TP-pages/TP-views')
);

const ViewUserPages = React.lazy(() =>
  import( './views/TP-pages/TP-views/UserPages/UserPages')
);

const ViewGuestPages = React.lazy(() =>
  import( './views/TP-pages/TP-views/GuestPages/GuestPages')
);

const ViewGuestPagesPublished = React.lazy(() =>
  import( './views/TP-pages/TP-views/GuestPages/GuestPagesPublished')
);

const LoginP = React.lazy(() =>
  import( './views/TP-pages/Login')
);

const Post = React.lazy(() =>
import( './views/TP-pages/Post')
);

const Error = React.lazy(() =>
import( './views/error')
);

const App = ({ setLoginPending, wallet, setWallet, clearWallet, ...props}) => {
  const direction = getDirection();
  if (direction.isRtl) {
    document.body.classList.add('rtl');
    document.body.classList.remove('ltr');
  } else {
    document.body.classList.add('ltr');
    document.body.classList.remove('rtl');
  }
  const { address } = useAccount()  
  const { chain } = useNetwork()  
  const { disconnect } = useDisconnect()
  const magicApikey = process.env.REACT_APP_MAGIC_APIKEY;

  const judgeOwner = ()=>{
    let flag = false
    OWNER_ID.forEach(item=>{
    if(wallet && item.toLocaleLowerCase()===wallet.toLocaleLowerCase()){
      flag=true
    }})
    return flag
  }

  useEffect(()=>{
    if(chain){
      if(chain.id !== 1){
        alert("请在登录后将您的Metamask钱包网络设置为Ethereum！")
      }
    }
  },[chain])
  
  const [tokenOvertime, setTokenOvertime] = useState(true)
  
  useEffect(()=>{
    if(tokenOvertime && wallet && localStorage.getItem("token")){
      setTokenOvertime(false)
      const interval = setInterval(()=>{
        const a = new Date().getTime()
        const date = localStorage.getItem("token") ? new Date(JSON.parse(localStorage.getItem("token")).createdAt.toString()):null;
        const createdTime = localStorage.getItem("token") ? date.getTime():null
        if(createdTime){
          if(a-createdTime>=3600*1000){
            clearWallet();
            localStorage.clear();
            disconnect();
            alert('登录超时')
            clearInterval(interval)
            setTokenOvertime(true)
            window.location.replace("/#/login")          
          }
        }
        else{
          clearInterval(interval)
        }
      },1000)
    }
  })


  useEffect( async ()=>{
    if(localStorage.auth && JSON.parse(localStorage.auth).resource === 'magic-link'){
      setLoginPending({pending:true})
      setWallet(
        JSON.parse(localStorage.auth)
      )
    }
  },[])

  const { locale } = props;
  const currentAppLocale = AppLocale[locale];

  return (
    <div className="h-100">
      <IntlProvider
        locale={currentAppLocale.locale || "en-US"}
        messages={currentAppLocale.messages || ""}
      >
        <>
          <NotificationContainer />
          {isMultiColorActive && <ColorSwitcher />}
          <Suspense fallback={<div className="loading" />}>
            <Router>
              <Switch>
                {
                  judgeOwner()
                  ?
                  <Route
                    path="/owner"
                    render={ () => <ViewOwnerPages />}
                  />
                  :
                  null
                }
                <Route
                  path="/guest"
                  render={() => <ViewGuestPagesPublished/>}
                />
                <Route
                  path="/guest-published"
                  render={() => <ViewGuestPagesPublished/>}
                />
                <Route
                  path="/user"
                  render={() => <ViewUserPages/>}
                />
                <Route
                  path="/login"
                  exact
                  render={() => <LoginP/>}
                />
                <Route
                  path="/post/:id"
                  exact
                  render={() => <Post/>}
                />
                <Route
                  path="/error"
                  exact
                  render={() => <Error/>}
                />
                <Redirect exact from="/" to="/guest" />
              </Switch>
            </Router>
          </Suspense>
        </>
      </IntlProvider>
    </div>
    );
  }
  const mapDispatchToProps = (dispatch) => {
    return{
      setWallet: (object)=>{
         dispatch(Login(object))
     },
     clearWallet: ()=>{
       dispatch(Logout())
     },
     setLoginPending: (object)=>{
         dispatch(loginPending(object))
     }
    }
  };

const mapStateToProps = (state) => {
  const { locale } = state.settings;
  return { 
    locale,
    wallet:state.auth.wallet,
    loginPendingState : state.loginPending
  };
};

const mapActionsToProps = {};
export default connect(mapStateToProps, mapDispatchToProps)(App);
