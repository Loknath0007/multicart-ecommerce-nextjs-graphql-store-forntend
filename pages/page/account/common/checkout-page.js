import React, { useContext, useState, useEffect } from "react";
import { Media, Container, Form, Row, Col, Input, Button } from "reactstrap";
import CartContext from "../../../../helpers/cart";
import paypal from "../../../../public/assets/images/paypal.png";
import { PayPalButton } from "react-paypal-button-v2";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { CurrencyContext } from "../../../../helpers/Currency/CurrencyContext";
import { gql, useMutation, useQuery } from "@apollo/client";
import Coupon from "./coupon";

const CREATE_ORDER = gql`
  mutation CreateOrder(
    $firstName: String
    $lastName: String
    $email: String
    $phone: String
    $address: String
    $city: String
    $state: String
    $country: String
    $postalCode: String
    $orderID: String
    $deliveryDate: String
    $paymentMethod: String
    $cartItems: [CartItemInput]
    $cartTotal: Float
  ) {
    createOrder(
      firstName: $firstName
      lastName: $lastName
      email: $email
      phone: $phone
      address: $address
      city: $city
      state: $state
      country: $country
      postalCode: $postalCode
      orderID: $orderID
      deliveryDate: $deliveryDate
      paymentMethod: $paymentMethod
      cartItems: $cartItems
      cartTotal: $cartTotal
    ) {
      firstName
    }
  }
`;

