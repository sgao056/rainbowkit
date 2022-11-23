import React, {useState, useEffect} from 'react'
import LoginSucc from "assets/img/login/loginSucc.png";
import LoginFail from "assets/img/login/loginFail.png";
import { Button, Modal } from 'reactstrap';
import { Login, Logout } from 'redux/actions';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { Network, Alchemy } from "alchemy-sdk";

const alchemyApikey = process.env.REACT_APP_ALCHEMY_APIKEY;
const fetchPrefix = process.env.REACT_APP_DEP_FETCH_PREFIX

const settings = {
  apiKey: alchemyApikey,
  network: Network.ETH_MAINNET
};

const alchemy = new Alchemy(settings);

function LoginModal({setWallet, wallet, ...props}) {
    const [ ownedNft, setOwnedNft ] = useState(null);  
    const { modalToggle, setModalToggle } = props;
    const { address } = useAccount();
    useEffect( async () => {
        if(address){
            const totalArray = await alchemy.nft.getNftsForOwner(address)
            if(totalArray.totalCount!==100 && !totalArray.pageKey){
            setOwnedNft(totalArray.ownedNfts.length>0 ? totalArray.ownedNfts:null);
            }
        }
    },[modalToggle])

    const handleClaim = async () => {
        fetch(`${fetchPrefix}/holders/${wallet.id}`,{
            method:"PUT",
            headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${JSON.parse(localStorage.getItem('token')).token}`
            },
            body: JSON.stringify(
                {
                    ...wallet,
                    holdingNumbers:ownedNft ? 1:0,
                    claimed:true
                }
            )
        })
        .then(result=>result.json())
        .then(res=>{
            setWallet({
                ...wallet,
                claimed:true
            })
            props.history.push('/user')
        })
        
    }
    return (
        <Modal
            isOpen={modalToggle}
            className='d-flex justify-content-center align-items-center login'
        > 
            {
            wallet && !wallet.claimed && ownedNft
            ?
            <div className="login_box d-flex align-items-center pl-5 pr-5">
                { 
                window.innerWidth >= 992
                ?
                <div className='p-0 m-0 w-100'>
                    <h1 className='w-100 d-flex justify-content-center login_box_items'>
                    领取成功 ！
                    </h1>
                    <h1 className='font-weight-light w-100 d-flex justify-content-center login_box_items'>
                    可在个人账户查看此NFT
                    </h1>
                </div>
                :
                <div className='p-0 m-0 w-100'>
                    <h1 className='w-100 d-flex justify-content-center login_box_items'>
                    领取成功 ！
                    </h1>
                    <h1 className='font-weight-light w-100 d-flex justify-content-center login_box_items'>
                    可在个人账户查看此NFT
                    </h1>
                </div>
                }
                <img src={LoginSucc} alt="" className='login_success_image'/>
                <div className='guest_NFT_right_claim'>
                <Button 
                className='guest_NFT_account_button p-0' 
                onClick={handleClaim}>
                    { 
                    window.innerWidth >= 992
                    ?
                    <h2 className='m-0'>My account</h2>
                    :
                    <h6 className='m-0'>My account</h6>
                    }
                </Button>
                </div>
            </div>
            :
            <>
                {
                wallet && ownedNft && wallet.claimed
                ?
                <div className="login_box d-flex align-items-center pl-5 pr-5">
                    { 
                    window.innerWidth >= 992
                    ?
                    <div className='p-0 m-0 w-100'>
                        <h1 className='w-100 d-flex justify-content-center login_box_items'>
                        领取失败 ！
                        </h1>
                        <h1 className='font-weight-light w-100 d-flex justify-content-center login_box_items'>
                        已领取过NFT
                        </h1>
                    </div>
                    :
                    <div className='p-0 m-0 w-100'>
                        <h1 className='w-100 d-flex justify-content-center login_box_items'>
                        领取失败 ！
                        </h1>
                        <h1 className='font-weight-light w-100 d-flex justify-content-center login_box_items'>
                        已领取过NFT
                        </h1>
                    </div>
                    }
                    <img src={LoginFail} alt="" className='login_success_image'/>
                    <div className='guest_NFT_right_claim'>
                    <Button className='guest_NFT_account_button p-0' onClick={()=>{setModalToggle(false)}}>
                        { 
                        window.innerWidth >= 992
                        ?
                        <h2 className='m-0'>Close</h2>
                        :
                        <h6 className='m-0'>Close</h6>
                        }
                    </Button>
                    </div>
                </div>
                :
                <>
                {
                    !ownedNft
                    ?
                    <div className="login_box d-flex align-items-center pl-5 pr-5">
                        { 
                        window.innerWidth >= 992
                        ?
                        <div className='p-0 m-0 w-100'>
                            <h1 className='w-100 d-flex justify-content-center login_box_items'>
                            领取失败 ！
                            </h1>
                            <h1 className='font-weight-light w-100 d-flex justify-content-center login_box_items'>
                            此账户无可领取NFT
                            </h1>
                        </div>
                        :
                        <div className='p-0 m-0 w-100'>
                            <h1 className='w-100 d-flex justify-content-center login_box_items'>
                            领取失败 ！
                            </h1>
                            <h1 className='font-weight-light w-100 d-flex justify-content-center login_box_items'>
                            此账户无可领取NFT
                            </h1>
                        </div>
                        }
                        <img src={LoginFail} alt="" className='login_success_image'/>
                        <div className='guest_NFT_right_claim'>
                        <Button className='guest_NFT_account_button p-0' onClick={()=>{setModalToggle(false)}}>
                            { 
                            window.innerWidth >= 992
                            ?
                            <h2 className='m-0'>Close</h2>
                            :
                            <h6 className='m-0'>Close</h6>
                            }
                        </Button>
                        </div>
                    </div>
                    :
                    null
                    }
                </>
                }
            </>
            }
        </Modal>
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
  
  
  export default connect(mapStateToProps, mapDispatchToProps)(withRouter(LoginModal))