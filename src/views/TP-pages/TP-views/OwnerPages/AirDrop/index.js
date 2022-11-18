import React, { useState, useEffect } from "react";
import { useAccount, useContract, useSigner } from "wagmi";
import { Button, Input, Spinner, Modal, Card } from 'reactstrap';
import { withRouter } from "react-router-dom";
import { Login, Logout } from 'redux/actions';
import { connect } from 'react-redux';
import NFT from "NFTAbi";
import nftVideo from 'assets/video/founderpass.mp4'
import '../modal.scss'  
import '../ownerCommon.scss'

const TOKEN_ADDRESS = process.env.REACT_APP_TOKEN_ADDRESS;

function AirdropPage({wallet}) {
    const { address, isConnected } = useAccount();
    const [ pending, setPending ] = useState(false);
    const [ dropAddress, setDropAddress ] = useState('');    
    const { data: signer, isError, isLoading } = useSigner()
    const contract = useContract({
      address: TOKEN_ADDRESS,
      abi: NFT,
      signerOrProvider: signer,
    })
    const handleTransfer = async () => {
      if(isConnected && address){
        const removeSpecialChar = (s) => {
          const pattern = /[a-zA-Z0-9\n]{1}/;
          let rs = "";
          for (let i = 0; i < s.length; i+=1) {
            const single = s.substr(i, 1);
            if(single.match(pattern)){
              rs += single;
             }
           }
          rs.toLocaleLowerCase()
          return rs;
        };
        const newArray = removeSpecialChar(dropAddress).split("\n");
        let flag = 0;   
        newArray.forEach(
          item=>{
          if(item.length === 42){
            flag+=1
          }
        })
        if (flag === newArray.length){
          setPending(true)
          const transaction = await contract.batchAirDrop(newArray,{gasLimit:100000})
          .then(
            async res => {
              await res.wait().then(response=>{
                setPending(false)
                alert("Airdrop successfully!")
              })
            }
          )
          .catch(err=>{
            alert(err.message)
            setPending(false)
          })
        }
        else{
          alert('Please make sure: \n 1.Every wallet address should contain 42 characters! \n 2.Do not input special punctuations! \n 3.Every line contains only one address! \n 4.Black cannot be empty!')
        }
      }
    }

    return (
      <div className="owner_common_box">
        <Modal
          isOpen={pending}
          className='d-flex justify-content-center align-items-center'
        >
          <Card 
          className='d-flex justify-content-center align-items-center'
          style={{
            height:"300px", 
            width:"200px !important", 
            position:"relative",
            top:"0",
            bottom:"0",
            left:"0",
            right:"0",
          }}
          >
            <Spinner color="primary" className="mb-1" style={{height:"50px", width:"50px"}}/>
            <h1 style={{color:"#ffffff", marginTop:"20px"}}>Loading...</h1>  
          </Card>
        </Modal>
        {
          wallet.wallet
          ?
          <div style={{zIndex:"90"}}>
            <video width="500" height="500" autoPlay loop muted controls controlsList='nodownload' playsInline preload="metadata">
                <source src={nftVideo} type="video/mp4"/>
                <track src="captions_en.vtt" kind="captions" srcLang="en" label="english_captions"/>
            </video>
            <Input
              className="mt-4"
              value={dropAddress}
              onChange={(e)=>{
                setDropAddress(e.target.value)
              }}
              type='textarea'
              rows="20"
              style={{zIndex:"90"}}
              placeholder="页面用于空投NFT。 请在输入框中输入需要空投的钱包地址，每行一个钱包，每个钱包只会空投一次，重复地址不会多次空投。"
            />
            <Button
            className="mt-4"
            style={{width:"150px", height:"50px"}}
            onClick={
              ()=>{handleTransfer()}
            }
            >
              Air Drop
            </Button>
          </div>
          :
          <div>
            Please link your wallet first!
          </div>
        }
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
     }
    }
  };
  
  const mapStateToProps = (state) => {
    return {
      wallet : state.auth
    }
  };
  export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AirdropPage))