const GET_COUPONS = gql`
  query getCoupons($indexFrom: Int) {
    getCoupons(indexFrom: $indexFrom) {
      discountType
      code
      qty
    }
  }
`;
const CheckoutPage = () => {
  var { data, refetch } = useQuery(GET_COUPONS, {
    variables: { indexFrom: 0 },
  });
  console.log("data", data);

  const [cpn, setCpn] = useState();

  // handle change
  const handleChange = (e) => {
    setCpn(e.target.value);
  };

  const cartContext = useContext(CartContext);
  const cartItems = cartContext.state;
  const setCartItems = cartContext.setCartItems;
  const cartTotal = cartContext.cartTotal;
  const setCartTotal = cartContext.setCartTotal;

  const curContext = useContext(CurrencyContext);
  const symbol = curContext.state.symbol;
  const [obj, setObj] = useState({});
  const [payment, setPayment] = useState("stripe");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm(); // initialise the hook
  const router = useRouter();
  const removeFromCart = cartContext.removeFromCart;
  const checkhandle = (value) => {
    setPayment(value);
  };

  var date = new Date();
  date.setDate(date.getDate() + 7);

  const items = cartItems?.map((item) => {
    const product = {
      id: item.id,
      qty: item.qty,
      total: item.total,
      title: item.title,
      description: item.description,
      // type: i.type,
      brand: item.brand,
      // collections: i.collections,
      category: item.category,
      price: item.price,
      sale: item.sale,
      discount: item.discount,
      stock: item.stock,
      newP: item.newP,
      // tags: i.tags,

      variants: item.variants.map((v) => {
        const vr = {
          color: v.color,
          size: v.size,
          image: v.image,
        };
        return vr;
      }),
    };
    return product;
  });
  console.log("cartItems:", cartItems);

  // create order api

  const [createOrder, { loading, error }] = useMutation(CREATE_ORDER, {
    onCompleted: (data) => {
      console.log("Data from mutation", data);
      if (data) {
        alert("successfully created order");
        setCartItems([]);
      }
    },
    onError: (error) => console.error("Error creating a order", error),
  });

  //  handle submit
  const onSubmit = (data) => {
    console.log("checkout data:", data);

    if (data !== "") {
      alert("You submitted the form and stuff!");
      // order Id
      const orderID = Date.now().toString();
      console.log("date:", orderID);

      createOrder({
        variables: {
          ...data,
          orderID,
          paymentMethod: payment,
          deliveryDate: date.toDateString(),
          cartItems: items,
          cartTotal,
        },
      });

      if (!error) {
        // localStorage.setItem("cartList", JSON.stringify([]));
        // cartItems.map((item) => removeFromCart(item));

        router.push({
          pathname: "/page/order-success",
          query: {
            orderID,
          },
        });

        // location.reload();
      }
    } else {
      errors.showMessages();
    }
  };

  const setStateFromInput = (event) => {
    obj[event.target.name] = event.target.value;
    setObj(obj);
  };

  const [matchCpn, setMatchCpn] = useState();
  const [handle, setHandle] = useState(false);
  // handle Coupons
  useEffect(() => {
    if (matchCpn) {
      const total = parseFloat(
        (cartTotal - (cartTotal * matchCpn?.qty) / 100).toFixed(2)
      );
      setCartTotal(total);
    }
  }, [handle]);
  console.log("cart total: ", cartTotal, handle);
  return (
    <section className="section-b-space">
      <Container>
        <div className="checkout-page">
          <div className="checkout-form">
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Row>
                <Col lg="6" sm="12" xs="12">
                  <div className="checkout-title">
                    <h3>Billing Details</h3>
                  </div>
                  <div className="row check-out">
                    <div className="form-group col-md-6 col-sm-6 col-xs-12">
                      <div className="field-label">First Name</div>
                      <input
                        type="text"
                        className={`${errors.firstName ? "error_border" : ""}`}
                        name="first_name"
                        {...register("firstName", { required: true })}
                      />
                      <span className="error-message">
                        {errors.firstName && "First name is required"}
                      </span>
                    </div>
                    <div className="form-group col-md-6 col-sm-6 col-xs-12">
                      <div className="field-label">Last Name</div>
                      <input
                        type="text"
                        className={`${errors.lastName ? "error_border" : ""}`}
                        name="lastName"
                        {...register("lastName", { required: true })}
                      />
                      <span className="error-message">
                        {errors.lastName && "Last name is required"}
                      </span>
                    </div>
                    <div className="form-group col-md-6 col-sm-6 col-xs-12">
                      <div className="field-label">Phone</div>
                      <input
                        type="text"
                        name="phone"
                        className={`${errors.phone ? "error_border" : ""}`}
                        {...register("phone", {
                          required: true,
                          pattern: /\d+/,
                        })}
                      />
                      <span className="error-message">
                        {errors.phone && "Please enter number for phone."}
                      </span>
                    </div>
                    <div className="form-group col-md-6 col-sm-6 col-xs-12">
                      <div className="field-label">Email Address</div>
                      <input
                        //className="form-control"
                        className={`${errors.email ? "error_border" : ""}`}
                        type="text"
                        name="email"
                        {...register("email", {
                          required: true,
                          pattern: /^\S+@\S+$/i,
                        })}
                      />
                      <span className="error-message">
                        {errors.email && "Please enter proper email address ."}
                      </span>
                    </div>
                    <div className="form-group col-md-12 col-sm-12 col-xs-12">
                      <div className="field-label">Country</div>
                      <select
                        name="country"
                        {...register("country", { required: true })}
                      >
                        <option>Bangladesh</option>
                        <option>Canada</option>
                        <option>United State</option>
                        <option>Australia</option>
                      </select>
                    </div>
                    <div className="form-group col-md-12 col-sm-12 col-xs-12">
                      <div className="field-label">Address</div>
                      <input
                        //className="form-control"
                        className={`${errors.address ? "error_border" : ""}`}
                        type="text"
                        name="address"
                        {...register("address", {
                          required: true,
                          min: 20,
                          max: 120,
                        })}
                        placeholder="Street address"
                      />
                      <span className="error-message">
                        {errors.address && "Please right your address ."}
                      </span>
                    </div>
                    <div className="form-group col-md-12 col-sm-12 col-xs-12">
                      <div className="field-label">Town/City</div>
                      <input
                        //className="form-control"
                        type="text"
                        className={`${errors.city ? "error_border" : ""}`}
                        name="city"
                        {...register("city", { required: true })}
                        onChange={setStateFromInput}
                      />
                      <span className="error-message">
                        {errors.city && "select one city"}
                      </span>
                    </div>
                    <div className="form-group col-md-12 col-sm-6 col-xs-12">
                      <div className="field-label">State </div>
                      <input
                        //className="form-control"
                        type="text"
                        className={`${errors.state ? "error_border" : ""}`}
                        name="state"
                        {...register("state", { required: true })}
                        onChange={setStateFromInput}
                      />
                      <span className="error-message">
                        {errors.state && "select one state"}
                      </span>
                    </div>
                    <div className="form-group col-md-12 col-sm-6 col-xs-12">
                      <div className="field-label">Postal Code</div>
                      <input
                        //className="form-control"
                        type="text"
                        name="postalCode"
                        className={`${errors.postalCode ? "error_border" : ""}`}
                        {...register("postalCode", {
                          required: true,
                          pattern: /\d+/,
                        })}
                      />
                      <span className="error-message">
                        {errors.postalCode && "Required integer"}
                      </span>
                    </div>
                    <div className="form-group col-lg-12 col-md-12 col-sm-12 col-xs-12">
                      <input
                        type="checkbox"
                        name="create_account"
                        id="account-option"
                      />
                      &ensp;{" "}
                      <label htmlFor="account-option">Create An Account?</label>
                    </div>
                  </div>
                </Col>
                <Col lg="6" sm="12" xs="12">
                  {cartItems && cartItems.length > 0 > 0 ? (
                    <div className="checkout-details">
                      <div className="order-box">
                        <div className="title-box">
                          <div>
                            Product <span>Total</span>
                          </div>
                        </div>
                        <ul className="qty">
                          {cartItems.map((item, index) => (
                            <li key={index}>
                              {item.title} × {item.qty}{" "}
                              <span>
                                {symbol}
                                {item.total}
                              </span>
                            </li>
                          ))}
                        </ul>
                        <ul className="sub-total">
                          <li>
                            Subtotal{" "}
                            <span className="count">
                              {symbol}
                              {cartTotal}
                            </span>
                          </li>
                          <li>
                            Shipping
                            <div className="shipping">
                              <div className="shopping-option">
                                <input
                                  type="checkbox"
                                  name="free-shipping"
                                  id="free-shipping"
                                />
                                <label htmlFor="free-shipping">
                                  Free Shipping
                                </label>
                              </div>
                              <div className="shopping-option">
                                <input
                                  type="checkbox"
                                  name="local-pickup"
                                  id="local-pickup"
                                />
                                <label htmlFor="local-pickup">
                                  Local Pickup
                                </label>
                              </div>
                            </div>
                          </li>
                        </ul>
                        {/*apply coupon code start*/}

                        <div>
                          <div className="sub-total">
                            <li>
                              Apply Coupon
                              <span className="count">
                                <div class="input-group mb-3">
                                  <Input
                                    type="text"
                                    value={cpn}
                                    class="form-control"
                                    placeholder="Enter Coupon"
                                    aria-describedby="basic-addon2"
                                    onChange={handleChange}
                                  />
                                  <br />
                                  <br />
                                  <br />
                                  <Button
                                    onClick={() => {
                                      if (!cpn == "") {
                                        {
                                          const match =
                                            data.getCoupons &&
                                            data.getCoupons.find(
                                              (cp) => cp.code === cpn
                                            );
                                          console.log("match", match);
                                          if (match) {
                                            setMatchCpn(match);
                                            setHandle(true);
                                          }
                                        }
                                      }
                                      setCpn("");
                                    }}
                                    type="button"
                                    color="warning"
                                    disabled={Boolean(handle && matchCpn)}
                                  >
                                    Apply
                                  </Button>
                                </div>

                                {!handle && !matchCpn && (
                                  <span>Coupon not matched</span>
                                )}
                                {handle && matchCpn && (
                                  <span className="text-success                                  ">
                                    Coupon Has Been Applied
                                  </span>
                                )}
                              </span>
                            </li>
                          </div>
                        </div>
                        {/*apply coupon code end*/}

                        <ul className="total">
                          <li>
                            Total{" "}
                            <span className="count">
                              {symbol}
                              {cartTotal}
                            </span>
                          </li>
                        </ul>
                      </div>
                      <div className="payment-box">
                        <div className="upper-box">
                          <div className="payment-options">
                            <ul>
                              <li>
                                <div className="radio-option stripe">
                                  <input
                                    type="radio"
                                    name="payment-group"
                                    id="payment-2"
                                    defaultChecked={true}
                                    onClick={() => checkhandle("stripe")}
                                  />
                                  <label htmlFor="payment-2">Stripe</label>
                                </div>
                              </li>
                              <li>
                                <div className="radio-option paypal">
                                  <input
                                    type="radio"
                                    name="payment-group"
                                    id="payment-1"
                                    onClick={() => checkhandle("paypal")}
                                  />
                                  <label htmlFor="payment-1">
                                    PayPal
                                    <span className="image">
                                      <Media src={paypal} alt="" />
                                    </span>
                                  </label>
                                </div>
                              </li>
                            </ul>
                          </div>
                        </div>
                        {cartTotal !== 0 ? (
                          <div className="text-right">
                            {payment === "stripe" ? (
                              <button type="submit" className="btn-solid btn">
                                Place Order
                              </button>
                            ) : (
                              <PayPalButton
                                amount="0.01"
                                onSuccess={(details, data) => {
                                  alert(
                                    "Transaction completed by " +
                                      details.payer.name.given_name
                                  );

                                  return fetch("/paypal-transaction-complete", {
                                    method: "post",
                                    body: JSON.stringify({
                                      orderID: data.orderID,
                                    }),
                                  });
                                }}
                              />
                            )}
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                </Col>
              </Row>
            </Form>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default CheckoutPage;
