import React,{useState} from 'react'
import { Row, Nav, NavItem, NavLink, Dropdown, DropdownMenu, DropdownItem, DropdownToggle, Spinner} from 'reactstrap';
import classnames from 'classnames';
import { Colxx } from 'components/common/CustomBootstrap';
import { useDisconnect } from 'wagmi';
import { withRouter } from 'react-router-dom';
import { Login, Logout, loginPending } from 'redux/actions';
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
        dropdownBasicOpen,
        setDropdownBasicOpen,
        activeTab,
        setActiveTab,
        postAuth,
        post,
        owner
    } = props
    const [ copied, setCopied] = useState(false) 
    const handleCopy = () => {
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
        <div className='guest_header'>
            <div className="container h-100 guest_header_box d-flex justify-content-between">
                <Row className='h-100 m-0 p-0 guest_header_information'>
                    <Colxx xxs="12" lg="6" className="h-100">
                        <div className='d-flex h-100 align-items-center'>
                        <img src={logo} alt="" className='guest_header_logo'/>
                        <div className="d-flex guest_header_info">
                            <div className='m-0 p-0 d-flex justify-content-between guest_header_info_subinfo h-100'>
                            <h1 className='ml-4 mb-0 mt-2 p-0'>EICO</h1>
                            <h5 className='font-weight-light ml-4 mb-2 d-flex align-items-end'>eico.forging.one</h5>
                            </div>
                        </div>
                        </div> 
                    </Colxx>
                    <Colxx xxs="12" lg="6" className="d-flex align-items-end h-100 w-100">
                    <div className='guest_header_right d-flex align-items-between w-100'>
                        <div className="guest_header_right_subdiv d-flex justify-content-end w-100">
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
                            className='pl-4 pr-4 m-0 guest_header_email font-weight-light d-flex justify-content-center align-items-center'
                            >
                                <h5 className="d-flex justify-content-center align-items-center m-0">
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
                                <DropdownItem name="logout" onClick={()=>{
                                handleLogout()
                                if(owner){
                                    props.history.push('/')
                                }}}>
                                Logout
                                </DropdownItem>
                            </DropdownMenu>
                            </Dropdown>
                            :
                            <button type="button" 
                            onClick={()=>{
                                if(!loginPendingState.pending){
                                    props.history.push('/login')
                                }
                            }} 
                            className='m-0 p-0 guest_header_email d-flex justify-content-center align-items-center'>
                                <h5 className='pl-4 pr-4 mb-0'>
                                {
                                    loginPendingState.pending 
                                    ? 
                                    <>
                                        <Spinner color="primary" className="mb-1" style={{height:"20px", width:"20px"}}/>
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
                        <div className='guest_header_right_subdiv' style={{display: post ? "none":"flex"}}>
                        <Nav tabs className="separator-tabs ml-0 mb-0">
                            <NavItem className='h-100'>
                            <NavLink
                            className={classnames({
                            active: activeTab === 'Post',
                            'nav-link': true,
                            })}
                            onClick={() => setActiveTab('Post')}
                            to="#"
                            location={{}}
                            >
                                <h5 className='font-weight-bold d-flex justify-content-center w-100'>
                                <i className={postAuth ? '':'simple-icon-lock mr-2'}/>
                                Post
                                </h5>
                            </NavLink>
                            </NavItem>
                            <NavItem className='h-100'>
                            <NavLink
                            className={classnames({
                            active: activeTab === 'NFT',
                            'nav-link': true,
                            })}
                            onClick={() => setActiveTab('NFT')}
                            to="#"
                            location={{}}
                            >
                                <h5 className='font-weight-bold d-flex justify-content-center w-100'>
                                NFT
                                </h5>
                            </NavLink>
                            </NavItem>
                            <NavItem className='h-100'>
                            <NavLink
                                className={classnames({
                                active: activeTab === 'About',
                                'nav-link': true,
                                })}
                                onClick={() => setActiveTab('About')}
                                to="#"
                                location={{}}
                            >
                                <h5 className='font-weight-bold d-flex justify-content-center w-100'>
                                About
                                </h5>
                            </NavLink>
                            </NavItem>
                        </Nav>
                        </div>
                    </div>
                    </Colxx>
                </Row>
                <div className={post?'background_light_post':'background_light'}/>
            </div>
        </div>
        :
        <div className='guest_header'>
            <div className="h-100 guest_header_box d-flex justify-content-between">
                <Row className='h-100 m-0 p-0 guest_header_information'>
                    <Colxx xxs="6"className="" style={{height:"66.7%"}}>
                        <div className='d-flex h-100 align-items-center'>
                            <img src={logo} alt="" className='guest_header_logo'/>
                            <div className="d-flex guest_header_info">
                                <div className='m-0 p-0 d-flex justify-content-between guest_header_info_subinfo h-100'>
                                <h1 className='ml-4 mb-0 mt-2 p-0'>EICO</h1>
                                <h5 className='font-weight-light ml-4 mb-2 d-flex align-items-end'>eico.forging.one</h5>
                                </div>
                            </div>
                        </div> 
                    </Colxx>
                    <Colxx xxs="6" className="d-flex align-items-end" style={{height:"66.7%"}}>
                    <div className='guest_header_right d-flex align-items-between w-100'>
                        <div className="guest_header_right_subdiv d-flex justify-content-end w-100">
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
                                className='pl-4 pr-4 m-0 guest_header_email font-weight-light d-flex justify-content-center align-items-center'
                                >
                                    <h5 className="d-flex justify-content-center align-items-center m-0">
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
                                    <DropdownItem name="logout" onClick={()=>{
                                    handleLogout()
                                    if(owner){
                                        props.history.push('/')
                                    }}}>
                                    Logout
                                    </DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                            :
                            <button type="button" 
                            onClick={()=>{
                                if(!loginPendingState.pending){
                                    props.history.push('/login')
                                }
                            }} 
                            className='m-0 p-0 guest_header_email d-flex justify-content-center align-items-center'>
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
                    </div>
                    </Colxx>
                    <Colxx xxs="12" className="align-items-end justify-content-center justify-content-center justify-content-sm-start m-0 p-0 ml-sm-5" style={{display: post ? "none":"flex"}}>
                        <div className='guest_header_right_subdiv'>
                            <Nav tabs className="separator-tabs ml-0 mb-0">
                                <Row className='p-0 m-0'>
                                    <Colxx xxs="4">
                                        <NavItem className='h-100'>
                                            <NavLink
                                                className={classnames({
                                                active: activeTab === 'Post',
                                                'nav-link': true,
                                                })}
                                                onClick={() => setActiveTab('Post')}
                                                to="#"
                                                location={{}}
                                            >
                                                <h5 className='font-weight-bold d-flex justify-content-center w-100 p-0 m-0'>
                                                <i className={postAuth ? '':'simple-icon-lock mr-2'}/>
                                                Post
                                                </h5>
                                            </NavLink>
                                        </NavItem>
                                    </Colxx>
                                    <Colxx xxs="4">
                                        <NavItem className='h-100'>
                                            <NavLink
                                                className={classnames({
                                                active: activeTab === 'NFT',
                                                'nav-link': true,
                                                })}
                                                onClick={() => setActiveTab('NFT')}
                                                to="#"
                                                location={{}}
                                            >
                                                <h5 className='font-weight-bold d-flex justify-content-center w-100 p-0 m-0'>
                                                NFT
                                                </h5>
                                            </NavLink>
                                        </NavItem>
                                    </Colxx>
                                    <Colxx xxs="4">
                                        <NavItem className='h-100'>
                                            <NavLink
                                                className={classnames({
                                                active: activeTab === 'About',
                                                'nav-link': true,
                                                })}
                                                onClick={() => setActiveTab('About')}
                                                to="#"
                                                location={{}}
                                            >
                                                <h5 className='font-weight-bold d-flex justify-content-center w-100 p-0 m-0'>
                                                About
                                                </h5>
                                            </NavLink>
                                        </NavItem>
                                    </Colxx>
                                </Row>
                            </Nav>
                        </div>
                    </Colxx>
                </Row>
                <div className={post?'background_light_post':'background_light'}/>
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