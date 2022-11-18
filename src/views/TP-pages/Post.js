import React, { useState, useEffect } from 'react';
import { Login, Logout } from 'redux/actions';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { useDisconnect } from 'wagmi';
import GuestHeader from 'views/TP-pages/TP-components/CommonHeader';
import 'quill/dist/quill.snow.css'; 
import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";
import { timeDiff} from 'views/TP-pages/TP-helpers/useTimeStamp';
import 'views/TP-pages/TP-scss/GuestPage.scss';
import 'views/TP-pages/TP-scss/login.scss';
import './TP-scss/Post.scss'

function Post({wallet, setWallet, clearWallet, ...props}) {
  const [id, setId] = useState(window.location.hash.replace("#/post/",""))
  const [content, setContent] = useState(null)
  
  useEffect(()=>{
    fetch(`http://localhost:8080/post/${id}`,{
      method:"GET"
    })
    .then(response=>response.json())
    .then(response => {
      const cfg = {};
      const converter = new QuillDeltaToHtmlConverter(JSON.parse(response.delta), cfg).convert();
      setContent(
        {
          inner:converter,
          created:response.created,
          edited:response.edited,
          viewed:response.viewed
        }
      )
    })
    
  },[])

   useEffect(()=>{
    if(content){
      const target = document.getElementById("content")
      target.innerHTML = content.inner;
    }
  },[content])

  const [ dropdownBasicOpen, setDropdownBasicOpen ] = useState(false);
  
  const { disconnectAsync } = useDisconnect()
  
  const handleLogout = async () => {
      if(window.confirm("Are you sure you want to logout?")===true){
          await disconnectAsync().then(
              ()=>{
                  clearWallet();
                  localStorage.clear();        
              }
          );
      }
  } 
  return (
    <div className='post'>
        <GuestHeader
        dropdownBasicOpen={dropdownBasicOpen}
        setDropdownBasicOpen={setDropdownBasicOpen}
        handleLogout={handleLogout}
        post
        />
        <div className='ql_container'>
          <div className='ql-editor'>
            <div id="content" className="ql_post_content"/>
          </div>
          <div className='d-flex justify-content-between ql_post_inform'>
            <h4>
              Viewed {content ? content.viewed : 0}
            </h4>
            <h4 style={{color:"gray"}}>
              {
                content ? 
                <div>
                  {
                  content.edited 
                  ? 
                  `Edited ${timeDiff(content.edited)}` 
                  : 
                  `Created ${timeDiff(content.created)}`
                  }
                </div>
                :
                null
              }
            </h4>
          </div>
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
     }
    }
};
  
const mapStateToProps = (state) => {
  return {
    wallet : state.auth
  }
};


export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Post))