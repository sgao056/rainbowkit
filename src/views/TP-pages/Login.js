import React, {useState, useEffect} from 'react'
import { Button, Input, Spinner, Modal, Card } from 'reactstrap';
import { Login, Logout, loginPending } from 'redux/actions'
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { useAccount, useBalance } from 'wagmi';
import { Network, Alchemy } from "alchemy-sdk";
import { MagicAuthConnector } from '@everipedia/wagmi-magic-connector';
import Metamask from "assets/img/wallets/metamaskWallet.png";
import './TP-scss/login.scss'

const tokenAddress = process.env.REACT_APP_TOKEN_ADDRESS;
const magicApikey = process.env.REACT_APP_MAGIC_APIKEY;
const alchemyApikey = process.env.REACT_APP_ALCHEMY_APIKEY;

const settings = {
  apiKey: alchemyApikey,
  network: Network.ETH_MAINNET
};

const alchemy = new Alchemy(settings);

function LoginPage({
  wallet,
  setWallet,
  setLoginPending,
  ...props
}) {

  const { data:balance }  = useBalance();
  const { isConnecting, isConnected, address } = useAccount();
  const [ email, setEmail ] = useState("");
  const [ pending, setPending ] = useState(false);
  const [ resource, setResource ] = useState(null)

  const loginMagic = async () => {
    // setPending(true)
    // setResource("magic-link")
    // await authenticate({
    //   provider: "magicLink",
    //   email,
    //   apiKey: magicApikey,
    //   network: "mainnet"
    // })
    // .then(async (item)=>{
    //   if(item){
    //     const signatureData = item.attributes.authData.moralisEth
    //     signatureData.data = signatureData.data.replace(/\n/g,"%5Cn")
    //     fetch(`http://localhost:8080/secret?signature=${signatureData.signature}&data=${signatureData.data}`,{
    //       method:"POST"
    //     })
    //     .then(res=>res.json())
    //     .then(res=>{
    //       const createTime = new Date()
    //       localStorage.setItem("token",JSON.stringify({token:res.accessToken,createdAt:filterTime(createTime)}))
    //     })
    //     props.history.push('/guest')
    //   }
    //   else{
    //     alert("You need to sign, please try again!")
    //   }
    // })
    // .catch(()=>{
    //   alert("System inner problem!")
    // })
  };

  const loginRainbowKit = async (connectorId) => {
  //  if(!window.ethereum){
  //     alert('MetaMask need to be installed!');
  //   }
  //   else{
  //     setResource("Rainbowkit")
  //     setEmail('')
  //     await authenticate({ 
  //       provider: connectorId,
  //       signingMessage:"Please sign here to login by your metamask wallet!"
  //     })
  //     .then(async (item)=>{
  //       if(item){
  //         const signatureData = item.attributes.authData.moralisEth
  //         signatureData.data = signatureData.data.replace(/\n/g,"%5Cn")
  //         fetch(`http://localhost:8080/secret?signature=${signatureData.signature}&data=${signatureData.data}`,{
  //           method:"POST"
  //         })
  //         .then(res=>res.json())
  //         .then(res=>{
  //           const createTime = new Date().toUTCString()
  //           localStorage.setItem("token",JSON.stringify({token:res.accessToken,createdAt:createTime}))
  //         })
  //         props.history.push('/guest')
  //       }
  //       else{
  //         alert("You need to sign, please try again!")
  //       }
  //     })
  //   }
  }

  const checkList = async () => {
    setLoginPending({pending:true})
    let number = 0
    const totalArray = await alchemy.nft.getNftsForOwner(address)
    if(totalArray.totalCount!==100 && !totalArray.pageKey){
      totalArray.ownedNfts.forEach(item=>{
        if(item.contract.address.toLocaleLowerCase() === tokenAddress){
          number += 1
        }
      })  
    }

    fetch('http://localhost:8080/holders',{
        method:"GET"
    })
    .then(response=>response.json())
    .then(async response => {
      let flag = null
      response.forEach((item)=>{
        if(item.wallet.toLowerCase() === address.toLowerCase()){
          flag = item.id
        }
      })
      if(!flag){
        fetch("http://localhost:8080/holders",{
            method:"POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${JSON.parse(localStorage.getItem('token')).token}`
            },
            body: JSON.stringify(
              {
                wallet: address,
                email,
                resource,
                holdingNumbers: number,
                claimed:false,
              }
            )
          })
        .then(res=>res.json())
        .then((result)=>{
          fetch(`http://localhost:8080/holders/`,{
            method:"GET",
            headers: {
              "Content-Type": "application/json"
            }
          })
          .then(res=>res.json())
          .then(
            res=>{
              res.forEach(item=>{
                if(item.wallet.toLowerCase() === address.toLowerCase()){
                  flag = item.id
                }
              })
              setWallet({
                wallet:address,
                email,
                balance,
                resource,
                claimed:false,
                id:flag
              })
            }
          )
               
        })
        .then(()=>setLoginPending({pending:false})
        )
        
      }
      else{
        fetch(`http://localhost:8080/holders/${flag}`,{
          method:"GET",
          headers: {
            "Content-Type": "application/json"
          }
        })
        .then(res=>res.json())
        .then(
          (res)=>{
            fetch(`http://localhost:8080/holders/${flag}`,{
              method:"PUT",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${JSON.parse(localStorage.getItem('token')).token}`
              },
              body: JSON.stringify(
                {
                  ...res,
                  holdingNumbers: number
                }
              )
            })
            .then(result=>result.json())
            .then((result)=>{
              setWallet({
                wallet:address,
                email,
                balance,
                resource,
                claimed:result.claimed,
                id:flag
              })}
            )
            .then(()=>setLoginPending({pending:false}))
            
          }
        )
        
      }
    })
    .catch(()=>alert('Please link to database!'))
  }

  useEffect(async ()=>{
    if(isConnected && address){
      localStorage.setItem("auth", JSON.stringify({
        wallet:address,
        email,
        balance,
        resource,
        claimed:wallet.claimed,
        id:wallet.id
      }));
      await checkList();
    }
  },[isConnected])

  useEffect(()=>{
    if(localStorage.getItem("auth")){
      props.history.push('/guest')
    }
  },[])

  return (
    <div className='d-flex justify-content-center align-items-center login'>
      <Modal
        isOpen={pending}
        className='d-flex justify-content-center align-items-center login'
      >
        <Card 
          className='d-flex justify-content-center align-items-center'
          style={{
            height:"200px", 
            width:"200px", 
            position:"relative",
            top:"0",
            bottom:"0",
            left:"0",
            right:"0",
        }}>
          <Spinner color="primary" className="mb-1" style={{height:"50px", width:"50px"}}/>
          <h1 style={{color:"#ffffff", marginTop:"20px"}}>Loading...</h1>  
        </Card>
      </Modal>
      <div className="login_box d-flex align-items-center justify-content-center pt-3 pb-4 pl-4 pr-4 m-5 login_true">
        <div className='w-100 d-flex justify-content-center login_box_items font-weight-bold' style={{color:"black", fontSize:"28px"}}>
          Login
        </div>
        <Input 
          className='login_input w-100 login_box_items'
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <Button className='login_create_account w-100 ' onClick={loginMagic} disabled={isConnecting}>
          <h5 className="m-0 p-0">
            Login by email
          </h5>
        </Button>
        <div className='d-flex justify-content-center align-items-center w-100' style={{margin:"10px 0"}}>    
          <h4 className='m-0'>OR</h4>
        </div>
        <Button 
          className='login_metamask w-100 d-flex align-items-center jsutify-content-between' 
          onClick={loginRainbowKit} 
          disabled={isConnecting}
        >
            <img className='login_metamask_icon' src={Metamask} alt="" />
            {
              window.innerWidth >= 992
              ?
              <h5 className='m-0 p-0 w-100 d-flex justify-content-center align-items-center'>
                Login Using MetaMask
              </h5>
              :
              <h5 className='m-0 p-0 w-100 d-flex justify-content-center align-items-center'>
                MetaMask
              </h5>
            }
            <i className="simple-icon-arrow-right font-weight-bold"/>
        </Button>
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
    wallet : state.auth
  }
};


export default connect(mapStateToProps, mapDispatchToProps)(withRouter(LoginPage))