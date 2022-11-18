import React, {useState, useEffect} from 'react';
import { 
  Button,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  Modal,
  Card,
  Spinner
} from 'reactstrap';
import { useQuill } from 'react-quilljs';
import 'quill/dist/quill.snow.css'; 
import logo from 'assets/img/portal/eicoLogo.jpg';
import { filterTime} from 'views/TP-pages/TP-helpers/useTimeStamp';


function QuillEditor(props) {
  const [ pending, setPending ] = useState(false)
  const [ innerText, setInnerText ] = useState('')
  const [ enlarged, setEnlarged ] = useState(false)
  const [ buttonPined, setButtonPined ] = useState(false)
  const [ dropdownBasicOpen, setDropdownBasicOpen ] = useState(false);
  
  const { quill, quillRef } = useQuill({
    modules: {
      toolbar: '#toolbar'
    },
    formats: ["video", "link", "image", "font", "size", "bold", 'italic', 'underline',"align"], // Important
  });

  useEffect(()=>{
    if(props && props.data){
      const { data } = props
      if(data !== undefined && quill){
        quill.setContents(JSON.parse(JSON.parse(data.delta)))
        setButtonPined(data.pined)
      }
    }
  },[quill])

  const handleQuill = (html) => {
    if(!props.data){
      if(window.confirm("Are you sure you want to post?") === true){
        if(html){
          const data = {
              delta: quill.getContents(),
              text: quill.getText(),
              created: filterTime(new Date().getTime()),
              pined: buttonPined,
              viewed:0,
          }
          if(data.delta.ops.length === 1 && data.delta.ops[0].insert === '\n'){
            alert('Post cannot be empty!')
          }
          else{
            fetch(`http://localhost:8080/post/${localStorage.getItem('blogId')}`,{
                method:"PUT",
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${JSON.parse(localStorage.getItem('token')).token}`
                },
                body: JSON.stringify({
                  ...data,
                  delta:JSON.stringify(data.delta.ops),
                  drafted:false
                })
              })
            .then(res=>res.json())
            .then(
              (res)=>{
                window.location.reload()
              }
            )
            

          }
        }
      }
    }
    else{
      const { data } = props
      if(window.confirm("Are you sure you want to update?") === true){
        if(html){
          const updateData = {
              delta: quill.getContents(),
              text: quill.getText(),
              created: data.created,
              pined: buttonPined,
              viewed: data.viewed
          }
          if(updateData.delta.ops.length === 1 && updateData.delta.ops[0].insert === '\n'){
            alert('Post cannot be empty!')
          }
          else{
            fetch(`http://localhost:8080/post/${data.id}`,{
                method:"PUT",
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${JSON.parse(localStorage.getItem('token')).token}`
                },
                body: JSON.stringify(
                  {
                    ...updateData,
                    delta:JSON.stringify(updateData.delta.ops),
                    edited: filterTime(new Date().getTime()),
                    drafted:false
                  }
                )
              })
            .then(res=>res.json())
            .then(
              (res)=>{
                window.location.reload()
              }
            )
            
          }
        }
      }
    }
  };
 
  // Insert Image(selected by user) to quill
  const insertToEditor = (url) => {
    const range = quill.getSelection();
    const mediaType = url.substring(url.length-3,url.length);
    if(mediaType === 'mp4'){
      quill.insertEmbed(range.index, 'video', `http://localhost:8080/${url}`);
      setPending(false)
    }
    else if(mediaType === 'jpg'){
      quill.insertEmbed(range.index, 'image', `http://localhost:8080/${url}`);
      setPending(false)
    }
  };

  // Upload Image to Image Server such as AWS S3, Cloudinary, Cloud Storage, etc..
  const saveToServer = async (file) => {
    setPending(true)
    const mediaType = file.type.substring(0,5)
    if(mediaType === 'image'){
      const body = new FormData();
      body.append('file', file);
      body.append('postId', `${localStorage.getItem('blogId')}`);
      fetch('http://localhost:8080/uploadImage',{ 
        method: 'POST',
        headers: {
          "Authorization": `Bearer ${JSON.parse(localStorage.getItem('token')).token}`
        },
        body
      })
      .then(res=>res.json())
      .then(res=>{
        insertToEditor(res.name);
      })
      
    }
    if(mediaType === 'video'){
      const body = new FormData();
      body.append('file', file);
      body.append('postId',`${localStorage.getItem('blogId')}`);
      fetch('http://localhost:8080/uploadVideo',{ 
        method: 'POST',
        headers: {
          "Authorization": `Bearer ${JSON.parse(localStorage.getItem('token')).token}`
        },
        body
      })
      .then(res=>res.json())
      .then(res=>{
        insertToEditor(res.name);
      })
      
    }
  };

  // Open Dialog to select Image File
  const selectLocalImage = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = () => {
      const file = input.files[0];
      saveToServer(file);
    };
  };

  const selectLocalVideo = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'video/*');
    input.click();

    input.onchange = () => {
      const file = input.files[0];
      saveToServer(file);
    };
  };

  React.useEffect(() => {
    if (quill) {
      // Add custom handler for Image Upload
      quill.getModule('toolbar').addHandler('image', selectLocalImage);
      quill.getModule('toolbar').addHandler('video', selectLocalVideo);
    }
  }, [quill]);
  return (
    <div style={{marginBottom:"100px", height:enlarged ? "700px":"300px"}}>
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
      <div style={{ width: "100%", height: enlarged ? "100%":300, position:"relative"}}>
        <div id="toolbar" style={{height:"50px", borderRadius:"10px 10px 0 0", color:"#ffffff !important"}}>
          <img src={logo} className="mr-4" alt="" style={{height:"30px", width:"30px", borderRadius:"15px", position:"relative", float:"left", display:"inline-block"}} />
          <select className="ql-font" style={{zIndex:"50"}} >
            <option selected />
            <option value="serif" />
            <option value="monospace" />
          </select>
          <select className="ql-size" style={{zIndex:"50"}} >
            <option value="small" />
            <option selected />
            <option value="large" />
            <option value="huge" />
          </select>
          <Button className="ql-bold"/>
          <Button className="ql-italic"/>
          <Button className="ql-underline"/>
          <Button className="ql-image"/> 
          <Button className="ql-video"/> 
          <Button className="ql-link"/> 
          <span className="ql-formats">
            <Button className="ql-align" value=""/>
            <Button className="ql-align" value="center"/>
            <Button className="ql-align" value="right"/>
            <Button className="ql-align" value="justify"/>
          </span>
            <Button 
            className={buttonPined ? "pined_button" : "pin_button"}
            onClick={()=>{setButtonPined(!buttonPined)}}>
              {
                buttonPined
                ?
                <>
                <>
                  <i className="simple-icon-pin"/>
                  &nbsp;
                  &nbsp;
                  Pined
                </>
                </>
                :
                <>
                  <i className="simple-icon-pin"/>
                  &nbsp;
                  &nbsp;
                  To pin
                </>
              }
            </Button>
        </div>
        <div 
          ref={quillRef} 
          style={{
            borderRadius:"0 0 10px 10px", 
            height:enlarged ? "650px" : "250px",
            overflow:"auto",
            width:"100%"
          }}
          rows="20"
        />
        <div id="editor"/>
        <Button
          style={{position:"absolute", float:"right", top:"70px", right:"20px", backgroundColor:"transparent", border:"none", zIndex:"90"}} 
          onClick={enlarged ? ()=>{setEnlarged(false)}:()=>{setEnlarged(true)}}>
          <i className={enlarged ? "simple-icon-size-actual":"simple-icon-size-fullscreen"}/>
        </Button>
        <Dropdown
        isOpen={dropdownBasicOpen}
        toggle={() => setDropdownBasicOpen(!dropdownBasicOpen)}
        >
        <DropdownToggle 
        caret 
        style={{position:"absolute", float:"right", bottom:"20px", right:"120px",zIndex:"99", border:"none"}}
        >
          NFT
        </DropdownToggle>
        <DropdownMenu>
          <DropdownItem>
            none
          </DropdownItem>
        </DropdownMenu>
        </Dropdown>
        <Button
          style={{position:"absolute", float:"right", bottom:"20px", right:"20px",zIndex:"99"}}
          onClick={handleQuill}
        >Post</Button>
      </div>
    </div>
  )
}

export default QuillEditor