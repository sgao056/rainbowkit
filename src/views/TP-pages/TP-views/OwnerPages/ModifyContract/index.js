import React, { useState, useEffect } from 'react'
import { Button, Input, Spinner, Modal, Card } from 'reactstrap';
import NFT from 'NFTAbi'
import { useContract, useSigner } from "wagmi";
import '../modal.scss'
import '../ownerCommon.scss'

const TOKEN_ADDRESS = process.env.REACT_APP_TOKEN_ADDRESS;

function index() {
  const [ pending, setPending ] = useState(false)
  const [ abiAddress, setAbiAddress ] = useState('')
  const { data: signer } = useSigner()
  const contract = useContract({
    address: TOKEN_ADDRESS,
    abi: NFT,
    signerOrProvider: signer,
  })  
  const handleModifyApi = async () => {
    if(abiAddress.length > 0){
      if(window.confirm("Are you sure you want to change abi address?") === true){
        setPending(true)
        const transaction = await contract.setURI(abiAddress,{gasLimit:100000})
        .then(
            async res => {
              await res.wait()
              .then(response=>{
                setPending(false)
                alert('Abi has successfully been changed')
              })
            }
        )
        .catch(err=>{
          alert(err.message)
          setPending(false)
        })
      }
    }
    else{
      alert('The abi blank cannot be empty!')
    }
  }

  return (
    <div className='modify_contract owner_common_box'>
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
      <Input 
      className='ml-4 mr-4'
      onChange={(e)=>{setAbiAddress(e.target.value)}}
      value={abiAddress}
      placeholder="此输入框只用于更新NFT视频素材，请输入metadata地址"
      style={{zIndex:"90"}}/>
      <div style={{zIndex:"90"}}>
        <Button
        className='m-4'
        style={{width:"150px", height:"50px"}}
        onClick={handleModifyApi}>
          Update Metadata
        </Button>
      </div>
    </div>
  )
}

export default index