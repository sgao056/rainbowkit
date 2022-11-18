import React, {useState, useEffect} from 'react'
import { Button, Input, Spinner, Modal, Card } from 'reactstrap';
import { Login, Logout, loginPending } from 'redux/actions'
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { useConnect, useAccount, useSignMessage, useDisconnect, useBalance } from 'wagmi'
import { Network, Alchemy } from "alchemy-sdk";
import { MagicAuthConnector } from '@everipedia/wagmi-magic-connector';
import { filterTime } from './TP-helpers/useTimeStamp';
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

  const { disconnectAsync } = useDisconnect()
  const { data, error, isLoading, signMessageAsync } = useSignMessage()
  const { data:balance }  = useBalance();
  const { isConnecting, isConnected, address } = useAccount();
  const [ email, setEmail ] = useState("");
  const [ pending, setPending ] = useState(false);
  const [ resource, setResource ] = useState("rainbowkit")

  const { connectAsync } = useConnect({
    connector: new MagicAuthConnector({
      options: {
        apiKey: process.env.REACT_APP_MAGIC_APIKEY
      },
    }),
  })

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
  
  useEffect(async () => {
    console.log(isConnecting)
    if(isConnected && !wallet.wallet && !localStorage.getItem("auth")){
      const message = "Please signature here to connect your wallet!"
      const signedData = await signMessageAsync({message})
      if(signedData){
        fetch(`http://localhost:8080/secret?signature=${signedData}&data=${message}`,{
          method:"POST"
        })
        .then(res=>res.json())
        .then(async res=>{
          const createTime = new Date()
          localStorage.setItem("token",JSON.stringify({token:res.accessToken,createdAt:filterTime(createTime)}))
          localStorage.setItem("auth",JSON.stringify({
            wallet:address,
            email,
            balance,
            resource,
            claimed:wallet.claimed,
            id:wallet.id
          }))
          await checkList();
        })
        props.history.push('/guest')
      }
      else{
        alert("You need to sign, please try again!")
      }
    }
  },[isConnected])


  const loginMagic = async () => {
    if (isConnected) {
      await disconnectAsync()
    }
    setPending(true)
    setResource("magic-link")
    await connectAsync()
    .then(async (item)=>{
      console.log(item)
      setPending(false)
    })
    .catch(()=>{
      alert("System inner problem!")
      setPending(false)
    })
  };


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
        <Button className='login_create_account w-100' onClick={loginMagic} disabled={isConnecting}>
          <h5 className="m-0 p-0">
            Login by email
          </h5>
        </Button>
        <div className='d-flex justify-content-center align-items-center w-100' style={{margin:"10px 0"}}>    
          <h4 className='m-0'>OR</h4>
        </div>
        <ConnectButton.Custom>
          {({
            account,
            chain,
            openAccountModal,
            openChainModal,
            openConnectModal,
            authenticationStatus,
            mounted,
          }) => {
            const ready = mounted && authenticationStatus !== 'loading';
            const connected =
              ready &&
              account &&
              chain &&
              (!authenticationStatus ||
                authenticationStatus === 'authenticated')
            

            return (
              <div
              className='w-100'
                {...(!ready && {
                  'aria-hidden': true,
                  'style': {
                    opacity: 0,
                    pointerEvents: 'none',
                    userSelect: 'none',
                  },
                })}
              >
                {(() => {
                  if (!connected || !wallet.wallet) {
                    return (
                      <>
                      <Button className='login_create_account w-100'
                      onClick={ async () => { 
                        if (isConnected) { await disconnectAsync() }
                        openConnectModal()
                      }}
                      disabled={isConnecting}>
                         <h5 className="m-0 p-0">
                            Connect Wallet
                        </h5>
                      </Button>
                      </>
                    );
                  }

                  if (chain.unsupported) {
                    return (
                      <Button className='login_create_account w-100' onClick={openChainModal}>
                        Wrong network
                      </Button>
                    );
                  }

                  return (
                    <div style={{ display: 'flex', gap: 12 }}>
                      <Button 
                      className='login_create_accoun' 
                      onClick={openChainModal}
                      style={{ display: 'flex', alignItems: 'center'}}
                     >
                        {chain.hasIcon && (
                          <div
                            style={{
                              background: chain.iconBackground,
                              width: 12,
                              height: 12,
                              borderRadius: 999,
                              overflow: 'hidden',
                              marginRight: 4,
                            } }
                          >
                            {chain.iconUrl && (
                              <img
                                alt={chain.name ?? 'Chain icon'}
                                src={chain.iconUrl}
                                style={{ width: 12, height: 12 }}
                              />
                            )}
                          </div>
                        )}
                        {chain.name}
                      </Button>

                      <Button 
                      className='login_create_accoun' 
                      onClick={openChainModal}
                      style={{ display: 'flex', alignItems: 'center'}}
                     >
                      {account.displayName}
                      {account.displayBalance
                      ? ` (${account.displayBalance})`
                      : ''}

                     </Button>
                    </div>
                  );
                })()}
              </div>
            );
          }}
        </ConnectButton.Custom>
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