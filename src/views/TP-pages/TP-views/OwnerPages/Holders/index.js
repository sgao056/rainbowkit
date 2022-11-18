import React, {useState, useEffect} from 'react';
import { connect } from 'react-redux';
import { 
  Row
} from 'reactstrap';
import './holders.scss'
import { Login } from 'redux/actions';
import { Colxx } from 'components/common/CustomBootstrap';

const Holders = ({wallet}) => {
  const [holders, setHolders] = useState([]);

  useEffect(()=>{
    fetch('http://localhost:8080/holders',{
        method:"GET"
    })
    .then(response=>response.json())
    .then((res)=>{
      setHolders(res)
    })
    

  },[wallet.wallet])

  return(
  <div className='mt-4'>      
    <Row className='holders_header'>
      <Colxx xxs="6" className="d-flex justify-content-center align-items-center"><h6 className='m-0 p-0'>Address</h6></Colxx>
      <Colxx xxs="4" className="d-flex justify-content-center align-items-center"><h6 className='m-0 p-0'>Email</h6></Colxx>
      <Colxx xxs="2" className="d-flex justify-content-center align-items-center"><h6 className='m-0 p-0'>Holding Numbers</h6></Colxx>
    </Row>
    {holders.map((item)=>{
      return(
        <Row key={item.wallet} className="holders_row">
          <Colxx xxs="6" className="d-flex justify-content-start align-items-center">
            <h6 className="p-0 m-0">
              {item.wallet}
            </h6> 
          </Colxx>
          <Colxx xxs="4" className="d-flex justify-content-center align-items-center">
            <h6 className='p-0 m-0'>
              {item.email}
            </h6>
          </Colxx>
          <Colxx xxs="2" className="d-flex justify-content-center align-items-center">
            <h6 className='p-0 m-0'>
              {item.holdingNumbers}
            </h6>
          </Colxx>
        </Row>
    )})}
  </div>
  )
};
const mapDispatchToProps = (dispatch) => {
  return{
    setWallet: (object)=>{
       dispatch(Login(object))
   }
  }
};

const mapStateToProps = (state) => {
const { locale } = state.settings;
return { 
  locale,
  wallet:state.auth.wallet 
};
};
const mapActionsToProps = {};
export default connect(mapStateToProps, mapDispatchToProps)(Holders);
