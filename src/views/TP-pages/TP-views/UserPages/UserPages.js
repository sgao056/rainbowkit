import React, { useState, useEffect } from 'react';
import { Login, Logout } from 'redux/actions';
import { connect } from 'react-redux';
import UserHeader from 'views/TP-pages/TP-components/UserHeader';
import {
  Row,
  Button,
  TabContent,
  TabPane,
}
from 'reactstrap';
import Blockies from 'react-blockies';
import { withRouter } from 'react-router-dom';
import { Colxx } from 'components/common/CustomBootstrap';
import { useAccount } from 'wagmi';
import { Network, Alchemy } from "alchemy-sdk";
import { getEthPriceNow } from 'get-eth-price';
import nftVideo from 'assets/video/founderpass.mp4'
import '../../TP-scss/UserPage.scss';

const authorAddress = process.env.REACT_APP_AUTHOR_ADDRESS;
const tokenAddress = process.env.REACT_APP_TOKEN_ADDRESS;
const settings = {
  apiKey: "Pn4Z8h9eeWxBma-BmOXsW-DJlW_EwiR9",
  network: Network.ETH_MAINNET
};

const alchemy = new Alchemy(settings);

const GuestPages = ({wallet, setWallet, clearWallet, ...props}) => {  
  const [ activeTab, setActiveTab ] = useState('Collection');
  const [ nftList, setNftList ] = useState([]);  
  const [ ownerList, setOwnerList ] = useState([]);  
  const [ dropdownBasicOpen, setDropdownBasicOpen ] = useState(false);
  const [ copied, setCopied] = useState(false) 
  const [ currentUSD, setCurrentUSD] = useState(0) 
  const { isConnected, address } = useAccount();

  useEffect(async()=>{ 
    const totalArray = await alchemy.nft.getNftsForOwner(address)
    if(totalArray.totalCount!==100 && !totalArray.pageKey){
      console.log(totalArray.ownedNfts)
      setOwnerList(totalArray.ownedNfts.length>0 ? totalArray.ownedNfts:null);
    }
  },[])

  useEffect(()=>{
    if(address && isConnected && ownerList.length>0){
        const newArray = [];
        const finder = ownerList.find((item)=>{
          return (
            // item.contract.address.toLocaleLowerCase() === tokenAddress.toLocaleLowerCase()
            item.contract.address.toLocaleLowerCase() === '0x0770c4e695851addcc3b47ababb99c55187edd49'
          )
        })
        if(finder){
          newArray.push(finder)
        }
        setNftList(newArray)
      } 
  },[ownerList])

  const handleCopy = () => {
    navigator.clipboard.writeText(wallet.wallet);
    setCopied(true);
    setInterval(()=>{
      setCopied(false)
    },5000);
    clearInterval();
  }

  useEffect(()=>{
    getEthPriceNow().then(data=>{
      setCurrentUSD(Object.values(data)[0].ETH.USD)
    })
  },[])

  return (
    <>
      <UserHeader 
      nftList={nftList}
      dropdownBasicOpen={dropdownBasicOpen}
      setDropdownBasicOpen={setDropdownBasicOpen}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      />
      <div className='container'>
          <TabContent activeTab={activeTab}>

            {/* Collection */}   
            <TabPane tabId="Collection" className='user_collection'>
             <Row className='m-0 p-0'>
              {
                nftList && nftList.length > 0
                ?
                nftList.map((item)=>{
                  return (
                    <Colxx xxs="12" lg="6" xl="4" key={item.token_address} className="user_collection_nftbox d-flex algin-content-center justify-content-center">
                        <video style={{borderRadius:"10%"}} className="w-100 h-100" autoPlay loop muted controls controlsList='nodownload' playsInline preload="metadata">
                            <source src={nftVideo} type="video/mp4"/>
                            <track src="captions_en.vtt" kind="captions" srcLang="en" label="english_captions"/>
                        </video>
                        <h1 className='d-flex justify-content-center align-items-center'>
                        <Blockies
                          seed= {tokenAddress}
                          size={10} 
                          scale={10} 
                          color="#dfe" 
                          bgColor="#abf" 
                          spotColor="#abc" 
                          className="identicon" 
                        /> 
                          {item.rawMetadata.name} #{item.tokenId}
                        </h1>
                    </Colxx>
                  )
                })
                :
                null
              }
             </Row>
            </TabPane>

            {/* Account */}  
            <TabPane tabId="Account" className='user_account_wallet'>
              <Row className='p-0 m-0'>
                <Colxx xxs="12" lg="6" style={{zIndex:"90 "}}>
                  <div>
                    <h3 className='user_account'>Account</h3>
                    <div className='user_dash'/> 
                    <Row className='p-0 m-0'>
                      <Colxx className="p-0 m-0" xxs="3" style={{zIndex:"90"}}>
                        <h4 className="user_account_normal_box">
                          email:
                        </h4>   
                      </Colxx>
                      <Colxx className="p-0 m-0" xxs="9" style={{zIndex:"90"}}>
                        <h5 className=" user_account_normal_box font-weight-light">
                          {wallet.email ? wallet.email : "No linked email!"}
                        </h5>
                      </Colxx>
                    </Row>
                    <Row className='p-0 m-0 user_account_wallet'>
                      <Colxx className="p-0 m-0" xxs="3" style={{zIndex:"90"}}>
                        <h4 className="user_account_normal_box">
                          wallet:
                        </h4>
                      </Colxx>
                      <Colxx className="p-0 m-0" xxs="6" style={{zIndex:"90"}}>
                        <div className="user_account_normal_box"> 
                        {  
                          wallet.wallet
                          ?
                          <h5 className="user_account_wallet_account w-100 m-0 p-0 font-weight-light">
                            <span>{wallet.wallet}</span>
                          </h5>
                          :
                          <h5 className="user_account_wallet_account w-100 m-0 p-0 font-weight-light">
                            Connect your wallet first!
                          </h5>
                        }
                        </div>
                      </Colxx>
                      <Colxx className="p-0 m-0" xxs="3" style={{zIndex:"90"}}>
                        <Button 
                        className='user_account_button p-0' 
                        style={{display: wallet.wallet ? "block" : "none"}}
                        onClick={handleCopy}>
                            {
                              copied 
                              ? 
                              <h5 className='m-0 p-0'>
                                <i className='simple-icon-check'/> Copied!
                              </h5>
                              : 
                              <h5 className='m-0 p-0'>
                                Copy
                              </h5>
                            }
                        </Button>
                      </Colxx>
                    </Row>
                    <Row className='p-0 m-0'  style={{display: wallet.resource && wallet.resource === "magic-link" ? "flex" : "none", zIndex:"90"}}>
                      <Colxx className="p-0 m-0" xxs="3" style={{zIndex:"90"}}>
                        <h4 className="user_account_wallet_account user_account_normal_box">
                          private key:
                        </h4>
                      </Colxx>
                      <Colxx className="p-0 m-0" xxs="6" style={{zIndex:"90"}}/>
                      <Colxx className="p-0 m-0" xxs="3" style={{zIndex:"90"}}>
                          <Button 
                          className='user_account_button p-0'
                          onClick={()=>{
                            const w = window.open('about:blank');
                            w.location.href="https://reveal.magic.link/theforging"
                          }}>
                            <h5 className='m-0 p-0'>
                              Check  
                            </h5>
                          </Button>
                      </Colxx>
                    </Row>
                  </div>
                  <div style={{zIndex:"90"}}>
                    <h3 className='user_wallet'>Wallet</h3>
                    <div className='user_dash'/>
                    <div className="user_wallet_normal_box d-flex justify-content-between" style={{zIndex:"90"}}>
                      <div className='d-flex justify-content-between align-items-center'>
                        <h4 className='m-0'>ETH</h4>
                        <h5 className='font-weight-light m-0'>{wallet.balance ? wallet.balance.formatted : 0 }</h5>
                      </div>
                      <div className='d-flex justify-content-end align-items-center'>{wallet.wallet ? `$${(currentUSD * parseFloat(wallet.balance.formatted.slice(0,-4))).toFixed(2)} USD`:"$0 USD"}</div>
                    </div>
                  </div>
                </Colxx>
              </Row>     
            </TabPane>
        </TabContent>
      </div>
    </>
  )
}
const mapDispatchToProps = (dispatch) => {
  return{
    setWallet: (object)=>{
       dispatch(Login(object))
   },
   clearWallet: ()=>{
     dispatch(Logout())
   }
  }
};

const mapStateToProps = (state) => {
  return {
    wallet : state.auth
  }
};


export default connect(mapStateToProps, mapDispatchToProps)(withRouter(GuestPages))