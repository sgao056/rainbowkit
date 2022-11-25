import React, { useState, useEffect } from "react";
import NFT from "NFTAbi";
import { Login, Logout } from 'redux/actions';
import { connect } from 'react-redux';
import { useContract, useSigner } from "wagmi";
import { Button, Input, Modal, Card, Spinner } from "reactstrap";
import nftVideo from 'assets/video/founderpass.mp4'
import '../modal.scss'  
import '../ownerPage.scss'

const TOKEN_ADDRESS = process.env.REACT_APP_TOKEN_ADDRESS;

function index({wallet}) {
  const { data: signer } = useSigner()
  const contract = useContract({
    address: TOKEN_ADDRESS,
    abi: NFT,
    signerOrProvider: signer,
  })  
  const [ pending, setPending ] = useState(false)
  const [ mintNumber, setMintNumber ] = useState(0); 
  const [ mintAddress, setMintAddress ] = useState(''); 

  const handleMint = async () => {
    if(mintAddress !== '' && mintAddress.length === 42){
      if(window.confirm('Are you sure you want to mint nft?')===true){
        setPending(true)
        try{
            const tx = await contract.mint(
              wallet.wallet,
              mintNumber,
              {
                  gasLimit: 100000
              }
            )
            .then(async res=>{
              await res.wait().then((response)=>{
                setPending(false)
                alert('Mint successful!')
              })
            })
            .catch(err=>{
              setPending(false)
              alert(err.message)
            })
        }
        catch(err){
          alert(err.message)
            setPending(false)
        }
      }
    }
    else if(mintAddress === ''){
      alert('Mint address cannot be empty')
    }
    else if(mintAddress.length !== 42){
      alert('Please input valid mint address')
    }
  }

  const modifyNumber = (number) => {
    if(mintNumber+number<=0){
      setMintNumber(0)
    }
    else if(mintNumber+number>=10){
      setMintNumber(10)
    }
    else{
      setMintNumber(mintNumber+number)
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
        }}>
          <Spinner color="primary" className="mb-1" style={{height:"50px", width:"50px"}}/>
          <h1 style={{color:"#ffffff", marginTop:"20px"}}>Loading...</h1>  
        </Card>
      </Modal>
      <div className='w-100 pr-5'>
        <div className='homepage_items d-flex justify-content-start'> 
          <h1 className='pt-5'>Mint</h1>
        </div>
        <div className='homepage_items'>
            <h3 className='mt-5 mb-5 font-weight-light'>As NFT owner, you can mint any amount of NFTs here to other wallet!</h3>
        </div>
      </div>
      {
        wallet.wallet
        ?
        <div style={{zIndex:"90"}}>
          <div style={{zIndex:"90"}} className="m-4">
            <video style={{borderRadius:"30px"}} width="300" height="300" autoPlay loop muted controls controlsList='nodownload' playsInline preload="metadata">
                <source src={nftVideo} type="video/mp4"/>
                <track src="captions_en.vtt" kind="captions" srcLang="en" label="english_captions"/>
            </video>
          </div>
          <Input 
          className="mr-4 mt-4"
          value={mintAddress}
          placeholder="Please type the wallet which you want to mint nfts to!"
          onChange={(e)=>{
            setMintAddress(e.target.value)
          }}
          />
          <div style={{zIndex:"90"}}>
            <Button className="ownerpage_button" style={{width:"80px", height:"50px"}} onClick={()=>modifyNumber(-10)} disabled={mintNumber<=0}>-10</Button>
            <Button className="ownerpage_button" style={{width:"80px", height:"50px"}} onClick={()=>modifyNumber(-1)} disabled={mintNumber<=0}>-1</Button>
            <span className="ownerpage_button" style={{ fontSize:"16px", marginRight:"10px",padding:"5px"}}>{mintNumber}</span> 
            <Button className="ownerpage_button" style={{width:"80px", height:"50px"}} onClick={()=>modifyNumber(1)} disabled={mintNumber>=10}>+1</Button>
            <Button className="ownerpage_button" style={{width:"80px", height:"50px"}} onClick={()=>modifyNumber(10)} disabled={mintNumber>=10}>+10</Button>
          </div>
          <Button className="ownerpage_button" style={{width:"210px", height:"50px"}} onClick={handleMint}>Mint</Button>
        </div>
        :
        <div style={{zIndex:"90"}}>
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
export default connect(mapStateToProps, mapDispatchToProps)(index)