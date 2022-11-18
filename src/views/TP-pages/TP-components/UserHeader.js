import React, { useState } from 'react'
import {
    Row,
    Nav, 
    NavItem,
    NavLink,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    DropdownToggle,
    Spinner
  } from 'reactstrap';
import Blockies from 'react-blockies';
import classnames from 'classnames';
import { Colxx } from 'components/common/CustomBootstrap';
import { withRouter } from 'react-router-dom';
import { Login, Logout, loginPending } from 'redux/actions';
import { useDisconnect } from 'wagmi';
import logo from 'assets/img/portal/eicoLogo.jpg';
import { connect } from 'react-redux';


function GuestHeader({loginPendingState, wallet, setWallet, clearWallet, ...props}) {
    const { disconnectAsync } = useDisconnect()
    const handleLogout = async () => {
        if(window.confirm("Are you sure you want to logout?")===true){
            await disconnectAsync().then(
                ()=>{
                    clearWallet();
                    localStorage.clear();        
                }
            );
        }
    } 
    const {
        nftList,
        dropdownBasicOpen,
        setDropdownBasicOpen,
        activeTab,
        setActiveTab
    } = props
    const [ copied, setCopied] = useState(false) 
    const handleCopy = (e) => {
        navigator.clipboard.writeText(wallet.wallet);
        setCopied(true);
        setInterval(()=>{
            setCopied(false)
        },5000);
        clearInterval();
    }
    return (
        window.innerWidth >= 992 
        ? 
        <div className='user_header'>
            <div className="h-100 container user_header_box d-flex justify-content-between">
            <Row className='h-100 m-0 p-0'>
                <Colxx xxs="12" lg="6" className="h-100">
                <div className='d-flex align-items-center user_header_logo_box'>
                    {
                    wallet.wallet
                    ?
                    <Blockies
                        seed= {wallet.wallet}
                        size={10} 
                        scale={10} 
                        color="#dfe" 
                        bgColor="#abf" 
                        spotColor="#abc" 
                        className="user_header_portrait" 
                    />
                    :
                    <div className="user_header_portrait" style={{backgroundColor:"white"}}/>
                    }
                    <div className="d-flex user_header_info">
                        <div className='ml-4 p-0 d-flex justify-content-between user_header_info_subinfo h-100'>
                            <h1 className='ml-0 ml-lg-4 mb-0 mt-2 p-0'>
                            {
                                wallet.email 
                                ? 
                                <>
                                    <span>{wallet.email.substring(0,4)}</span>
                                    <span>...{wallet.email.slice(-4)}</span>                           
                                </> 
                                : 
                                "No linked email"
                            }
                            </h1>
                            {
                            wallet.wallet
                            ?
                            <h5 className='font-weight-light ml-0 ml-lg-4 mb-2 d-flex align-items-end'>
                                <span>{wallet.wallet.substring(0,4)}</span>
                                <span>...{wallet.wallet.slice(-4)}</span>
                            </h5>
                            :
                            <h5 className='font-weight-light ml-0 ml-lg-4 mb-2 d-flex align-items-end'>
                                Connect your wallet first!
                            </h5>
                            }
                        </div>
                    </div>
                </div> 
                </Colxx>
                <Colxx xxs="12" lg="6" className="d-flex align-items-end h-100 w-100">
                <div className='user_header_right d-flex align-items-between w-100'>
                    <div className="user_header_right_subdiv d-flex justify-content-end w-100">
                    {
                        wallet.wallet
                        ?
                        <Dropdown
                        isOpen={dropdownBasicOpen}
                        toggle={(e) => {
                            if(e.target.name === 'copy' || e.target.nodeName === "DIV" || e.target.nodeName === "I" ){
                                return;
                            }
                            setDropdownBasicOpen(!dropdownBasicOpen)
                        }}>
                        <DropdownToggle 
                        caret 
                        className='pl-4 pr-4 m-0 user_header_email font-weight-light d-flex justify-content-center align-items-center'
                        >
                            <h5 className="d-flex justify-content-center align-items-center m-0 p-0">
                            {
                                wallet.email 
                                ? 
                                <div>
                                    <span>{wallet.email.substring(0,4)}</span>
                                    <span>...{wallet.email.slice(-4)}</span>
                                </div>  
                                :
                                <div>
                                    <span>{wallet.wallet.substring(0,4)}</span>
                                    <span>...{wallet.wallet.slice(-4)}</span>
                                </div> 
                            }
                            </h5>
                        </DropdownToggle>
                        <DropdownMenu className="w-100">
                            <DropdownItem name="copy" onClick={handleCopy}>
                            {
                                copied 
                                ?
                                <>
                                    <i className='simple-icon-check'/> Copied!                                                                    
                                </>
                                : 
                                <>
                                    <div style={{display:"inline"}}>Copy: </div>
                                    <div style={{display:"inline"}}>{wallet.wallet.substring(0,4)}</div>
                                    <div style={{display:"inline"}}>...{wallet.wallet.slice(-4)}</div>
                                    &nbsp;
                                    <i name="copy" className='simple-icon-docs'/> 
                                </>
                            }
                            </DropdownItem>
                            <DropdownItem name="homepage" onClick={()=>{props.history.push('/')}}>
                            Homepage
                            </DropdownItem>
                            <DropdownItem name="account" onClick={()=>{props.history.push('/user')}}>
                            My account
                            </DropdownItem>
                            <DropdownItem name="logout" onClick={handleLogout}>
                            Logout
                            </DropdownItem>
                        </DropdownMenu>
                        </Dropdown>
                        :
                        <button type="button" onClick={()=>{
                            if(!loginPendingState.pending){
                                props.history.push('/login')
                            }
                        }}  
                        className='m-0 p-0 user_header_email d-flex justify-content-center align-items-center'>
                            <h5 className='pl-4 pr-4 mb-0'>
                                {
                                    loginPendingState.pending 
                                    ? 
                                    <>
                                        <Spinner color="primary" className="mb-1" style={{height:"20px", width:"20px"}}/>&nbsp;
                                    </>
                                    :
                                    <>
                                        Login
                                    </>
                                }
                            </h5>
                        </button>
                    }
                    </div>
                    <div className='user_header_right_subdiv'>
                    <Nav tabs className="separator-tabs ml-0 mb-0">
                        <NavItem className='h-100'>
                        <NavLink
                            className={classnames({
                            active: activeTab === 'Collection',
                            'nav-link': true,
                            })}
                            onClick={() => setActiveTab('Collection')}
                            to="#"
                            location={{}}
                        >
                            <h5 className='font-weight-bold d-flex justify-content-center w-100'>
                            Collection({nftList ? nftList.length : 0})
                            </h5>
                        </NavLink>
                        </NavItem>
                        <NavItem className='h-100'>
                        <NavLink
                            className={classnames({
                            active: activeTab === 'Account',
                            'nav-link': true,
                            })}
                            onClick={() => setActiveTab('Account')}
                            to="#"
                            location={{}}
                        >
                            <h5 className='font-weight-bold d-flex justify-content-center w-100'>
                            Account & Wallet
                            </h5>
                        </NavLink>
                        </NavItem>
                    </Nav>
                    </div>
                </div>
                </Colxx>
            </Row>
            <div 
                style={{
                height:"20vw",
                width:"60vw",
                borderRadius:"0 0 300px 300px",
                position:"absolute",
                top:"100px",
                right:"0",
                // zIndex:"100",
                backgroundImage:"radial-gradient(ellipse farthest-side at top, rgba(80, 154, 185, 1),rgba(52, 58, 64, 0.2), rgba(52, 58, 64, 0))",
                }}
            /> 
            </div>
        </div>
        :
        <div className='user_header'>
            <div className="h-100 user_header_box d-flex justify-content-between">
                <Row className='h-100 m-0 p-0'>
                    <Colxx xxs="12">
                        <div className="user_header_subdiv d-flex justify-content-end w-100">
                        {
                            wallet.wallet
                            ?
                            <Dropdown
                            isOpen={dropdownBasicOpen}
                            toggle={(e) => {
                                if(e.target.name === 'copy' || e.target.nodeName === "DIV" || e.target.nodeName === "I" ){
                                    return;
                                }
                                setDropdownBasicOpen(!dropdownBasicOpen)
                            }}>
                            <DropdownToggle 
                            caret 
                            className='pl-4 pr-4 m-0 user_header_email font-weight-light d-flex justify-content-center align-items-center'
                            >
                                <h5 className="d-flex justify-content-center align-items-center m-0 p-0">
                                {
                                wallet.email 
                                ? 
                                <div>
                                    <span>{wallet.email.substring(0,4)}</span>
                                    <span>...{wallet.email.slice(-4)}</span>
                                </div>  
                                :
                                <div>
                                    <span>{wallet.wallet.substring(0,4)}</span>
                                    <span>...{wallet.wallet.slice(-4)}</span>
                                </div> 
                                }
                                </h5>
                            </DropdownToggle>
                            <DropdownMenu className="w-100">
                                <DropdownItem name="copy" onClick={handleCopy}>
                                {
                                    copied 
                                    ?
                                    <>
                                        <i className='simple-icon-check'/> Copied!                                                                    
                                    </>
                                    : 
                                    <>
                                        <div style={{display:"inline"}}>Copy: </div>
                                        <div style={{display:"inline"}}>{wallet.wallet.substring(0,4)}</div>
                                        <div style={{display:"inline"}}>...{wallet.wallet.slice(-4)}</div>
                                        &nbsp;
                                        <i name="copy" className='simple-icon-docs'/> 
                                    </>
                                }
                                </DropdownItem>
                                <DropdownItem name="homepage" onClick={()=>{props.history.push('/')}}>
                                Homepage
                                </DropdownItem>
                                <DropdownItem name="account" onClick={()=>{props.history.push('/user')}}>
                                My account
                                </DropdownItem>
                                <DropdownItem name="logout" onClick={handleLogout}>
                                Logout
                                </DropdownItem>
                            </DropdownMenu>
                            </Dropdown>
                            :
                            <button type="button" onClick={()=>{
                                if(!loginPendingState.pending){
                                    props.history.push('/login')
                                }
                            }} 
                            className='m-0 p-0 user_header_email d-flex justify-content-center align-items-center'>
                                <h5 className='pl-4 pr-4 mb-0'>
                                {
                                        loginPendingState.pending 
                                        ? 
                                        <>
                                            <Spinner color="primary" className="mb-1" style={{height:"16px", width:"16px"}}/>&nbsp;
                                        </>
                                        :
                                        <>
                                            Login
                                        </>
                                    }
                                </h5>
                            </button>
                        }
                        </div>
                    </Colxx>
                    <Colxx xxs="12" style={{height:"50px"}}>
                    <div className='d-flex align-items-center user_header_logo_box'>
                        {
                        wallet.wallet
                        ?
                        <Blockies
                            seed= {wallet.wallet}
                            size={10} 
                            scale={10} 
                            color="#dfe" 
                            bgColor="#abf" 
                            spotColor="#abc" 
                            className="user_header_portrait" 
                        />
                        :
                        <div className="user_header_portrait" style={{backgroundColor:"white"}}/>
                        }
                        <div className="d-flex user_header_info">
                            <div className='m-0 p-0 d-flex justify-content-between user_header_info_subinfo h-100'>
                                <h1 className='ml-0 ml-lg-4 mb-0 mt-1 p-0'>
                                    {
                                    wallet.email 
                                    ? 
                                    <>
                                        <span>{wallet.email.substring(0,4)}</span>
                                        <span>...{wallet.email.slice(-4)}</span>                           
                                    </> 
                                    : 
                                    "No linked email"
                                    }
                                </h1>
                                {
                                wallet.wallet
                                ?
                                <h5 className='font-weight-light ml-0 ml-lg-4 mb-1 d-flex align-items-end'>
                                    <span>{wallet.wallet.substring(0,4)}</span>
                                    <span>...{wallet.wallet.slice(-4)}</span>
                                </h5>
                                :
                                <h5 className='font-weight-light ml-0 ml-lg-4 mb-2 d-flex align-items-end'>
                                    connect your wallet first!
                                </h5>
                                }
                            </div>
                        </div>
                    </div> 
                    </Colxx>
                    <Colxx xxs="12" className="d-flex align-items-end w-100">
                        <div className='user_header_right d-flex align-items-between w-100'>
                            <div className='user_header_right_subdiv h-100'>
                                <Nav tabs className="separator-tabs ml-0 mb-0">
                                    <NavItem className='h-100'>
                                    <NavLink
                                        className={classnames({
                                        active: activeTab === 'Collection',
                                        'nav-link': true,
                                        })}
                                        onClick={() => setActiveTab('Collection')}
                                        to="#"
                                        location={{}}
                                    >
                                        <h5 className='font-weight-bold d-flex justify-content-center w-100'>
                                        Collection({nftList ? nftList.length : 0})
                                        </h5>
                                    </NavLink>
                                    </NavItem>
                                    <NavItem className='h-100'>
                                    <NavLink
                                        className={classnames({
                                        active: activeTab === 'Account',
                                        'nav-link': true,
                                        })}
                                        onClick={() => setActiveTab('Account')}
                                        to="#"
                                        location={{}}
                                    >
                                        <h5 className='font-weight-bold d-flex justify-content-center w-100'>
                                        Account & Wallet
                                        </h5>
                                    </NavLink>
                                    </NavItem>
                                </Nav>
                            </div>
                        </div>
                    </Colxx>
                </Row>
                <div 
                style={{
                height:"20vw",
                width:"60vw",
                borderRadius:"0 0 300px 300px",
                position:"absolute",
                top:"150px",
                right:"0",
                backgroundImage:"radial-gradient(ellipse farthest-side at top, rgba(80, 154, 185, 1),rgba(52, 58, 64, 0.2), rgba(52, 58, 64, 0))",
                }}
                /> 
            </div>
        </div>
    )
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
    return {
      wallet : state.auth,
      loginPendingState : state.loginPending
    }
  };
  
  
  export default connect(mapStateToProps, mapDispatchToProps)(withRouter(GuestHeader))