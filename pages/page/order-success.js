import React, { useContext } from "react";
import CommonLayout from "../../components/shop/common-layout";
import { Container, Row, Col, Media } from "reactstrap";
import one from "../../public/assets/images/pro3/1.jpg";
import { useRouter } from "next/router";
import CartContext from "../../helpers/cart";
import { CurrencyContext } from "../../helpers/Currency/CurrencyContext";
import { gql, useQuery } from "@apollo/client";

const GET_ORDER = gql`
  query getOrder($id: String!) {
    getOrder(id: $id) {
      firstName
      lastName
      email
      phone
      address
      city
      state
      country
      postalCode
      orderID
      deliveryDate
      paymentMethod
      cartTotal
      cartItems {
        id
        title
        description
        type
        brand
        category
        price
        sale
        discount
        stock
        newP
        qty
        total
        variants {
          color
          size
          image
          sku
        }
      }
    }
  }
`;

const OrderSuccess = () => {
  const router = useRouter();
  const { orderID } = router.query;
  console.log("router:", router);

  if (orderID) {
    var { loading, data } = useQuery(GET_ORDER, {
      variables: {
        id: orderID,
      },
    });
    console.log("data:", data?.getOrder);
  }

  const cartContext = useContext(CartContext);
  const cartItems = cartContext.state;
  const cartTotal = cartContext.cartTotal;
  const curContext = useContext(CurrencyContext);
  const symbol = curContext.state.symbol;
  // const data = cartItems;
  // const items = cartItems;
  // const removeFromCart = cartContext.removeFromCart;

  // cartItems.map((item) => {
  //   removeFromCart(item);
  // });

  // console.log("cartItems", cartItems);
  // console.log("Items", items);
  // window.location.reload();
  return (
    <CommonLayout parent="home" title="order success">
      <section className="section-b-space light-layout">
        <Container>
          <Row>
            <Col md="12">
              <div className="success-text">
                <i className="fa fa-check-circle" aria-hidden="true"></i>
                <h2>thank you</h2>
                <p>
                  Payment is successfully processsed and your order is on the
                  way
                </p>
                <p>Transaction ID:267676GHERT105467</p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="section-b-space">
        <Container>
          {data && data.getOrder && (
            <Row>
              <Col lg="6">
                <div className="product-order">
                  <h3>your order details</h3>

                  {data.getOrder.cartItems &&
                    data?.getOrder.cartItems.map(
                      (cItem, i) => (
                        <Row className="product-order-detail" key={i}>
                          <Col xs="3">
                            <Media
                              src={cItem.variants[0].image}
                              alt=""
                              className="img-fluid blur-up lazyload"
                            />
                          </Col>
                          <Col xs="3" className="order_detail">
                            <div>
                              <h4>product name</h4>
                              <h5>{cItem.title}</h5>
                            </div>
                          </Col>
                          <Col xs="3" className="order_detail">
                            <div>
                              <h4>quantity</h4>
                              <h5>{cItem.qty}</h5>
                            </div>
                          </Col>
                          <Col xs="3" className="order_detail">
                            <div>
                              <h4>price</h4>
                              <h5>
                                {symbol}
                                {cItem.price}
                              </h5>
                            </div>
                          </Col>
                        </Row>
                      )

                      // <h1>
                      //   <a
                      //     href="http://"
                      //     target="_blank"
                      //     rel="noopener noreferrer"
                      //   ></a>
                      // </h1>
                    )}
                  <div className="total-sec">
                    <ul>
                      <li>
                        subtotal{" "}
                        <span>
                          {symbol}
                          {data.getOrder.cartTotal}
                        </span>
                      </li>
                    </ul>
                  </div>
                  <div className="final-total">
                    <h3>
                      total{" "}
                      <span>
                        {symbol}
                        {data.getOrder.cartTotal}
                      </span>
                    </h3>
                  </div>
                </div>
              </Col>
              <Col lg="6">
                <Row className="order-success-sec">
                  <Col sm="6">
                    <h4>summery</h4>
                    <ul className="order-detail">
                      <li>order ID: {data.getOrder.orderID}</li>
                      <li>Order Date: {new Date().toDateString()}</li>
                      <li>
                        Order Total: {symbol}
                        {data.getOrder.cartTotal}
                      </li>
                    </ul>
                  </Col>
                  <Col sm="6">
                    <h4>shipping address</h4>
                    <ul className="order-detail">
                      <li>
                        {data.getOrder.firstName} {data.lastName}
                      </li>
                      <li>{data.getOrder.address}</li>
                      <li>
                        {data.getOrder.country}, {data.getOrder.postalCode}
                      </li>
                      <li>Contact No: {data.getOrder.phone}</li>
                    </ul>
                  </Col>
                  <Col sm="12" className="payment-mode">
                    <h4>payment method</h4>
                    <p>
                      Pay on Delivery (Cash/Card). Cash on delivery (COD)
                      available. Card/Net banking acceptance subject to device
                      availability.
                    </p>
                  </Col>
                  <Col md="12">
                    <div className="delivery-sec">
                      <h3>expected date of delivery</h3>
                      <h2>{data.getOrder.deliveryDate}</h2>
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
          )}
        </Container>
      </section>
    </CommonLayout>
  );
};

export default OrderSuccess;
