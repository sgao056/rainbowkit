import React, {useState, useEffect} from 'react'
import { Button, Modal, Card ,Spinner} from 'reactstrap'
import { ethers, ContractFactory } from 'ethers';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { useContract, useSigner } from "wagmi";
import Abi from 'NFTAbi'
import ByteCode from 'ByteCode'
import '../ownerPage.scss'

const fetchPrefix = process.env.REACT_APP_DEP_FETCH_PREFIX
const tokenAddress = process.env.REACT_APP_TOKEN_ADDRESS;

function DeployContract({wallet}) {
  const [ deployStatus, setDeployStatus ] = useState("")
  const [ pauseStatus, setPauseStatus ] = useState("")
  const [ pending, setPending ] = useState(false)
  const { data: signer } = useSigner()

  const contract = useContract({
    address: tokenAddress,
    abi: Abi,
    signerOrProvider: signer,
  })

  useEffect(()=>{
    fetch(`${fetchPrefix}/deploy/1`,{
      method:"POST",
    })
    .then(response =>{  
      if(!response.ok){
        alert("Fail adding deploy status! Error: System problem, maybe not connect to database!");
        return Promise.reject();
      }
      return response.json()
    })
    .then((response)=>{
      setDeployStatus(response.status)
    })
    .catch(()=>{
      alert("Fail adding deploy status! Error: System problem, maybe not connect to database!");
      return Promise.reject();
    })
  },[])

  const handleDeploy = async () => {
    const officialWallet = process.env.REACT_APP_OFFICIAL_DEPLOY
    const deployWallet = process.env.REACT_APP_DEPLOY_WALLET
    const popAddress = process.env.REACT_APP_POP_ADDRESS
    const timeStamp = 1667869200
    if(wallet.wallet && wallet.wallet.toLowerCase() === officialWallet.toLowerCase()){
      setPending(true)
      const factory = new ContractFactory(Abi, ByteCode, signer);
      const deployContract = await factory.deploy(deployWallet, timeStamp, {
        gasLimit:6000000
      })
      .then(async res=>{
        await res.deployTransaction.wait()
        .then(async (deployRes)=>{
          const w = window.open('about:blank');
          w.location.href= `${popAddress}${deployRes.contractAddress}`
          fetch(`${fetchPrefix}/deploy/1`,{
            method:"PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${wallet.token}`
              },
            body: JSON.stringify({
              status:"deployed"
            })
          })
          .then(response=>{     
            if(!response.ok){
              if(response.status === 403){
                alert("Successfully deploy in blockchain but fail to change deploy status in database! Error: Login timeout!");
                setPending(false);
                return Promise.reject();
              }
              if(response.status === 401){
                alert("Successfully deploy in blockchain but fail to change deploy status in database!  Error: This is not an admin wallet, please login by admin wallet!");
                setPending(false);
                return Promise.reject();
              }
              setPending(false);
              alert("Successfully deploy in blockchain but fail to change deploy status in database!  Error: System problem, maybe not connect to database!");
              return Promise.reject();
            }  
            return response.json()
          })
          .then(response=>{
            if(response.code==='PROTOCOL_SEQUENCE_TIMEOUT'){
              setPending(false);
              alert("Fail to change deploy status in database! Error: System problem, maybe not connect to database!");
              return Promise.reject();
            }
            return response
          })
          .then(async response=>{
            alert("Deployed successfully!")
            setPending(false);
            window.location.reload();
          })
          .catch(err=>{
            setPending(false);
          })
        })
        .catch(()=>{
          setPending(false);
        })
      })
      .catch((err)=>{
          alert("Fail to deploy on blockchain!")
          setPending(false)
      }) 
    }
    else{
      alert("Not official wallet! You cannot deploy!")
    }
  }

  const handlePause = async () => {
    setPauseStatus("pause")
    const officialWallet = process.env.REACT_APP_OFFICIAL_DEPLOY
    if(wallet.wallet && wallet.wallet.toLowerCase() === officialWallet.toLowerCase()){
      setPending(true)  
        const transaction = await contract.pause({gasLimit:100000})
        .then(
            async res => {
              await res.wait()
              .then(response=>{
                setPending(false)
                setPauseStatus("")
                alert('Successfully Pause!')
              })
            }
        )
        .catch(()=>{
          alert("Fail to pause, perhaps because you are not the owner!")
          setPending(false)
          setPauseStatus("")
        })
    }
    else{
      alert("Not official wallet! You cannot pause!")
    }
  }

  const handleUnpause = async () => {
    setPauseStatus("unpause")
    const officialWallet = process.env.REACT_APP_OFFICIAL_DEPLOY
    if(wallet.wallet && wallet.wallet.toLowerCase() === officialWallet.toLowerCase()){
      setPending(true)  
        const transaction = await contract.unpause({gasLimit:100000})
        .then(
            async res => {
              await res.wait()
              .then(response=>{
                setPending(false)
                setPauseStatus("")
                alert('Successfully unpause!')
              })
            }
        )
        .catch(()=>{
          alert("Fail to unpause, perhaps because you are not the owner!")
          setPauseStatus("")
          setPending(false)
        })
    }
    else{
      alert("Not official wallet! You cannot unpause!")
    }
  }

  const handleWithdraw = async () => {
    const officialWallet = process.env.REACT_APP_OFFICIAL_DEPLOY
    if(wallet.wallet && wallet.wallet.toLowerCase() === officialWallet.toLowerCase()){
      setPending(true)  
        const transaction = await contract.withdraw({gasLimit:100000})
        .then(
            async res => {
              await res.wait()
              .then(response=>{
                setPending(false)
                alert('Successfully withdraw money!')
              })
            }
        )
        .catch(()=>{
          alert("Fail to withdraw, perhaps because you are not the owner!")
          setPending(false)
        })
    }
    else{
      alert("Not official wallet! You cannot withdraw!")
    }
  }
  return (
    <div className="">
      <div className='d-flex '>
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
                  <Spinner color="primary" className="mb-4" style={{height:"50px", width:"50px"}}/>
                  <h1 className="m-0 p-0" style={{color:"#ffffff"}}>{deployStatus === "undeployed" ? "Deploying...":null}</h1>  
                  <h1 className="m-0 p-0" style={{color:"#ffffff"}}>{deployStatus === "deployed" && (pauseStatus !== "pause" && pauseStatus !== "unpause") ? "Withdrawing money...":null}</h1>  
                  <h1 className="m-0 p-0" style={{color:"#ffffff"}}>{deployStatus === "deployed" && pauseStatus === "pause" ? "Pausing...":null}</h1>  
                  <h1 className="m-0 p-0" style={{color:"#ffffff"}}>{deployStatus === "deployed" && pauseStatus === "unpause" ? "Unpausing...":null}</h1>  
              </Card>
          </Modal>
          <div className='w-100 pr-5'>
            <div className='homepage_items d-flex justify-content-start'> 
              <h1 className='pt-5'>Deploy contract</h1>
            </div>
            {
            deployStatus === "deployed"
            ?
            <div className='homepage_items'>
                <h3 className='mt-5 mb-5 font-weight-light'>You have deployed your contract! Press withdraw Button to withdraw all money!</h3>
                <Button className="ownerpage_button" onClick={handleWithdraw}>Withdraw</Button>
                <Button className="ownerpage_button" onClick={handlePause}>Pause</Button>
                <Button className="ownerpage_button" onClick={handleUnpause}>Unpause</Button>
            </div>
            :
            null
            }
            {
            deployStatus === "undeployed"
            ?
            <div className='homepage_items'>
                <h3 className='mt-5 mb-5 font-weight-light'>Press deploy Button to deploy your contract!</h3>
                <Button className="ownerpage_button" onClick={handleDeploy}>deploy</Button>
            </div>
            :
            null
            }
          </div>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => {
    return {
      wallet : state.auth
    }
  };
  
export default connect(mapStateToProps, null)(withRouter( DeployContract))
