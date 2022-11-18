import React,{useState} from 'react'
import { Login, Logout } from 'redux/actions';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Row } from 'reactstrap'
import GuestHeader from 'views/TP-pages/TP-components/CommonHeader';
import { Colxx } from 'components/common/CustomBootstrap'
import 'views/TP-pages/TP-scss/GuestPage.scss';
import Sidebar from '../../TP-components/Sidebar'
import Data from './Data/index'

function DataM() {
  const [ dropdownBasicOpen, setDropdownBasicOpen ] = useState(false);
  return (
    <>
      <GuestHeader
      dropdownBasicOpen={dropdownBasicOpen}
      setDropdownBasicOpen={setDropdownBasicOpen}
      post
      owner
      />
      <div className='container'>
        <Row>
          <Colxx xxs="2" md="3" style={{maxWidth:"220px"}} className="p-0">
            <Sidebar/>      
          </Colxx>
          <Colxx xxs="10" md="9">
            <Data />     
          </Colxx>
        </Row>
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


export default connect(mapStateToProps, mapDispatchToProps)(withRouter(DataM))