import React from 'react'
import { Colxx } from 'components/common/CustomBootstrap'
import {Row, Button, Input} from 'reactstrap'
import '../../assets/css/sass/core/commonheader.scss'

function CommonHeader(props) {
    const attrs = props
    return (
    <Row className='common_header'>
        <Colxx xxs="12" md="6" className='common_header_grid'>
            <div className='p-4 ml-xs-2 ml-lg-5'>
                <h1 className='pb-0'>
                    {attrs.title}
                </h1>
                <h6>
                    {attrs.webpage}
                </h6>
            </div>
        </Colxx>    
        <Colxx xxs="12" md="6" className="common_header_grid d-flex justify-content-end align-items-center">
            {(
                ()=>{
                    switch (attrs.rightPartType){
                        case "input": 
                            return (
                                <div className="search d-flex justify-content-center align-items-center">
                                    <Input
                                        className='common_header_input'
                                        name="searchKeyword"
                                        id="searchKeyword"                                
                                        placeholder="Address / Token ID / Social ID / Tags"
                                    />
                                    <span
                                        className="search-icon"
                                    >
                                        <i className="simple-icon-magnifier" />
                                    </span>
                                </div>
                                );  
                        case "button": 
                            return (
                                <Button type="button">
                                    1  
                                </Button>
                            ); 
                        default:return null;
                    }
                }
            )()}
        </Colxx>
    </Row>
  )
}

export default CommonHeader