import React from 'react';
import { 
  Row
} from 'reactstrap'
import { Colxx } from 'components/common/CustomBootstrap';
import "./dashboard.scss";
import {BarChart} from 'components/charts';
import { ThemeColors } from 'helpers/ThemeColors';
import opensea from 'assets/img/icons/Opensea.png'

const colors = ThemeColors();
const chartData = [41, 59, 19, 65, 38, 17, 5, 44, 79]
const barChartData = {
  datasets: [
    {
      label: 'Cakes',
      borderColor: colors.themeColor1,
      backgroundColor: colors.themeColor1_10,
      data: chartData,
      borderWidth: 2,
      borderRadius: 5
    }
  ],
  labels: [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
};

const tradesData = [
  {
    address:"0x6g26e1b8adec1",
    price:0.3,
    time: "3 hrs 26 mins",
    payment:"opensea"
  },
  {
    address:"0x6g26e1b8adec2",
    price:0.25,
    time: "1 day 23 hrs",
    payment:"mint"
  },
  {
    address:"0x6g26e1b8adec3",
    price:0.25,
    time: "5 days 13 hrs",
    peyment:"mint"
  },
  {
    address:"0x6g26e1b8adec4",
    price:0.25,
    time: "13 hrs 5 hrs",
    payment:"mint"
  },
]

const Dashboard = () => (
  <div className='container mt-4'>
      <Row className="dashboard_first_row ">
        {/* textarea part */}
        <Colxx xxs="12" md="12" className=" d-flex align-items-center ">
        <Row className="dashboard_first_row_datas">
            <Colxx xxs="12" md="6" className='d-flex align-items-center justify-content-center m-0 p-0'>
              <div className='dashboard_textarea_box d-flex justify-content-center align-items-start flex-column m-md-1 pl-3 pr-1'>
                <div><h2 className='font-weight-bold'>Ξ 1.89</h2></div>
                <div><h4 className='font-weight-light'>Monthly Income</h4></div>
                <div><h6 className='font-weight-light'><span className='emphasized_font'>+12.3%</span> since last month</h6></div>
              </div>
            </Colxx>
            <Colxx xxs="12" md="6" className='d-flex align-items-center justify-content-center m-0 p-0'>
              <div className='dashboard_textarea_box d-flex justify-content-center align-items-start flex-column m-md-1 pl-3 pr-1'>
                <div><h2 className='font-weight-bold'>Ξ 10.14</h2></div>
                <div><h4 className='font-weight-light'>Total Revenue</h4></div>
                <div><h6 className='font-weight-light'><span className='emphasized_font'>+2.4%</span> since last month</h6></div>
              </div>
            </Colxx>
            <Colxx xxs="12" md="6" className='d-flex align-items-center justify-content-center m-0 p-0'>
              <div className='dashboard_textarea_box d-flex justify-content-center align-items-start flex-column m-md-1 pl-3 pr-1'>
                <div><h2 className='font-weight-bold'>547 Holders</h2></div>
                <div><h4 className='font-weight-light'>2 NFTs</h4></div>
                <div><h6 className='font-weight-light'><span className='emphasized_font'>+22%</span> since last month</h6></div>
              </div>
            </Colxx>
            <Colxx xxs="12" md="6" className='d-flex align-items-center justify-content-center m-0 p-0'>
              <div className='dashboard_textarea_box d-flex justify-content-center align-items-start flex-column m-md-1 pl-3 pr-1'>
                <div><h2 className='font-weight-bold'>79 Sales</h2></div>
                <div><h4 className='font-weight-light'>This month</h4></div>
                <div><h6 className='font-weight-light'><span className='emphasized_font'>+179%</span> since last month</h6></div>
              </div>
            </Colxx>
          </Row>
        </Colxx>
      </Row>

      <Row className="dashboard_second_row mt-5">
        {/* chart-bar part */}
        <Colxx xxs="12" md="5" className="p-5 pl-md-4 pr-md-2 p-lg-5">
          <h2>
            NFT Sales
          </h2>
          <Row>
            <Colxx xxs="12" className="mb-5">
              <h6 className='font-weight-light'>
                <span className='emphasized_font'>+179%</span> since last month / <span className="font-weight-bold">672 </span> sales in last year
              </h6>
              <div className="chart-container">
                <BarChart data={barChartData} />
              </div>
            </Colxx>
          </Row>
        </Colxx>

        {/* recent trades part */}
        <Colxx xxs="12" md="7" className="mt-5">
          <h2>
            Recent Trades
          </h2>
          <h6 className='font-weight-light'>
            <span className='emphasized_font'>+179%</span> since last month / <span className="font-weight-bold">672 </span> sales in last year
          </h6>
          {
            tradesData.map((item)=>{
              return(
                <Row key={item.id} className="dashboard_recent_trade_box">
                  <Colxx xxs="2" className="h-100 d-flex justify-content-center align-items-center overflow-hidden">
                    <img className='h-100' src="/assets/img/portal/Frame-11.png" alt="" />
                  </Colxx>
                  <Colxx xxs="10" className="h-100">
                    <Row className='h-50'>
                        <Colxx xxs="5"><h6 className='left_side_laid'>{item.address}</h6></Colxx>
                        <Colxx xxs="7" className="right_side_laid">
                          <h6>
                            {
                              item.payment === 'opensea' ? 
                              <span>
                                <img className='dashboard_recentTrade_image' src={opensea} alt="" />
                                &nbsp;
                              </span>
                              :
                              <span className='dashboard_recentTrade_payment pl-2 pr-2 mr-1'>
                                Mint
                              </span>
                            }
                            {item.price} ETH</h6>
                        </Colxx>
                    </Row>
                    <Row className="h-50">
                        <Colxx xxs="6"><h6>Buy</h6></Colxx>
                        <Colxx xxs="6" className="right_side_laid"><h6>{item.time}</h6></Colxx>
                    </Row>
                  </Colxx>
                </Row>
              )  
            })
          }
        </Colxx>
      </Row>
  </div>
);
export default Dashboard;
